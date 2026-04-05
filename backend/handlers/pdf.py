import fitz  
import json
from groq import Groq

def get_groq_client():
    with open("tokens.json", "r") as f:
        keys = list(json.load(f).values())
    last_exception = None
    for key in keys:
        try:
            client = Groq(api_key=key)
            test = client.models.list()
            return client
        except Exception as e:
            last_exception = e
            continue
    raise RuntimeError(f"All Groq API keys exhausted or invalid. Last error: {last_exception}")

client = get_groq_client()

def extract_pdf_text(pdf_path: str) -> str:
    try:
        text_content = ""
        
        pdf_document = fitz.open(pdf_path)
        
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            text_content += page.get_text()
        
        pdf_document.close()
        
        return text_content
    
    except FileNotFoundError:
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def load_pdf_prompt():
    try:
        with open("../data/pdf.txt", "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return "You are PaperLens AI."

BASE_PROMPT = load_pdf_prompt()

async def validate_pdf(text: str):
    try:
        truncated_text = text[:12000]

        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": BASE_PROMPT},
                {"role": "user", "content": truncated_text},
            ],
            temperature=0,
        )

        answer = response.choices[0].message.content.strip().upper()

        return "YES" if "YES" in answer else "NO"

    except Exception as e:
        return "ERROR"

REJECTION_MSG = "I am PaperLens AI. I only assist with research paper understanding and academic topics."