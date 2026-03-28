"use client";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Info } from "lucide-react";

interface Props {
  userId: string;
  onComplete: (sessionId: string, academicBackground: string, attemptNumber: string) => void;
}

const SELF_ASSESSMENT_LEVELS = ["Very Weak", "Weak", "Average", "Good", "Very Good"];

// New scheme paper names (ICAI 2024+)
const PAPERS = [
  { id: 1, name: "Paper 1 — Accounting" },
  { id: 2, name: "Paper 2 — Business Laws" },
  { id: 3, name: "Paper 3 — Quantitative Aptitude" },
  { id: 4, name: "Paper 4 — Business Economics" },
];

type OptionBtn = { label: string; value: string; disabled?: boolean };

function OptionButtons({
  options,
  value,
  onChange,
}: {
  options: OptionBtn[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => !o.disabled && onChange(o.value)}
          disabled={o.disabled}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            o.disabled
              ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
              : value === o.value
              ? "border-[var(--primary)] bg-[var(--sage-light)] text-[var(--teal-dark)]"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--sage-light)] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--teal-dark)] flex items-start gap-2.5 mt-3">
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

// ─── ICAI eligibility logic ───────────────────────────────────────────────────
// • "completing_class_12" students cannot have appeared before → attempt is always 1
// • After class 12 board exams (Mar-Apr), results come in May-Jun, then 4 months
//   study period is required → earliest eligible cycle is September of the same year
//   or January of next year
// • Exam cycles: January, May/June, September (3 times per year since June 2024)
// • Papers 1 & 2 are objective (negative marking ¼), Papers 3 & 4 are subjective
// • Passing: 40% each paper, 50% aggregate
// ──────────────────────────────────────────────────────────────────────────────

function getEligibleExamOptions(
  bg: string,
): { cycles: OptionBtn[]; years: OptionBtn[] } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // For "completing class 12" students:
  // Board exams happen Feb-Mar, results May-Jun
  // 4 months study → earliest September same year (if registered by May 1)
  // If we're past September already, January next year
  if (bg === "completing_class_12") {
    const boardYear = currentYear; // assume they finish board this year
    // Earliest possible: September of board year (if currently before Sep)
    // Otherwise January next year
    const cycles: OptionBtn[] = [];
    const years: OptionBtn[] = [];

    // Sep of board year is possible if it's still before Sep registration deadline
    if (currentMonth <= 5) {
      // Can register by May 1 for Sep exam
      cycles.push(
        { label: "January", value: "january", disabled: true },
        { label: "May / June", value: "may", disabled: true },
        { label: "September", value: "september" },
      );
      years.push(
        { label: String(boardYear), value: String(boardYear) },
        { label: String(boardYear + 1), value: String(boardYear + 1) },
      );
    } else if (currentMonth <= 9) {
      // Can still do Sep this year or Jan/May/Sep next year
      cycles.push(
        { label: "January", value: "january" },
        { label: "May / June", value: "may" },
        { label: "September", value: "september" },
      );
      years.push(
        { label: String(boardYear), value: String(boardYear), disabled: currentMonth > 5 },
        { label: String(boardYear + 1), value: String(boardYear + 1) },
      );
    } else {
      // Past Sep — earliest is Jan next year
      cycles.push(
        { label: "January", value: "january" },
        { label: "May / June", value: "may" },
        { label: "September", value: "september" },
      );
      years.push(
        { label: String(boardYear + 1), value: String(boardYear + 1) },
        { label: String(boardYear + 2), value: String(boardYear + 2) },
      );
    }

    return { cycles, years };
  }

  // For all other backgrounds — all cycles and next 2 years available
  const allCycles: OptionBtn[] = [
    { label: "January", value: "january" },
    { label: "May / June", value: "may" },
    { label: "September", value: "september" },
  ];

  // Disable cycles in current year that have already passed
  if (currentMonth > 1)
    allCycles[0] = { ...allCycles[0], disabled: false }; // Jan — show for next year
  if (currentMonth > 6)
    allCycles[1] = { ...allCycles[1], disabled: false }; // May — show for next year

  const years: OptionBtn[] = [
    { label: String(currentYear), value: String(currentYear) },
    { label: String(currentYear + 1), value: String(currentYear + 1) },
  ];

  return { cycles: allCycles, years };
}

function getAttemptOptions(bg: string): OptionBtn[] | null {
  // Students currently in class 12 CANNOT have appeared before — ICAI requires
  // Class 12 pass + 4 months study before first appearance
  if (bg === "completing_class_12") return null; // auto-set to 1

  return [
    { label: "1st attempt", value: "1" },
    { label: "2nd attempt", value: "2" },
    { label: "3rd attempt", value: "3" },
    { label: "4th+ attempt", value: "4" },
  ];
}

export function OnboardingQuestionnaire({ userId, onComplete }: Props) {
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    academic_background: "",
    attempt_number: "",
    target_exam_cycle: "",
    target_exam_year: "",
    learning_style: "",
    self_assessment: {} as Record<string, string>,
    previous_marks: {} as Record<string, string>,
  });

  // Derived: is this a first-time aspirant?
  const isFirstAttempt =
    form.academic_background === "completing_class_12" ||
    form.attempt_number === "1";

  // Effective attempt number (auto-set for class 12 students)
  const effectiveAttempt =
    form.academic_background === "completing_class_12"
      ? "1"
      : form.attempt_number;

  // Eligible exam options
  const examOptions = useMemo(
    () => getEligibleExamOptions(form.academic_background),
    [form.academic_background],
  );

  // When academic background changes, reset dependent fields
  function handleBackgroundChange(v: string) {
    const newForm = { ...form, academic_background: v };
    // Auto-set attempt for class 12 students
    if (v === "completing_class_12") {
      newForm.attempt_number = "1";
      newForm.previous_marks = {};
    }
    // Reset exam selections if they become invalid
    newForm.target_exam_cycle = "";
    newForm.target_exam_year = "";
    setForm(newForm);
  }

  const steps = [
    // ─── Step 1: Academic Background + Attempt ───────────────────────
    {
      title: "Academic Background",
      subtitle: "Help us understand where you are right now",
      render: () => {
        const attemptOptions = getAttemptOptions(form.academic_background);
        return (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Your current academic status
              </p>
              <OptionButtons
                options={[
                  { label: "Completing Class 12", value: "completing_class_12" },
                  { label: "Class 12 passed", value: "class_12" },
                  { label: "Pursuing graduation", value: "graduation" },
                  { label: "Post-graduate", value: "post_graduate" },
                  { label: "Working professional", value: "working" },
                ]}
                value={form.academic_background}
                onChange={handleBackgroundChange}
              />
            </div>

            {/* Show attempt options only if not a class 12 student */}
            {form.academic_background && attemptOptions && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Which CA Foundation attempt is this?
                </p>
                <OptionButtons
                  options={attemptOptions}
                  value={form.attempt_number}
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      attempt_number: v,
                      // Clear previous marks if switching to 1st attempt
                      previous_marks: v === "1" ? {} : prev.previous_marks,
                    }));
                  }}
                />
              </div>
            )}

            {/* Auto-set message for class 12 students */}
            {form.academic_background === "completing_class_12" && (
              <InfoBanner>
                As a Class 12 student, this will be your <strong>first CA Foundation attempt</strong>.
                You can register provisionally with ICAI after Class 10, but you need to pass Class 12
                and complete a 4-month study period before appearing for the exam.
              </InfoBanner>
            )}
          </div>
        );
      },
      isValid: () =>
        !!form.academic_background &&
        (form.academic_background === "completing_class_12" || !!form.attempt_number),
    },

    // ─── Step 2: Target Exam ─────────────────────────────────────────
    {
      title: "Target Exam",
      subtitle: "When are you planning to appear for the CA Foundation exam?",
      render: () => (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Exam cycle</p>
            <OptionButtons
              options={examOptions.cycles}
              value={form.target_exam_cycle}
              onChange={(v) => setForm({ ...form, target_exam_cycle: v })}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Year</p>
            <OptionButtons
              options={examOptions.years}
              value={form.target_exam_year}
              onChange={(v) => setForm({ ...form, target_exam_year: v })}
            />
          </div>

          {form.academic_background === "completing_class_12" && (
            <InfoBanner>
              CA Foundation exams happen 3 times a year — <strong>January</strong>,{" "}
              <strong>May/June</strong>, and <strong>September</strong>. Since your board
              exams end in March-April, the earliest you can appear is{" "}
              <strong>September {new Date().getFullYear()}</strong> (with registration by
              May 1 and 4 months of study).
            </InfoBanner>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-500 space-y-1">
            <p><strong>ICAI registration rule:</strong> You must register with Board of Studies at least 4 months before the exam month.</p>
            <p><strong>Passing criteria:</strong> Minimum 40% in each paper and 50% aggregate.</p>
          </div>
        </div>
      ),
      isValid: () => !!form.target_exam_cycle && !!form.target_exam_year,
    },

    // ─── Step 3: Previous Attempts (skip for 1st attempt) ────────────
    {
      title: parseInt(effectiveAttempt) > 1 ? "Previous Attempt Details" : "Fresh Start",
      subtitle:
        parseInt(effectiveAttempt) > 1
          ? "Tell us about your last attempt — approximate marks are fine"
          : "You are starting fresh — no past performance bias!",
      render: () =>
        parseInt(effectiveAttempt) > 1 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              How did you score in each paper in your previous attempt?
            </p>
            {PAPERS.map((paper) => (
              <div key={paper.id} className="flex items-center gap-4 flex-wrap">
                <span className="text-sm text-gray-700 w-full sm:w-52 flex-shrink-0 font-medium">
                  {paper.name}
                </span>
                <OptionButtons
                  options={[
                    { label: "< 30", value: "below_30" },
                    { label: "30-39", value: "30_39" },
                    { label: "40-50", value: "40_50" },
                    { label: "50-60", value: "50_60" },
                    { label: "60+", value: "above_60" },
                    { label: "N/A", value: "na" },
                  ]}
                  value={form.previous_marks[paper.id] ?? ""}
                  onChange={(v) =>
                    setForm((prev) => ({
                      ...prev,
                      previous_marks: { ...prev.previous_marks, [paper.id]: v },
                    }))
                  }
                />
              </div>
            ))}
            <InfoBanner>
              This helps us identify which papers need the most attention. If you were
              close to 40 in any paper, we will prioritise those topics.
            </InfoBanner>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🌟</div>
            <p className="text-green-700 font-medium">
              First-time aspirants get a fresh profile with no bias from previous
              attempts. Your diagnostic test will accurately baseline your preparation
              level.
            </p>
          </div>
        ),
      isValid: () => true,
    },

    // ─── Step 4: Self-Assessment ─────────────────────────────────────
    {
      title: "Subject Self-Assessment",
      subtitle:
        form.academic_background === "completing_class_12"
          ? "How confident do you feel about these subjects from what you have learnt so far in school?"
          : "How comfortable do you feel with each CA Foundation subject? Be honest — this helps us personalise your experience",
      render: () => (
        <div className="space-y-4">
          {PAPERS.map((paper) => (
            <div key={paper.id}>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {paper.name}
              </p>
              <div className="flex gap-2 flex-wrap">
                {SELF_ASSESSMENT_LEVELS.map((level, idx) => (
                  <button
                    key={level}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        self_assessment: {
                          ...prev.self_assessment,
                          [paper.id]: level,
                        },
                      }))
                    }
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      form.self_assessment[paper.id] === level
                        ? idx <= 1
                          ? "border-red-400 bg-red-50 text-red-700"
                          : idx === 2
                          ? "border-yellow-400 bg-yellow-50 text-yellow-700"
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

          {form.academic_background === "completing_class_12" && (
            <InfoBanner>
              Do not worry if you feel weak in most subjects — CA Foundation covers
              topics you may not have studied in school. The diagnostic test will give
              you a precise starting point.
            </InfoBanner>
          )}
        </div>
      ),
      isValid: () => Object.keys(form.self_assessment).length === 4,
    },

    // ─── Step 5: Learning Style ──────────────────────────────────────
    {
      title: "Learning Style",
      subtitle:
        "How do you prefer to study? This helps us tailor resources for you",
      render: () => (
        <div className="grid gap-3">
          {[
            {
              value: "text_heavy",
              emoji: "📖",
              label: "Text-based learning",
              desc: "I prefer reading notes, ICAI material, and detailed explanations",
            },
            {
              value: "video_heavy",
              emoji: "🎥",
              label: "Video-first learning",
              desc: "I learn best by watching lectures and tutorials",
            },
            {
              value: "practice_heavy",
              emoji: "✍️",
              label: "Practice-first",
              desc: "I learn by doing — give me questions, I figure out concepts from answers",
            },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => setForm({ ...form, learning_style: style.value })}
              className={`p-4 rounded-xl border text-left transition-all ${
                form.learning_style === style.value
                  ? "border-[var(--primary)] bg-[var(--sage-light)]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{style.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {style.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {style.desc}
                  </div>
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
  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  async function handleNext() {
    if (!current.isValid()) {
      toast.error("Please complete all fields to continue");
      return;
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
      return;
    }
    // Final step — save profile and create diagnostic session
    setLoading(true);
    try {
      const attemptNum = parseInt(effectiveAttempt) || 1;

      // Upsert student profile
      const { error: profileError } = await (
        supabase.from("student_profiles") as any
      ).upsert(
        {
          user_id: userId,
          academic_background: form.academic_background,
          attempt_number: attemptNum,
          target_exam_cycle: form.target_exam_cycle as
            | "january"
            | "may"
            | "september",
          target_exam_year: parseInt(form.target_exam_year),
          previous_marks: form.previous_marks,
          self_assessment: form.self_assessment,
          learning_style: form.learning_style as
            | "text_heavy"
            | "video_heavy"
            | "practice_heavy",
          onboarding_completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (profileError) throw profileError;

      // Create diagnostic session
      const { data: sessionData, error: sessionError } = await (
        supabase.from("diagnostic_sessions") as any
      )
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
      toast.success("Questionnaire complete! Starting your diagnostic test...");
      onComplete(session.id, form.academic_background, effectiveAttempt);
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
        <div className="inline-flex items-center gap-2 bg-[var(--sage-light)] border border-[var(--border)] rounded-full px-4 py-1.5 text-sm text-[var(--teal-dark)] mb-4">
          Step {step + 1} of {totalSteps}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{current.title}</h1>
        <p className="text-gray-500 mt-1">{current.subtitle}</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2 max-w-xs mx-auto" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">{current.render()}</CardContent>
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
          {step === totalSteps - 1
            ? "Start Diagnostic Test →"
            : "Continue"}
          {step < totalSteps - 1 && (
            <ChevronRight className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Your answers are private and only used to personalise your study plan
      </p>
    </div>
  );
}
