"use client";
import { useState } from "react";
import { OnboardingQuestionnaire } from "./onboarding-questionnaire";
import { DiagnosticTest } from "./diagnostic-test";
import { ProfileReport } from "./profile-report";

export type DiagnosticTier = "aptitude" | "foundation" | "intermediate" | "advanced";

type Step = "questionnaire" | "test" | "report";

interface Props {
  userId: string;
  existingProfile: Record<string, unknown> | null;
  existingSession: Record<string, unknown> | null;
}

export function determineTier(academicBackground: string, attemptNumber: string): DiagnosticTier {
  const attempt = parseInt(attemptNumber) || 1;

  // Any background with 2+ attempts → advanced
  if (attempt >= 2) return "advanced";

  // First attempt — decide by academic background
  switch (academicBackground) {
    case "completing_class_12":
      return "aptitude";
    case "class_12":
      return "foundation";
    case "graduation":
    case "post_graduate":
    case "working":
      return "intermediate";
    default:
      return "foundation";
  }
}

function inferTierFromProfile(profile: Record<string, unknown> | null): DiagnosticTier {
  if (!profile) return "foundation";
  const bg = (profile.academic_background as string) ?? "";
  const attempt = String(profile.attempt_number ?? "1");
  return determineTier(bg, attempt);
}

export function DiagnosticFlow({ userId, existingProfile, existingSession }: Props) {
  const initialStep: Step = (() => {
    if (existingSession) return "test";
    if (existingProfile?.onboarding_completed_at && !existingProfile?.diagnostic_completed_at) return "test";
    return "questionnaire";
  })();

  const [step, setStep] = useState<Step>(initialStep);
  const [sessionId, setSessionId] = useState<string | null>(
    existingSession ? (existingSession.id as string) : null
  );
  const [diagnosticTier, setDiagnosticTier] = useState<DiagnosticTier>(
    inferTierFromProfile(existingProfile)
  );

  return (
    <div className="animate-fade-in">
      {step === "questionnaire" && (
        <OnboardingQuestionnaire
          userId={userId}
          onComplete={(sid, academicBackground, attemptNumber) => {
            setSessionId(sid);
            setDiagnosticTier(determineTier(academicBackground, attemptNumber));
            setStep("test");
          }}
        />
      )}
      {step === "test" && sessionId && (
        <DiagnosticTest
          userId={userId}
          sessionId={sessionId}
          diagnosticTier={diagnosticTier}
          onComplete={() => setStep("report")}
        />
      )}
      {step === "report" && (
        <ProfileReport userId={userId} />
      )}
    </div>
  );
}
