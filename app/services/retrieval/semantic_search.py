from qdrant_client import QdrantClient

from app.services.retrieval.embedding_service import (
    generate_embedding
)


client = QdrantClient(
    host="localhost",
    port=6333
)


def semantic_schema_search(
    query: str
):

    query_vector = generate_embedding(
        query
    )

    results = client.query_points(
        collection_name="schema_metadata",
        query=query_vector,
        limit=3
    )

    contexts = []

    for point in results.points:

        payload = point.payload

        contexts.append(
            payload["text"]
        )

    return "\n".join(
        contexts
    )