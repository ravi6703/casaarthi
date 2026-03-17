"use client";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Chrome, AlertTriangle, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

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
    if (pw.length >= 10 && hasNumber && hasUpper && hasSpecial)
      return { level: 4, label: "Strong", color: "bg-green-500" };
    if (pw.length >= 8 && hasNumber && hasUpper)
      return { level: 3, label: "Good", color: "bg-yellow-400" };
    if (pw.length >= 8 && hasNumber)
      return { level: 2, label: "Fair", color: "bg-orange-400" };
    if (pw.length >= 6)
      return { level: 1, label: "Weak", color: "bg-red-500" };
    return { level: 0, label: "Too short", color: "bg-red-500" };
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
      if (error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("invalid")) {
        toast.error("Email delivery failed. Try password signup instead.");
      } else {
        toast.error(error.message);
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
    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "email",
    });
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
    if (!form.password || form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    // If session is null, email confirmation is required
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">CA</div>
            <span className="font-bold text-xl text-gray-900">CA Saarthi</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start with a free diagnostic — know exactly where you stand</p>
        </div>

        {/* Warning removed — users should never see dev messages */}

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => { setMode("otp"); setStep("form"); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "otp" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            OTP / Magic Link
          </button>
          <button
            onClick={() => setMode("password")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "password" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Set Password
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {mode === "otp" ? (
            <>
              {step === "form" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Priya Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="pl-10"
                        onKeyDown={(e) => e.key === "Enter" && handleRegisterOTP()}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleRegisterOTP} disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Sending..." : "Create Account — It's Free"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    By registering, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📬</div>
                    <p className="text-sm text-gray-600">We sent a login link to <strong>{form.email}</strong></p>
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
                    {loading ? "Verifying..." : "Verify & Start Diagnostic"}
                  </Button>
                  <button
                    onClick={() => { setStep("form"); setOtp(""); }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
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
                  <Input
                    id="name-pw"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email-pw">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email-pw"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getPasswordStrength(form.password).color}`}
                        style={{ width: `${(getPasswordStrength(form.password).level / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right">{getPasswordStrength(form.password).label}</span>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="confirm">Confirm password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="pl-10"
                    onKeyDown={(e) => e.key === "Enter" && handleRegisterPassword()}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleRegisterPassword} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating..." : "Create Account — It's Free"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
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

          <Button variant="outline" className="w-full" onClick={handleGoogleRegister} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
