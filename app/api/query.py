from fastapi import APIRouter

from app.schemas.query_schema import QueryRequest

from app.services.llm.sql_generator import (
    generate_sql
)

from app.services.validators.sql_validator import (
    validate_sql
)

from app.services.execution.sql_executor import (
    execute_sql
)


router = APIRouter()


@router.post("/query")
def query_endpoint(
    request: QueryRequest
):

    sql = generate_sql(
        request.query
    )

    is_valid = validate_sql(
        sql
    )

    if not is_valid:

        return {
            "success": False,
            "error": "Invalid SQL"
        }

    results = execute_sql(
        sql
    )

    return {
        "success": True,
        "query": request.query,
        "generated_sql": sql,
        "results": results
    }