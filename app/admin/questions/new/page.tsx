import { createClient } from "@/lib/supabase/server";
import { QuestionForm } from "@/components/admin/question-form";

export const metadata = { title: "New Question — Admin" };

export default async function NewQuestionPage() {
  const supabase = await createClient();

  const { data: papers } = await supabase.from("papers").select("id, name, code").order("id");
  const { data: topics } = await supabase.from("topics").select("id, name, paper_id").order("name");

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Question</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new question for the question bank</p>
      </div>
      <QuestionForm papers={papers ?? []} topics={topics ?? []} />
    </div>
  );
}
