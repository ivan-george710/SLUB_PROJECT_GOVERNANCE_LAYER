from fastapi import FastAPI

from app.api.query import router as query_router


app = FastAPI(
    title="DataGPT",
    version="0.1.0"
)


@app.get("/")
def root():

    return {
        "message": "DataGPT running"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }


app.include_router(
    query_router
)