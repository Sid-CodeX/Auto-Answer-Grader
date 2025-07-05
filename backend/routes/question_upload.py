from fastapi import APIRouter, UploadFile, File
from services.question_parser import parse_question_paper

router = APIRouter()

@router.post("/parse-question-paper")
async def upload_question_paper(file: UploadFile = File(...)):
    result = await parse_question_paper(file)
    return result
