import requests
import xml.etree.ElementTree as ET


import requests
import xml.etree.ElementTree as ET
from io import BytesIO
from pdfminer.high_level import extract_text


def search_arxiv(query: str, limit: int = 5):
    url = "http://export.arxiv.org/api/query"

    params = {
        "search_query": query,
        "start": 0,
        "max_results": limit
    }

    res = requests.get(url, params=params, timeout=10)
    root = ET.fromstring(res.content)

    ns = {"atom": "http://www.w3.org/2005/Atom"}

    results = []

    for entry in root.findall("atom:entry", ns):
        title = entry.find("atom:title", ns).text.strip()
        summary = entry.find("atom:summary", ns).text.strip()
        link = entry.find("atom:id", ns).text.strip()

        pdf = link.replace("abs", "pdf") + ".pdf"

        results.append({
            "title": title,
            "pdf": pdf,
            "summary": summary,
            "url": link
        })

    return results


    
if __name__ == "__main__":
    query = "deep learning for natural language processing"
    results = search_arxiv(query)
    for idx, paper in enumerate(results):
        print(f"{idx+1}. {paper['title']} (PDF: {paper['pdf'] is not None}) | URL: {paper['url']} | Has PDF: {paper['pdf'] is not None}")