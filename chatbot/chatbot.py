from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Constant rejection message (IMPORTANT)
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
            temperature=0.2  # lower = stricter, less hallucination
        )

        response = chat_completion.choices[0].message.content.strip()

        # 🔥 HARD OUTPUT CONTROL (FINAL FIX)
        # If model tries to continue after rejection → cut it
        if response.startswith(REJECTION_MSG):
            return REJECTION_MSG

        return response

    except Exception as e:
        return f"Error: {str(e)}"