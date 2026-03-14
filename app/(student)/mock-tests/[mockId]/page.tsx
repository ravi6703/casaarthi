import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { MockTestEnvironment } from "@/components/mock-test/mock-test-environment";

interface Props { params: Promise<{ mockId: string }> }

export default async function MockTestPage({ params }: Props) {
  const { mockId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch mock test
  const { data: mockData } = await supabase
    .from("mock_tests")
    .select("*, papers(name, format, duration_minutes, negative_marking, total_marks)")
    .eq("id", mockId)
    .eq("is_active", true)
    .single();

  const mock = mockData as any;
  if (!mock) notFound();

  // Fetch questions for this mock
  const { data: mockQuestionsData } = await supabase
    .from("mock_test_questions")
    .select("question_order, questions(*, topics(name))")
    .eq("mock_test_id", mockId)
    .order("question_order");

  const mockQuestions = (mockQuestionsData as any[]) ?? [];

  const questions = mockQuestions
    .sort((a: any, b: any) => a.question_order - b.question_order)
    .map((mq: any) => mq.questions)
    .filter(Boolean);

  // Check for in-progress attempt
  const { data: existingAttemptData } = await supabase
    .from("mock_test_attempts")
    .select("id, started_at")
    .eq("user_id", user.id)
    .eq("mock_test_id", mockId)
    .eq("status", "in_progress")
    .single();

  const existingAttempt = existingAttemptData as any;

  // Check for existing responses if resuming
  let existingResponses: Record<string, string> = {};
  if (existingAttempt) {
    const { data: responsesData } = await supabase
      .from("mock_test_responses")
      .select("question_id, selected_option")
      .eq("attempt_id", existingAttempt.id);
    const responses = (responsesData as any[]) ?? [];
    existingResponses = Object.fromEntries(
      responses.filter((r: any) => r.selected_option).map((r: any) => [r.question_id, r.selected_option!])
    );
  }

  return (
    <MockTestEnvironment
      userId={user.id}
      mock={mock as Record<string, unknown>}
      questions={questions as Record<string, unknown>[]}
      existingAttemptId={existingAttempt?.id}
      existingResponses={existingResponses}
      existingStartTime={existingAttempt?.started_at}
    />
  );
}
