"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is CA Saarthi really free?",
    answer:
      "Yes, 100% free. All features — diagnostic, practice questions, mock tests, AI doubt solver, and analytics — are completely free with no hidden charges.",
  },
  {
    question: "How many questions are available?",
    answer:
      "We have 2,500+ practice questions covering all 4 papers of CA Foundation — Accounting, Business Laws, Mathematics & Statistics, and Business Economics. We keep adding more questions regularly.",
  },
  {
    question: "What is the diagnostic test?",
    answer:
      "It's a one-time adaptive assessment that evaluates your current preparation level across all papers. Based on your academic background and attempt number, you get a customised 15-60 question test.",
  },
  {
    question: "Can I use this on mobile?",
    answer:
      "Yes! CA Saarthi works on all devices. You can also add it to your home screen for an app-like experience.",
  },
  {
    question: "How does the AI doubt solver work?",
    answer:
      "Our AI tutor (powered by Claude) can explain any CA Foundation concept. Just click the chat bubble or use 'Explain with AI' after practice questions.",
  },
  {
    question: "Is this affiliated with ICAI?",
    answer:
      "No. CA Saarthi is an independent preparation platform. We follow the ICAI syllabus but are not affiliated with or endorsed by ICAI.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Everything you need to know about CA Saarthi
      </p>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? "max-h-40 pb-4" : "max-h-0"
              }`}
            >
              <p className="px-6 text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
