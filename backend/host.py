import uvicorn
from fastapi import FastAPI
from routes.health import router as health_router
from routes.uploads import router as uploads_router
from routes.chat import router as chat_router

app = FastAPI(title="Hacktropica API")

app.include_router(health_router)
app.include_router(uploads_router)
app.include_router(chat_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9019)
