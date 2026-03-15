import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AIChatbot } from "@/components/chat/ai-chatbot";
import { DailyQuote } from "@/components/daily-quote";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch streak
  const { data: streakData } = await supabase
    .from("study_streaks")
    .select("current_streak")
    .eq("user_id", user.id)
    .single();

  const streak = streakData as any;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName={userName} userEmail={user.email} streakCount={streak?.current_streak} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* AI Doubt Solver Chatbot */}
      <AIChatbot />

      {/* Daily Motivational Quote */}
      <DailyQuote />
    </div>
  );
}
