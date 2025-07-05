import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, TrendingUp, FileText, Award, RefreshCw, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EvaluationResult } from '@/pages/Index';

interface ResultsDashboardProps {
  results: EvaluationResult;
  onNewEvaluation: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  onNewEvaluation,
}) => {
  const percentage = (results.marks_obtained / results.total_marks) * 100;

  // CRITICAL: Map over results.results
  const questionScores = results.results.map((q, index) => ({
    name: `Q${index + 1}`,
    score: q.score,
    maxScore: q.out_of,
    percentage: (q.score / q.out_of) * 100,
  }));

  const performanceData = [
    { name: 'Obtained', value: results.marks_obtained, color: '#6366f1' },
    { name: 'Remaining', value: results.total_marks - results.marks_obtained, color: '#e2e8f0' },
  ];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200';
    if (percentage >= 80) return 'text-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
    if (percentage >= 70) return 'text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200';
    if (percentage >= 60) return 'text-orange-700 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200';
    return 'text-red-700 bg-gradient-to-br from-red-50 to-pink-50 border-red-200';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center">
            <Sparkles className="h-8 w-8 text-indigo-600 mr-3" />
            Evaluation Results
          </h2>
          <p className="text-slate-600 text-lg font-medium mt-2">Comprehensive analysis of student performance</p>
        </div>
        <Button
          onClick={onNewEvaluation}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <RefreshCw className="h-4 w-4" />
          <span>New Evaluation</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`border-2 shadow-xl ${getGradeColor(percentage)} transform hover:scale-105 transition-all duration-300`}>
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <Trophy className="h-16 w-16 mx-auto text-current" />
              <Star className="h-5 w-5 absolute -top-1 -right-2 text-yellow-400 animate-pulse" />
            </div>
            <div className="text-4xl font-bold mb-3">
              {results.marks_obtained}/{results.total_marks}
            </div>
            <div className="text-lg font-semibold">Final Score</div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <div className="text-4xl font-bold mb-3 text-blue-700">
              {percentage.toFixed(1)}%
            </div>
            <div className="text-lg font-semibold text-blue-600">Percentage</div>
          </CardContent>
        </Card>

        <Card className={`border-2 shadow-xl ${getGradeColor(percentage)} transform hover:scale-105 transition-all duration-300`}>
          <CardContent className="p-8 text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-current" />
            <div className="text-4xl font-bold mb-3">
              {getGrade(percentage)}
            </div>
            <div className="text-lg font-semibold">Grade</div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto mb-6 text-purple-600" />
            <div className="text-4xl font-bold mb-3 text-purple-700">
              {results.results.length} {/* Use results.results.length */}
            </div>
            <div className="text-lg font-semibold text-purple-600">Questions</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              <span>Score Distribution</span>
            </CardTitle>
            <CardDescription className="text-slate-600">Performance breakdown by question</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={questionScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  formatter={(value, name) => [
                    `${value} marks`,
                    name === 'score' ? 'Obtained' : 'Maximum'
                  ]}
                />
                <Bar dataKey="maxScore" fill="#e2e8f0" name="maxScore" radius={[4, 4, 0, 0]} />
                <Bar dataKey="score" fill="#6366f1" name="score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <Target className="h-6 w-6 text-purple-600" />
              <span>Overall Performance</span>
            </CardTitle>
            <CardDescription className="text-slate-600">Visual representation of total score</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  formatter={(value) => [`${value} marks`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-6">
              <div className="text-3xl font-bold text-slate-800">{percentage.toFixed(1)}%</div>
              <div className="text-slate-600 font-medium">Achievement Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span>Detailed Question Analysis</span>
          </CardTitle>
          <CardDescription className="text-slate-600">Individual question performance and feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CRITICAL: Map over results.results */}
          {results.results.map((question, index) => (
            <div key={question.question_id} className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8 space-y-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline" className="bg-white/70 font-semibold px-3 py-1">
                      Question {index + 1}
                    </Badge>
                    <Badge variant={question.score === question.out_of ? 'default' : question.score > question.out_of * 0.7 ? 'secondary' : 'destructive'} className="font-semibold px-3 py-1">
                      {question.score}/{question.out_of} marks
                    </Badge>
                    {/* CRITICAL: Use question.similarity */}
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold px-3 py-1">
                      Similarity: {(question.similarity * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  {/* question.question_text is now correctly part of EvaluationResult interface */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                      Question:
                    </h4>
                    <p className="text-slate-700 bg-white/50 p-4 rounded-xl border border-slate-200">{question.question_text}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-purple-600" />
                      Student Answer:
                    </h4>
                    <p className="text-slate-700 bg-white/70 p-4 rounded-xl border border-slate-200">{question.student_answer}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-emerald-600" />
                      Feedback:
                    </h4>
                    <p className="text-slate-700 bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200">{question.feedback}</p>
                  </div>
                </div>

                <div className="ml-8 text-center">
                  <div className="w-32 mb-4">
                    <Progress
                      value={(question.score / question.out_of) * 100}
                      className="h-3"
                    />
                  </div>
                  <div className="text-lg font-bold text-slate-700">
                    {((question.score / question.out_of) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Score</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};