# backend/utils/pdf_utils.py
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close() # Ensure the document is closed
        return text
    except Exception as e:
        # You might want to log this error
        print(f"Error extracting text from PDF: {e}")
        raise # Re-raise the exception to be caught by the calling function