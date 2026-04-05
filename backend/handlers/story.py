import os
import json
from groq import Groq
from dotenv import load_dotenv
import requests

load_dotenv()

ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

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

SYSTEM_PROMPT = "You are a creative assistant. Given the extracted text from a research paper, write a short, engaging story (max 5000 characters) that conveys the main ideas and findings in a narrative style for a general audience."

def generate_story_from_text(extracted_text: str, level: str = "beginner") -> str:
    if level == "beginner":
        system_prompt = (
            "You are a creative assistant. Given the extracted text from a research paper, write a very short, simple story (max 2000 characters) that conveys the main ideas in a fun, easy-to-understand way for beginners."
        )
        char_limit = 2000
    elif level == "intermediate":
        system_prompt = (
            "You are a creative assistant. Given the extracted text from a research paper, write a medium-length story (max 3500 characters) that explains the main ideas and findings in a clear, engaging way for someone with some background knowledge."
        )
        char_limit = 3500
    else:
        system_prompt = (
            "You are a creative assistant. Given the extracted text from a research paper, write a detailed, engaging story (max 5000 characters) that conveys the main ideas and findings in a narrative style for a general audience."
        )
        char_limit = 5000

    prompt = f"Write a story based on the following research paper text. Limit the story to {char_limit} characters.\n\n{extracted_text[:12000]}"
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7
            # No temp file removal needed for story handler as per new requirements
        )
        story = chat_completion.choices[0].message.content.strip()
        return story
    except Exception as e:
        return f"Error generating story: {str(e)}"

VOICE_IDS = {
    "beginner": "QIhD5ivPGEoYZQDocuHI",      
    "intermediate": "DWRB4weeqtqHSoQLvPTd", 
    "advanced": "ITaiTttRyfzFt2lW5dI5"       
}

def text_to_speech_elevenlabs(text: str, output_path: str, level: str) -> str:

    voice_id = VOICE_IDS.get(level, VOICE_IDS["advanced"])
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        with open(output_path, "wb") as f:
            f.write(response.content)
        return output_path
    except Exception as e:
        return f"Error generating speech: {str(e)}"
