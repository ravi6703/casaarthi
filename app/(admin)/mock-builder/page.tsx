import { createClient } from "@/lib/supabase/server";
import { MockBuilderClient } from "@/components/admin/mock-builder-client";

export const metadata = { title: "Mock Builder — Admin" };

export default async function MockBuilderPage() {
  const supabase = await createClient();

  const [{ data: papers }, { data: topics }, { data: existingMocks }] = await Promise.all([
    supabase.from("papers").select("id, name, code").order("id"),
    supabase.from("topics").select("id, name, paper_id").order("name"),
    supabase.from("mock_tests")
      .select("id, paper_id, test_number, duration_minutes, is_active, mock_test_questions(count)")
      .order("paper_id")
      .order("test_number"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mock Test Builder</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage mock test papers</p>
      </div>
      <MockBuilderClient
        papers={papers ?? []}
        topics={topics ?? []}
        existingMocks={(existingMocks ?? []) as any}
      />
    </div>
  );
}
