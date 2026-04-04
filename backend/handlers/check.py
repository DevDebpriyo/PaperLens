import os
import fitz  # PyMuPDF
import asyncio
import logging
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import PlainTextResponse
from dotenv import load_dotenv
from groq import AsyncGroq

# -------------------------------
# ⚙️ Setup
# -------------------------------
load_dotenv()

app = FastAPI()

logging.basicConfig(level=logging.INFO)

# Limit concurrent requests
semaphore = asyncio.Semaphore(5)

# Init Groq client
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

# Read prompt
with open("../data/pdf.txt", "r", encoding="utf-8") as f:
    BASE_PROMPT = f.read()


# -------------------------------
# 📄 Extract text from PDF
# -------------------------------
async def extract_text_from_pdf(file: UploadFile):
    contents = await file.read()

    def process_pdf():
        try:
            doc = fitz.open(stream=contents, filetype="pdf")
            text = ""

            for page in doc:
                page_text = page.get_text()

                # CLEANING
                page_text = page_text.replace("\t", " ")   # tab → space
                page_text = page_text.replace("\r", "")    # remove CR

                text += page_text + "\n"

            # remove excessive blank lines
            text = text.replace("\n\n\n", "\n\n").strip()

            return text

        except Exception as e:
            logging.error(f"PDF extraction error: {e}")
            return ""

    return await asyncio.to_thread(process_pdf)


# -------------------------------
# 🤖 Validate using Groq
# -------------------------------
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
        logging.error(f"Groq API error: {e}")
        return "ERROR"


# -------------------------------
# 🚀 API Endpoint
# -------------------------------
@app.post("/check-pdf/", response_class=PlainTextResponse)
async def check_pdf(file: UploadFile = File(...)):
    logging.info(f"📄 Received file: {file.filename}")

    if not file.filename.lower().endswith(".pdf"):
        return "ERROR: Only PDF files allowed"

    try:
        async with semaphore:
            logging.info("⚙️ Extracting text...")

            text = await extract_text_from_pdf(file)

            if not text or len(text.strip()) < 200:
                return "ERROR: PDF seems empty or invalid"

            logging.info("🤖 Checking legitimacy...")

            result = await validate_pdf(text)

            logging.info(f"✅ Result: {result}")

            # ❌ IF NOT LEGIT → DO NOT SHOW TEXT
            if result == "NO":
                return f"""
========== PDF ANALYSIS RESULT ==========
Is Legit Research Paper: NO

❌ The uploaded document is NOT a valid research paper.
Extracted text is hidden.
""".strip()

            # ✅ IF LEGIT → SHOW FULL TEXT
            if result == "YES":
                return f"""
========== PDF ANALYSIS RESULT ==========
Is Legit Research Paper: YES

========== EXTRACTED TEXT ==========

{text}
""".strip()

            # ⚠️ fallback
            return "ERROR: Could not determine result"

    except Exception as e:
        logging.error(f"🔥 Server error: {str(e)}")
        return f"ERROR: {str(e)}"