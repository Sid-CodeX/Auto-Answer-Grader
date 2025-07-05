import React, { useState } from 'react';
import { QuestionPaperUpload } from '@/components/QuestionPaperUpload';
import { StudentAnswerUpload } from '@/components/StudentAnswerUpload';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { Header } from '@/components/Header';
import { StepIndicator } from '@/components/StepIndicator';

// Configure API base URL - can be modified for different environments
const BASE_API_URL = 'http://127.0.0.1:8000'; // Change this to your backend URL

// --- CORRECTED INTERFACES ---

export interface QuestionData {
  total_marks: number;
  questions: Array<{
    question_id: number;
    question_text: string;
    answer_key: string;
    marks: number;
  }>;
}

export interface EvaluationResult {
  total_marks: number;
  marks_obtained: number;
  results: Array<{
    question_id: number;
    student_answer: string;
    score: number;
    out_of: number;
    similarity: number;
    feedback: string;
    question_text: string; // <<< ADDED THIS LINE
  }>;
}

// --- END CORRECTED INTERFACES ---


const Index = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult | null>(null);

  const handleQuestionPaperParsed = (data: QuestionData) => {
    setQuestionData(data);
    try {
      localStorage.setItem('question_data', JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save question data to localStorage:", e);
    }
    setCurrentStep(2);
  };

  const handleAnswerEvaluated = (results: EvaluationResult) => {
    setEvaluationResults(results);
    setCurrentStep(3);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setQuestionData(null);
    setEvaluationResults(null);
    localStorage.removeItem('question_data');
  };

  React.useEffect(() => {
    const storedQuestionData = localStorage.getItem('question_data');
    if (storedQuestionData) {
      try {
        const parsedData: QuestionData = JSON.parse(storedQuestionData);
        if (parsedData && Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
          setQuestionData(parsedData);
          setCurrentStep(2);
        }
      } catch (e) {
        console.error("Failed to parse stored question data:", e);
        localStorage.removeItem('question_data');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header onReset={handleReset} />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-16">
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="animate-fade-in">
          {currentStep === 1 && (
            <QuestionPaperUpload
              baseApiUrl={BASE_API_URL}
              onSuccess={handleQuestionPaperParsed}
            />
          )}

          {currentStep === 2 && questionData && (
            <StudentAnswerUpload
              baseApiUrl={BASE_API_URL}
              questionData={questionData}
              onSuccess={handleAnswerEvaluated}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && evaluationResults && (
            <ResultsDashboard
              results={evaluationResults}
              onNewEvaluation={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;