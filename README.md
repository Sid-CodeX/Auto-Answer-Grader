# Auto-Answer Grader

## Project Overview

The **Auto-Answer Grader** is an innovative web application designed to automate the evaluation of subjective, descriptive answers in an educational context. Leveraging cutting-edge Artificial Intelligence (AI) and Natural Language Processing (NLP), this tool aims to significantly reduce the manual effort involved in grading, provide consistent and objective evaluations, and deliver timely, constructive feedback to students.

### The Challenge

Manual grading of open-ended questions presents significant hurdles for educators:
* **Time-Intensive:** Consumes valuable time that could be dedicated to teaching and curriculum development.
* **Subjectivity & Inconsistency:** Grading can vary between different evaluators or even for the same evaluator over time, raising concerns about fairness.
* **Delayed Feedback:** Students often receive feedback long after completing assignments, diminishing its impact on learning.
* **Limited Insights:** Traditional methods rarely provide granular, actionable feedback beyond a simple score.

### Our Solution

The Auto-Answer Grader provides a comprehensive digital solution to these challenges through a streamlined, intelligent workflow:
1.  **Question Paper Ingestion:** Users upload PDF question papers, from which the system intelligently extracts questions and their corresponding answer keys.
2.  **Student Answer Submission:** Students' answer sheets (in PDF format) are uploaded for automated processing.
3.  **Intelligent Evaluation:** AI/NLP models perform semantic similarity analysis between student responses and answer keys, subsequently generating precise scores and constructive, contextual feedback.
4.  **Interactive Results Dashboard:** A intuitive user interface presents a clear overview of performance, including overall scores, a detailed per-question breakdown, similarity metrics, and personalized feedback.

## Features

* **PDF Document Parsing:** Robust extraction of questions and answer keys from uploaded PDF question papers.
* **Semantic Similarity Scoring:** Utilizes advanced NLP techniques (`sentence-transformers`) to evaluate student answers based on their meaning, providing more accurate assessments than keyword-based matching.
* **AI-Driven Feedback Generation:** Provides detailed, personalized feedback for each graded answer using powerful Large Language Models (LLMs) via Groq API.
* **Automated Scoring:** Assigns scores precisely based on semantic similarity to the answer key and the defined marking scheme.
* **Comprehensive Interactive Dashboard:** Offers visual insights into performance with charts (e.g., score distribution, overall attainment) and a detailed breakdown for each question.
* **Guided Workflow:** A clear, step-by-step user interface ensures ease of use from document upload to results analysis.

## Technologies Used

This project is built on a modern, high-performance full-stack architecture, ensuring both a responsive user experience and powerful backend processing.

### Frontend (Client-Side)

* **React:** A leading JavaScript library for building dynamic and highly responsive user interfaces.
* **TypeScript:** A statically-typed superset of JavaScript, enhancing code quality, maintainability, and developer productivity by catching errors early.
* **Vite:** A next-generation frontend tooling that provides an exceptionally fast development server and optimized build processes.
* **Shadcn/ui:** A collection of highly customizable and accessible UI components built on Radix UI and styled with Tailwind CSS, accelerating UI development.
* **Tailwind CSS:** A utility-first CSS framework that enables rapid and consistent styling directly within the markup.
* **Recharts:** A powerful and flexible charting library for React, used to visualize evaluation data effectively.
* **Lucide-React:** Provides a comprehensive set of beautiful and customizable SVG icons for the UI.
* **`localStorage`:** Utilized for client-side persistence of temporary session data.

### Backend (Server-Side)

* **FastAPI:** A modern, high-performance web framework for building APIs with Python, known for its speed and automatic interactive documentation (Swagger UI).
* **Pydantic:** Integrated with FastAPI, this library provides robust data validation and settings management, ensuring data integrity across the API.
* **`sentence-transformers`:** A Python library crucial for our AI core, used to compute dense vector embeddings from text, enabling accurate semantic similarity comparisons.
* **Large Language Models (LLMs):** Integrated via external APIs (e.g., Groq API) to generate sophisticated, context-aware feedback for student answers, emphasizing rapid inference.
* **`python-fitz` (PyMuPDF):** A high-performance Python library used for parsing and extracting textual content from PDF documents (both question papers and student answers).
* **Uvicorn:** An ASGI server responsible for running the FastAPI application, providing efficient asynchronous request handling.

## Project Structure

```

Auto-Answer-Grader/
├── backend/
│   ├── routes/                \# API endpoint definitions
│   │   ├── question\_upload.py \# Handles question paper uploads
│   │   └── submission\_eval.py \# Handles student answer submissions and evaluation
│   ├── services/              \# Core business logic and AI/NLP integrations
│   │   ├── question\_parser.py \# Logic for parsing question papers
│   │   └── submission\_evaluator.py \# Logic for evaluating student answers (AI/NLP)
│   ├── utils/                 \# Utility functions
│   │   └── pdf\_utils.py       \# PDF text extraction utilities
│   ├── .env.example           \# Example environment variables for backend
│   ├── main.py                \# Main FastAPI application entry point
│   └── requirements.txt       \# Python dependencies
│
└── frontend/
├── public/                \# Static assets (e.g., favicon)
├── src/
│   ├── components/        \# Reusable UI components
│   │   ├── ui/            \# Shadcn/ui generated components
│   │   ├── Header.tsx
│   │   ├── QuestionPaperUpload.tsx
│   │   ├── ResultsDashboard.tsx
│   │   ├── StepIndicator.tsx
│   │   └── StudentAnswerUpload.tsx
│   ├── hooks/             \# Custom React hooks (e.g., useToast)
│   ├── lib/               \# Utility functions (e.g., general JS utils, Tailwind merge)
│   ├── pages/             \# Main application pages/views
│   │   ├── Index.tsx      \# Main application logic and routing
│   │   └── NotFound.tsx   \# 404 page
│   ├── App.css            \# Global CSS for the app
│   ├── App.tsx            \# Root React component
│   │   \# (Note: index.css and main.tsx are typical Vite entry points)
│   ├── vite-env.d.ts      \# Vite environment type declarations
│   └── index.css          \# Core styles and Tailwind directives
├── .env.example           \# Example environment variables for frontend
├── package.json           \# Frontend dependencies and scripts
├── postcss.config.js      \# PostCSS configuration for Tailwind
├── tailwind.config.ts     \# Tailwind CSS configuration
├── tsconfig.json          \# TypeScript configuration
└── vite.config.ts         \# Vite build configuration

````

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your system:

* **Python:** Version 3.8 or higher.
* **Node.js:** Latest LTS (Long Term Support) version recommended.
* **npm or Yarn:** (npm is used in these instructions).
* **Git:** For cloning the repository.

### 1. Clone the Repository

```bash
git clone [https://github.com/Sid-CodeX/Auto-Answer-Grader.git](https://github.com/Sid-CodeX/Auto-Answer-Grader.git)
cd Auto-Answer-Grader
````

### 2\. Backend Setup

Navigate into the `backend` directory, set up your Python environment, install dependencies, and configure your API key.

```bash
cd backend

# Create a Python virtual environment to manage dependencies
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install all required Python packages
pip install -r requirements.txt

# Create a .env file for your API keys
# Copy the content from .env.example into a new file named .env
# Replace "your_groq_api_key_here" with your actual Groq API Key
# Example .env content:
# GROQ_API_KEY="your_groq_api_key_here"

# Start the backend server
uvicorn main:app --reload
```

The backend server should now be running, typically accessible at `http://127.0.0.1:8000`. Keep this terminal window open.

### 3\. Frontend Setup

Open a **new terminal window**. Navigate into the `frontend` directory, install Node.js dependencies, and launch the development server.

```bash
cd ../frontend # Go back to root and then into frontend
# OR if you are already in the root (Auto-Answer-Grader):
# cd frontend

# Install Node.js dependencies (e.g., React, Vite, Tailwind CSS)
npm install

# Start the frontend development server
npm run dev
```

The frontend application will typically open in your default web browser at `http://localhost:5173` or `http://localhost:8080` (refer to your terminal output for the exact URL).

## Usage Guide

Once both the backend and frontend servers are running:

1.  **Upload Question Paper:** On the application's first screen, click the upload button to select and submit your question paper in PDF format. The system will process this to extract questions and their answer keys.
2.  **Upload Student Answer:** After the question paper is parsed, you will be prompted to upload a student's answer sheet, also in PDF format.
3.  **View Evaluation Results:** Upon successful submission, the system will perform the AI-driven evaluation. You will then be redirected to the Results Dashboard, where you can view:
      * The student's total score and overall percentage.
      * A visual breakdown of scores per question.
      * A detailed analysis for each question, including the original question text, the student's submitted answer, the calculated similarity score, and comprehensive AI-generated feedback.

## Contributing

We welcome contributions to the Auto-Answer Grader\! If you have suggestions for improvements, new features, or encounter any bugs, please feel free to:

  * Open an issue on the GitHub repository.
  * Submit a pull request with your proposed changes.

## License

This project is open-sourced under the [MIT License](https://www.google.com/search?q=LICENSE).

-----
