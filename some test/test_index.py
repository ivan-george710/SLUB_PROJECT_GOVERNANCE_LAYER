from qdrant_client import QdrantClient

from qdrant_client.models import (
    VectorParams,
    Distance,
    PointStruct
)

from app.services.retrieval.embedding_service import (
    generate_embedding
)


client = QdrantClient(
    host="localhost",
    port=6333
)


COLLECTION_NAME = "schema_metadata"


print(
    "Recreating Qdrant collection..."
)


client.recreate_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(
        size=384,
        distance=Distance.COSINE
    )
)


schema_text = """
Table: loan_applications

Columns:

sk_id_curr
target
name_contract_type
code_gender
flag_own_car
flag_own_realty
cnt_children
amt_income_total
amt_credit
amt_annuity
amt_goods_price
name_type_suite
name_income_type
name_education_type
name_family_status
name_housing_type
region_population_relative
days_birth
days_employed
occupation_type
organization_type
ext_source_1
ext_source_2
ext_source_3
obs_30_cnt_social_circle
def_30_cnt_social_circle
amt_req_credit_bureau_year
"""


print(
    "Generating embeddings..."
)


embedding = generate_embedding(
    schema_text
)


print(
    "Uploading schema to Qdrant..."
)


client.upsert(
    collection_name=COLLECTION_NAME,
    points=[
        PointStruct(
            id=1,
            vector=embedding,
            payload={
                "text": schema_text
            }
        )
    ]
)


print(
    "Schema indexed successfully"
)