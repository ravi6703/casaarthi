import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/faq-accordion";
import { getAllBlogs, getPlatformStats } from "@/lib/data";
import {
  Target, BookOpen, FileText, Brain, BarChart3, Shield, Sparkles,
  CheckCircle2, ArrowRight, Star, Users, Clock, Zap, GraduationCap,
  ChevronRight, TrendingUp, Phone, Mail, MessageCircle,
} from "lucide-react";

export default async function HomePage() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url") {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  const [stats, blogPosts] = await Promise.all([
    getPlatformStats(),
    getAllBlogs(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CA Saarthi",
    url: "https://www.casaarthi.in",
    description: "India's free CA Foundation preparation platform with 2,500+ questions, mock tests, AI tutor and personalised study plans.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: { "@type": "Organization", name: "CA Saarthi", url: "https://www.casaarthi.in" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Is CA Saarthi really free?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free. All features are completely free with no hidden charges." } },
      { "@type": "Question", name: "How many questions are available?", acceptedAnswer: { "@type": "Answer", text: "We have 2,500+ practice questions covering all 4 papers of CA Foundation." } },
      { "@type": "Question", name: "What is the diagnostic test?", acceptedAnswer: { "@type": "Answer", text: "A one-time adaptive assessment that evaluates your preparation level across all papers." } },
      { "@type": "Question", name: "Can I use this on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes! CA Saarthi works on all devices and can be added to your home screen." } },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ───── Sticky Nav ───── */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[var(--primary)]/25">CA</div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">CA Saarthi</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">How It Works</a>
            <a href="#papers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Papers</a>
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-700 font-medium">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] shadow-lg shadow-[var(--primary)]/25 font-medium">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ───── Hero Section ───── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--sage-light)]/60 via-[var(--background)] to-[var(--background)]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[var(--sage-light)]/40 via-[var(--amber-light)]/20 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--sage-light)] to-[var(--amber-light)] border border-[var(--sage)]/30 rounded-full px-5 py-2 text-sm text-[var(--teal-dark)] mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <span className="font-medium">100% Free Platform — No Hidden Charges</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Your smartest path to{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--sage)] to-[var(--accent)] bg-clip-text text-transparent">
              clearing CA Foundation
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered diagnostics, 2,500+ practice questions, personalised study plans, and an AI doubt solver — everything you need in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] shadow-xl shadow-[var(--primary)]/25 font-semibold">
                Start Free Diagnostic
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base border-gray-300 hover:bg-gray-50 font-medium">
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              No signup fees
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[var(--primary)]" />
              ICAI syllabus aligned
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-purple-500" />
              Built by CA aspirants, for aspirants
            </span>
          </div>
        </div>
      </section>

      {/* ───── Stats Bar ───── */}
      <section className="relative py-12 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "19.23%", label: "National Pass Rate", sub: "Jan 2026 — We help you beat the odds" },
            { value: `${stats.questionCount.toLocaleString("en-IN")}+`, label: "Practice Questions", sub: "All 4 papers covered" },
            { value: `${stats.topicCount}`, label: "Topics Covered", sub: `Across ${stats.chapterCount} chapters` },
            { value: "4", label: "AI-Powered Modules", sub: "Diagnostic, Practice, Plan & Doubt Solver" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm font-medium text-gray-300">{s.label}</div>
              <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Features Grid ───── */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[var(--sage-light)] rounded-full px-4 py-1.5 text-sm text-[var(--teal-dark)] font-medium mb-4">
              <Zap className="h-3.5 w-3.5" /> Everything You Need
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for serious CA aspirants</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Six powerful features that work together to accelerate your preparation</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Target className="h-6 w-6" />, bg: "bg-[var(--sage-light)]", iconColor: "text-[var(--primary)]", title: "Smart Diagnostic", desc: "60-question adaptive test identifies your exact weak spots across all 4 papers in just 45 minutes." },
              { icon: <BookOpen className="h-6 w-6" />, bg: "bg-emerald-50", iconColor: "text-emerald-600", title: "Practice Engine", desc: "2,500+ questions with 6 practice modes — topic drill, weak area focus, revision, exam simulation & more." },
              { icon: <FileText className="h-6 w-6" />, bg: "bg-violet-50", iconColor: "text-violet-600", title: "Mock Test Series", desc: "Full-length ICAI-pattern mocks with proctored full-screen mode, timers, and detailed performance analytics." },
              { icon: <Brain className="h-6 w-6" />, bg: "bg-amber-50", iconColor: "text-amber-600", title: "AI Study Plan", desc: "Personalised daily recommendations based on your performance, weak areas, and exam countdown." },
              { icon: <BarChart3 className="h-6 w-6" />, bg: "bg-rose-50", iconColor: "text-rose-600", title: "Deep Analytics", desc: "Track accuracy, speed, and consistency trends. Topic heatmaps and peer comparisons keep you motivated." },
              { icon: <Sparkles className="h-6 w-6" />, bg: "bg-[var(--background)]", iconColor: "text-[var(--primary)]", title: "AI Doubt Solver", desc: "Get instant explanations for any concept. Our AI tutor breaks down complex topics into simple language." },
            ].map((f) => (
              <div key={f.title} className="group bg-white rounded-2xl border border-gray-200/80 p-7 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
                <div className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                  <span className={f.iconColor}>{f.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-sm text-emerald-700 font-medium mb-4">
              <GraduationCap className="h-3.5 w-3.5" /> Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Start preparing in 3 simple steps</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">From zero to exam-ready, we guide you at every step</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Take the Diagnostic", desc: "Complete a 45-minute assessment. Our AI identifies your strengths and weak areas across all papers.", icon: <Target className="h-8 w-8 text-[var(--primary)]" />, border: "border-[var(--sage)]/40", bg: "bg-[var(--sage-light)]/50" },
              { step: "02", title: "Follow Your Plan", desc: "Get a personalised daily study plan. Practice questions, flashcards, and revision schedules — all tailored to you.", icon: <TrendingUp className="h-8 w-8 text-emerald-600" />, border: "border-emerald-200", bg: "bg-emerald-50/50" },
              { step: "03", title: "Ace the Exam", desc: "Take full-length mock tests, track your progress with analytics, and walk into the exam hall with confidence.", icon: <Star className="h-8 w-8 text-amber-600" />, border: "border-amber-200", bg: "bg-amber-50/50" },
            ].map((s) => (
              <div key={s.step} className={`relative rounded-2xl border-2 ${s.border} ${s.bg} p-8 text-center`}>
                <div className="text-5xl font-black text-gray-200 mb-4">{s.step}</div>
                <div className="flex justify-center mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Papers Section ───── */}
      <section id="papers" className="py-20 sm:py-28 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 rounded-full px-4 py-1.5 text-sm text-violet-700 font-medium mb-4">
              <BookOpen className="h-3.5 w-3.5" /> Complete Coverage
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">All 4 CA Foundation papers covered</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">Aligned with the latest ICAI syllabus and exam pattern</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { code: "P1", name: "Accounting", topics: "12 Chapters", color: "from-[var(--primary)] to-[var(--teal-dark)]", link: "/papers/accounting" },
              { code: "P2", name: "Business Laws", topics: "10 Chapters", color: "from-purple-500 to-purple-600", link: "/papers/business-laws" },
              { code: "P3", name: "Maths & Stats", topics: "14 Chapters", color: "from-emerald-500 to-emerald-600", link: "/papers/quantitative-aptitude" },
              { code: "P4", name: "Economics", topics: "11 Chapters", color: "from-amber-500 to-amber-600", link: "/papers/business-economics" },
            ].map((p) => (
              <Link key={p.code} href={p.link}>
                <div className="group bg-white rounded-2xl border border-gray-200/80 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} text-white font-bold text-sm mb-4 shadow-lg`}>
                    {p.code}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{p.topics}</p>
                  <span className="inline-flex items-center text-sm text-[var(--primary)] font-medium group-hover:gap-2 transition-all">
                    View syllabus <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Comparison Table ───── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why CA Saarthi over others?</h2>
            <p className="text-gray-600 text-lg">See how we compare with other CA Foundation prep options</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-5 font-medium text-gray-500">Feature</th>
                  <th className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-[var(--sage-light)] text-[var(--teal-dark)] rounded-lg px-3 py-1.5 font-bold text-xs">CA Saarthi</span>
                  </th>
                  <th className="py-4 px-4 font-medium text-gray-500 text-center">Coaching</th>
                  <th className="py-4 px-4 font-medium text-gray-500 text-center">Other Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: "Cost", us: "Free forever", coaching: "15,000-50,000+", others: "500-5,000/mo" },
                  { feature: "AI Diagnostic", us: true, coaching: false, others: false },
                  { feature: "Personalised Study Plan", us: true, coaching: false, others: "Limited" },
                  { feature: "Practice Questions", us: "2,500+", coaching: "Varies", others: "500-2,000" },
                  { feature: "Full-Length Mocks", us: `${stats.mockTestCount}+ available`, coaching: "5-10", others: "5-15" },
                  { feature: "AI Doubt Solver", us: true, coaching: false, others: false },
                  { feature: "Performance Analytics", us: true, coaching: false, others: "Basic" },
                  { feature: "Available 24/7", us: true, coaching: false, others: true },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-5 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      {row.us === true ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <span className="font-semibold text-[var(--teal-dark)]">{row.us}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center text-gray-500">
                      {row.coaching === true ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : row.coaching === false ? <span className="text-gray-300">--</span> : row.coaching}
                    </td>
                    <td className="py-3.5 px-4 text-center text-gray-500">
                      {row.others === true ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : row.others === false ? <span className="text-gray-300">--</span> : row.others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───── CTA Banner ───── */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary)] via-[var(--teal-dark)] to-[var(--sage)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start your CA journey?</h2>
          <p className="text-white text-opacity-90 text-lg mb-8 max-w-xl mx-auto">
            Join students already preparing smarter. Completely free, forever.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[var(--teal-dark)] hover:bg-gray-50 shadow-xl px-10 h-13 text-base font-semibold">
              Create Free Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <p className="text-white/70 text-sm mt-4">Takes less than 30 seconds</p>
        </div>
      </section>

      {/* ───── Blog ───── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">From Our Blog</h2>
            <p className="text-gray-600 text-lg">Expert tips and strategies for CA Foundation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(post.keywords ?? []).slice(0, 2).map((kw: string) => (
                      <span key={kw} className="text-xs bg-[var(--sage-light)] text-[var(--teal-dark)] px-2.5 py-1 rounded-full font-medium">{kw}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 flex-1 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/blog">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 font-medium">
                View All Articles <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <div className="bg-gray-50/50">
        <FAQAccordion />
      </div>

      {/* ───── Support Section ───── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Help?</h2>
          <p className="text-gray-600 mb-8">Our team is here to help you with any issues or questions</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:support@casaarthi.in" className="flex items-center gap-3 bg-gray-50 rounded-xl px-6 py-4 hover:bg-gray-100 transition-colors border border-gray-200">
              <Mail className="h-5 w-5 text-[var(--primary)]" />
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Email Support</div>
                <div className="text-xs text-gray-500">support@casaarthi.in</div>
              </div>
            </a>
            <a href="https://t.me/casaarthiindia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-50 rounded-xl px-6 py-4 hover:bg-gray-100 transition-colors border border-gray-200">
              <MessageCircle className="h-5 w-5 text-[var(--primary)]" />
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Telegram Community</div>
                <div className="text-xs text-gray-500">Join our student group</div>
              </div>
            </a>
            <a href="https://instagram.com/casaarthi.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-50 rounded-xl px-6 py-4 hover:bg-gray-100 transition-colors border border-gray-200">
              <Phone className="h-5 w-5 text-pink-600" />
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Instagram DM</div>
                <div className="text-xs text-gray-500">@casaarthi.in</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] flex items-center justify-center text-white font-bold text-sm">CA</div>
                <span className="font-bold text-lg text-white">CA Saarthi</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                India&apos;s free CA Foundation preparation platform. Smart diagnostics, AI-powered practice, and full-length mock tests.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a href="https://instagram.com/casaarthi.in" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://youtube.com/@casaarthi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://t.me/casaarthiindia" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[var(--primary)] transition-colors" aria-label="Telegram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
                <a href="https://x.com/casaarthi_in" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="X (Twitter)">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Diagnostic Test</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Practice Questions</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Mock Tests</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">AI Study Plan</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Papers</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/papers/accounting" className="hover:text-white transition-colors">P1: Accounting</Link></li>
                <li><Link href="/papers/business-laws" className="hover:text-white transition-colors">P2: Business Laws</Link></li>
                <li><Link href="/papers/quantitative-aptitude" className="hover:text-white transition-colors">P3: Maths & Stats</Link></li>
                <li><Link href="/papers/business-economics" className="hover:text-white transition-colors">P4: Economics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
              <h4 className="text-white font-semibold mt-6 mb-3 text-sm uppercase tracking-wide">Support</h4>
              <a href="mailto:support@casaarthi.in" className="text-sm hover:text-white transition-colors">support@casaarthi.in</a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} CA Saarthi. All rights reserved.</p>
            <p className="text-gray-500">Built for Indian CA Foundation aspirants. Not affiliated with ICAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
