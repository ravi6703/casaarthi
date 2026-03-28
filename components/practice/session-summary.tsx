"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateAccuracy, formatDuration } from "@/lib/utils";
import { CheckCircle2, XCircle, SkipForward, Trophy, RefreshCw, ArrowRight, PlayCircle } from "lucide-react";
import { SocialShare } from "@/components/social-share";

interface Question {
  id: string;
  question_text: string;
  correct_option: string | null;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  explanation: string;
  difficulty: string;
  topics?: { name: string; paper_id: number };
}

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
  questions: Question[];
  answers: Record<string, { selected: string; isCorrect: boolean; timeSec: number }>;
  skipped: Set<string>;
  totalTime: number;
  sessionType: string;
  topicName?: string;
  subjectiveResults?: Record<string, SubjectiveResult>;
  videosByTopic?: Record<string, { id: string; title: string; url: string }[]>;
}

export function SessionSummary({ questions, answers, skipped, totalTime, sessionType, topicName, subjectiveResults = {}, videosByTopic = {} }: Props) {
  const correct = Object.values(answers).filter((a) => a.isCorrect).length;
  const wrong = Object.values(answers).filter((a) => !a.isCorrect).length;
  const answered = Object.keys(answers).length;
  const accuracy = calculateAccuracy(correct, answered);
  const wrongQuestions = questions.filter((q) => answers[q.id] && !answers[q.id].isCorrect);

  const subjResults = Object.values(subjectiveResults);
  const subjScoreTotal = subjResults.reduce((s, r) => s + r.score, 0);
  const subjMaxTotal = subjResults.reduce((s, r) => s + r.maxMarks, 0);
  const hasSubjective = subjResults.length > 0;

  const allAnsweredCount = answered + subjResults.length;
  const avgTime = allAnsweredCount > 0
    ? Math.round(
        (Object.values(answers).reduce((s, a) => s + a.timeSec, 0) +
         subjResults.reduce((s, r) => s + r.timeSec, 0)) / allAnsweredCount
      )
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Hero score */}
      <div className="text-center py-8">
        <div className="text-5xl mb-4">
          {accuracy >= 80 ? "🏆" : accuracy >= 60 ? "💪" : accuracy >= 40 ? "📚" : "🎯"}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Session Complete!</h1>
        <p className="text-gray-500">{topicName ?? sessionType.replace("_", " ") + " session"}</p>

        <div className="mt-6 inline-flex items-center gap-8 bg-gray-50 rounded-2xl px-8 py-4 border border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{accuracy}%</div>
            <div className="text-xs text-gray-500 mt-1">Accuracy</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{correct}</div>
            <div className="text-xs text-gray-500 mt-1">Correct</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500">{wrong}</div>
            <div className="text-xs text-gray-500 mt-1">Wrong</div>
          </div>
          <div className="w-px h-12 bg-gray-300" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-400">{skipped.size}</div>
            <div className="text-xs text-gray-500 mt-1">Skipped</div>
          </div>
        </div>

        {/* Subjective score summary */}
        {hasSubjective && (
          <div className="mt-4 inline-flex items-center gap-4 bg-purple-50 rounded-xl px-6 py-3 border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">{subjScoreTotal.toFixed(1)}/{subjMaxTotal}</div>
              <div className="text-xs text-purple-600 mt-0.5">Subjective Score</div>
            </div>
            <div className="w-px h-8 bg-purple-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">{subjResults.length}</div>
              <div className="text-xs text-purple-600 mt-0.5">Answers Evaluated</div>
            </div>
          </div>
        )}
      </div>

      {/* Time stats */}
      <Card>
        <CardContent className="p-4 flex items-center justify-around text-center">
          <div>
            <div className="font-bold text-gray-900">{formatDuration(totalTime)}</div>
            <div className="text-xs text-gray-500">Total time</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">{formatDuration(avgTime)}</div>
            <div className="text-xs text-gray-500">Avg per question</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">{questions.length}</div>
            <div className="text-xs text-gray-500">Total questions</div>
          </div>
        </CardContent>
      </Card>

      {/* Wrong answers review */}
      {wrongQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Review Wrong Answers ({wrongQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wrongQuestions.map((q, i) => {
              const a = answers[q.id];
              const correctText = q[`option_${q.correct_option}` as keyof Question] as string;
              const selectedText = q[`option_${a.selected}` as keyof Question] as string;
              return (
                <div key={q.id} className="border border-red-100 rounded-xl p-4 bg-red-50/30">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                    <Badge variant="secondary" className="text-xs capitalize">{q.difficulty}</Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-3">{q.question_text}</p>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-red-700">Your answer: {a.selected.toUpperCase()} — {selectedText}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-green-700">Correct: {q.correct_option?.toUpperCase()} — {correctText}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-[var(--sage-light)] p-3">
                    <p className="text-xs text-gray-700 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Subjective answers review */}
      {hasSubjective && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              ✍️ Subjective Answers Review ({subjResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.filter((q) => subjectiveResults[q.id]).map((q, i) => {
              const r = subjectiveResults[q.id];
              const pct = Math.round((r.score / r.maxMarks) * 100);
              return (
                <div key={q.id} className={`border rounded-xl p-4 ${
                  pct >= 70 ? "border-green-200 bg-green-50/30" :
                  pct >= 40 ? "border-yellow-200 bg-yellow-50/30" :
                  "border-red-200 bg-red-50/30"
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                    <Badge variant="secondary" className="text-xs">{r.score}/{r.maxMarks} marks · {r.grade}</Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">{q.question_text}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{r.feedback}</p>
                  {r.keyPointsMissed.length > 0 && (
                    <div className="mt-2 text-xs text-orange-700">
                      <strong>Missed:</strong> {r.keyPointsMissed.join(" · ")}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Video Suggestions for Wrong Topics */}
      {Object.keys(videosByTopic).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-red-500" />
              Recommended Videos — Topics You Need to Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(videosByTopic).map(([topicName, videos]) => (
                <div key={topicName}>
                  <div className="text-xs font-semibold text-gray-600 mb-1.5">{topicName}</div>
                  <div className="flex flex-wrap gap-2">
                    {videos.map((v: any) => {
                      const ytId = v.url.match(/(?:youtu\.be\/|v=)([^&\s]+)/)?.[1];
                      return (
                        <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all text-xs max-w-xs">
                          {ytId && <img src={`https://img.youtube.com/vi/${ytId}/default.jpg`} alt="" className="w-16 h-12 rounded object-cover flex-shrink-0" />}
                          <span className="text-gray-700 line-clamp-2">{v.title}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Score */}
      <SocialShare
        score={correct}
        total={answered}
        accuracy={accuracy}
        label={topicName ?? sessionType.replace("_", " ")}
        type="practice"
      />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/practice" className="flex-1">
          <Button variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Practice More
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full">
            Dashboard <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
