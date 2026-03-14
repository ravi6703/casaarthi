import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DiagnosticFlow } from "@/components/diagnostic/diagnostic-flow";

export const metadata = { title: "Diagnostic Assessment" };

export default async function DiagnosticPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const profile = profileData as any;

  // Already completed diagnostic
  if (profile?.diagnostic_completed_at) {
    redirect("/profile");
  }

  // Check for in-progress diagnostic session
  const { data: sessionData } = await supabase
    .from("diagnostic_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "in_progress")
    .gte("expires_at", new Date().toISOString())
    .single();

  const session = sessionData as any;

  return (
    <DiagnosticFlow
      userId={user.id}
      existingProfile={profile}
      existingSession={session}
    />
  );
}
