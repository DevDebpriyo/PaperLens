from fastapi import APIRouter, Body
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tempfile
import os
from handlers import generate_story_from_text, text_to_speech_elevenlabs
from dotenv import load_dotenv

load_dotenv()


router = APIRouter()

class StoryRequest(BaseModel):
    text: str
    level: str 

@router.post("/story/voice")
async def story_voice(request: StoryRequest):
    print(f"[story_voice] Received request: level={request.level}, text_length={len(request.text)}")
    try:
        story = generate_story_from_text(request.text, request.level)
        print(f"[story_voice] Generated story (length={len(story)}): {story[:100]}...")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            mp3_path = tmp.name
        api_key = os.getenv("ELEVEN_LABS_API_KEY")
        if not api_key:
            print("[story_voice] ELEVEN_LABS_API_KEY not set!")
            return {"error": "ELEVEN_LABS_API_KEY not set"}, 500
        result = text_to_speech_elevenlabs(story, mp3_path, request.level)
        if not os.path.exists(mp3_path) or os.path.getsize(mp3_path) == 0:
            print(f"[story_voice] Failed to generate mp3: {result}")
            return {"error": result}, 500
        print(f"[story_voice] Returning mp3 file: {mp3_path}")
        return FileResponse(mp3_path, media_type="audio/mpeg", filename="story.mp3")
    except Exception as e:
        print(f"[story_voice] Exception: {e}")
        return {"error": str(e)}, 500
