import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";

export const metadata = { title: "Analytics — Admin" };

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalQuestions },
    { count: totalMocks },
    { count: totalSessions },
    { data: recentReports },
    { data: weakTopics },
  ] = await Promise.all([
    supabase.from("student_profiles").select("id", { count: "exact", head: true }),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("mock_test_attempts").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("practice_sessions").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("question_reports")
      .select("id, reason, question_id, created_at, questions(question_text)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("topic_progress")
      .select("topic_id, accuracy_rate, total_attempted, topics(name, papers(name))")
      .lt("accuracy_rate", 50)
      .gt("total_attempted", 20)
      .order("accuracy_rate", { ascending: true })
      .limit(10),
  ]);

  const stats = [
    { label: "Total Students", value: totalUsers ?? 0, icon: <Users className="h-5 w-5 text-blue-500" /> },
    { label: "Approved Questions", value: totalQuestions ?? 0, icon: <BookOpen className="h-5 w-5 text-green-500" /> },
    { label: "Mock Attempts", value: totalMocks ?? 0, icon: <FileText className="h-5 w-5 text-purple-500" /> },
    { label: "Practice Sessions", value: totalSessions ?? 0, icon: <TrendingUp className="h-5 w-5 text-orange-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">{s.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Question reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Question Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!recentReports || recentReports.length === 0 ? (
              <p className="p-4 text-sm text-gray-400 text-center">No reports</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentReports.map((r: any) => (
                  <div key={r.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full capitalize">{r.reason}</span>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {r.questions?.question_text?.slice(0, 100) ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak topics across platform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weakest Topics (Platform-wide)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!weakTopics || weakTopics.length === 0 ? (
              <p className="p-4 text-sm text-gray-400 text-center">Insufficient data</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {weakTopics.map((t: any) => (
                  <div key={t.topic_id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-900">{t.topics?.name ?? "Unknown"}</div>
                      <div className="text-xs text-gray-400">{t.topics?.papers?.name} · {t.total_attempted} attempts</div>
                    </div>
                    <span className="text-sm font-bold text-red-600">{Math.round(t.accuracy_rate)}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
