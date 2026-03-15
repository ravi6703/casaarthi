"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props { userId: string; onComplete: (sessionId: string, academicBackground: string) => void; }

const SELF_ASSESSMENT_LEVELS = ["Very Weak", "Weak", "Average", "Good", "Very Good"];
const PAPERS = [
  { id: 1, name: "Paper 1 — Accounts" },
  { id: 2, name: "Paper 2 — Laws" },
  { id: 3, name: "Paper 3 — Maths & Stats" },
  { id: 4, name: "Paper 4 — Economics" },
];

type OptionBtn = { label: string; value: string };

function OptionButtons({ options, value, onChange }: { options: OptionBtn[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            value === o.value
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function OnboardingQuestionnaire({ userId, onComplete }: Props) {
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    academic_background: "",
    attempt_number: "",
    target_exam_cycle: "",
    target_exam_year: "2026",
    learning_style: "",
    self_assessment: {} as Record<string, string>,
    previous_marks: {} as Record<string, string>,
  });

  const steps = [
    {
      title: "Academic Background",
      subtitle: "Help us understand where you are right now",
      render: () => (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your current academic status</p>
            <OptionButtons
              options={[
                { label: "Class 12 graduate", value: "class_12" },
                { label: "Completing Class 12", value: "completing_class_12" },
                { label: "Pursuing graduation", value: "graduation" },
                { label: "Post-graduate", value: "post_graduate" },
                { label: "Working professional", value: "working" },
              ]}
              value={form.academic_background}
              onChange={(v) => setForm({ ...form, academic_background: v })}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Which attempt is this?</p>
            <OptionButtons
              options={[
                { label: "1st attempt", value: "1" },
                { label: "2nd attempt", value: "2" },
                { label: "3rd attempt", value: "3" },
                { label: "4th+ attempt", value: "4" },
              ]}
              value={form.attempt_number}
              onChange={(v) => setForm({ ...form, attempt_number: v })}
            />
          </div>
        </div>
      ),
      isValid: () => !!form.academic_background && !!form.attempt_number,
    },
    {
      title: "Target Exam",
      subtitle: "When are you planning to appear for the exam?",
      render: () => (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Exam cycle</p>
            <OptionButtons
              options={[
                { label: "January", value: "january" },
                { label: "May / June", value: "may" },
                { label: "September", value: "september" },
              ]}
              value={form.target_exam_cycle}
              onChange={(v) => setForm({ ...form, target_exam_cycle: v })}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Year</p>
            <OptionButtons
              options={[
                { label: "2026", value: "2026" },
                { label: "2027", value: "2027" },
              ]}
              value={form.target_exam_year}
              onChange={(v) => setForm({ ...form, target_exam_year: v })}
            />
          </div>
        </div>
      ),
      isValid: () => !!form.target_exam_cycle,
    },
    {
      title: "Previous Attempts",
      subtitle: parseInt(form.attempt_number) > 1
        ? "Tell us about your previous attempt (approximate marks are fine)"
        : "Good — you are starting fresh!",
      render: () => (
        parseInt(form.attempt_number) > 1 ? (
          <div className="space-y-3">
            {PAPERS.map((paper) => (
              <div key={paper.id} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-44 flex-shrink-0">{paper.name}</span>
                <OptionButtons
                  options={[
                    { label: "< 30", value: "below_30" },
                    { label: "30–39", value: "30_39" },
                    { label: "40–50", value: "40_50" },
                    { label: "50–60", value: "50_60" },
                    { label: "60+", value: "above_60" },
                    { label: "Not attempted", value: "na" },
                  ]}
                  value={form.previous_marks[paper.id] ?? ""}
                  onChange={(v) => setForm((prev) => ({
                    ...prev,
                    previous_marks: { ...prev.previous_marks, [paper.id]: v },
                  }))}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🌟</div>
            <p className="text-green-700 font-medium">Great start! First-time aspirants get a completely fresh profile with no bias from previous attempts.</p>
          </div>
        )
      ),
      isValid: () => true,
    },
    {
      title: "Subject Self-Assessment",
      subtitle: "How comfortable do you feel with each subject? Be honest — this helps us personalise your experience",
      render: () => (
        <div className="space-y-4">
          {PAPERS.map((paper) => (
            <div key={paper.id}>
              <p className="text-sm font-medium text-gray-700 mb-2">{paper.name}</p>
              <div className="flex gap-2 flex-wrap">
                {SELF_ASSESSMENT_LEVELS.map((level, idx) => (
                  <button
                    key={level}
                    onClick={() => setForm((prev) => ({
                      ...prev,
                      self_assessment: { ...prev.self_assessment, [paper.id]: level },
                    }))}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      form.self_assessment[paper.id] === level
                        ? idx <= 1 ? "border-red-400 bg-red-50 text-red-700"
                          : idx === 2 ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                          : "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
      isValid: () => Object.keys(form.self_assessment).length === 4,
    },
    {
      title: "Learning Style",
      subtitle: "How do you prefer to study? This helps us tailor resources for you",
      render: () => (
        <div className="grid gap-3">
          {[
            { value: "text_heavy",     emoji: "📖", label: "Text-based learning", desc: "I prefer reading notes, ICAI material, and detailed explanations" },
            { value: "video_heavy",    emoji: "🎥", label: "Video-first learning",  desc: "I learn best by watching lectures and tutorials" },
            { value: "practice_heavy", emoji: "✍️", label: "Practice-first",       desc: "I learn by doing — give me questions, I figure out concepts from answers" },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => setForm({ ...form, learning_style: style.value })}
              className={`p-4 rounded-xl border text-left transition-all ${
                form.learning_style === style.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{style.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{style.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{style.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ),
      isValid: () => !!form.learning_style,
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  async function handleNext() {
    if (!current.isValid()) {
      toast.error("Please complete all fields to continue");
      return;
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    // Final step — save profile and create diagnostic session
    setLoading(true);
    try {
      // Upsert student profile
      const { error: profileError } = await (supabase.from("student_profiles") as any).upsert({
        user_id: userId,
        academic_background: form.academic_background,
        attempt_number: parseInt(form.attempt_number) || 1,
        target_exam_cycle: form.target_exam_cycle as "january" | "may" | "september",
        target_exam_year: parseInt(form.target_exam_year),
        previous_marks: form.previous_marks,
        self_assessment: form.self_assessment,
        learning_style: form.learning_style as "text_heavy" | "video_heavy" | "practice_heavy",
        onboarding_completed_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      if (profileError) throw profileError;

      // Create diagnostic session
      const { data: sessionData, error: sessionError } = await (supabase
        .from("diagnostic_sessions") as any)
        .insert({
          user_id: userId,
          status: "in_progress",
          questionnaire_data: form,
          expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const session = sessionData as any;
      const isAptitude = form.academic_background === "completing_class_12";
      toast.success(isAptitude
        ? "Questionnaire complete! Starting your aptitude assessment..."
        : "Questionnaire complete! Starting your diagnostic test..."
      );
      onComplete(session.id, form.academic_background);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-4">
          Step {step + 1} of {steps.length}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{current.title}</h1>
        <p className="text-gray-500 mt-1">{current.subtitle}</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2 max-w-xs mx-auto" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {current.render()}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button onClick={handleNext} loading={loading} className="min-w-32">
          {step === steps.length - 1 ? "Start Diagnostic Test →" : "Continue"}
          {step < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Your answers are private and only used to personalise your study plan
      </p>
    </div>
  );
}
