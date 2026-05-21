from app.integrations.connection_manager import get_active_connection
from app.integrations.postgres_connector import PostgresConnector


def get_connector(connection_name: str):
    """Return a connector for an active saved connection."""
    connection_details = get_active_connection(connection_name)

    if connection_details is None:
        raise ValueError(f"Missing active connection: {connection_name}")

    db_type = connection_details["db_type"]
    connection_url = connection_details["connection_url"]

    if db_type == "postgres":
        return PostgresConnector(connection_url)

    raise ValueError(f"Unsupported database type: {db_type}")
