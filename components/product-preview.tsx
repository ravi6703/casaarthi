"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    gradient: "from-blue-600 via-blue-500 to-indigo-600",
    heading: "Your personalised command centre",
    features: [
      "Real-time progress tracking across all 4 papers",
      "Weak-area alerts so you never miss a gap",
      "Daily study streaks and target countdown",
      "One-click access to recommended next steps",
    ],
    mockElements: [
      { label: "Accounting", pct: 72 },
      { label: "Business Law", pct: 58 },
      { label: "Quantitative", pct: 81 },
      { label: "Economics", pct: 45 },
    ],
  },
  {
    id: "practice",
    label: "Practice Engine",
    gradient: "from-indigo-600 via-blue-500 to-cyan-500",
    heading: "Drill down to the exact topic you need",
    features: [
      "2,500+ questions sorted by topic & difficulty",
      "Instant detailed explanations for every answer",
      "Spaced-repetition scheduling for lasting recall",
      "Bookmark & revisit flagged questions anytime",
    ],
    mockElements: [
      { label: "Partnership Accounts", pct: 85 },
      { label: "Company Law", pct: 62 },
      { label: "Statistics", pct: 74 },
      { label: "Micro Economics", pct: 39 },
    ],
  },
  {
    id: "mocks",
    label: "Mock Tests",
    gradient: "from-violet-600 via-indigo-500 to-blue-500",
    heading: "Full-length ICAI-pattern simulations",
    features: [
      "40 mock tests — 10 per paper, timed & proctored",
      "Full-screen lock mode for real exam feel",
      "Detailed post-test analysis with percentile rank",
      "Paper-wise and topic-wise breakdowns",
    ],
    mockElements: [
      { label: "Mock Test 1", pct: 68 },
      { label: "Mock Test 2", pct: 74 },
      { label: "Mock Test 3", pct: 71 },
      { label: "Mock Test 4", pct: 80 },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    gradient: "from-blue-700 via-indigo-600 to-purple-600",
    heading: "Deep insights that guide your preparation",
    features: [
      "Accuracy, speed & consistency trends over time",
      "Topic-level heatmaps to spot weak areas instantly",
      "Comparative benchmarks against other aspirants",
      "AI-generated weekly improvement reports",
    ],
    mockElements: [
      { label: "Accuracy", pct: 76 },
      { label: "Speed", pct: 63 },
      { label: "Consistency", pct: 88 },
      { label: "Improvement", pct: 52 },
    ],
  },
];

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="bg-white border-y border-gray-200 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          See CA Saarthi in action
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore the tools that help thousands of students prepare smarter for CA Foundation
        </p>

        {/* Tab selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview card */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Mockup visual */}
          <div
            className={`relative rounded-2xl bg-gradient-to-br ${current.gradient} p-8 aspect-[4/3] flex flex-col justify-between overflow-hidden`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Mock UI header */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-white/30" />
                <div className="w-3 h-3 rounded-full bg-white/30" />
                <div className="w-3 h-3 rounded-full bg-white/30" />
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 inline-block mb-4">
                <span className="text-white/90 text-xs font-medium uppercase tracking-wide">
                  {current.label}
                </span>
              </div>
              <h3 className="text-white text-xl font-bold leading-snug">
                {current.heading}
              </h3>
            </div>

            {/* Mock progress bars */}
            <div className="relative z-10 space-y-3">
              {current.mockElements.map((el) => (
                <div key={el.label}>
                  <div className="flex justify-between text-white/80 text-xs mb-1">
                    <span>{el.label}</span>
                    <span>{el.pct}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white/80 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${el.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature list */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {current.heading}
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Everything you need, built into one seamless experience.
            </p>
            <ul className="space-y-4 mb-8">
              {current.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Try it free →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
