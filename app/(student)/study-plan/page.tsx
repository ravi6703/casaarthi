import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getNextExamDate, getDaysUntilExam } from "@/lib/utils";
import { StudyPlanClient } from "@/components/study-plan/study-plan-client";

export const metadata = { title: "Study Plan" };

const PAPERS = [
  { id: 1, name: "Accounting", short: "P1", emoji: "📊" },
  { id: 2, name: "Laws", short: "P2", emoji: "⚖️" },
  { id: 3, name: "Maths", short: "P3", emoji: "🔢" },
  { id: 4, name: "Economics", short: "P4", emoji: "📈" },
];

export default async function StudyPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, progressRes, topicsRes, scoresRes] = await Promise.all([
    supabase.from("student_profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("topic_progress").select("topic_id, total_attempted, correct, accuracy_rate, last_practiced_at").eq("user_id", user.id),
    supabase.from("topics").select("id, name, paper_id, sort_order").order("paper_id").order("sort_order"),
    supabase.from("readiness_scores").select("paper_scores, topic_scores").eq("user_id", user.id).single(),
  ]);

  const profile = profileRes.data as any;
  const progress = (progressRes.data as any[]) ?? [];
  const topics = (topicsRes.data as any[]) ?? [];
  const scores = scoresRes.data as any;

  // Calculate days until exam
  const cycle = (profile?.target_exam_cycle ?? "may") as "january" | "may" | "september";
  const year = profile?.target_exam_year ?? new Date().getFullYear() + 1;
  const examDate = getNextExamDate(cycle, year);
  const daysRemaining = getDaysUntilExam(examDate);

  // Build topic performance data
  const progressMap = Object.fromEntries(progress.map((p: any) => [p.topic_id, p]));
  const topicScores = (scores?.topic_scores as Record<string, { score: number }>) ?? {};
  const paperScores = (scores?.paper_scores as Record<string, number>) ?? {};

  // Categorise topics by urgency
  const topicData = topics.map((t: any) => {
    const p = progressMap[t.id];
    const ts = topicScores[t.id];
    const accuracy = p?.total_attempted > 0 ? Math.round(p.accuracy_rate) : ts?.score ?? null;
    const daysSinceLastPractice = p?.last_practiced_at
      ? Math.floor((Date.now() - new Date(p.last_practiced_at).getTime()) / 86400000)
      : null;

    let priority: "critical" | "high" | "medium" | "low" | "untested" = "untested";
    if (accuracy === null) priority = "untested";
    else if (accuracy < 30) priority = "critical";
    else if (accuracy < 50) priority = "high";
    else if (accuracy < 70) priority = "medium";
    else priority = "low";

    // Boost priority if not practiced recently
    if (daysSinceLastPractice !== null && daysSinceLastPractice > 7 && priority !== "critical") {
      if (priority === "low") priority = "medium";
      else if (priority === "medium") priority = "high";
    }

    return {
      id: t.id,
      name: t.name,
      paperId: t.paper_id,
      accuracy,
      attempted: p?.total_attempted ?? 0,
      daysSinceLastPractice,
      priority,
    };
  });

  // Generate daily plan based on days remaining
  const criticalTopics = topicData.filter((t) => t.priority === "critical");
  const highTopics = topicData.filter((t) => t.priority === "high");
  const untestedTopics = topicData.filter((t) => t.priority === "untested");
  const mediumTopics = topicData.filter((t) => t.priority === "medium");
  const lowTopics = topicData.filter((t) => t.priority === "low");

  // Phase allocation
  let phase: "foundation" | "practice" | "mock" | "revision" = "foundation";
  if (daysRemaining > 60) phase = "foundation";
  else if (daysRemaining > 30) phase = "practice";
  else if (daysRemaining > 14) phase = "mock";
  else phase = "revision";

  const phaseInfo = {
    foundation: { label: "Foundation Building", color: "blue", desc: "Focus on understanding concepts and covering untested topics", dailyQuestions: 30, mocksPerWeek: 0 },
    practice: { label: "Deep Practice", color: "yellow", desc: "Intensive topic-wise drilling, target weak areas", dailyQuestions: 50, mocksPerWeek: 1 },
    mock: { label: "Mock Test Phase", color: "orange", desc: "Full-length mocks + targeted revision of weak areas", dailyQuestions: 40, mocksPerWeek: 3 },
    revision: { label: "Final Revision", color: "red", desc: "Quick revision of all topics, focus on high-weightage areas", dailyQuestions: 30, mocksPerWeek: 4 },
  };

  const currentPhase = phaseInfo[phase];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Study Plan</h1>
        <p className="text-gray-500 mt-1">Your personalised preparation roadmap</p>
      </div>

      {/* Exam Countdown */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-blue-200 text-sm mb-1">Target Exam</div>
              <div className="text-2xl font-bold">
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)} {year}
              </div>
              <div className="text-blue-200 text-sm mt-1">
                {examDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{daysRemaining}</div>
              <div className="text-blue-200 text-sm">days remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paper-wise Status */}
      <Card>
        <CardHeader><CardTitle>Paper-wise Readiness</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PAPERS.map((paper) => {
              const paperTopicList = topicData.filter((t) => t.paperId === paper.id);
              const mastered = paperTopicList.filter((t) => t.priority === "low").length;
              const score = paperScores[String(paper.id)] ?? 0;
              return (
                <div key={paper.id} className="flex items-center gap-4">
                  <div className="w-8 text-xl">{paper.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{paper.short}: {paper.name}</span>
                      <span className="text-sm font-bold text-gray-700">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">{mastered}/{paperTopicList.length} topics mastered</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Priority Topics */}
      <StudyPlanClient
        criticalTopics={criticalTopics}
        highTopics={highTopics}
        untestedTopics={untestedTopics}
        mediumTopics={mediumTopics}
        papers={PAPERS}
        daysRemaining={daysRemaining}
        phase={phase}
        totalTopics={topics.length}
      />
    </div>
  );
}
