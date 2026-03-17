"use client";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Chrome, AlertTriangle, Lock, Eye, EyeOff, Loader2, UserCircle } from "lucide-react";

type Mode = "otp" | "password";

export default function LoginPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const supabase = configured ? createClient() : null;
  const [mode, setMode] = useState<Mode>("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleEmailOTP() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!email) return toast.error("Enter your email address");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("not found") || error.message.toLowerCase().includes("invalid login")) {
        toast.error("No account found. Please register first.");
      } else if (error.message.toLowerCase().includes("rate") || error.message.toLowerCase().includes("limit")) {
        toast.error("Too many attempts. Please wait a few minutes and try again, or use password login.");
      } else if (error.message.toLowerCase().includes("email") || error.message.toLowerCase().includes("sending") || error.message.toLowerCase().includes("magic link")) {
        toast.error("Email delivery failed. Please try password login or contact us on Telegram.");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
      return;
    }
    setOtpSent(true);
    toast.success("Check your email! Enter the OTP code or click the magic link.");
  }

  async function handleVerifyOTP() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast.error("Invalid or expired OTP. Try again.");
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  async function handlePasswordLogin() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!email) return toast.error("Enter your email address");
    if (!password) return toast.error("Enter your password");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("invalid")) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!email) return toast.error("Enter your email address first");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password reset link sent! Check your email.");
  }

  async function handleGoogleLogin() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      toast.error("Google login not configured yet. Use email login instead.");
      setLoading(false);
    }
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

        {/* Warning removed — users should never see dev messages */}

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => { setMode("otp"); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "otp" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            OTP / Magic Link
          </button>
          <button
            onClick={() => setMode("password")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "password" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Password
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {mode === "otp" ? (
            <>
              {!otpSent ? (
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
                  <Button className="w-full" onClick={handleEmailOTP} disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📬</div>
                    <p className="text-sm text-gray-600">We sent a login link to <strong>{email}</strong></p>
                    <p className="text-xs text-gray-500 mt-1">Click the link in the email <strong>or</strong> enter the OTP code below</p>
                    <p className="text-xs text-gray-400 mt-1">Check spam/junk if not in inbox</p>
                  </div>
                  <div>
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="12345678"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      className="mt-1.5 text-center text-2xl tracking-widest font-mono"
                      maxLength={8}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                    />
                  </div>
                  <Button className="w-full" onClick={handleVerifyOTP} disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </Button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(""); }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Use a different email
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-pw">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email-pw"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full" onClick={handlePasswordLogin} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <button
                onClick={handleForgotPassword}
                className="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline"
                type="button"
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Chrome className="h-4 w-4" />
            Sign in with Google
          </Button>

          <Button
            variant="ghost"
            className="w-full mt-3 text-gray-500 hover:text-gray-700"
            onClick={async () => {
              if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
              setLoading(true);
              const { error } = await supabase.auth.signInAnonymously();
              setLoading(false);
              if (error) {
                toast.error("Guest login not available. Please sign up instead.");
                return;
              }
              toast.success("Browsing as guest — sign up to save your progress!");
              router.push("/dashboard");
              router.refresh();
            }}
            disabled={loading}
          >
            <UserCircle className="h-4 w-4" />
            Continue as Guest
          </Button>
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
