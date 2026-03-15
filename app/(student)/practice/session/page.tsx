import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PracticeSession } from "@/components/practice/practice-session";

interface Props {
  searchParams: Promise<{ type?: string; topicId?: string; subTopicId?: string; paperId?: string }>;
}

export default async function PracticeSessionPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sessionType = (params.type ?? "mixed") as "topic" | "mixed" | "weak_area" | "revision" | "exam_sim" | "challenge";
  const topicId = params.topicId;
  const paperId = params.paperId ? parseInt(params.paperId) : undefined;

  // Determine question scope
  let questions: Record<string, unknown>[] = [];

  const baseQuery = supabase
    .from("questions")
    .select("*, topics(name, paper_id), sub_topics(name)")
    .eq("status", "approved")
    .order("question_type");

  if (sessionType === "topic" && topicId) {
    const { data } = await baseQuery.eq("topic_id", topicId).limit(30);
    questions = (data as any[]) ?? [];
  } else if (sessionType === "weak_area") {
    // Get user's weakest topics
    const { data: weakProgressData } = await supabase
      .from("topic_progress")
      .select("topic_id")
      .eq("user_id", user.id)
      .lt("accuracy_rate", 50)
      .order("accuracy_rate")
      .limit(5);

    const weakProgress = (weakProgressData as any[]) ?? [];
    const weakTopicIds = weakProgress.map((p: any) => p.topic_id);
    if (weakTopicIds.length > 0) {
      const { data } = await baseQuery.in("topic_id", weakTopicIds).limit(30);
      questions = (data as any[]) ?? [];
    } else {
      const { data } = await baseQuery.limit(30);
      questions = (data as any[]) ?? [];
    }
  } else if (sessionType === "revision") {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: revTopicsData } = await supabase
      .from("topic_progress")
      .select("topic_id")
      .eq("user_id", user.id)
      .lt("last_practiced_at", sevenDaysAgo)
      .limit(5);

    const revTopics = (revTopicsData as any[]) ?? [];
    const revTopicIds = revTopics.map((p: any) => p.topic_id);
    if (revTopicIds.length > 0) {
      const { data } = await baseQuery.in("topic_id", revTopicIds).limit(30);
      questions = (data as any[]) ?? [];
    } else {
      const { data } = await baseQuery.limit(30);
      questions = (data as any[]) ?? [];
    }
  } else if (sessionType === "exam_sim") {
    const pid = paperId ?? 3;
    const { data } = await baseQuery.eq("paper_id", pid).limit(100);
    questions = (data as any[]) ?? [];
  } else if (sessionType === "challenge") {
    // Hard questions only from topics with >70% accuracy
    const { data: strongTopicsData } = await supabase
      .from("topic_progress")
      .select("topic_id")
      .eq("user_id", user.id)
      .gt("accuracy_rate", 70);
    const strongTopics = (strongTopicsData as any[]) ?? [];
    const strongIds = strongTopics.map((p: any) => p.topic_id);
    if (strongIds.length > 0) {
      const { data } = await baseQuery.in("topic_id", strongIds).eq("difficulty", "hard").limit(30);
      questions = (data as any[]) ?? [];
    } else {
      const { data } = await baseQuery.eq("difficulty", "hard").limit(30);
      questions = (data as any[]) ?? [];
    }
  } else {
    // Mixed
    const { data } = await baseQuery.limit(30);
    questions = (data as any[]) ?? [];
  }

  // Get user's bookmarks for these questions
  const questionIds = questions.map((q) => q.id as string);
  const { data: bookmarksData } = await supabase
    .from("bookmarks")
    .select("question_id")
    .eq("user_id", user.id)
    .in("question_id", questionIds);

  const bookmarks = (bookmarksData as any[]) ?? [];
  const bookmarkSet = new Set(bookmarks.map((b: any) => b.question_id));

  // Get topic name if topic session
  let topicName: string | undefined;
  if (topicId) {
    const { data: topicData } = await supabase.from("topics").select("name").eq("id", topicId).single();
    const topic = topicData as any;
    topicName = topic?.name;
  }

  return (
    <PracticeSession
      userId={user.id}
      questions={questions}
      sessionType={sessionType}
      topicId={topicId}
      paperId={paperId}
      bookmarkedIds={bookmarkSet}
      topicName={topicName}
    />
  );
}
