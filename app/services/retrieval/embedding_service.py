from sentence_transformers import SentenceTransformer


embedding_model = SentenceTransformer(
    "BAAI/bge-small-en"
)


def generate_embedding(
    text: str
):

    return embedding_model.encode(
        text
    ).tolist()