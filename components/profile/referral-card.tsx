"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  referralCode: string | null;
  referralCount: number;
}

export function ReferralCard({ referralCode: initialCode, referralCount }: Props) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) {
      // Generate code if not exists
      fetch("/api/referral")
        .then((r) => r.json())
        .then((data) => setCode(data.code))
        .catch(() => {});
    }
  }, [code]);

  const referralLink = code ? `https://www.casaarthi.in/register?ref=${code}` : "";

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `Hey! I'm preparing for CA Foundation with CA Saarthi - an AI-powered study platform. Join using my referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  if (!code) return null;

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Share2 className="h-4 w-4 text-green-600" />
          Refer a Friend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3">Share CA Saarthi with friends and earn rewards!</p>

        <div className="flex items-center gap-2 bg-white rounded-lg border border-green-200 px-3 py-2 mb-3">
          <span className="text-sm font-mono font-bold text-green-700 flex-1">{code}</span>
          <button onClick={copyLink} className="text-green-600 hover:text-green-800">
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={copyLink} className="flex-1">
            <Copy className="h-3 w-3 mr-1" /> Copy Link
          </Button>
          <Button size="sm" onClick={shareWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
            Share on WhatsApp
          </Button>
        </div>

        {referralCount > 0 && (
          <div className="flex items-center gap-2 mt-3 text-sm text-green-700">
            <Users className="h-4 w-4" />
            <span className="font-medium">{referralCount} friend{referralCount > 1 ? "s" : ""} joined!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
