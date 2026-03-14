import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "CA Saarthi — Intelligent CA Foundation Exam Prep",
    template: "%s | CA Saarthi",
  },
  description:
    "India's most intelligent CA Foundation preparation platform. Diagnostic profiling, adaptive practice, full mock tests, and AI-driven study plans.",
  keywords: ["CA Foundation", "ICAI", "CA exam preparation", "mock tests", "CA Saarthi"],
  authors: [{ name: "CA Saarthi" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CA Saarthi",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased min-h-screen bg-gray-50">
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
      </body>
    </html>
  );
}
