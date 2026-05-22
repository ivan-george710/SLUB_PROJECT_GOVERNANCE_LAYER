from app.services.llm.sql_generator import (
    generate_sql
)


query = (
    "Show total loans by city"
)

sql = generate_sql(
    query
)

print(sql)