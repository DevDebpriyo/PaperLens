from fastapi import APIRouter, BackgroundTasks, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
import tempfile
import os
import time
from handlers import generate_story_from_text, text_to_speech_elevenlabs

router = APIRouter()


class PromptRequest(BaseModel):
    prompt: str


@router.post("/user/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        temp_dir = tempfile.gettempdir()
        
        pdf_name = f"{int(time.time())}.pdf"
        pdf_path = os.path.join(temp_dir, pdf_name)
        
        with open(pdf_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        extracted_text = extract_pdf_text(pdf_path)
        
        os.remove(pdf_path)
        
        return {
            "text": extracted_text,
            "message": "PDF processed successfully"
        }, 200
    
    except Exception as e:
        return {
            "text": str(e),
            "message": "Failed to process PDF"
        }, 500



@router.post("/user/prompt")
async def submit_prompt(request: PromptRequest, background_tasks: BackgroundTasks):
    try:
        story = generate_story_from_text(request.prompt, level="beginner")

        temp_dir = tempfile.gettempdir()
        audio_filename = f"story_{int(time.time())}.mp3"
        audio_path = os.path.join(temp_dir, audio_filename)

        result = text_to_speech_elevenlabs(story, audio_path, level="beginner")

        if result.startswith("Error"):
            return {"text": story, "message": "Story generated but TTS failed.", "error": result}

        background_tasks.add_task(os.remove, audio_path)

        return FileResponse(
            path=audio_path,
            media_type="audio/mpeg",
            filename=audio_filename,
        )

    except Exception as e:
        return {"text": str(e), "message": "Failed to generate story from prompt."}