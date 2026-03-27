"use client";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Lock, Eye, EyeOff, Loader2, Target, BookOpen, Brain, BarChart3, Sparkles } from "lucide-react";

type Mode = "otp" | "password";

export default function RegisterPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const supabase = configured ? createClient() : null;
  const [mode, setMode] = useState<Mode>("otp");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
    if (!pw) return { level: 0, label: "", color: "" };
    const hasNumber = /\d/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    if (pw.length >= 12 && hasNumber && hasUpper && hasSpecial)
      return { level: 4, label: "Strong", color: "bg-[var(--success)]" };
    if (pw.length >= 10 && hasNumber && hasUpper)
      return { level: 3, label: "Good", color: "bg-[var(--warning)]" };
    if (pw.length >= 8 && hasNumber && hasUpper)
      return { level: 2, label: "Fair", color: "bg-orange-400" };
    if (pw.length >= 8)
      return { level: 1, label: "Weak", color: "bg-[var(--danger)]" };
    return { level: 0, label: "Too short", color: "bg-[var(--danger)]" };
  }

  async function handleRegisterOTP() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!form.name.trim()) return toast.error("Enter your full name");
    if (!form.email.trim()) return toast.error("Enter your email address");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        shouldCreateUser: true,
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("rate") || error.message.toLowerCase().includes("limit")) {
        toast.error("Too many attempts. Please wait a few minutes and try again, or use password signup.");
      } else if (error.message.toLowerCase().includes("email") || error.message.toLowerCase().includes("sending") || error.message.toLowerCase().includes("magic link")) {
        toast.error("Email delivery failed. Please try password signup instead, or contact us on Telegram.");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
      return;
    }
    setStep("otp");
    toast.success("OTP sent! Check your inbox (and spam folder).");
  }

  async function handleVerifyOTP() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email: form.email, token: otp, type: "email" });
    setLoading(false);
    if (error) { toast.error("Invalid or expired OTP. Try again."); return; }
    toast.success("Account created! Let us get you started.");
    router.push("/diagnostic");
    router.refresh();
  }

  async function handleRegisterPassword() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!form.name.trim()) return toast.error("Enter your full name");
    if (!form.email.trim()) return toast.error("Enter your email address");
    if (!form.password || form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!/\d/.test(form.password)) return toast.error("Password must include at least one number");
    if (!/[A-Z]/.test(form.password)) return toast.error("Password must include at least one uppercase letter");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (!data.session) {
      toast.success("Account created! Check your email to confirm your account, then sign in.");
      router.push("/login");
      return;
    }
    toast.success("Account created! Let us get you started.");
    router.push("/diagnostic");
    router.refresh();
  }

  async function handleGoogleRegister() {
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
      toast.error("Google login not configured yet. Use email signup instead.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-gradient-to-br from-[var(--sage)] via-[var(--primary)] to-[var(--teal-dark)] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/4 -translate-x-1/4" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">CA</div>
            <span className="font-bold text-xl">CA Saarthi</span>
          </Link>

          <h2 className="text-3xl font-bold leading-tight mb-4">Start your CA Foundation journey today</h2>
          <p className="text-white/80 text-lg leading-relaxed">Free diagnostic test, personalised study plan, and AI-powered practice — all at zero cost.</p>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: <Target className="h-5 w-5" />, title: "Smart Diagnostic", desc: "Identify your weak areas in 45 min" },
            { icon: <BookOpen className="h-5 w-5" />, title: "2,500+ Questions", desc: "All 4 papers covered" },
            { icon: <Brain className="h-5 w-5" />, title: "AI Doubt Solver", desc: "Get instant explanations" },
            { icon: <BarChart3 className="h-5 w-5" />, title: "Deep Analytics", desc: "Track accuracy & speed trends" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-sm font-medium block">{item.title}</span>
                <span className="text-xs text-white/60">{item.desc}</span>
              </div>
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

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your free account</h1>
          <p className="text-[var(--muted-foreground)] mb-8">Start with a diagnostic — know exactly where you stand</p>

          {/* Mode Toggle */}
          <div className="flex bg-[var(--secondary)] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("otp"); setStep("form"); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "otp" ? "bg-white shadow-sm text-gray-900" : "text-[var(--muted-foreground)] hover:text-gray-700"}`}
            >
              OTP / Magic Link
            </button>
            <button
              onClick={() => setMode("password")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "password" ? "bg-white shadow-sm text-gray-900" : "text-[var(--muted-foreground)] hover:text-gray-700"}`}
            >
              Set Password
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-7">
            {mode === "otp" ? (
              <>
                {step === "form" ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="name" placeholder="Priya Sharma" value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10"
                          onKeyDown={(e) => e.key === "Enter" && handleRegisterOTP()} />
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleRegisterOTP} disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {loading ? "Sending..." : "Create Account — It's Free"}
                    </Button>
                    <p className="text-xs text-[var(--muted-foreground)] text-center mt-2">
                      By registering, you agree to our{" "}
                      <Link href="/terms" className="text-[var(--primary)] hover:underline">Terms</Link>{" "}and{" "}
                      <Link href="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--sage-light)] flex items-center justify-center mx-auto mb-3">
                        <Mail className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <p className="text-sm text-gray-600">We sent a link to <strong>{form.email}</strong></p>
                      <p className="text-xs text-gray-500 mt-1">Click the link <strong>or</strong> enter the OTP below</p>
                    </div>
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input id="otp" type="text" placeholder="12345678" value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        className="mt-1.5 text-center text-2xl tracking-widest font-mono"
                        maxLength={8} onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()} />
                    </div>
                    <Button className="w-full" onClick={handleVerifyOTP} disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {loading ? "Verifying..." : "Verify & Start Diagnostic"}
                    </Button>
                    <button onClick={() => { setStep("form"); setOtp(""); }}
                      className="w-full text-sm text-[var(--muted-foreground)] hover:text-gray-700">
                      ← Change email
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name-pw">Full name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="name-pw" placeholder="Priya Sharma" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email-pw">Email address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email-pw" type="email" placeholder="you@example.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters (A-Z, 0-9)"
                      value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getPasswordStrength(form.password).color}`}
                          style={{ width: `${(getPasswordStrength(form.password).level / 4) * 100}%` }} />
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)] w-16 text-right">{getPasswordStrength(form.password).label}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="confirm" type="password" placeholder="Repeat password"
                      value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="pl-10" onKeyDown={(e) => e.key === "Enter" && handleRegisterPassword()} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleRegisterPassword} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Creating..." : "Create Account — It's Free"}
                </Button>
                <p className="text-xs text-[var(--muted-foreground)] text-center">
                  By registering, you agree to our{" "}
                  <Link href="/terms" className="text-[var(--primary)] hover:underline">Terms</Link>{" "}and{" "}
                  <Link href="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link>
                </p>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--border)]" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[var(--muted-foreground)]">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleRegister} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
