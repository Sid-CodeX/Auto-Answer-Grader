from fastapi import APIRouter, UploadFile, Form
from services.submission_evaluator import evaluate_submission
import json

router = APIRouter()

@router.post("/submit-answer")
async def submit_answer(student_file: UploadFile, question_json: str = Form(...)):
    parsed_q = json.loads(question_json)
    result = await evaluate_submission(student_file, parsed_q)
    return result
