Auto-Answer Grader
🚀 Project Overview
Auto-Answer Grader is a modern web application that automates the evaluation of descriptive student answers using Artificial Intelligence (AI) and Natural Language Processing (NLP). It replaces traditional manual grading methods with a faster, fairer, and more insightful system — ideal for educators seeking to streamline subjective assessments.

🎯 The Challenge
Manual grading of open-ended answers presents serious bottlenecks:

⏱️ Time-Consuming: Drains instructional time.

⚖️ Inconsistent Evaluation: Prone to human bias and variability.

🐌 Delayed Feedback: Slows the learning process.

🔍 Lack of Insights: Fails to offer in-depth, actionable feedback.

💡 Our Solution
Auto-Answer Grader solves these challenges through an end-to-end AI-powered pipeline:

📥 Upload Question Paper: Users submit PDF question papers.

🧠 Answer Key Extraction: System parses questions and model answers.

📄 Student Answer Upload: Upload student answer sheets (PDF).

🧾 Automated Evaluation: Semantic similarity & LLMs score answers and generate feedback.

📊 Interactive Dashboard: View scores, metrics, and detailed feedback visually.

🔧 Features
📚 PDF Parsing: Extracts questions and answer keys from PDFs.

🧠 Semantic Evaluation: Scores answers using sentence embeddings, not just keywords.

✍️ LLM-Based Feedback: Personalized AI feedback on every answer.

✅ Automated Scoring: Consistent, objective evaluation.

📈 Performance Dashboard: Interactive visuals for scores and analytics.

👣 Step-by-Step UI: Intuitive, guided grading workflow.

🛠️ Technologies Used
🖥️ Frontend
React – Modern UI library

TypeScript – Typed JavaScript for robust development

Vite – Lightning-fast bundler

Tailwind CSS – Utility-first CSS

Shadcn/ui – Accessible UI components

Recharts – Data visualization

Lucide-React – Beautiful SVG icon set

localStorage – Temporary session persistence

⚙️ Backend
FastAPI – High-performance Python web framework

Pydantic – Data validation and schema management

sentence-transformers – Semantic text embeddings

LLMs via Groq API – Contextual AI feedback

PyMuPDF (python-fitz) – PDF parsing engine

Uvicorn – ASGI web server

⚙️ Getting Started
✅ Prerequisites
Ensure the following are installed:

Python 3.8+

Node.js (Latest LTS)

npm (or Yarn)

Git

📦 1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/Sid-CodeX/Auto-Answer-Grader.git
cd Auto-Answer-Grader
🧪 2. Backend Setup
bash
Copy
Edit
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create a .env file
cp .env.example .env
# Replace placeholder API keys with actual values

# Run the FastAPI server
uvicorn main:app --reload
Server should run at http://127.0.0.1:8000

💻 3. Frontend Setup
bash
Copy
Edit
cd ../frontend

# Install frontend dependencies
npm install

# Start development server
npm run dev
The app will be available at http://localhost:5173 (or as shown in your terminal).

📚 Usage Guide
Upload Question Paper:
Submit a PDF containing questions and answer keys.

Upload Student Answer Sheet:
Provide the student’s answer PDF.

Get Evaluation:
View:

Total score & percentage

Per-question similarity score

Full AI-generated feedback

