"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Send, Loader2, CheckCircle2, AlertCircle, BookOpen,
  ChevronDown, ChevronUp, Star,
} from "lucide-react";

interface SubjectiveResult {
  answerText: string;
  score: number;
  maxMarks: number;
  feedback: string;
  rubricScores: Record<string, number>;
  keyPointsMissed: string[];
  grade: string;
  timeSec: number;
}

interface Props {
  questionId: string;
  maxMarks: number;
  modelAnswer?: string;
  onSubmit: (answerText: string) => Promise<SubjectiveResult | null>;
  existingResult?: SubjectiveResult;
  isEvaluating: boolean;
}

const GRADE_COLORS: Record<string, string> = {
  "Excellent": "bg-green-100 text-green-800 border-green-300",
  "Good": "bg-blue-100 text-blue-800 border-blue-300",
  "Satisfactory": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Needs Improvement": "bg-orange-100 text-orange-800 border-orange-300",
  "Poor": "bg-red-100 text-red-800 border-red-300",
};

export function SubjectiveAnswer({ questionId, maxMarks, modelAnswer, onSubmit, existingResult, isEvaluating }: Props) {
  const [answer, setAnswer] = useState(existingResult?.answerText ?? "");
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const isSubmitted = !!existingResult;

  async function handleSubmit() {
    if (!answer.trim() || isEvaluating) return;
    await onSubmit(answer.trim());
  }

  // Before submission — answer writing mode
  if (!isSubmitted && !isEvaluating) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            ✍️ Write your answer ({maxMarks} marks)
          </Badge>
          <span className={`text-xs font-medium ${wordCount > 0 ? "text-gray-600" : "text-gray-400"}`}>
            {wordCount} words
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here... Write as you would in the actual CA Foundation exam. Include all relevant points, sections, and explanations."
          className="w-full min-h-[200px] p-4 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y placeholder:text-gray-400"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {maxMarks >= 8 ? "Aim for 150-200 words" : maxMarks >= 4 ? "Aim for 80-120 words" : "Aim for 40-60 words"}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={wordCount < 5}
            className="min-w-32"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Answer
          </Button>
        </div>
      </div>
    );
  }

  // Evaluating state
  if (isEvaluating) {
    return (
      <div className="text-center py-8 space-y-4">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto" />
        <div>
          <p className="font-semibold text-gray-900">AI is evaluating your answer...</p>
          <p className="text-sm text-gray-500 mt-1">Checking accuracy, concepts & presentation</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{answer}</p>
        </div>
      </div>
    );
  }

  // After evaluation — show results
  if (!existingResult) return null;
  const { score, feedback, rubricScores, keyPointsMissed, grade } = existingResult;
  const percentage = Math.round((score / maxMarks) * 100);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Score card */}
      <div className={`p-5 rounded-xl border-2 ${
        percentage >= 70 ? "border-green-300 bg-green-50" :
        percentage >= 40 ? "border-yellow-300 bg-yellow-50" :
        "border-red-300 bg-red-50"
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${
              percentage >= 70 ? "text-green-700" : percentage >= 40 ? "text-yellow-700" : "text-red-700"
            }`}>
              {score}/{maxMarks}
            </div>
            <div>
              <Badge className={`text-xs ${GRADE_COLORS[grade] || "bg-gray-100 text-gray-800"}`}>
                {grade}
              </Badge>
              <div className="text-xs text-gray-500 mt-0.5">{percentage}% marks scored</div>
            </div>
          </div>
          <div className="text-3xl">
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "💪" : percentage >= 40 ? "📝" : "📚"}
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      {/* Rubric breakdown */}
      {Object.keys(rubricScores).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Marking Breakdown
            </h4>
            <div className="space-y-2.5">
              {Object.entries(rubricScores).map(([criterion, marks]) => {
                const maxForCriterion = Math.ceil(maxMarks / Object.keys(rubricScores).length);
                const pct = Math.round(((marks as number) / maxForCriterion) * 100);
                return (
                  <div key={criterion}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">{criterion}</span>
                      <span className="text-xs font-bold text-gray-900">{marks as number}/{maxForCriterion}</span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Feedback */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            AI Feedback
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
        </CardContent>
      </Card>

      {/* Key points missed */}
      {keyPointsMissed && keyPointsMissed.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Key Points You Missed
            </h4>
            <ul className="space-y-1.5">
              {keyPointsMissed.map((point, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Model answer toggle */}
      {modelAnswer && (
        <div>
          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            {showModelAnswer ? "Hide" : "View"} Model Answer
            {showModelAnswer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showModelAnswer && (
            <Card className="mt-2 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{modelAnswer}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Your answer */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Answer</h4>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{existingResult.answerText}</p>
        </CardContent>
      </Card>
    </div>
  );
}
