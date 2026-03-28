"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_option: string | null;
  explanation: string;
}

interface QuizClientProps {
  questions: Question[];
}

type Option = "a" | "b" | "c" | "d";

export default function QuizClient({ questions }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Option>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isCorrect = currentAnswer === currentQuestion.correct_option?.toLowerCase();
  const quizComplete = currentIndex === questions.length;

  const optionsMap: Record<Option, string | null> = {
    a: currentQuestion.option_a,
    b: currentQuestion.option_b,
    c: currentQuestion.option_c,
    d: currentQuestion.option_d,
  };

  const handleAnswerSelect = (option: Option) => {
    if (!answers[currentQuestion.id]) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }));
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else {
      setCurrentIndex(questions.length);
    }
  };

  const score = Object.entries(answers).filter(([qId, answer]) => {
    const question = questions.find((q) => q.id === qId);
    return answer === question?.correct_option?.toLowerCase();
  }).length;

  if (quizComplete) {
    const scorePercentage = Math.round((score / questions.length) * 100);

    return (
      <div className="space-y-8 text-center">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] rounded-2xl p-12 text-white">
          <div className="text-6xl font-bold mb-4">{score}/5</div>
          <div className="text-2xl font-semibold mb-2">Quiz Complete!</div>
          <div className="text-lg opacity-90">
            You scored {scorePercentage}% on today's quiz
          </div>
        </div>

        {/* Performance Message */}
        <div className="bg-[var(--sage-light)] border-2 border-[var(--sage)] rounded-xl p-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            {scorePercentage >= 80
              ? "Excellent performance! You're well-prepared for the CA Foundation exam."
              : scorePercentage >= 60
              ? "Good effort! Keep practicing to strengthen your understanding."
              : "Don't worry! Consistent practice will help you improve. Keep learning!"}
          </p>
        </div>

        {/* Answer Review */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Answers</h3>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const answer = answers[q.id];
              const correct = answer === q.correct_option?.toLowerCase();
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border-2 text-left ${
                    correct
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">
                        Q{idx + 1}: {q.question_text}
                      </p>
                      {!correct && (
                        <p className="text-sm text-gray-700 mb-2">
                          Your answer: <span className="font-medium">{answer?.toUpperCase()}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-700 mb-2">
                        Correct answer: <span className="font-medium">{q.correct_option?.toUpperCase()}</span>
                      </p>
                      <p className="text-sm text-gray-600 italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[var(--sage-light)] to-[var(--background)] rounded-2xl border-2 border-[var(--sage)] p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Want more practice?</h3>
          <p className="text-gray-700 mb-6">
            Sign up for free to access 2,500+ practice questions, 40 mock tests, and AI-powered study plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25 font-medium"
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/daily-quiz">
              <Button
                size="lg"
                variant="outline"
                className="font-medium"
              >
                Take Another Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>Question {currentIndex + 1} of 5</span>
          <span>{Math.round(((currentIndex) / 5) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] transition-all"
            style={{ width: `${((currentIndex) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 space-y-6">
        {/* Question */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {(["a", "b", "c", "d"] as Option[]).map((option) => {
            const optionText = optionsMap[option];
            if (!optionText) return null;

            const isSelected = currentAnswer === option;
            const isCorrectOption = currentQuestion.correct_option?.toLowerCase() === option;
            const showCorrect = showExplanation && isCorrectOption;
            const showIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!currentAnswer}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showCorrect
                    ? "bg-green-50 border-green-500 cursor-default"
                    : showIncorrect
                    ? "bg-red-50 border-red-500 cursor-default"
                    : isSelected
                    ? "bg-blue-50 border-[var(--primary)] cursor-default"
                    : currentAnswer
                    ? "bg-gray-50 border-gray-300 cursor-not-allowed opacity-60"
                    : "bg-white border-gray-300 hover:border-[var(--primary)] cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm ${
                      showCorrect
                        ? "bg-green-500 border-green-500 text-white"
                        : showIncorrect
                        ? "bg-red-500 border-red-500 text-white"
                        : isSelected
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                        : "border-gray-400 text-gray-600"
                    }`}
                  >
                    {option.toUpperCase()}
                  </div>
                  <span className="flex-1 text-gray-800">{optionText}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                  {showIncorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 border-2 border-green-300"
                : "bg-blue-50 border-2 border-blue-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold mb-2 ${
                    isCorrect ? "text-green-900" : "text-blue-900"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className={isCorrect ? "text-green-800" : "text-blue-800"}>
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentAnswer && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] text-white font-medium"
          >
            {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
