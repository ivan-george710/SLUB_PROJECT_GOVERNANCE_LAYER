import pandas as pd

from sqlalchemy import create_engine


DATABASE_URL = (
    "postgresql://postgres:password@localhost:5432/datagpt"
)


engine = create_engine(
    DATABASE_URL
)


DATASET_PATH = (
    r"C:\DataGPT_re\dataset\application_train.csv"
)


print(
    "Loading dataset..."
)


df = pd.read_csv(
    DATASET_PATH
)


# CONVERT ALL COLUMN NAMES TO LOWERCASE

df.columns = [
    col.lower()
    for col in df.columns
]


print(
    "Dataset loaded into pandas"
)

print(
    f"Rows: {len(df)}"
)

print(
    f"Columns: {len(df.columns)}"
)


print(
    "Uploading dataset to PostgreSQL..."
)


df.to_sql(
    "loan_applications",
    engine,
    if_exists="replace",
    index=False
)


print(
    "Dataset loaded successfully into PostgreSQL"
)


print(
    "Table name: loan_applications"
)