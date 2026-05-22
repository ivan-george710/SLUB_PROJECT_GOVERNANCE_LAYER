conversation_store = {}


def save_context(
    session_id: str,
    query: str,
    sql: str
):

    conversation_store[
        session_id
    ] = {
        "query": query,
        "sql": sql
    }


def get_context(
    session_id: str
):

    return conversation_store.get(
        session_id
    )