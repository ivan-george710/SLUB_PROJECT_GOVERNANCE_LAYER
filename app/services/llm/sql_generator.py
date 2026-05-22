from app.services.llm.providers.ollama_provider import (
    OllamaProvider
)

from app.services.retrieval.semantic_search import (
    semantic_schema_search
)

from app.services.planner.query_planner import (
    create_query_plan
)

from app.services.llm.prompts.sql_prompt import (
    build_sql_prompt
)

from app.services.repair.sql_repair import (
    repair_sql
)


provider = OllamaProvider()


def generate_sql(
    query: str
):

    schema_context = semantic_schema_search(
        query
    )

    query_plan = create_query_plan(
        query
    )

    prompt = build_sql_prompt(
        user_query=query,
        schema_context=schema_context,
        query_plan=query_plan
    )

    sql = provider.generate(
        prompt
    )

    cleaned_sql = repair_sql(
        sql
    )

    return cleaned_sql