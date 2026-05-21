from typing import Any

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from app.integrations.base_connector import BaseConnector


class PostgresConnector(BaseConnector):
    """Connector for PostgreSQL databases."""

    def __init__(self, connection_url: str) -> None:
        self.connection_url = connection_url
        self.engine: Engine | None = None

    def connect(self) -> None:
        """Create a SQLAlchemy engine for PostgreSQL."""
        self.engine = create_engine(self.connection_url)

    def get_engine(self) -> Engine:
        """Return the active engine, connecting first if needed."""
        if self.engine is None:
            self.connect()

        if self.engine is None:
            raise ValueError("Could not connect to PostgreSQL")

        return self.engine

    def get_tables(self) -> list[str]:
        """Return all public table names."""
        query = text(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name
            """
        )

        engine = self.get_engine()

        with engine.connect() as connection:
            rows = connection.execute(query)
            return [row.table_name for row in rows]

    def get_columns(self, table_name: str) -> list[str]:
        """Return column names for a public table."""
        query = text(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = :table_name
            ORDER BY ordinal_position
            """
        )

        engine = self.get_engine()

        with engine.connect() as connection:
            rows = connection.execute(query, {"table_name": table_name})
            return [row.column_name for row in rows]

    def execute_query(self, query: str) -> list[dict[str, Any]]:
        """Run a SQL query and return rows as dictionaries."""
        engine = self.get_engine()

        with engine.connect() as connection:
            rows = connection.execute(text(query))
            return [dict(row._mapping) for row in rows]
