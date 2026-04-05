from fastapi import APIRouter, Body
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tempfile
import os
from handlers import generate_story_from_text, text_to_speech_elevenlabs

router = APIRouter()

class StoryRequest(BaseModel):
    text: str
    level: str 

@router.post("/story/voice")
async def story_voice(request: StoryRequest):
    story = generate_story_from_text(request.text, request.level)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        mp3_path = tmp.name
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        return {"error": "ELEVENLABS_API_KEY not set"}, 500
    result = text_to_speech_elevenlabs(story, mp3_path, request.level, api_key)
    if not os.path.exists(mp3_path):
        return {"error": result}, 500
    return FileResponse(mp3_path, media_type="audio/mpeg", filename="story.mp3")
