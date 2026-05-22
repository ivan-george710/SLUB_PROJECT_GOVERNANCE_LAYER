from sqlalchemy import create_engine
import pandas as pd


DATABASE_URL = (
    "postgresql://postgres:password@localhost:5432/datagpt"
)


engine = create_engine(
    DATABASE_URL
)


def execute_sql(
    sql: str
):

    df = pd.read_sql(
        sql,
        engine
    )

    return df.to_dict(
        orient="records"
    )