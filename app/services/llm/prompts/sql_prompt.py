def build_sql_prompt(
    user_query: str,
    schema_context: str,
    query_plan: dict
):

    prompt = f"""
You are an expert PostgreSQL SQL generator.

STRICT RULES:
- Use ONLY tables provided
- Never invent tables
- Never invent columns
- Generate ONLY SQL
- No markdown
- No explanation

DATABASE SCHEMA:
{schema_context}

QUERY PLAN:
{query_plan}

USER QUERY:
{user_query}

Generate PostgreSQL SQL.
"""

    return prompt