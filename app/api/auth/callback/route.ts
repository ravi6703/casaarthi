import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if student profile exists; if not, send to diagnostic
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Retry profile check up to 3 times to handle race condition
        // where profile hasn't been created yet after registration
        let profile: any = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const { data: profileData } = await supabase
            .from("student_profiles")
            .select("onboarding_completed_at")
            .eq("user_id", user.id)
            .maybeSingle();
          profile = profileData;
          if (profile) break;
          // Wait briefly before retry (200ms, 500ms)
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, attempt === 0 ? 200 : 500));
          }
        }

        if (!profile || !profile.onboarding_completed_at) {
          return NextResponse.redirect(`${origin}/diagnostic`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Provide more specific error context
  const errorType = searchParams.get("error") || "auth_callback_failed";
  const errorDesc = searchParams.get("error_description") || "";
  const errorParam = errorDesc
    ? `error=${encodeURIComponent(errorType)}&error_description=${encodeURIComponent(errorDesc)}`
    : `error=${encodeURIComponent(errorType)}`;
  return NextResponse.redirect(`${origin}/login?${errorParam}`);
}
