import os
import json
from groq import Groq
from dotenv import load_dotenv
import requests
import tempfile
import shutil

load_dotenv()

def get_groq_client():
    with open("tokens.json", "r") as f:
        keys = list(json.load(f).values())
    last_exception = None
    for key in keys:
        try:
            client = Groq(api_key=key)
            client.models.list()
            return client
        except Exception as e:
            last_exception = e
            continue
    raise RuntimeError(f"All Groq API keys exhausted or invalid. Last error: {last_exception}")

client = get_groq_client()

SPEAKER_NAMES = {
    "friend": ("Ranveer", "Samay"),
    "teacher": ("Ranveer", "Alakh"),
    "scientist": ("Ranveer", "Sir APJ Abdul Kalam")
}

VOICE_IDS_PAIR = {
    "friend": ("PouU1r0E06DKPc95jpeo", "xLLhiVEVlyz49giHc9T0"),
    "teacher": ("PouU1r0E06DKPc95jpeo", "dyV5YXIulJ4AQemVi0u1"),
    "scientist": ("PouU1r0E06DKPc95jpeo", "Wa04ZikXgZON6tuLKJCA")
}

SYSTEMS = {
    "friend": [
        "You are Ranveer, a friendly podcast host. Discuss the research paper in a casual, simple way as if talking to your friend Samay.",
        "You are Samay, a friendly podcast guest. Discuss the research paper in a casual, simple way as if talking to your friend Ranveer."
    ],
    "teacher": [
        "You are Ranveer, a knowledgeable teacher podcast host. Discuss the research paper clearly for students with your guest Alakh.",
        "You are Alakh, a teacher podcast guest. Discuss the research paper clearly for students with your host Ranveer."
    ],
    "scientist": [
        "You are Ranveer, a scientist podcast host. Discuss the research paper in detail, using technical language, with Sir APJ Abdul Kalam.",
        "You are Sir APJ Abdul Kalam, a scientist podcast guest. Discuss the research paper in detail, using technical language, with Ranveer."
    ]
}

def ai_podcast_conversation(paper_text: str, turns: int = 6, max_chars: int = 5000, level: str = "friend") -> dict:
    speakers = SPEAKER_NAMES.get(level, SPEAKER_NAMES["friend"])
    systems = SYSTEMS.get(level, SYSTEMS["friend"])
    messages = [
        {"role": "system", "content": systems[0]},
        {"role": "user", "content": f"Let's discuss this research paper: {paper_text[:8000]}"}
    ]
    dialogue = []
    total_chars = 0
    for i in range(turns):
        # Speaker 1
        chat1 = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.7
        )
        msg1 = chat1.choices[0].message.content.strip()
        if total_chars + len(msg1) > max_chars:
            msg1 = msg1[:max_chars - total_chars]
        total_chars += len(msg1)
        dialogue.append({speakers[0]: msg1})
        messages.append({"role": "assistant", "content": msg1})
        if total_chars >= max_chars:
            break
        # Speaker 2
        if i < turns - 1:
            guest_messages = messages.copy()
            guest_messages[0] = {"role": "system", "content": systems[1]}
            chat2 = client.chat.completions.create(
                messages=guest_messages,
                model="llama-3.1-8b-instant",
                temperature=0.7
            )
            msg2 = chat2.choices[0].message.content.strip()
            if total_chars + len(msg2) > max_chars:
                msg2 = msg2[:max_chars - total_chars]
            total_chars += len(msg2)
            dialogue.append({speakers[1]: msg2})
            messages.append({"role": "assistant", "content": msg2})
            if total_chars >= max_chars:
                break
    return {"dialogue": dialogue}

def text_to_speech_elevenlabs(text: str, output_path: str, voice_id: str, api_key: str) -> str:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
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

def multi_podcast_labs(dialogue_dict: dict, level: str, output_path: str, elevenlabs_api_key: str) -> str:
    voice_ids = VOICE_IDS_PAIR.get(level, VOICE_IDS_PAIR["friend"])
    temp_files = []
    for idx, turn in enumerate(dialogue_dict["dialogue"]):
        speaker, text = list(turn.items())[0]
        if speaker == SPEAKER_NAMES[level][0]:
            voice_id = voice_ids[0]
        else:
            voice_id = voice_ids[1]
        temp_mp3 = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        text_to_speech_elevenlabs(text, temp_mp3.name, voice_id, elevenlabs_api_key)
        temp_files.append(temp_mp3.name)
    with open(output_path, "wb") as outfile:
        for fname in temp_files:
            with open(fname, "rb") as infile:
                shutil.copyfileobj(infile, outfile)
    for fname in temp_files:
        os.remove(fname)
    return output_path
