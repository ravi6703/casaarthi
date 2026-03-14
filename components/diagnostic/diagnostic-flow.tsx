"use client";
import { useState } from "react";
import { OnboardingQuestionnaire } from "./onboarding-questionnaire";
import { DiagnosticTest } from "./diagnostic-test";
import { ProfileReport } from "./profile-report";

type Step = "questionnaire" | "test" | "report";

interface Props {
  userId: string;
  existingProfile: Record<string, unknown> | null;
  existingSession: Record<string, unknown> | null;
}

export function DiagnosticFlow({ userId, existingProfile, existingSession }: Props) {
  // Determine starting step
  const initialStep: Step = (() => {
    if (existingSession) return "test";
    if (existingProfile?.onboarding_completed_at && !existingProfile?.diagnostic_completed_at) return "test";
    return "questionnaire";
  })();

  const [step, setStep] = useState<Step>(initialStep);
  const [sessionId, setSessionId] = useState<string | null>(
    existingSession ? (existingSession.id as string) : null
  );

  return (
    <div className="animate-fade-in">
      {step === "questionnaire" && (
        <OnboardingQuestionnaire
          userId={userId}
          onComplete={(sid) => { setSessionId(sid); setStep("test"); }}
        />
      )}
      {step === "test" && sessionId && (
        <DiagnosticTest
          userId={userId}
          sessionId={sessionId}
          onComplete={() => setStep("report")}
        />
      )}
      {step === "report" && (
        <ProfileReport userId={userId} />
      )}
    </div>
  );
}
