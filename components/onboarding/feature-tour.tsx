"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Brain, CalendarDays, Trophy, BarChart2,
  FileText, MessageSquare, Sparkles, ArrowRight, ArrowLeft, X, Zap
} from "lucide-react";

const TOUR_STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to CA Saarthi!",
    description: "Your AI-powered CA Foundation exam preparation companion. Let us show you around.",
    color: "blue",
    bg: "from-[var(--primary)] to-[var(--primary)]",
  },
  {
    icon: CalendarDays,
    title: "Smart Study Plan",
    description: "Get a personalized study plan based on your exam date and pace. Daily topics are auto-assigned by priority — weakest first. You'll get daily email reminders to stay on track.",
    color: "green",
    bg: "from-green-500 to-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Practice Sessions",
    description: "6 practice modes: Topic-wise, Mixed, Weak Area Focus, Revision, Exam Simulation, and Challenge Mode. Questions are selected based on your weak areas and spaced repetition.",
    color: "purple",
    bg: "from-purple-500 to-violet-600",
  },
  {
    icon: Brain,
    title: "AI Visual Explainer",
    description: "Ask any doubt and get instant AI-powered answers with visual mind maps. Concepts become clearer with interactive diagrams you can explore.",
    color: "pink",
    bg: "from-pink-500 to-rose-600",
  },
  {
    icon: FileText,
    title: "Mock Tests & Previous Year Papers",
    description: "Full-length timed mock exams that simulate the real CA Foundation experience. Practice with actual ICAI past papers organized by year.",
    color: "orange",
    bg: "from-orange-500 to-amber-600",
  },
  {
    icon: BarChart2,
    title: "Analytics & Progress Tracking",
    description: "Track your accuracy, speed, and improvement over time. See how you compare with other students. Paper-wise and topic-wise performance breakdowns.",
    color: "cyan",
    bg: "from-cyan-500 to-teal-600",
  },
  {
    icon: Trophy,
    title: "Achievements & Streaks",
    description: "Earn badges for milestones — first 100 questions, 7-day streaks, mock test champions, and more. Daily challenges keep you motivated with XP rewards.",
    color: "yellow",
    bg: "from-yellow-500 to-orange-600",
  },
  {
    icon: MessageSquare,
    title: "Community & AI Doubts",
    description: "Get instant AI answers to any doubt, or post in the community forum for peer discussions. Never get stuck on a concept again.",
    color: "indigo",
    bg: "from-[var(--background)]0 to-[var(--primary)]",
  },
  {
    icon: Zap,
    title: "You're All Set!",
    description: "Start with your study plan — we've already set up daily reminders for you. Consistency is key to cracking CA Foundation. Let's begin!",
    color: "green",
    bg: "from-green-500 to-emerald-600",
  },
];

export function FeatureTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if tour has been completed
    const tourDone = localStorage.getItem("ca_tour_completed");
    if (!tourDone) {
      setVisible(true);
    }
  }, []);

  function handleNext() {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  }

  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }

  function handleClose() {
    localStorage.setItem("ca_tour_completed", "true");
    setVisible(false);
  }

  if (!visible) return null;

  const current = TOUR_STEPS[step];
  const Icon = current.icon;
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${current.bg} p-8 text-center relative`}>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">{current.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center leading-relaxed">{current.description}</p>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? `bg-gradient-to-r ${current.bg} w-6` : i < step ? "bg-gray-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div>
              {!isFirst && (
                <Button variant="ghost" size="sm" onClick={handlePrev}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isLast && (
                <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-400">
                  Skip Tour
                </Button>
              )}
              <Button onClick={handleNext} size="sm">
                {isLast ? "Get Started" : "Next"}
                {!isLast && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
