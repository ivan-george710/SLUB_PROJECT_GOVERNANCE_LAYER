def repair_sql(
    sql: str
):

    sql = sql.replace(
        "```sql",
        ""
    )

    sql = sql.replace(
        "```",
        ""
    )

    sql = sql.strip()

    return sql