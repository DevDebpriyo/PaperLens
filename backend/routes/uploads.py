from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
import tempfile
import os
import time
from handlers import extract_pdf_text

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
async def submit_prompt(request: PromptRequest):
    return {
        "prompt": request.prompt,
        "message": "Prompt received successfully"
    }