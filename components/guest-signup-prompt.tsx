"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isAnonymous: boolean;
}

const GUEST_VIEW_LIMIT = 5; // Show popup after 5 page views
const GUEST_TIME_LIMIT = 3 * 60 * 1000; // Or after 3 minutes

export function GuestSignupPrompt({ isAnonymous }: Props) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isAnonymous || dismissed) return;

    // Track page views
    const views = parseInt(localStorage.getItem("ca_guest_views") || "0") + 1;
    localStorage.setItem("ca_guest_views", String(views));

    // Check if limit reached
    if (views >= GUEST_VIEW_LIMIT) {
      setShow(true);
      return;
    }

    // Time-based trigger
    const timer = setTimeout(() => {
      setShow(true);
    }, GUEST_TIME_LIMIT);

    return () => clearTimeout(timer);
  }, [isAnonymous, dismissed]);

  if (!show || !isAnonymous) return null;

  function handleDismiss() {
    setDismissed(true);
    setShow(false);
    // Only allow one dismiss, show again on next page
    localStorage.setItem("ca_guest_dismissed", "1");
  }

  function handleSignUp() {
    router.push("/register");
  }

  function handleLogin() {
    router.push("/login");
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 animate-fade-in">
      {/* Backdrop — blocks interaction */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close — only if they haven't dismissed before */}
        {!localStorage.getItem("ca_guest_dismissed") && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] p-6 text-white text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold">Create Your Free Account</h2>
          <p className="text-white text-opacity-80 text-sm mt-2">
            Sign up to save your progress, track your scores, and get personalised study plans.
          </p>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <ul className="space-y-3 mb-6">
            {[
              "Save your practice progress forever",
              "Get personalised study plans",
              "Track your readiness score",
              "Compete on the leaderboard",
              "Access AI-powered doubt solver",
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500 flex-shrink-0">✓</span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <Button onClick={handleSignUp} className="w-full" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up Free
            </Button>
            <Button onClick={handleLogin} variant="outline" className="w-full" size="lg">
              <LogIn className="h-4 w-4 mr-2" />
              I Have an Account
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            100% free · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
