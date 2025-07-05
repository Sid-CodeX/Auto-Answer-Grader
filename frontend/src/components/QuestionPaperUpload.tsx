
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { QuestionData } from '@/pages/Index';

interface QuestionPaperUploadProps {
  baseApiUrl: string;
  onSuccess: (data: QuestionData) => void;
}

export const QuestionPaperUpload: React.FC<QuestionPaperUploadProps> = ({
  baseApiUrl,
  onSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseSuccess, setParseSuccess] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setParseSuccess(false);
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
    formData.append('file', uploadedFile);

    try {
      const response = await fetch(`${baseApiUrl}/api/parse-question-paper`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QuestionData = await response.json();
      setParseSuccess(true);
      
      toast({
        title: "Question paper parsed successfully!",
        description: `Found ${data.questions.length} questions with ${data.total_marks} total marks.`,
      });

      setTimeout(() => {
        onSuccess(data);
      }, 1500);

    } catch (error) {
      console.error('Error parsing question paper:', error);
      toast({
        title: "Upload failed",
        description: "Failed to parse the question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
          <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Upload Question Paper
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg font-medium mt-2">
            Upload your PDF question paper to begin the automated grading process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group",
              isDragActive
                ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg scale-105'
                : uploadedFile
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-6">
              {uploadedFile ? (
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-emerald-500 animate-scale-in" />
                  <Sparkles className="h-5 w-5 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              ) : (
                <Upload className={cn(
                  "h-20 w-20 transition-all duration-300",
                  isDragActive ? "text-indigo-500 scale-110" : "text-slate-400 group-hover:text-slate-500"
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
                    {isDragActive ? 'Drop the PDF here' : 'Drag & drop your PDF here'}
                  </p>
                  <p className="text-slate-500">or click to browse files</p>
                  <p className="text-xs text-slate-400 mt-2">Only PDF files are supported</p>
                </div>
              )}
            </div>
          </div>

          {parseSuccess && (
            <Alert className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 animate-fade-in">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800 font-medium">
                Question paper successfully parsed! Proceeding to next step...
              </AlertDescription>
            </Alert>
          )}

          {uploadedFile && !parseSuccess && (
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Parsing Question Paper...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" />
                  Parse Question Paper
                </>
              )}
            </Button>
          )}

          <Alert className="bg-slate-50 border-slate-200">
            <AlertCircle className="h-4 w-4 text-slate-600" />
            <AlertDescription className="text-slate-600">
              Ensure your PDF contains clear, readable questions with proper formatting for best results.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
