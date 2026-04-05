import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.health import router as health_router
from routes.uploads import router as uploads_router
from routes.chat import router as chat_router
from routes.podcast import router as podcast_router
from routes.story import router as story_router

app = FastAPI(title="Hacktropica API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:6969"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(uploads_router)
app.include_router(chat_router)
app.include_router(podcast_router)
app.include_router(story_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9019)
