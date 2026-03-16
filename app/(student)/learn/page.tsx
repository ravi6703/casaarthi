import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LearnClient } from "./learn-client";

export const metadata = { title: "AI Visual Explainer" };

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get all topics for the topic selector
  const { data: topicsData } = await supabase
    .from("topics")
    .select("id, name, paper_id")
    .order("paper_id")
    .order("sort_order");

  const topics = (topicsData as any[]) ?? [];

  return <LearnClient topics={topics} />;
}
