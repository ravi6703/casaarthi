"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getDailyQuote } from "@/lib/quotes";

export function DailyQuote() {
  const [show, setShow] = useState(false);
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("ca_quote_last_shown");
    if (lastShown !== today) {
      setQuote(getDailyQuote());
      setShow(true);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem("ca_quote_last_shown", new Date().toDateString());
    setShow(false);
  }

  if (!show || !quote) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Card */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative p-8 pt-10">
          {/* Quote icon */}
          <div className="text-6xl text-white/20 font-serif leading-none mb-4">&ldquo;</div>

          {/* Quote text */}
          <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
            {quote.text}
          </p>

          {/* Author */}
          <p className="text-blue-200 text-sm font-medium">— {quote.author}</p>

          {/* CTA */}
          <button
            onClick={handleDismiss}
            className="mt-8 w-full bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Let&apos;s Go! Start Studying 🚀
          </button>

          {/* Branding */}
          <p className="text-center text-white/30 text-xs mt-4">CA Saarthi — Your daily dose of motivation</p>
        </div>
      </div>
    </div>
  );
}
