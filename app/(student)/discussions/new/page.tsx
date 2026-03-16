import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewDiscussionForm } from "./form";

export const metadata = { title: "Ask a Doubt" };

export default async function NewDiscussionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: topics } = await supabase
    .from("topics")
    .select("id, name, paper_id")
    .order("paper_id")
    .order("sort_order");

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/discussions" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ask a Doubt</h1>
          <p className="text-gray-500 text-sm">Get help from fellow CA aspirants</p>
        </div>
      </div>

      <NewDiscussionForm topics={(topics as any[]) ?? []} />
    </div>
  );
}
