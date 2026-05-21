import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


def get_database_url() -> str | None:
    """Load the PostgreSQL database URL from the .env file."""
    load_dotenv()
    return os.getenv("DATABASE_URL")


def create_database_engine() -> Engine | None:
    """Create a SQLAlchemy engine using the database URL."""
    database_url = get_database_url()

    if not database_url:
        return None

    return create_engine(database_url)


def insert_audit_log(
    engine: Engine,
    username: str,
    role: str,
    query_text: str,
    is_safe: bool,
) -> None:
    """Insert one audit log record into the audit_logs table."""
    query = text(
        """
        INSERT INTO audit_logs (username, role, query_text, is_safe)
        VALUES (:username, :role, :query_text, :is_safe)
        """
    )

    with engine.begin() as connection:
        connection.execute(
            query,
            {
                "username": username,
                "role": role,
                "query_text": query_text,
                "is_safe": is_safe,
            },
        )


def log_query_event(
    username: str,
    role: str,
    query_text: str,
    is_safe: bool,
) -> None:
    """Log whether a user's query was considered safe."""
    engine = create_database_engine()

    if engine is None:
        raise ValueError("DATABASE_URL is missing from .env")

    insert_audit_log(
        engine=engine,
        username=username,
        role=role,
        query_text=query_text,
        is_safe=is_safe,
    )
