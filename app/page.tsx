import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/faq-accordion";
import { ProductPreview } from "@/components/product-preview";
import { BLOG_POSTS } from "@/lib/blog-data";

export default async function HomePage() {
  // Only check auth if Supabase is configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url") {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CA Saarthi",
    url: "https://www.casaarthi.in",
    description: "India's #1 free CA Foundation preparation platform with 10,000+ questions, 40 mock tests, AI tutor and personalised study plans.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    provider: {
      "@type": "Organization",
      name: "CA Saarthi",
      url: "https://www.casaarthi.in",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CA</div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Blog
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Built for CA Foundation 2026 aspirants
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Know exactly where you stand.<br />
          <span className="text-blue-600">Study smarter. Pass faster.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          CA Saarthi combines a personalised diagnostic, 10,000+ practice questions,
          40 full-length mock tests, and AI-driven study plans — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto px-8">Start Free Diagnostic →</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">I already have an account</Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">Free to start · No credit card required</p>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "19.23%", label: "National pass rate Jan 2026", sub: "Our target: 35%+" },
            { value: "10,000+", label: "Practice questions", sub: "Across all 4 papers" },
            { value: "40", label: "Full mock tests", sub: "10 per paper, ICAI-pattern" },
            { value: "500+", label: "Students already preparing", sub: "Join the growing community" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-blue-600 mb-1">{s.value}</div>
              <div className="text-sm font-medium text-gray-900">{s.label}</div>
              <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Module cards */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Your complete preparation journey</h2>
        <p className="text-center text-gray-600 mb-12">Four intelligent modules that work together</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🎯", step: "M1", title: "Diagnostic & Profiling", desc: "60-question test across all 4 papers. Identifies your exact weak spots within 45 minutes." },
            { icon: "📚", step: "M2", title: "Practice Engine", desc: "10,000+ questions. Topic-level drill-down, spaced revision, and instant explanations." },
            { icon: "📝", step: "M3", title: "Mock Test Series", desc: "40 full-length ICAI-pattern mocks with full-screen lock, timers, and deep analytics." },
            { icon: "🤖", step: "M4", title: "AI Study Plan", desc: "Daily personalised recommendations based on your performance and exam countdown." },
          ].map((m) => (
            <div key={m.step} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{m.icon}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{m.step}</div>
              <h3 className="font-bold text-gray-900 mb-2">{m.title}</h3>
              <p className="text-sm text-gray-600">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Preview */}
      <ProductPreview />

      {/* Free Platform */}
      <section className="bg-gray-50 border-t border-gray-200 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">100% Free. No catches.</h2>
          <p className="text-gray-600 mb-10">Everything you need to prepare for CA Foundation — completely free, forever.</p>
          <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg shadow-blue-100 p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold text-blue-600 mb-2">₹0</div>
            <div className="text-lg font-medium text-gray-900 mb-6">Full Access</div>
            <ul className="space-y-3 text-left mb-8">
              {[
                "Diagnostic & Aptitude Assessment",
                "10,000+ practice questions",
                "All mock tests",
                "Full analytics & dashboard",
                "AI-driven study plans",
                "Study resources & notes",
              ].map((f) => (
                <li key={f} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button className="w-full" size="lg">Get Started Free →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">From Our Blog</h2>
        <p className="text-center text-gray-600 mb-12">Expert tips and strategies to ace your CA Foundation exam</p>
        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.keywords.slice(0, 2).map((kw) => (
                    <span key={kw} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-600 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/blog">
            <Button variant="outline">View All Articles →</Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CA</div>
                <span className="font-bold text-lg text-white">CA Saarthi</span>
              </div>
              <p className="text-sm leading-relaxed">
                India&apos;s free CA Foundation preparation platform. Smart diagnostics, practice, and mock tests.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Diagnostic Test</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Practice Questions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mock Tests</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Study Plan</a></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Papers */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Papers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/papers/accounting" className="hover:text-white transition-colors">Paper 1: Accounting</Link></li>
                <li><Link href="/papers/business-laws" className="hover:text-white transition-colors">Paper 2: Business Laws</Link></li>
                <li><Link href="/papers/quantitative-aptitude" className="hover:text-white transition-colors">Paper 3: Quant & Stats</Link></li>
                <li><Link href="/papers/business-economics" className="hover:text-white transition-colors">Paper 4: Economics</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@casaarthi.in" className="hover:text-white transition-colors">
                    support@casaarthi.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CA Saarthi. All rights reserved. Not affiliated with ICAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
