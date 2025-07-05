
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { QuestionData, EvaluationResult } from '@/pages/Index';

interface StudentAnswerUploadProps {
  baseApiUrl: string;
  questionData: QuestionData;
  onSuccess: (results: EvaluationResult) => void;
  onBack: () => void;
}

export const StudentAnswerUpload: React.FC<StudentAnswerUploadProps> = ({
  baseApiUrl,
  questionData,
  onSuccess,
  onBack,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('student_file', uploadedFile);
    formData.append('question_json', JSON.stringify(questionData));

    try {
      const response = await fetch(`${baseApiUrl}/api/submit-answer`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results: EvaluationResult = await response.json();
      
      toast({
        title: "Answer evaluation completed!",
        description: `Student scored ${results.marks_obtained}/${results.total_marks} marks.`,
      });

      onSuccess(results);

    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast({
        title: "Evaluation failed",
        description: "Failed to evaluate the student answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Upload Student Answer
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg font-medium mt-2">
            Upload the student's answer sheet for automated evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Question Paper Summary
            </h3>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/70 text-indigo-700 font-medium px-3 py-1">
                {questionData.questions.length} Questions
              </Badge>
              <Badge variant="secondary" className="bg-white/70 text-indigo-700 font-medium px-3 py-1">
                {questionData.total_marks} Total Marks
              </Badge>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group",
              isDragActive
                ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                : uploadedFile
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-6">
              {uploadedFile ? (
                <CheckCircle className="h-20 w-20 text-emerald-500 animate-scale-in" />
              ) : (
                <FileText className={cn(
                  "h-20 w-20 transition-all duration-300",
                  isDragActive ? "text-purple-500 scale-110" : "text-slate-400 group-hover:text-slate-500"
                )} />
              )}
              
              {uploadedFile ? (
                <div className="text-center">
                  <p className="text-xl font-semibold text-emerald-700 mb-2">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-slate-500 bg-white/50 px-3 py-1 rounded-full">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xl font-semibold text-slate-700 mb-2">
                    {isDragActive ? 'Drop the student answer PDF here' : 'Drag & drop student answer PDF here'}
                  </p>
                  <p className="text-slate-500">or click to browse files</p>
                  <p className="text-xs text-slate-400 mt-2">Only PDF files are supported</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center space-x-2 bg-white/50 hover:bg-white border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <Button 
              onClick={handleUpload} 
              disabled={!uploadedFile || isUploading}
              className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Evaluating Answers...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-3" />
                  Evaluate Answers
                </>
              )}
            </Button>
          </div>

          <Alert className="bg-slate-50 border-slate-200">
            <AlertCircle className="h-4 w-4 text-slate-600" />
            <AlertDescription className="text-slate-600">
              Ensure the student answer sheet is clear and legible for accurate evaluation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
