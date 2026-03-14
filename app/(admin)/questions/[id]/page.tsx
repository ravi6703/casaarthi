import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuestionForm } from "@/components/admin/question-form";

export const metadata = { title: "Edit Question — Admin" };

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const [{ data: question }, { data: papers }, { data: topics }] = await Promise.all([
    supabase.from("questions").select("*").eq("id", id).single(),
    supabase.from("papers").select("id, name, code").order("id"),
    supabase.from("topics").select("id, name, paper_id").order("name"),
  ]);

  if (!question) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Question</h1>
        <p className="text-gray-500 text-sm mt-1 font-mono text-xs">{id}</p>
      </div>
      <QuestionForm
        papers={papers ?? []}
        topics={topics ?? []}
        initialData={question as any}
      />
    </div>
  );
}
