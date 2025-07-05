import React, { useState } from 'react';
import { QuestionPaperUpload } from '@/components/QuestionPaperUpload';
import { StudentAnswerUpload } from '@/components/StudentAnswerUpload';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { Header } from '@/components/Header';
import { StepIndicator } from '@/components/StepIndicator';

// Load the base API URL 
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

// Validate that the API URL is defined
if (!BASE_API_URL) {
  console.error("VITE_BASE_API_URL is not defined in the environment variables. Please check your .env file.");
}


// Interface Definitions

/**
 * Represents the structure of the parsed question paper.
 */
export interface QuestionData {
  total_marks: number;
  questions: Array<{
    question_id: number;
    question_text: string;
    answer_key: string;
    marks: number;
  }>;
}

/**
 * Represents the structure of the evaluation results returned after grading.
 */
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
    question_text: string;
  }>;
}


// Main Component Logic

const Index = () => {
  // Step management: 1 - Upload Question, 2 - Upload Answer, 3 - View Results
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // State to store parsed question data
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  // State to store evaluation results
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult | null>(null);

  /**
   * Handler for when question paper is successfully parsed.
   * Saves the data to localStorage and proceeds to Step 2.
   */
  const handleQuestionPaperParsed = (data: QuestionData) => {
    setQuestionData(data);
    try {
      localStorage.setItem('question_data', JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save question data to localStorage:", e);
    }
    setCurrentStep(2);
  };

  /**
   * Handler for when student answers are evaluated.
   * Stores the result and proceeds to Step 3.
   */
  const handleAnswerEvaluated = (results: EvaluationResult) => {
    setEvaluationResults(results);
    setCurrentStep(3);
  };

  /**
   * Handler to reset the flow to Step 1.
   * Clears stored data and localStorage.
   */
  const handleReset = () => {
    setCurrentStep(1);
    setQuestionData(null);
    setEvaluationResults(null);
    localStorage.removeItem('question_data');
  };

  /**
   * On initial load, check for any saved question data in localStorage.
   * If valid, resume from Step 2.
   */
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

  // Component UI Rendering

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
