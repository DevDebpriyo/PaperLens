import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def get_groq_client():
    with open(os.path.join(os.path.dirname(__file__), '../backend/data/tokens.json'), "r") as f:
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

REJECTION_MSG = "I am PaperLens AI. I only assist with research paper understanding and academic topics."

def load_system_prompt():
    try:
        with open("data/prompt.txt", "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return "You are PaperLens AI."

def generate_response(user_input: str):
    if not user_input:
        return "Please provide a message"

    system_prompt = load_system_prompt()

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.2
        )

        response = chat_completion.choices[0].message.content.strip()

        if response.startswith(REJECTION_MSG):
            return REJECTION_MSG

        return response

    except Exception as e:
        return f"Error: {str(e)}"
