import uvicorn
from fastapi import FastAPI
from routes.health import router as health_router

app = FastAPI(title="Hacktropica API")

app.include_router(health_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5050)
