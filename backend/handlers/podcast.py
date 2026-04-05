import os
import json
from groq import Groq
from dotenv import load_dotenv
import requests

load_dotenv()

def get_groq_client():
    tokens_path = os.path.join(os.path.dirname(__file__), "..", "data", "tokens.json")
    with open(tokens_path, "r") as f:
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

AGENT1_SYSTEM = "You are Dr. Smith, a curious AI scientist. Discuss the research paper with your colleague."
AGENT2_SYSTEM = "You are Dr. Lee, an insightful AI researcher. Discuss the research paper with your colleague."

VOICE_ID_HOST = "VOICE_ID_HOST"  # Replace with actual ElevenLabs voice ID for host
VOICE_ID_GUESTS = [
    "VOICE_ID_GUEST1",  # Replace with actual ElevenLabs voice ID for guest 1
    "VOICE_ID_GUEST2",  # Replace with actual ElevenLabs voice ID for guest 2
    "VOICE_ID_GUEST3",  # Replace with actual ElevenLabs voice ID for guest 3
]

SYSTEM_PROMPTS_SINGLE = {
    "friend": "You are a friendly podcast host. Explain the research paper in a casual, relatable, and simple way as if talking to a friend.",
    "teacher": "You are a knowledgeable teacher podcast host. Explain the research paper clearly and thoroughly for students with some background knowledge.",
    "scientist": "You are a scientist podcast host. Discuss the research paper in detail, using technical language and focusing on scientific insights."
}

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

def ai_podcast_conversation(paper_text: str, turns: int = 6, max_chars: int = 5000, elevenlabs_api_key: str = None) -> dict:
    """
    Simulate a conversation between two AI agents about the research paper text.
    Returns a dict with dialogue and mp3 file paths for each turn.
    """
    messages = [
        {"role": "system", "content": AGENT1_SYSTEM},
        {"role": "user", "content": f"Let's discuss this research paper: {paper_text[:8000]}"}
    ]
    dialogue = []
    total_chars = 0
    mp3_files = []
    for i in range(turns):
        # Agent 1 speaks
        chat1 = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.7
        )
        msg1 = chat1.choices[0].message.content.strip()
        if total_chars + len(msg1) > max_chars:
            msg1 = msg1[:max_chars - total_chars]
        total_chars += len(msg1)
        dialogue.append({"Dr. Smith": msg1})
        # ElevenLabs TTS for Dr. Smith
        if elevenlabs_api_key:
            mp3_path = f"podcast_smith_{i+1}.mp3"
            text_to_speech_elevenlabs(msg1, mp3_path, VOICE_ID_SMITH, elevenlabs_api_key)
            mp3_files.append({"Dr. Smith": mp3_path})
        messages.append({"role": "assistant", "content": msg1})
        if total_chars >= max_chars:
            break
        # Agent 2 responds
        if i < turns - 1:
            lee_messages = messages.copy()
            lee_messages[0] = {"role": "system", "content": AGENT2_SYSTEM}
            chat2 = client.chat.completions.create(
                messages=lee_messages,
                model="llama-3.1-8b-instant",
                temperature=0.7
            )
            msg2 = chat2.choices[0].message.content.strip()
            if total_chars + len(msg2) > max_chars:
                msg2 = msg2[:max_chars - total_chars]
            total_chars += len(msg2)
            dialogue.append({"Dr. Lee": msg2})
            # ElevenLabs TTS for Dr. Lee
            if elevenlabs_api_key:
                mp3_path = f"podcast_lee_{i+1}.mp3"
                text_to_speech_elevenlabs(msg2, mp3_path, VOICE_ID_LEE, elevenlabs_api_key)
                mp3_files.append({"Dr. Lee": mp3_path})
            messages.append({"role": "assistant", "content": msg2})
            if total_chars >= max_chars:
                break
    return {"dialogue": dialogue, "audio_files": mp3_files}

def single_host_podcast(paper_text: str, level: str = "friend", max_chars: int = 5000, elevenlabs_api_key: str = None) -> dict:
    """
    Generate a single-host podcast monologue at the given level and return the text and mp3 file path.
    """
    system_prompt = SYSTEM_PROMPTS_SINGLE.get(level, SYSTEM_PROMPTS_SINGLE["friend"])
    voice_id = VOICE_IDS_SINGLE.get(level, VOICE_IDS_SINGLE["friend"])
    prompt = f"Summarize and discuss the following research paper for a podcast. Limit to {max_chars} characters.\n\n{paper_text[:12000]}"
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        model="llama-3.1-8b-instant",
        temperature=0.7
    )
    monologue = chat_completion.choices[0].message.content.strip()[:max_chars]
    mp3_path = f"podcast_{level}.mp3"
    audio_result = None
    if elevenlabs_api_key:
        audio_result = text_to_speech_elevenlabs(monologue, mp3_path, voice_id, elevenlabs_api_key)
    return {"text": monologue, "audio_file": audio_result or mp3_path}

def multi_guest_podcast(paper_text: str, turns: int = 6, max_chars: int = 5000, elevenlabs_api_key: str = None) -> dict:
    """
    Simulate a podcast with 1 host and 3 guests, each with their own voice ID.
    First generate the conversation text, then convert each turn to voice.
    Returns a dict with dialogue and mp3 file paths for each turn.
    """
    messages = [
        {"role": "system", "content": HOST_SYSTEM},
        {"role": "user", "content": f"Let's discuss this research paper: {paper_text[:8000]}"}
    ]
    dialogue = []
    total_chars = 0
    for i in range(turns):
        # Host speaks
        chat_host = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.7
        )
        host_msg = chat_host.choices[0].message.content.strip()
        if total_chars + len(host_msg) > max_chars:
            host_msg = host_msg[:max_chars - total_chars]
        total_chars += len(host_msg)
        dialogue.append(("Host", host_msg))
        messages.append({"role": "assistant", "content": host_msg})
        if total_chars >= max_chars:
            break
        # Each guest responds in turn
        for guest_idx in range(3):
            if total_chars >= max_chars:
                break
            guest_messages = messages.copy()
            guest_messages[0] = {"role": "system", "content": GUEST_SYSTEMS[guest_idx]}
            chat_guest = client.chat.completions.create(
                messages=guest_messages,
                model="llama-3.1-8b-instant",
                temperature=0.7
            )
            guest_msg = chat_guest.choices[0].message.content.strip()
            if total_chars + len(guest_msg) > max_chars:
                guest_msg = guest_msg[:max_chars - total_chars]
            total_chars += len(guest_msg)
            dialogue.append((f"Guest {guest_idx+1}", guest_msg))
            messages.append({"role": "assistant", "content": guest_msg})
            if total_chars >= max_chars:
                break
    # Now, after all text is generated, convert each turn to voice
    mp3_files = []
    if elevenlabs_api_key:
        for idx, (role, msg) in enumerate(dialogue):
            if role == "Host":
                voice_id = VOICE_ID_HOST
            else:
                guest_num = int(role.split()[1]) - 1
                voice_id = VOICE_ID_GUESTS[guest_num]
            mp3_path = f"podcast_{role.lower().replace(' ', '_')}_{idx+1}.mp3"
            text_to_speech_elevenlabs(msg, mp3_path, voice_id, elevenlabs_api_key)
            mp3_files.append({role: mp3_path})
    return {"dialogue": [{role: msg} for role, msg in dialogue], "audio_files": mp3_files}
