
import React from 'react';
import { FileText, Upload, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Upload Question Paper', icon: FileText, description: 'Parse and analyze the question paper' },
    { number: 2, title: 'Upload Student Answers', icon: Upload, description: 'Submit student answer sheets for evaluation' },
    { number: 3, title: 'View Results', icon: BarChart3, description: 'Review detailed grading and feedback' },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-8 bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-500 shadow-lg",
                  currentStep >= step.number
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-indigo-200"
                    : "bg-white border-slate-300 text-slate-400 shadow-slate-100"
                )}
              >
                <step.icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-center max-w-32">
                <p className={cn(
                  "text-sm font-semibold transition-colors duration-300",
                  currentStep >= step.number ? "text-indigo-700" : "text-slate-500"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-20 h-1 rounded-full mx-6 transition-all duration-500",
                  currentStep > step.number 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600" 
                    : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
