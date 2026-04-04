from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
import tempfile
import os
import time
from handlers import extract_pdf_text, search_arxiv, choose_best_project, download_pdf

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
    try:
        papers = search_arxiv(request.prompt)
        if not papers or len(papers) < 1:
            return {"error": "No papers found for this prompt."}, 404
        best_title = choose_best_project(papers)
        best_paper = next((p for p in papers if best_title.strip().lower() in p['title'].strip().lower()), None)
        if not best_paper:
            best_paper = papers[0] 
        temp_dir = tempfile.gettempdir()
        pdf_name = f"{int(time.time())}.pdf"
        pdf_path = os.path.join(temp_dir, pdf_name)
        download_pdf(best_paper['pdf'], pdf_path)
        extracted_text = extract_pdf_text(pdf_path)
        os.remove(pdf_path)
        return {"text": extracted_text, "message": "Best paper text extracted successfully"}, 200
    except Exception as e:
        return {"text": str(e), "message": "Failed to process prompt"}, 500