from abc import ABC, abstractmethod
from typing import Any


class BaseConnector(ABC):
    """Base class for all data source connectors."""

    @abstractmethod
    def connect(self) -> None:
        """Connect to the data source."""
        pass

    @abstractmethod
    def get_tables(self) -> list[str]:
        """Return available table names."""
        pass

    @abstractmethod
    def get_columns(self, table_name: str) -> list[str]:
        """Return column names for a table."""
        pass

    @abstractmethod
    def execute_query(self, query: str) -> list[dict[str, Any]]:
        """Run a query and return the results."""
        pass
