"use client";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

const ReactConfetti = lazy(() => import("react-confetti"));

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
}

export function DailyChallenge() {
  const [challenge, setChallenge] = useState<any>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch("/api/daily-challenge")
      .then((r) => r.json())
      .then((data) => {
        setChallenge(data.challenge);
        setQuestion(data.challenge?.questions);
        setResponse(data.response);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Timer
  useEffect(() => {
    if (!question || response) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [question, response]);

  const handleSubmit = useCallback(async () => {
    if (!selected || !question || submitting) return;
    setSubmitting(true);

    const isCorrect = selected === question.correct_option;
    try {
      const res = await fetch("/api/daily-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          selectedOption: selected,
          isCorrect,
          timeSpentSec: timer,
        }),
      });
      const data = await res.json();
      setResponse(data.response ?? { is_correct: isCorrect, selected_option: selected });
      if (isCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch {
      // Allow showing result even if API fails
      setResponse({ is_correct: isCorrect, selected_option: selected });
    }
    setSubmitting(false);
  }, [selected, question, submitting, timer]);

  if (loading) {
    return (
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="p-5 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!challenge || !question) {
    return null; // No challenge today
  }

  const isAnswered = !!response;
  const isCorrect = response?.is_correct;
  const options = [
    { key: "a", text: question.option_a },
    { key: "b", text: question.option_b },
    { key: "c", text: question.option_c },
    { key: "d", text: question.option_d },
  ].filter((o) => o.text);

  return (
    <>
      {showConfetti && (
        <Suspense fallback={null}>
          <ReactConfetti recycle={false} numberOfPieces={150} style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }} />
        </Suspense>
      )}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-[var(--background)] overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-purple-900 text-sm">Daily Challenge</span>
              <Badge variant="secondary" className="text-xs">{question.difficulty}</Badge>
            </div>
            {!isAnswered && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
              </div>
            )}
            {isAnswered && (
              <Badge className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {isCorrect ? "+20 XP" : "+5 XP"}
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-800 font-medium mb-3 leading-relaxed">{question.question_text}</p>

          <div className="grid grid-cols-1 gap-2">
            {options.map((opt) => {
              const isSelected = selected === opt.key;
              const isAnswer = opt.key === question.correct_option;
              let btnClass = "w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ";

              if (isAnswered) {
                if (isAnswer) {
                  btnClass += "border-green-400 bg-green-50 text-green-800 font-medium";
                } else if (isSelected && !isCorrect) {
                  btnClass += "border-red-400 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-gray-200 bg-white text-gray-500";
                }
              } else {
                btnClass += isSelected
                  ? "border-purple-400 bg-purple-100 text-purple-800 font-medium"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50";
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => !isAnswered && setSelected(opt.key)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="font-bold mr-2 uppercase">{opt.key}.</span>
                  {opt.text}
                  {isAnswered && isAnswer && <CheckCircle2 className="inline h-4 w-4 ml-2 text-green-600" />}
                  {isAnswered && isSelected && !isAnswer && <XCircle className="inline h-4 w-4 ml-2 text-red-600" />}
                </button>
              );
            })}
          </div>

          {!isAnswered && selected && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Answer
            </Button>
          )}

          {isAnswered && question.explanation && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Explanation</p>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
