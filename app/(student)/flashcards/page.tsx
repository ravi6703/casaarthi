import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layers } from "lucide-react";

export const metadata = { title: "Flashcards" };

const PAPERS = [
  { id: 1, code: "P1", name: "Accounts", emoji: "📊" },
  { id: 2, code: "P2", name: "Laws", emoji: "⚖️" },
  { id: 3, code: "P3", name: "Maths", emoji: "🔢" },
  { id: 4, code: "P4", name: "Economics", emoji: "📈" },
];

export default async function FlashcardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch topics with flashcard counts
  const { data: topics } = await supabase
    .from("topics")
    .select("id, name, paper_id, slug")
    .order("paper_id")
    .order("sort_order");

  const { data: flashcardCounts } = await supabase
    .from("flashcards")
    .select("topic_id")
    .eq("is_active", true);

  const countByTopic: Record<string, number> = {};
  for (const fc of (flashcardCounts ?? []) as any[]) {
    countByTopic[fc.topic_id] = (countByTopic[fc.topic_id] || 0) + 1;
  }

  // Fetch user progress
  const { data: progress } = await supabase
    .from("flashcard_progress")
    .select("flashcard_id, confidence")
    .eq("user_id", user.id);

  const progressByCard: Record<string, string> = {};
  for (const p of (progress ?? []) as any[]) {
    progressByCard[p.flashcard_id] = p.confidence;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link href="/resources" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-500 mt-1">Quick review cards for key concepts, formulas, and definitions</p>
        </div>
      </div>

      {PAPERS.map((paper) => {
        const paperTopics = (topics as any[] ?? [])
          .filter((t: any) => t.paper_id === paper.id && (countByTopic[t.id] || 0) > 0);

        if (paperTopics.length === 0) return null;

        return (
          <div key={paper.id}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>{paper.emoji}</span> {paper.code} — {paper.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paperTopics.map((topic: any) => {
                const count = countByTopic[topic.id] || 0;
                return (
                  <Link key={topic.id} href={`/flashcards/${topic.id}`}>
                    <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">{count} cards</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.values(countByTopic).reduce((s, c) => s + c, 0) === 0 && (
        <div className="text-center py-12">
          <Layers className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Flashcards are being created. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
