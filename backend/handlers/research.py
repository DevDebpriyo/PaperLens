import requests
import xml.etree.ElementTree as ET
import os
import re
import time
import fitz
from dotenv import load_dotenv
from groq import Groq
import json

load_dotenv()

def get_groq_client():
    with open("data/tokens.json", "r") as f:
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


def search_arxiv(query: str):
    url = "http://export.arxiv.org/api/query"
    limit = 5
    params = {
        "search_query": f"all:{query}",   
        "start": 0,
        "max_results": limit
    }

    res = requests.get(url, params=params, timeout=10)
    res.raise_for_status()

    root = ET.fromstring(res.content)
    ns = {"atom": "http://www.w3.org/2005/Atom"}

    results = []

    for entry in root.findall("atom:entry", ns):
        title = entry.find("atom:title", ns)
        summary = entry.find("atom:summary", ns)
        link = entry.find("atom:id", ns)

        if title is None or link is None:
            continue

        title_text = title.text.strip().replace("\n", " ")
        summary_text = summary.text.strip().replace("\n", " ") if summary is not None else ""

        base_link = link.text.strip()
        pdf_link = base_link.replace("abs", "pdf") + ".pdf"

        results.append({
            "title": title_text,
            "pdf": pdf_link,
            "summary": summary_text,
            "url": base_link
        })

    return results


def sanitize_filename(name: str, max_length: int = 100):
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    return name[:max_length]


def download_pdf(pdf_url: str, pdf_path: str):
    try:
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

        if os.path.exists(pdf_path):
            return pdf_path

        response = requests.get(pdf_url, timeout=20)
        response.raise_for_status()

        with open(pdf_path, "wb") as f:
            f.write(response.content)

        return pdf_path

    except Exception as e:
        print(f"Download failed for {pdf_path[:40]}:", e)
        return None


def choose_best_project(projects):
    if len(projects) != 5:
        raise ValueError("Exactly 5 projects must be provided.")

    titles = [p['title'] for p in projects]
    prompt = """Given the following 5 project titles, return ONLY the title of the best project for research purposes.\n\n"""
    for idx, title in enumerate(titles, 1):
        prompt += f"{idx}. {title}\n"
    prompt += "\nReturn only the best project title, nothing else."

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are PaperLens AI. Only respond with the best project title."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant", 
            temperature=0.2
        )
        response = chat_completion.choices[0].message.content.strip()
        if response.startswith(REJECTION_MSG):
            best_title = REJECTION_MSG
        else:
            best_title = response
    except Exception as e:
        print("Groq API error:", e)
        raise

    pdf_filename = f"{int(time.time())}.pdf"
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), best_title, fontsize=18)
    doc.save(pdf_filename)
    doc.close()

    return pdf_filename
