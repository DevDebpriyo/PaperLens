import fitz  


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
