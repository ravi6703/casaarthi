"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2, UserCircle, BookOpen, Target, Brain, ArrowRight } from "lucide-react";

type Mode = "otp" | "password";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configured = isSupabaseConfigured();
  const supabase = configured ? createClient() : null;
  const [mode, setMode] = useState<Mode>("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) toast.error(error);
  }, [searchParams]);

  const rawRedirect = searchParams.get("redirectTo") || "/dashboard";
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/dashboard";

  async function handleEmailOTP() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!email) return toast.error("Enter your email address");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
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
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setLoading(false);
    if (error) { toast.error("Invalid or expired OTP. Try again."); return; }
    toast.success("Welcome back!");
    router.push(redirectTo);
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
      toast.error(error.message.toLowerCase().includes("invalid") ? "Incorrect email or password." : error.message);
      return;
    }
    toast.success("Welcome back!");
    router.push(redirectTo);
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!email) return toast.error("Enter your email address first");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/auth/reset-password`,
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
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    });
    if (error) {
      toast.error("Google login not configured yet. Use email login instead.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-gradient-to-br from-[var(--primary)] via-[var(--teal-dark)] to-[var(--sage)] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/4 -translate-x-1/4" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">CA</div>
            <span className="font-bold text-xl">CA Saarthi</span>
          </Link>

          <h2 className="text-3xl font-bold leading-tight mb-4">Welcome back to your preparation hub</h2>
          <p className="text-white/80 text-lg leading-relaxed">Pick up right where you left off. Your study plan, analytics, and practice sessions are waiting.</p>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: <Target className="h-5 w-5" />, text: "Personalised diagnostic insights" },
            { icon: <BookOpen className="h-5 w-5" />, text: "2,500+ practice questions" },
            { icon: <Brain className="h-5 w-5" />, text: "AI-powered doubt solver" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-white/90">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 bg-[var(--background)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold">CA</div>
              <span className="font-bold text-xl text-gray-900">CA Saarthi</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-[var(--muted-foreground)] mb-8">Continue your CA Foundation preparation</p>

          {/* Mode Toggle */}
          <div className="flex bg-[var(--secondary)] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("otp"); setOtpSent(false); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "otp" ? "bg-white shadow-sm text-gray-900" : "text-[var(--muted-foreground)] hover:text-gray-700"}`}
            >
              OTP / Magic Link
            </button>
            <button
              onClick={() => setMode("password")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "password" ? "bg-white shadow-sm text-gray-900" : "text-[var(--muted-foreground)] hover:text-gray-700"}`}
            >
              Password
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-7">
            {mode === "otp" ? (
              <>
                {!otpSent ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email" type="email" placeholder="you@example.com"
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          className="pl-10" onKeyDown={(e) => e.key === "Enter" && handleEmailOTP()}
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
                      <div className="w-12 h-12 rounded-full bg-[var(--sage-light)] flex items-center justify-center mx-auto mb-3">
                        <Mail className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <p className="text-sm text-gray-600">We sent a login link to <strong>{email}</strong></p>
                      <p className="text-xs text-gray-500 mt-1">Click the link <strong>or</strong> enter the OTP below</p>
                    </div>
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp" type="text" placeholder="12345678"
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        className="mt-1.5 text-center text-2xl tracking-widest font-mono"
                        maxLength={8} onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                      />
                    </div>
                    <Button className="w-full" onClick={handleVerifyOTP} disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {loading ? "Verifying..." : "Verify & Sign In"}
                    </Button>
                    <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-[var(--muted-foreground)] hover:text-gray-700">
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
                    <Input id="email-pw" type="email" placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10" onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" onClick={handlePasswordLogin} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <button onClick={handleForgotPassword}
                  className="w-full text-sm text-[var(--primary)] hover:underline" type="button">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--border)]" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[var(--muted-foreground)]">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </Button>

            <Button variant="ghost" className="w-full mt-3 text-[var(--muted-foreground)] hover:text-gray-700"
              onClick={async () => {
                if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
                setLoading(true);
                const { error } = await supabase.auth.signInAnonymously();
                setLoading(false);
                if (error) { toast.error("Guest login not available. Please sign up instead."); return; }
                toast.success("Browsing as guest — sign up to save your progress!");
                router.push(redirectTo);
                router.refresh();
              }}
              disabled={loading}
            >
              <UserCircle className="h-4 w-4" />
              Continue as Guest
            </Button>
          </div>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">Register free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
