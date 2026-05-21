import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


def get_database_url() -> str | None:
    """Load the application database URL from the .env file."""
    load_dotenv()
    return os.getenv("DATABASE_URL")


def create_database_engine() -> Engine:
    """Create a SQLAlchemy engine for the application database."""
    database_url = get_database_url()

    if not database_url:
        raise ValueError("DATABASE_URL is missing from .env")

    return create_engine(database_url)


def add_connection(
    connection_name: str,
    db_type: str,
    connection_url: str,
) -> None:
    """Add a new database connection record."""
    engine = create_database_engine()
    query = text(
        """
        INSERT INTO database_connections (connection_name, db_type, connection_url)
        VALUES (:connection_name, :db_type, :connection_url)
        """
    )

    with engine.begin() as connection:
        connection.execute(
            query,
            {
                "connection_name": connection_name,
                "db_type": db_type,
                "connection_url": connection_url,
            },
        )


def get_active_connection(connection_name: str) -> dict | None:
    """Return active connection details by connection name."""
    engine = create_database_engine()
    query = text(
        """
        SELECT connection_name, db_type, connection_url, is_active
        FROM database_connections
        WHERE connection_name = :connection_name
          AND is_active = true
        LIMIT 1
        """
    )

    with engine.connect() as connection:
        row = connection.execute(
            query,
            {"connection_name": connection_name},
        ).fetchone()

    if row is None:
        return None

    return dict(row._mapping)
