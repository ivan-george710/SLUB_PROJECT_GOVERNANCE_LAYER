from pathlib import Path

import pandas as pd

from app.integrations.connector_factory import get_connector


def load_file(file_path: str) -> pd.DataFrame:
    """Load a CSV or Excel file into a pandas DataFrame."""
    file_extension = Path(file_path).suffix.lower()

    if file_extension == ".csv":
        return pd.read_csv(file_path)

    if file_extension == ".xlsx":
        return pd.read_excel(file_path)

    raise ValueError("Only .csv and .xlsx files are supported")


def normalize_column_names(dataframe: pd.DataFrame) -> pd.DataFrame:
    """Normalize DataFrame column names for database use."""
    dataframe = dataframe.copy()
    dataframe.columns = [
        column.strip().lower().replace(" ", "_")
        for column in dataframe.columns
    ]
    return dataframe


def get_database_engine(connection_name: str):
    """Resolve a connector and return its SQLAlchemy engine."""
    connector = get_connector(connection_name)
    connector.connect()
    return connector.get_engine()


def ingest_file(
    file_path: str,
    table_name: str,
    connection_name: str,
) -> dict:
    """Load a file and insert its rows into a PostgreSQL table."""
    dataframe = load_file(file_path)
    dataframe = normalize_column_names(dataframe)

    engine = get_database_engine(connection_name)
    dataframe.to_sql(
        name=table_name,
        con=engine,
        if_exists="append",
        index=False,
    )

    row_count = len(dataframe)

    return {
        "message": "File ingested successfully",
        "row_count": row_count,
    }
