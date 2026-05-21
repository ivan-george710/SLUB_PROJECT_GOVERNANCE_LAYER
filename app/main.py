import os
import shutil
import tempfile

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
import sqlglot
from sqlglot import expressions

from app.auth.dependencies import require_permission
from app.auth.jwt_handler import create_access_token
from app.auth.security import verify_password
from app.execution.query_executor import execute_governed_query
from app.governance.audit_logger import log_query_event
from app.ingestion.file_ingestor import ingest_file
from app.integrations.connection_manager import add_connection
from app.validation.cost_guard import analyze_query_cost
from app.validation.schema_checker import validate_schema


app = FastAPI()

load_dotenv()


class QueryValidationRequest(BaseModel):
    query: str


class QueryValidationResponse(BaseModel):
    safe: bool
    issues: list[str]
    username: str | None = None
    role: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class DatabaseConnectionRequest(BaseModel):
    connection_name: str
    db_type: str
    connection_url: str


class ExecuteQueryRequest(BaseModel):
    connection_name: str
    query: str


def get_database_url() -> str | None:
    return os.getenv("DATABASE_URL")


def create_database_engine() -> Engine:
    database_url = get_database_url()

    if not database_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DATABASE_URL is missing from .env",
        )

    return create_engine(database_url)


def parse_sql(query: str) -> expressions.Expression | None:
    try:
        return sqlglot.parse_one(query)
    except sqlglot.errors.ParseError:
        return None


def is_select_statement(parsed_query: expressions.Expression) -> bool:
    return isinstance(parsed_query, expressions.Select)


def get_username_from_user_payload(current_user: dict) -> str | None:
    return current_user.get("sub")


def get_role_from_user_payload(current_user: dict) -> str | None:
    return current_user.get("role")


def log_validation_attempt(
    current_user: dict,
    query_text: str,
    is_safe: bool,
) -> None:
    username = get_username_from_user_payload(current_user) or "unknown"
    role = get_role_from_user_payload(current_user) or "unknown"

    log_query_event(
        username=username,
        role=role,
        query_text=query_text,
        is_safe=is_safe,
    )


def log_upload_attempt(
    current_user: dict,
    file_name: str,
    table_name: str,
    is_safe: bool,
) -> None:
    username = get_username_from_user_payload(current_user) or "unknown"
    role = get_role_from_user_payload(current_user) or "unknown"
    event_text = f"UPLOAD_DATA file={file_name} table={table_name}"

    log_query_event(
        username=username,
        role=role,
        query_text=event_text,
        is_safe=is_safe,
    )


def validate_query_schema(
    query: str,
    current_user: dict,
    connection_name: str = "postgres",
) -> QueryValidationResponse:
    valid, issues = validate_schema(query, connection_name)

    if not valid:
        log_validation_attempt(current_user, query, False)
        return QueryValidationResponse(safe=False, issues=issues)

    cost_is_safe, cost_issues = analyze_query_cost(query)

    if not cost_is_safe:
        log_validation_attempt(current_user, query, False)
        return QueryValidationResponse(safe=False, issues=cost_issues)

    log_validation_attempt(current_user, query, True)

    username = get_username_from_user_payload(current_user)
    role = get_role_from_user_payload(current_user)

    return QueryValidationResponse(
        safe=True,
        issues=[],
        username=username,
        role=role,
    )


def get_user_by_username(username: str) -> dict | None:
    engine = create_database_engine()
    query = text(
        """
        SELECT username, password_hash, role
        FROM users
        WHERE username = :username
        LIMIT 1
        """
    )

    try:
        with engine.connect() as connection:
            row = connection.execute(query, {"username": username}).fetchone()
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not fetch user from database",
        )

    if row is None:
        return None

    return dict(row._mapping)


def raise_invalid_credentials_error() -> None:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )


def validate_supported_db_type(db_type: str) -> None:
    supported_db_types = ["postgres"]

    if db_type not in supported_db_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported database type: {db_type}",
        )


def save_upload_temporarily(uploaded_file: UploadFile) -> str:
    file_extension = os.path.splitext(uploaded_file.filename or "")[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
        shutil.copyfileobj(uploaded_file.file, temp_file)
        return temp_file.name


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}


@app.post("/validate-query")
def validate_query(
    request: QueryValidationRequest,
    current_user: dict = Depends(require_permission("execute_queries")),
) -> QueryValidationResponse:
    parsed_query = parse_sql(request.query)

    if parsed_query is None:
        log_validation_attempt(current_user, request.query, False)
        return QueryValidationResponse(
            safe=False,
            issues=["Invalid SQL syntax"],
        )

    if not is_select_statement(parsed_query):
        log_validation_attempt(current_user, request.query, False)
        return QueryValidationResponse(
            safe=False,
            issues=["Only SELECT queries are allowed"],
        )

    return validate_query_schema(request.query, current_user)


@app.post("/execute-query")
def execute_query(
    request: ExecuteQueryRequest,
    current_user: dict = Depends(require_permission("execute_queries")),
) -> dict:
    parsed_query = parse_sql(request.query)

    if parsed_query is None:
        log_validation_attempt(current_user, request.query, False)
        return {"safe": False, "issues": ["Invalid SQL syntax"]}

    if not is_select_statement(parsed_query):
        log_validation_attempt(current_user, request.query, False)
        return {"safe": False, "issues": ["Only SELECT queries are allowed"]}

    validation_result = validate_query_schema(
        query=request.query,
        current_user=current_user,
        connection_name=request.connection_name,
    )

    if not validation_result.safe:
        return {
            "safe": False,
            "issues": validation_result.issues,
        }

    results = execute_governed_query(
        connection_name=request.connection_name,
        query=request.query,
    )

    return {
        "safe": True,
        "issues": [],
        "results": results,
    }


@app.post("/connect-database")
def connect_database(
    request: DatabaseConnectionRequest,
    current_user: dict = Depends(require_permission("manage_integrations")),
) -> dict[str, str]:
    validate_supported_db_type(request.db_type)

    add_connection(
        connection_name=request.connection_name,
        db_type=request.db_type,
        connection_url=request.connection_url,
    )

    return {"message": "Database connection added successfully"}


@app.post("/upload-data")
def upload_data(
    table_name: str = Form(...),
    connection_name: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(require_permission("upload_data")),
) -> dict:
    temp_file_path = save_upload_temporarily(file)
    file_name = file.filename or "unknown"

    try:
        result = ingest_file(
            file_path=temp_file_path,
            table_name=table_name,
            connection_name=connection_name,
        )
        log_upload_attempt(current_user, file_name, table_name, True)
        return result
    except ValueError as error:
        log_upload_attempt(current_user, file_name, table_name, False)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
    except Exception as error:
        log_upload_attempt(current_user, file_name, table_name, False)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not upload data: {error}",
        )
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    user = get_user_by_username(form_data.username)

    if user is None:
        raise_invalid_credentials_error()

    password_is_valid = verify_password(
        form_data.password,
        user["password_hash"],
    )

    if not password_is_valid:
        raise_invalid_credentials_error()

    token = create_access_token(data={"sub": user["username"], "role": user["role"]})

    return TokenResponse(access_token=token, token_type="bearer")
