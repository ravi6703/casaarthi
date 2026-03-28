import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = "https://www.casaarthi.in";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // Google Analytics Measurement ID

export const metadata: Metadata = {
  title: {
    default: "CA Saarthi — Free CA Foundation Exam Prep | Practice, Mock Tests & AI Tutor",
    template: "%s | CA Saarthi",
  },
  description:
    "India's free CA Foundation preparation platform. 2,500+ practice questions, AI doubt solver, diagnostic profiling & personalised study plans. Covers Accounting, Laws, Maths & Economics.",
  keywords: [
    "CA Foundation", "CA Foundation preparation", "CA Foundation mock test",
    "CA Foundation practice questions", "ICAI exam prep", "CA Saarthi",
    "CA Foundation 2026", "CA Foundation free", "CA exam study material",
    "CA Foundation accounting", "CA Foundation business laws",
    "CA Foundation maths statistics", "CA Foundation economics",
    "chartered accountant exam", "ICAI mock test", "CA Foundation online test",
  ],
  authors: [{ name: "CA Saarthi" }],
  creator: "CA Saarthi",
  publisher: "CA Saarthi",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "CA Saarthi",
    title: "CA Saarthi — Free CA Foundation Exam Prep",
    description: "2,500+ questions, AI tutor & personalised study plans. 100% free for CA Foundation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CA Saarthi — Free CA Foundation Exam Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CA Saarthi — Free CA Foundation Exam Prep",
    description: "2,500+ questions, AI tutor & personalised study plans. 100% free for CA Foundation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4A90A4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-slate-900">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "8px", background: "#1e293b", color: "#f8fafc", fontSize: "14px" },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
        </ThemeProvider>
        {/* Organization Schema */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CA Saarthi",
              "url": "https://www.casaarthi.in",
              "logo": "https://www.casaarthi.in/icon-512.png",
              "description": "India's free CA Foundation exam preparation platform",
              "email": "support@casaarthi.in",
              "sameAs": ["https://t.me/casaarthiindia"]
            }),
          }}
        />
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
