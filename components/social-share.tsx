"use client";
import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  score: number;
  total: number;
  accuracy: number;
  label: string; // e.g. "CA Foundation Mock Test - Paper 1" or "Accounting Practice"
  type: "practice" | "mock";
}

const SITE_URL = "https://www.casaarthi.in";

export function SocialShare({ score, total, accuracy, label, type }: Props) {
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const emoji = accuracy >= 80 ? "🏆" : accuracy >= 60 ? "💪" : accuracy >= 40 ? "📚" : "🎯";
  const shareText = type === "mock"
    ? `${emoji} I scored ${accuracy}% on ${label}! ${score}/${total} correct. Preparing with CA Saarthi — India's free CA Foundation platform.`
    : `${emoji} Just completed ${total} ${label} questions with ${accuracy}% accuracy! Preparing with CA Saarthi.`;

  const shareUrl = SITE_URL;
  const hashtags = "CAFoundation,CASaarthi,CAExam";

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My CA Saarthi Score", text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
  }

  function handleTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`, "_blank");
  }

  function handleFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText + "\n" + shareUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Share Your Score Button */}
      <button
        onClick={() => setShowCard(!showCard)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--sage-light)] text-[var(--teal-dark)] text-sm font-medium hover:bg-[var(--sage-light)] transition-colors w-full justify-center"
      >
        <Share2 className="h-4 w-4" />
        Share Your Score
      </button>

      {showCard && (
        <div className="animate-slide-up">
          {/* Visual Score Card (for screenshot) */}
          <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] rounded-xl p-6 text-white text-center mb-4">
            <div className="text-sm text-white text-opacity-80 mb-1">{type === "mock" ? "Mock Test Result" : "Practice Session"}</div>
            <div className="text-lg font-medium mb-4">{label}</div>
            <div className="text-5xl font-bold mb-2">{accuracy}%</div>
            <div className="text-white text-opacity-80 text-sm">{score}/{total} correct</div>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">CA</div>
              <span className="text-xs text-white text-opacity-80">casaarthi.in</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
            <button
              onClick={handleTwitter}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              Twitter / X
            </button>
            <button
              onClick={handleFacebook}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--teal-dark)] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Facebook
            </button>
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
