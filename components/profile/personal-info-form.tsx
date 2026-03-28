"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface Props {
  userEmail: string;
  userMetadata: Record<string, any>;
}

export function PersonalInfoForm({ userEmail, userMetadata }: Props) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: userMetadata?.full_name || "",
    phone: userMetadata?.phone || "",
    city: userMetadata?.city || "",
    college: userMetadata?.college || "",
    date_of_birth: userMetadata?.date_of_birth || "",
    icai_registration: userMetadata?.icai_registration || "",
  });

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          city: form.city,
          college: form.college,
          date_of_birth: form.date_of_birth,
          icai_registration: form.icai_registration,
        },
      });
      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-[var(--primary)]" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className={inputClass}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className={inputClass} value={userEmail} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College / Institution</label>
            <input
              type="text"
              className={inputClass}
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              placeholder="e.g. HR College of Commerce"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              className={inputClass}
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ICAI Student Registration Number <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.icai_registration}
              onChange={(e) => setForm({ ...form, icai_registration: e.target.value })}
              placeholder="e.g. WRO0123456"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
