import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service | CA Saarthi",
  description: "Terms of service for CA Saarthi, India's free CA Foundation exam preparation platform. Read about usage terms, user responsibilities, and content policies.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CA Saarthi (&quot;the Platform&quot;), operated at{" "}
              <span className="font-medium">www.casaarthi.in</span>, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              CA Saarthi is a free educational technology platform designed to help students prepare
              for the CA Foundation examination conducted by ICAI. The Platform provides diagnostic
              assessments, practice questions, mock tests, AI-powered study recommendations, and
              related study resources. CA Saarthi is not affiliated with, endorsed by, or officially
              connected to ICAI in any way.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must be at least 13 years of age to create an account. Users under 18 should have parental or guardian consent.</li>
              <li>One person may maintain only one account. Duplicate or fraudulent accounts may be terminated.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Acceptable Use</h2>
            <p className="mb-2">When using the Platform, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Copy, reproduce, distribute, or publicly display any content from the Platform without prior written permission.</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code from the Platform.</li>
              <li>Use automated tools, bots, or scrapers to access the Platform or extract data.</li>
              <li>Share your account credentials with others or allow others to access your account.</li>
              <li>Engage in any activity that disrupts or interferes with the Platform&apos;s functionality.</li>
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Content &amp; Intellectual Property</h2>
            <p>
              All content on the Platform -- including questions, explanations, mock tests, study
              materials, AI-generated recommendations, logos, and design elements -- is the
              intellectual property of CA Saarthi or its licensors. You are granted a limited,
              non-exclusive, non-transferable licence to access and use the content solely for
              personal, non-commercial educational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. AI-Generated Content</h2>
            <p>
              The Platform uses artificial intelligence to generate study plans, explanations, and
              recommendations. While we strive for accuracy, AI-generated content may occasionally
              contain errors. You should verify critical information with official ICAI study materials
              and consult qualified professionals where appropriate. AI-generated content does not
              constitute professional advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>
              The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties
              of any kind, whether express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or non-infringement. We do not
              guarantee that the Platform will be uninterrupted, error-free, or secure. We do not
              guarantee any specific exam results or outcomes from using the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, CA Saarthi and its founders,
              employees, and affiliates shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to loss of data, loss of
              profits, or exam failure, arising out of or related to your use of the Platform. Our
              total liability for any claims shall not exceed the amount you have paid to use the
              Platform (which, for free users, is zero).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Modifications to the Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Platform at
              any time, with or without notice. We may also update these Terms of Service from time
              to time. Continued use of the Platform after changes constitutes acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion if you
              violate these Terms of Service or engage in behaviour that is harmful to other users
              or the Platform. Upon termination, your right to use the Platform ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws
              of India. Any disputes arising under these terms shall be subject to the exclusive
              jurisdiction of the courts in Jaipur, Rajasthan, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@casaarthi.in" className="text-[var(--primary)] hover:underline">
                support@casaarthi.in
              </a>.
            </p>
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
