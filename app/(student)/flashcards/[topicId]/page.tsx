import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FlashcardDeckWrapper } from "./flashcard-deck-wrapper";

export default async function FlashcardTopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: topic } = await supabase
    .from("topics")
    .select("id, name, paper_id")
    .eq("id", topicId)
    .single();

  if (!topic) notFound();

  const { data: cards } = await supabase
    .from("flashcards")
    .select("*")
    .eq("topic_id", topicId)
    .eq("is_active", true)
    .order("sort_order");

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/flashcards" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{(topic as any).name}</h1>
          <p className="text-gray-500 text-sm">{(cards as any[])?.length ?? 0} flashcards</p>
        </div>
      </div>

      <FlashcardDeckWrapper cards={(cards as any[]) ?? []} />
    </div>
  );
}
