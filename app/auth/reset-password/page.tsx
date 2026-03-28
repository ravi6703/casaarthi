"use client";
import { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const supabase = configured ? createClient() : null;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const [checking, setChecking] = useState(true);

  // Verify the user has a valid session (from reset email link)
  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        router.push("/login");
      } else {
        setSessionValid(true);
      }
      setChecking(false);
    });
  }, [supabase, router]);

  async function handleResetPassword() {
    if (!supabase) return toast.error("Service temporarily unavailable. Please try again later.");
    if (!password || password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!/\d/.test(password)) return toast.error("Password must include at least one number");
    if (!/[A-Z]/.test(password)) return toast.error("Password must include at least one uppercase letter");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated successfully!");
    router.push("/dashboard");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!sessionValid) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold">CA</div>
            <span className="font-bold text-xl text-gray-900">CA Saarthi</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-1">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters (A-Z, 0-9)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <div>
              <Label htmlFor="confirm">Confirm new password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleResetPassword} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
