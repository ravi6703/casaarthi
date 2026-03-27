import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type MockTest = Database["public"]["Tables"]["mock_tests"]["Row"] & {
  paper_name?: string;
  total_questions?: number;
  duration_minutes?: number;
  sort_order?: number;
};

export const metadata = { title: "Mock Tests | CA Saarthi" };

export default async function MockTestsPage() {
  const supabase = await createClient();

  const { data: mockTests } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const tests = (mockTests ?? []) as unknown as MockTest[];

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mock Test Series</h1>
        <p className="text-gray-500 mt-1">Full-length ICAI-pattern tests with detailed analytics</p>
      </div>

      {tests.length === 0 ? (
        <Card className="border-[var(--border)] bg-[var(--secondary)]">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--sage-light)] flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mock tests are being prepared</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              We are finalizing full-length ICAI-pattern mock tests. Meanwhile, strengthen your basics with practice questions.
            </p>
            <Link href="/practice">
              <Button>Start Practicing <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="p1">{test.paper_name ?? "Mixed"}</Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {test.duration_minutes ?? 180} min
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{test.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{test.total_questions ?? 100} questions</p>
                <Link href={`/mock-tests/${test.id}`}>
                  <Button size="sm" className="w-full">
                    Start Test <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
