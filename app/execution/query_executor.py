from typing import Any

from app.integrations.connector_factory import get_connector


def execute_governed_query(
    connection_name: str,
    query: str,
) -> list[dict[str, Any]]:
    """Execute a query using the connector for a saved connection."""
    connector = get_connector(connection_name)
    connector.connect()

    results = connector.execute_query(query)

    return results
