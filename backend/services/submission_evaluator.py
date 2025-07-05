# services/submission_evaluator.py
import os
import json
import re
import fitz
from openai import OpenAI
from fastapi import UploadFile
from sentence_transformers import SentenceTransformer, util
from utils.pdf_utils import extract_text_from_pdf
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LLM client
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# Load SentenceTransformer model once globally
try:
    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    logger.error(f"Failed to load SentenceTransformer model: {e}")
    # Consider a fallback or raise a critical error if model loading is essential
    model = None # Or raise an exception to prevent server start if critical


# --- NEW FUNCTION TO EXTRACT STUDENT ANSWERS USING LLM ---
async def extract_student_answers_llm(student_text: str, questions: list) -> dict:
    answers = {}
    for q in questions:
        prompt = f"""
Given the following student's submission and a specific question, extract the student's answer corresponding to that question.
Only return the extracted answer text, without any additional comments or formatting.
If the answer is not clearly present or identifiable, state "Answer not found".

Question ID: {q['question_id']}
Question Text: {q['question_text']}

Student Submission:
---
{student_text}
---

Extracted Student Answer:
        """
        try:
            response = client.chat.completions.create(
                model="llama3-8b-8192", # Using a smaller model for this task might be faster/cheaper
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500 # Limit response length
            )
            answer_text = response.choices[0].message.content.strip()
            answers[q["question_id"]] = answer_text if answer_text else "Answer not found"
        except Exception as e:
            logger.error(f"Error extracting answer for QID {q['question_id']} with LLM: {e}")
            answers[q["question_id"]] = "LLM Extraction Error"
    return answers


async def evaluate_submission(student_file: UploadFile, question_data: dict):
    if model is None:
        return {"error": "SentenceTransformer model not loaded. Cannot evaluate submissions."}

    try:
        pdf_bytes = await student_file.read()
        text = extract_text_from_pdf(pdf_bytes)
        if not text:
            logger.warning("Extracted no text from student PDF.")
            return {"error": "Could not extract text from student PDF. File might be empty or unreadable."}

        # Use LLM to extract student answers
        student_answers = await extract_student_answers_llm(text, question_data["questions"])

        results = []
        total_score = 0

        for q in question_data["questions"]:
            qid = q["question_id"]
            key = q["answer_key"]
            max_marks = q["marks"]
            student_ans = student_answers.get(qid, "Not found")

            similarity = 0.0
            if student_ans != "Not found" and student_ans != "LLM Extraction Error" and key:
                try:
                    emb_key = model.encode(key, convert_to_tensor=True)
                    emb_ans = model.encode(student_ans, convert_to_tensor=True)
                    similarity = util.pytorch_cos_sim(emb_key, emb_ans).item()
                except Exception as e:
                    logger.warning(f"Error calculating similarity for QID {qid}: {e}")
                    # Fallback if encoding fails, e.g., due to empty string
                    similarity = 0.0

            prompt = f"""
You are an AI assistant for grading student answers.
Carefully compare the 'Answer Key' with the 'Student Answer' for the given question.
Consider the 'Similarity Score' as a guide, but make your judgment primarily based on semantic understanding.
Assign a 'score' out of {max_marks} marks based on the correctness and completeness of the student's answer.
Provide concise 'feedback' explaining why the score was given, highlighting correct parts or missing information.
The response must be a perfectly valid JSON object with "score" (integer) and "feedback" (string) fields.
Do not include any additional text or explanations outside the JSON object.

Question: {q['question_text']}
Answer Key: {key}
Student Answer: {student_ans}
Similarity Score (Cosine Similarity): {similarity:.2f}

Return JSON:
{{
    "score": int,
    "feedback": string
}}
"""

            try:
                res = client.chat.completions.create(
                    model="llama3-70b-8192",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1, # Lower temp for consistent grading
                    response_format={"type": "json_object"}
                )
                content = res.choices[0].message.content
                logger.info(f"LLM grading raw response content for QID {qid}: {content[:500]}...")

                # Attempt to parse directly
                eval_result = json.loads(content)
                if not isinstance(eval_result.get("score"), int) or not isinstance(eval_result.get("feedback"), str):
                    raise ValueError("Invalid JSON structure from LLM for grading.")

            except (json.JSONDecodeError, ValueError) as e:
                logger.error(f"Error parsing LLM grading response for QID {qid}: {e}. Raw content: {content}")
                eval_result = {"score": 0, "feedback": f"LLM error or malformed response: {e}"}
            except Exception as e:
                logger.error(f"Error calling LLM for grading QID {qid}: {e}")
                eval_result = {"score": 0, "feedback": f"LLM API error: {e}"}

            total_score += eval_result["score"]
            results.append({
                "question_id": qid,
                "student_answer": student_ans,
                "score": eval_result["score"],
                "out_of": max_marks,
                "similarity": round(similarity, 3),
                "feedback": eval_result["feedback"]
            })

        return {
            "total_marks": question_data["total_marks"],
            "marks_obtained": total_score,
            "results": results
        }

    except Exception as e:
        logger.exception(f"An error occurred during submission evaluation: {e}")
        return {"error": f"Failed to evaluate submission: {str(e)}"}