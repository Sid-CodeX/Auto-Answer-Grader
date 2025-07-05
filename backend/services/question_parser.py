# services/question_parser.py
import os
import re
import json
from openai import OpenAI
from fastapi import UploadFile
from utils.pdf_utils import extract_text_from_pdf
import logging # Import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Groq/OpenAI client
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
        if not text:
            logger.warning("Extracted no text from PDF.")
            return {"error": "Could not extract text from PDF. File might be empty or unreadable."}

        prompt = generate_prompt(text)

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1, 
            response_format={"type": "json_object"} 
        )

        content = response.choices[0].message.content
        logger.info(f"LLM raw response content: {content[:500]}...") 

        try:
            
            parsed_json = json.loads(content)
            if "total_marks" in parsed_json and "questions" in parsed_json and isinstance(parsed_json["questions"], list):
                return parsed_json
            else:
                logger.error(f"LLM returned invalid JSON structure: {content}")
                return {"error": "LLM returned unexpected JSON structure."}
        except json.JSONDecodeError:
            logger.error(f"LLM response was not valid JSON: {content}")
            
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    logger.error(f"Regex extracted content still not valid JSON: {match.group(0)}")
                    return {"error": "Could not parse JSON from LLM response."}
            else:
                logger.error("No JSON object found in LLM response.")
                return {"error": "No valid JSON found in LLM response."}

    except Exception as e:
        logger.exception(f"An error occurred during question paper parsing: {e}") # Log full traceback
        return {"error": f"Failed to parse question paper: {str(e)}"}