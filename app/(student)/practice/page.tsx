import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Clock, RefreshCw, Zap, Trophy, FileText } from "lucide-react";
import { QuickStartFilter } from "@/components/practice/quick-start-filter";
import { MicroChallengeCards } from "@/components/practice/micro-challenge-card";

export const metadata = { title: "Practice" };

const PAPERS = [
  { id: 1, code: "P1", name: "Accounting (Subjective)",                    color: "blue",   emoji: "📊" },
  { id: 2, code: "P2", name: "Business Laws (Subjective)",                 color: "purple", emoji: "⚖️" },
  { id: 3, code: "P3", name: "Quantitative Aptitude (Objective, MCQ)",     color: "green",  emoji: "🔢" },
  { id: 4, code: "P4", name: "Business Economics (Objective, MCQ)",        color: "orange", emoji: "📈" },
];

const PAPER_COLORS: Record<string, string> = {
  blue:   "border-l-[var(--primary)] hover:border-[var(--sage)]",
  purple: "border-l-purple-500 hover:border-purple-400",
  green:  "border-l-green-500 hover:border-green-400",
  orange: "border-l-orange-500 hover:border-orange-400",
};

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch topic progress
  const { data: progressData } = await supabase
    .from("topic_progress")
    .select("topic_id, total_attempted, accuracy_rate, last_practiced_at")
    .eq("user_id", user.id);

  // Fetch topics with question counts (include chapter_id for grouping)
  const { data: topicsData } = await supabase
    .from("topics")
    .select("id, paper_id, chapter_id, name, slug, exam_weightage")
    .order("paper_id")
    .order("sort_order");

  // Fetch chapters
  const { data: chaptersData } = await supabase
    .from("chapters")
    .select("id, paper_id, chapter_number, name")
    .order("paper_id")
    .order("chapter_number");

  const progress = (progressData as any[]) ?? [];
  const topics = (topicsData as any[]) ?? [];
  const chapters = (chaptersData as any[]) ?? [];

  // Get question counts per topic (using group-by RPC or topic_id select with count)
  const { data: qCountData } = await supabase
    .from("questions")
    .select("topic_id", { count: "exact" })
    .eq("status", "approved");
  const qCounts: Record<string, number> = {};
  // Since Supabase doesn't support group-by directly, we still need to count per topic
  // but at least we only fetch the topic_id column (no other data)
  ((qCountData as any[]) ?? []).forEach((q: any) => {
    qCounts[q.topic_id] = (qCounts[q.topic_id] || 0) + 1;
  });

  const progressMap = Object.fromEntries(progress.map((p: any) => [p.topic_id, p]));

  // Fetch micro-challenges
  const { data: challengesData } = await supabase
    .from("micro_challenges")
    .select("*")
    .eq("is_active", true)
    .limit(3);
  const microChallenges = (challengesData as any[]) ?? [];

  // Topics not practiced in 7+ days (for revision mode)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const revisionTopics = topics.filter((t: any) => {
    const p = progressMap[t.id];
    return p && p.last_practiced_at && p.last_practiced_at < sevenDaysAgo;
  });

  // Weak topics (accuracy < 50%)
  const weakTopics = topics.filter((t: any) => {
    const p = progressMap[t.id];
    return p && p.accuracy_rate < 50 && p.total_attempted > 0;
  }).sort((a: any, b: any) => (progressMap[a.id]?.accuracy_rate ?? 0) - (progressMap[b.id]?.accuracy_rate ?? 0));

  const SESSION_TYPES = [
    { type: "topic",    label: "Topic Practice",     icon: <BookOpen className="h-5 w-5 text-[var(--primary)]" />,   desc: "Drill down on a specific topic" },
    { type: "mixed",    label: "Mixed Practice",      icon: <Zap className="h-5 w-5 text-yellow-500" />,     desc: "Questions across all topics" },
    { type: "weak_area",label: "Weak Area Focus",     icon: <Target className="h-5 w-5 text-red-500" />,     desc: "AI-selected from your weakest topics" },
    { type: "revision", label: "Revision Mode",       icon: <RefreshCw className="h-5 w-5 text-green-500" />,desc: `${revisionTopics.length} topics due for revision` },
    { type: "exam_sim", label: "Exam Simulation",     icon: <Clock className="h-5 w-5 text-purple-500" />,   desc: "Timed 100-question mock drill" },
    { type: "challenge",label: "Challenge Mode",      icon: <Trophy className="h-5 w-5 text-orange-500" />, desc: "Hard-only questions for strong topics" },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Practice</h1>
        <p className="text-gray-500 mt-1">Choose a session type or drill into a specific topic</p>
      </div>

      {/* Quick Start Filter */}
      <QuickStartFilter
        papers={PAPERS.map((p) => ({ id: p.id, code: p.code, name: p.name, emoji: p.emoji }))}
        topics={topics.map((t: any) => ({ id: t.id, paper_id: t.paper_id, chapter_id: t.chapter_id ?? null, name: t.name, questionCount: qCounts[t.id] || 0 }))}
        chapters={chapters.map((c: any) => ({ id: c.id, paper_id: c.paper_id, chapter_number: c.chapter_number, name: c.name }))}
      />

      {/* Micro-Challenges */}
      {microChallenges.length > 0 && <MicroChallengeCards challenges={microChallenges} />}

      {/* Session Types */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Session Types</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SESSION_TYPES.map((st) => (
            <Link key={st.type} href={`/practice/session?type=${st.type}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer h-full group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{st.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors">{st.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{st.desc}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Papers with Chapter counts */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Browse by Paper</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PAPERS.map((paper) => {
            const paperTopics = topics.filter((t: any) => t.paper_id === paper.id);
            const totalAttempted = paperTopics.filter((t: any) => progressMap[t.id]?.total_attempted > 0).length;
            const avgAccuracy = paperTopics.length > 0
              ? Math.round(paperTopics.reduce((s: number, t: any) => s + (progressMap[t.id]?.accuracy_rate ?? 0), 0) / paperTopics.length)
              : 0;
            const paperChapters = chapters.filter((c: any) => c.paper_id === paper.id);

            return (
              <Link key={paper.id} href={`/practice/${paper.id}`}>
                <Card className={`border-l-4 ${PAPER_COLORS[paper.color]} transition-all hover:shadow-md cursor-pointer h-full`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{paper.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={`p${paper.id}` as "p1"|"p2"|"p3"|"p4"}>{paper.code}</Badge>
                          </div>
                          <div className="font-semibold text-gray-900 mt-1 text-sm">{paper.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{avgAccuracy}%</div>
                        <div className="text-xs text-gray-500">accuracy</div>
                      </div>
                    </div>

                    <Progress
                      value={paperTopics.length > 0 ? (totalAttempted / paperTopics.length) * 100 : 0}
                      className="h-1.5 mb-2"
                    />
                    <div className="text-xs text-gray-500 mb-3">
                      {paperChapters.length} chapters · {paperTopics.length} topics · {totalAttempted} started
                    </div>

                    {/* Chapter pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {paperChapters.slice(0, 4).map((ch: any) => (
                        <span key={ch.id} className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                          Ch {ch.chapter_number}: {ch.name.length > 18 ? ch.name.slice(0, 18) + "…" : ch.name}
                        </span>
                      ))}
                      {paperChapters.length > 4 && (
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-[var(--sage-light)] text-[var(--teal-dark)]">
                          +{paperChapters.length - 4} more →
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Previous Year Papers */}
      <Link href="/practice/previous-years">
        <Card className="hover:shadow-md transition-all cursor-pointer border-[var(--border)] bg-[var(--background)]/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--sage-light)] flex items-center justify-center">
              <FileText className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Previous Year Papers</div>
              <div className="text-sm text-gray-500">Practice with actual ICAI exam questions organized by year</div>
            </div>
            <span className="text-[var(--primary)] font-medium text-sm">Browse →</span>
          </CardContent>
        </Card>
      </Link>

      {/* Weak topics alert */}
      {weakTopics.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Needs Urgent Attention ({weakTopics.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakTopics.slice(0, 6).map((topic: any) => {
              const p = progressMap[topic.id];
              return (
                <Link key={topic.id} href={`/practice/session?type=topic&topicId=${topic.id}`}>
                  <Card className="border-red-200 hover:shadow-md transition-all cursor-pointer hover:border-red-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-2">
                          <div className="text-sm font-medium text-gray-900 truncate">{topic.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">P{topic.paper_id} · {p?.total_attempted ?? 0} attempted</div>
                        </div>
                        <div className="text-lg font-bold text-red-600">{Math.round(p?.accuracy_rate ?? 0)}%</div>
                      </div>
                      <Progress value={p?.accuracy_rate ?? 0} className="mt-2 h-1" indicatorClassName="bg-red-400" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
