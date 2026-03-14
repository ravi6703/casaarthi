"use client";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Chrome, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const supabase = configured ? createClient() : null;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleEmailOTP() {
    if (!supabase) return toast.error("Supabase not configured — add credentials to .env.local");
    if (!email) return toast.error("Enter your email address");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) {
      if (error.message.includes("User not found")) {
        toast.error("No account found. Please register first.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your email!");
  }

  async function handleVerifyOTP() {
    if (!supabase) return toast.error("Supabase not configured");
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) { toast.error("Invalid OTP. Try again."); return; }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    if (!supabase) return toast.error("Supabase not configured");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { toast.error(error.message); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">CA</div>
            <span className="font-bold text-xl text-gray-900">CA Saarthi</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to continue your preparation</p>
        </div>

        {!configured && (
          <div className="mb-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-600" />
            <span>Supabase not configured. Add credentials to <code className="font-mono">.env.local</code> to enable auth.</span>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {!otpSent ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      onKeyDown={(e) => e.key === "Enter" && handleEmailOTP()}
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleEmailOTP} loading={loading}>
                  Send OTP
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} loading={loading}>
                <Chrome className="h-4 w-4" />
                Sign in with Google
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📬</div>
                <p className="text-sm text-gray-600">We sent a 6-digit OTP to <strong>{email}</strong></p>
              </div>
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-1.5 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                />
              </div>
              <Button className="w-full" onClick={handleVerifyOTP} loading={loading}>
                Verify & Sign In
              </Button>
              <button
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Register free
          </Link>
        </p>
      </div>
    </div>
  );
}
