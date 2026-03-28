import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy | CA Saarthi",
  description: "CA Saarthi's privacy policy. Learn how we collect, use, and protect your personal data on our free CA Foundation exam preparation platform.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">CA</div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              CA Saarthi (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, store, and share your personal
              information when you use our platform at{" "}
              <span className="font-medium">www.casaarthi.in</span>. By using the Platform, you
              consent to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account information:</strong> Name, email address, and password when you register.</li>
              <li><strong>Profile information:</strong> Optional details such as your exam attempt date, city, and study preferences.</li>
              <li><strong>Support communications:</strong> Messages you send to us for help or feedback.</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Usage data:</strong> Pages visited, features used, questions attempted, test scores, time spent, and study patterns.</li>
              <li><strong>Device information:</strong> Browser type, operating system, screen resolution, and device type.</li>
              <li><strong>Log data:</strong> IP address, access timestamps, and referring URLs.</li>
              <li><strong>Cookies and local storage:</strong> Session tokens and user preferences (see Section 5).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, maintain, and improve the Platform and its features.</li>
              <li>Generate personalised study plans, recommendations, and diagnostic reports.</li>
              <li>Power AI-driven features such as the doubt solver and adaptive practice engine.</li>
              <li>Display your performance analytics, leaderboard rankings, and progress tracking.</li>
              <li>Send important service-related notifications (e.g., exam reminders, feature updates).</li>
              <li>Analyse aggregate usage patterns to improve content quality and platform experience.</li>
              <li>Detect and prevent fraud, abuse, or security incidents.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services to operate the Platform:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Supabase:</strong> Cloud database and authentication provider. Your account data,
                study progress, and test records are stored on Supabase infrastructure. Supabase processes
                data in compliance with their privacy policy and applicable data protection laws.
              </li>
              <li>
                <strong>Anthropic (Claude AI):</strong> Powers our AI-driven features including study
                plan generation, doubt solving, and question explanations. When you interact with AI
                features, relevant context (such as your question or topic) is sent to Anthropic&apos;s
                API for processing. Anthropic does not use this data to train their models.
              </li>
              <li>
                <strong>Google Analytics:</strong> We use Google Analytics to understand aggregate
                usage patterns and improve the Platform. This may collect anonymised browsing data.
              </li>
              <li>
                <strong>Vercel:</strong> Our hosting provider. Vercel processes web requests and may
                log IP addresses and request metadata for security and performance purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies &amp; Local Storage</h2>
            <p className="mb-2">We use the following types of cookies and browser storage:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential cookies:</strong> Required for authentication, session management, and security. These cannot be disabled.</li>
              <li><strong>Functional storage:</strong> Stores your preferences such as theme settings and last-visited pages.</li>
              <li><strong>Analytics cookies:</strong> Google Analytics cookies that help us understand usage patterns. You can opt out via your browser settings or Google&apos;s opt-out tool.</li>
            </ul>
            <p className="mt-2">
              We do not use advertising cookies or sell your data to advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including
              encryption in transit (TLS/HTTPS), secure authentication via Supabase Auth with
              Row-Level Security (RLS) policies, and regular security reviews. However, no method
              of transmission or storage is 100% secure. We cannot guarantee absolute security of
              your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
            <p>
              We retain your account data and study progress for as long as your account is active.
              If you delete your account, we will remove your personal data within 30 days, except
              where retention is required by law or for legitimate business purposes (e.g., anonymised
              aggregate analytics). Anonymised data that cannot identify you may be retained
              indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="mb-2">
              Under applicable data protection laws, including the Indian Digital Personal Data
              Protection Act (DPDPA) 2023 and the EU General Data Protection Regulation (GDPR)
              where applicable, you have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Right to access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
              <li><strong>Right to erasure:</strong> Request deletion of your personal data and account.</li>
              <li><strong>Right to data portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong>Right to withdraw consent:</strong> Withdraw consent for optional data processing at any time.</li>
              <li><strong>Right to grievance redressal:</strong> Lodge a complaint with the relevant Data Protection Board or supervisory authority.</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@casaarthi.in" className="text-[var(--primary)] hover:underline">
                privacy@casaarthi.in
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
            <p>
              The Platform is intended for students preparing for the CA Foundation exam, who are
              typically 17 years and older. We do not knowingly collect personal data from children
              under 13. If we become aware that we have collected data from a child under 13, we will
              take steps to delete it promptly. Users between 13 and 18 should have parental or
              guardian consent before using the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make significant changes,
              we will notify you via email or a prominent notice on the Platform. Your continued use
              of the Platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your
              personal data, please contact us:
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li>Email: <a href="mailto:privacy@casaarthi.in" className="text-[var(--primary)] hover:underline">privacy@casaarthi.in</a></li>
              <li>Platform: <a href="https://www.casaarthi.in" className="text-[var(--primary)] hover:underline">www.casaarthi.in</a></li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
