# main.py

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI
from routes import question_upload, submission_eval
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS (for frontend calls)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register API routes
app.include_router(question_upload.router, prefix="/api")
app.include_router(submission_eval.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Auto Answer Grader API running 🚀"}
