# services/question_parser.py

import os
import re
import json
import logging
from openai import OpenAI
from fastapi import UploadFile
from utils.pdf_utils import extract_text_from_pdf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Groq/OpenAI client initialization
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_prompt(text: str) -> str:
    return f"""
You are an expert in parsing question papers.
Extract all questions from the provided question paper text, along with their answer keys and allocated marks.
Ensure that the output is a perfectly valid JSON object conforming to the specified schema.
Do not include any additional text, explanations, or formatting outside the JSON object.

JSON Schema:
{{
  "total_marks": int,
  "questions": [
    {{
      "question_id": int,
      "question_text": string,
      "answer_key": string,
      "marks": int
    }}
  ]
}}

Question paper text:
---
{text}
---
"""

async def parse_question_paper(file: UploadFile):
    try:
        pdf_bytes = await file.read()
        text = extract_text_from_pdf(pdf_bytes)

        if not text.strip():
            logger.warning("No text extracted from the uploaded PDF.")
            return {"error": "Could not extract text from the PDF."}

        prompt = generate_prompt(text)

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        logger.info(f"LLM Response Snippet: {content[:400]}...")

        try:
            parsed_json = json.loads(content)

            if isinstance(parsed_json, dict) and "total_marks" in parsed_json and "questions" in parsed_json:
                return parsed_json
            else:
                logger.error("LLM returned an unexpected JSON structure.")
                return {"error": "Invalid JSON structure returned by LLM."}

        except json.JSONDecodeError:
            logger.warning("Raw response is not valid JSON. Attempting regex fallback.")
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    logger.error("Regex extracted content is still invalid.")
                    return {"error": "Could not parse JSON even after fallback."}
            else:
                logger.error("No JSON object found in the response.")
                return {"error": "No valid JSON content found in LLM response."}

    except Exception as e:
        logger.exception("Unexpected error during PDF parsing.")
        return {"error": f"Internal error: {str(e)}"}
