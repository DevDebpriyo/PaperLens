from fastapi import APIRouter, Body
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tempfile
import os
from handlers.podcast import ai_podcast_conversation, multi_podcast_labs

router = APIRouter()

class PodcastRequest(BaseModel):
    text: str
    level: str 

@router.post("/podcast/voice")
async def podcast_voice(request: PodcastRequest):
    dialogue_dict = ai_podcast_conversation(request.text, level=request.level)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        mp3_path = tmp.name
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        return {"error": "ELEVENLABS_API_KEY not set"}, 500
    result_path = multi_podcast_labs(dialogue_dict, request.level, mp3_path, api_key)
    if not os.path.exists(result_path):
        return {"error": "Failed to generate podcast audio"}, 500
    return FileResponse(result_path, media_type="audio/mpeg", filename="podcast.mp3")
