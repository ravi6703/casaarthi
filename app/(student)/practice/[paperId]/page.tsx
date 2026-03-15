import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, ArrowLeft } from "lucide-react";

const PAPER_META: Record<number, { code: string; name: string; color: string; emoji: string }> = {
  1: { code: "P1", name: "Principles & Practice of Accounting", color: "blue", emoji: "📊" },
  2: { code: "P2", name: "Business Laws", color: "purple", emoji: "⚖️" },
  3: { code: "P3", name: "Business Mathematics & Statistics", color: "green", emoji: "🔢" },
  4: { code: "P4", name: "Business Economics & Commerce", color: "orange", emoji: "📈" },
};

export default async function PaperDetailPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId: paperIdStr } = await params;
  const paperId = parseInt(paperIdStr);
  if (isNaN(paperId) || paperId < 1 || paperId > 4) notFound();

  const paper = PAPER_META[paperId];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch chapters for this paper
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, chapter_number, name, slug")
    .eq("paper_id", paperId)
    .order("chapter_number");

  // Fetch topics with chapter_id
  const { data: topics } = await supabase
    .from("topics")
    .select("id, name, slug, chapter_id, exam_weightage")
    .eq("paper_id", paperId)
    .order("sort_order");

  // Fetch sub-topics for all topics
  const topicIds = (topics ?? []).map((t: any) => t.id);
  const { data: subTopics } = topicIds.length > 0
    ? await supabase
        .from("sub_topics")
        .select("id, topic_id, name, slug")
        .in("topic_id", topicIds)
        .order("sort_order")
    : { data: [] };

  // Fetch question counts per topic
  const { data: qCountData } = await supabase
    .from("questions")
    .select("topic_id")
    .eq("paper_id", paperId)
    .eq("status", "approved");
  const qCounts: Record<string, number> = {};
  ((qCountData as any[]) ?? []).forEach((q: any) => {
    qCounts[q.topic_id] = (qCounts[q.topic_id] || 0) + 1;
  });

  // Fetch user progress
  const { data: progressData } = await supabase
    .from("topic_progress")
    .select("topic_id, total_attempted, accuracy_rate")
    .eq("user_id", user.id);
  const progressMap = Object.fromEntries(
    ((progressData as any[]) ?? []).map((p: any) => [p.topic_id, p])
  );

  // Group topics by chapter
  const topicsByChapter: Record<string, any[]> = {};
  ((topics as any[]) ?? []).forEach((t: any) => {
    const key = t.chapter_id || "uncategorized";
    if (!topicsByChapter[key]) topicsByChapter[key] = [];
    topicsByChapter[key].push(t);
  });

  // Group sub-topics by topic
  const subTopicsByTopic: Record<string, any[]> = {};
  ((subTopics as any[]) ?? []).forEach((st: any) => {
    if (!subTopicsByTopic[st.topic_id]) subTopicsByTopic[st.topic_id] = [];
    subTopicsByTopic[st.topic_id].push(st);
  });

  const chaptersList = (chapters as any[]) ?? [];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/practice" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{paper.emoji}</span>
            <Badge variant={`p${paperId}` as "p1" | "p2" | "p3" | "p4"}>{paper.code}</Badge>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{paper.name}</h1>
          <p className="text-sm text-gray-500">
            {chaptersList.length} chapters · {(topics as any[])?.length ?? 0} topics · {Object.values(qCounts).reduce((s, c) => s + c, 0)} questions
          </p>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-4">
        {chaptersList.map((chapter: any) => {
          const chapterTopics = topicsByChapter[chapter.id] || [];
          const totalQs = chapterTopics.reduce((s: number, t: any) => s + (qCounts[t.id] || 0), 0);
          const practicedTopics = chapterTopics.filter((t: any) => progressMap[t.id]?.total_attempted > 0);
          const avgAccuracy = practicedTopics.length > 0
            ? Math.round(practicedTopics.reduce((s: number, t: any) => s + (progressMap[t.id]?.accuracy_rate ?? 0), 0) / practicedTopics.length)
            : 0;

          return (
            <Card key={chapter.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Chapter Header */}
                <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                      {chapter.chapter_number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{chapter.name}</h3>
                      <p className="text-xs text-gray-500">
                        {chapterTopics.length} topic{chapterTopics.length !== 1 ? "s" : ""} · {totalQs} questions
                      </p>
                    </div>
                  </div>
                  {practicedTopics.length > 0 && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{avgAccuracy}%</div>
                      <div className="text-xs text-gray-500">accuracy</div>
                    </div>
                  )}
                </div>

                {/* Topics under this chapter */}
                <div className="divide-y">
                  {chapterTopics.map((topic: any) => {
                    const topicSubTopics = subTopicsByTopic[topic.id] || [];
                    const topicQs = qCounts[topic.id] || 0;
                    const p = progressMap[topic.id];
                    const accuracy = p?.accuracy_rate ?? null;

                    return (
                      <div key={topic.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={topicQs > 0 ? `/practice/session?type=topic&topicId=${topic.id}` : "#"}
                              className={`font-medium text-sm ${topicQs > 0 ? "text-gray-900 hover:text-blue-600" : "text-gray-400"} transition-colors flex items-center gap-2`}
                            >
                              <BookOpen className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{topic.name}</span>
                              {topicQs > 0 && <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />}
                            </Link>

                            {/* Sub-topics */}
                            {topicSubTopics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
                                {topicSubTopics.map((st: any) => (
                                  <span key={st.id} className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                    {st.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                            {topicQs > 0 && (
                              <span className="text-xs text-gray-400">{topicQs} Qs</span>
                            )}
                            {accuracy !== null ? (
                              <div className="text-right">
                                <div className={`text-sm font-bold ${
                                  accuracy >= 70 ? "text-green-600" : accuracy >= 40 ? "text-yellow-600" : "text-red-600"
                                }`}>
                                  {Math.round(accuracy)}%
                                </div>
                                <Progress
                                  value={accuracy}
                                  className="w-16 h-1 mt-0.5"
                                  indicatorClassName={
                                    accuracy >= 70 ? "bg-green-500" : accuracy >= 40 ? "bg-yellow-500" : "bg-red-500"
                                  }
                                />
                              </div>
                            ) : topicQs > 0 ? (
                              <Link
                                href={`/practice/session?type=topic&topicId=${topic.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Start
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-300">Coming soon</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {chapterTopics.length === 0 && (
                    <div className="p-4 text-sm text-gray-400 text-center">No topics yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
