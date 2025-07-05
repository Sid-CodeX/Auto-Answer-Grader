
import React from 'react';
import { GraduationCap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Auto Answer Grader
              </h1>
              <p className="text-slate-600 font-medium mt-1">
                Intelligent evaluation system for academic assessments
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex items-center space-x-2 bg-white/50 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="font-medium">Start Over</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
