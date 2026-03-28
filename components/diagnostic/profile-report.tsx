"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getHeatClass, getReadinessBgColor } from "@/lib/utils";
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface Props { userId: string; }

const PAPERS = [
  { id: 1, name: "Accounts",  short: "P1" },
  { id: 2, name: "Laws",      short: "P2" },
  { id: 3, name: "Maths",     short: "P3" },
  { id: 4, name: "Economics", short: "P4" },
];

const SELF_ASSESSMENT_NUM: Record<string, number> = {
  "Very Weak": 20, "Weak": 35, "Average": 50, "Good": 70, "Very Good": 85,
};

export function ProfileReport({ userId }: Props) {
  const supabase = createClient();
  const [scores, setScores] = useState<Record<string, unknown> | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [topics, setTopics] = useState<Array<{ id: string; name: string; paper_id: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [scoresRes, profileRes, topicsRes] = await Promise.all([
      supabase.from("readiness_scores").select("*").eq("user_id", userId).single(),
      supabase.from("student_profiles").select("*").eq("user_id", userId).single(),
      supabase.from("topics").select("id, name, paper_id").order("paper_id").order("sort_order"),
    ]);
    setScores(scoresRes.data as any);
    setProfile(profileRes.data as any);
    setTopics(topicsRes.data ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Analysing your performance...</h2>
        <p className="text-gray-500">Building your personalised profile</p>
      </div>
    );
  }

  const overallScore = (scores?.overall_score as number) ?? 0;
  const paperScores = (scores?.paper_scores as Record<string, number>) ?? {};
  const topicScores = (scores?.topic_scores as Record<string, { score: number; color: string }>) ?? {};
  const selfAssessment = (scores?.self_assessment as Record<string, string>) ?? {};

  // Gap vs Claim analysis
  const gapFlags = Object.entries(selfAssessment).map(([paperId, selfRating]) => {
    const selfNum = SELF_ASSESSMENT_NUM[selfRating] ?? 50;
    const actualScore = paperScores[paperId] ?? 0;
    const gap = selfNum - actualScore;
    const paperName = PAPERS.find((p) => String(p.id) === paperId)?.name ?? "";
    return { paperId, paperName, selfRating, actualScore, gap };
  }).filter((g) => Math.abs(g.gap) >= 20);

  // Priority topics (low scoring)
  const weakTopics = Object.entries(topicScores)
    .filter(([, v]) => v.score < 50)
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 6)
    .map(([tid, v]) => ({
      id: tid,
      name: topics.find((t) => t.id === tid)?.name ?? "Unknown topic",
      paperId: topics.find((t) => t.id === tid)?.paper_id ?? 0,
      ...v,
    }));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Celebration header */}
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile Report is Ready!</h1>
        <p className="text-gray-500">Based on your diagnostic assessment, here is exactly where you stand</p>
      </div>

      {/* Overall Readiness */}
      <Card className="border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white">
        <CardContent className="p-6 text-center">
          <p className="text-white text-opacity-90 text-sm font-medium mb-2">Overall Exam Readiness</p>
          <div className="text-7xl font-bold mb-2">{overallScore}</div>
          <div className="text-white text-opacity-90 text-lg">/100</div>
          <p className="text-white text-opacity-80 text-sm mt-3">
            {overallScore >= 70 ? "You are in great shape! Focus on consolidating your strong areas."
             : overallScore >= 50 ? "Good foundation. Target your weak topics systematically."
             : overallScore >= 30 ? "Significant preparation needed — but you have identified the gaps!"
             : "Early stage. Your diagnostic now gives you a precise study roadmap."}
          </p>
        </CardContent>
      </Card>

      {/* Paper-wise Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Paper-wise Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PAPERS.map((paper) => {
              const score = paperScores[String(paper.id)] ?? 0;
              return (
                <div key={paper.id} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">{paper.short}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{score}</div>
                  <div className="text-xs text-gray-500 mb-3">{paper.name}</div>
                  <Progress
                    value={score}
                    className="h-2"
                    indicatorClassName={score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Topic Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Heat Map</CardTitle>
          <p className="text-sm text-gray-500">Colour-coded by your diagnostic performance</p>
          <div className="flex items-center gap-3 flex-wrap text-xs">
            {[["heat-strong","Strong (80%+)"],["heat-good","Good (65-79%)"],["heat-medium","Average (40-64%)"],["heat-weak","Weak (20-39%)"],["heat-critical","Critical (<20%)"],["heat-untested","Not tested"]].map(([cls, label]) => (
              <div key={cls} className="flex items-center gap-1">
                <span className={`${cls} px-2 py-0.5 rounded text-xs`}>·</span>
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PAPERS.map((paper) => {
              const paperTopics = topics.filter((t) => t.paper_id === paper.id);
              return (
                <div key={paper.id}>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2">{paper.short} — {paper.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {paperTopics.map((topic) => {
                      const ts = topicScores[topic.id];
                      const cls = ts ? getHeatClass(ts.score) : "heat-untested";
                      return (
                        <span
                          key={topic.id}
                          title={ts ? `${ts.score}%` : "Not tested"}
                          className={`${cls} px-3 py-1.5 rounded-lg text-xs font-medium cursor-default transition-transform hover:scale-105`}
                        >
                          {topic.name}
                          {ts && <span className="ml-1 opacity-70">({ts.score}%)</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gap vs Claim Analysis */}
      {gapFlags.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Gap vs. Claim Analysis
            </CardTitle>
            <p className="text-sm text-yellow-700">Your self-assessment vs. actual diagnostic performance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gapFlags.map((g) => (
                <div key={g.paperId} className="bg-white rounded-lg border border-yellow-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{g.paperName}</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {g.gap > 0
                          ? `You rated yourself "${g.selfRating}" but scored ${g.actualScore}% in the diagnostic — you may be overestimating your readiness here.`
                          : `You rated yourself "${g.selfRating}" but scored ${g.actualScore}% in the diagnostic — you are stronger than you think!`
                        }
                      </p>
                    </div>
                    <Badge variant={g.gap > 0 ? "destructive" : "success"} className="ml-3 flex-shrink-0">
                      {g.gap > 0 ? `${g.gap}% overconfident` : `${Math.abs(g.gap)}% underestimated`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Priority Study Areas */}
      {weakTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Priority Study Areas
            </CardTitle>
            <p className="text-sm text-gray-500">Start with these topics — they have the highest improvement potential</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weakTopics.map((topic, i) => (
                <div key={topic.id} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                      <span className="text-xs text-gray-500 ml-2">P{topic.paperId}</span>
                    </div>
                    <Progress
                      value={topic.score}
                      className="h-1.5"
                      indicatorClassName={topic.score < 30 ? "bg-red-500" : "bg-orange-400"}
                    />
                  </div>
                  <span className="text-sm font-bold text-red-600 w-10 text-right flex-shrink-0">{topic.score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">You are all set to start practicing!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Your profile will automatically update as you practice. Retake the diagnostic in 30 days to measure your growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/practice">
            <Button size="lg">Start Practicing Now <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
