import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

interface WelcomeEmail {
  daysSinceRegistration: number;
  subject: string;
  htmlContent: (name: string) => string;
  ctaUrl: string;
  ctaText: string;
}

const welcomeSequence: WelcomeEmail[] = [
  {
    daysSinceRegistration: 0,
    subject: "🎉 Welcome to CA Saarthi! Here's how to get started",
    htmlContent: (name) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to CA Saarthi! 🎓</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Hi ${name}, let's begin your CA journey</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 32px 24px; border-radius: 0 0 12px 12px; background: #ffffff;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            We're excited to have you onboard! The first step to cracking CA Foundation is understanding your current level. Our diagnostic test will:
          </p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
            <li>Assess your strengths and areas to improve</li>
            <li>Create a personalized study plan just for you</li>
            <li>Show you exactly where to focus your efforts</li>
          </ul>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Take just 30 minutes to complete the diagnostic test and unlock your personalized learning path.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://www.casaarthi.in/diagnostic-test" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Take the Diagnostic Test →</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
            Once you complete it, we'll analyze your results and create a study plan tailored to your needs.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            You're receiving this email because you recently signed up for CA Saarthi.
          </p>
        </div>
      </div>
    `,
    ctaUrl: "https://www.casaarthi.in/diagnostic-test",
    ctaText: "Take the Diagnostic Test",
  },
  {
    daysSinceRegistration: 1,
    subject: "✨ Your personalised study plan is waiting",
    htmlContent: (name) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Your Study Plan is Ready! 📊</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Hi ${name}, let's get you started</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 32px 24px; border-radius: 0 0 12px 12px; background: #ffffff;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            Great news! We've analyzed your diagnostic test results and created a personalized study plan for you.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Your AI-powered study plan includes:
          </p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
            <li>Topics ordered by priority and difficulty</li>
            <li>Recommended study pace based on your profile</li>
            <li>Spaced repetition schedule for better retention</li>
            <li>Practice sessions targeted to your weak areas</li>
          </ul>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Start studying today and build the foundation for CA success!
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://www.casaarthi.in/study-plan" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">View Your Study Plan →</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
            Pro tip: Start with the fundamentals section for a strong foundation.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            You're receiving this email because you have an active account on CA Saarthi.
          </p>
        </div>
      </div>
    `,
    ctaUrl: "https://www.casaarthi.in/study-plan",
    ctaText: "View Your Study Plan",
  },
  {
    daysSinceRegistration: 3,
    subject: "💪 10,000+ questions are ready for you",
    htmlContent: (name) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Master CA with Our Practice Engine 🚀</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Hi ${name}, it's time to practice</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 32px 24px; border-radius: 0 0 12px 12px; background: #ffffff;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            You've completed the diagnostic test and your study plan is set. Now comes the fun part—practice!
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Our practice engine includes:
          </p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
            <li>10,000+ carefully curated questions</li>
            <li>Chapter-wise and topic-wise practice tests</li>
            <li>Full-length mock exams to simulate real conditions</li>
            <li>Detailed explanations for every answer</li>
            <li>Performance analytics to track your progress</li>
          </ul>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Start with the questions recommended in your study plan and build your confidence!
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://www.casaarthi.in/practice" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Start Practicing Now →</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
            Did you know? Students who practice regularly score 30% higher on their exams.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            You're receiving this email because you have an active account on CA Saarthi.
          </p>
        </div>
      </div>
    `,
    ctaUrl: "https://www.casaarthi.in/practice",
    ctaText: "Start Practicing",
  },
  {
    daysSinceRegistration: 7,
    subject: "🌟 Join our thriving community + exclusive mock test",
    htmlContent: (name) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Join Our Community! 👥</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Hi ${name}, let's connect you with other learners</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 32px 24px; border-radius: 0 0 12px 12px; background: #ffffff;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            You're making great progress on CA Saarthi! The best part about preparing for CA is having a supportive community around you.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Join our Telegram community where you can:
          </p>
          <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
            <li>Ask doubts and get instant help from experts</li>
            <li>Share tips and strategies with fellow aspirants</li>
            <li>Get daily motivation and success stories</li>
            <li>Participate in challenges and contests</li>
            <li>Access exclusive resources and mock tests</li>
          </ul>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
            Plus, we're sharing a special mock test with you right now to help you assess your progress!
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 32px 0;">
            <a href="https://t.me/casaarthiindia" style="display: block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;">Join Telegram →</a>
            <a href="https://www.casaarthi.in/mock-test" style="display: block; background: #e5e7eb; color: #1f2937; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;">Take Mock Test →</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
            Our community has 50,000+ active learners. Join them and accelerate your CA journey!
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            You're receiving this email because you have an active account on CA Saarthi.
          </p>
        </div>
      </div>
    `,
    ctaUrl: "https://t.me/casaarthiindia",
    ctaText: "Join Community",
  },
];

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const resend = getResend();

  try {
    // Get all users who registered within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: profiles } = await supabase
      .from("student_profiles")
      .select("user_id, created_at")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        message: "No new users to send welcome emails",
        sent: 0,
      });
    }

    let sentCount = 0;
    const results: Record<
      string,
      { email?: string; emailsSent: number; error?: string }
    > = {};

    for (const profile of profiles as any[]) {
      const userId = profile.user_id;
      const registrationDate = new Date(profile.created_at);
      const today = new Date();
      const daysSinceRegistration = Math.floor(
        (today.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);

      if (!user?.email || user.is_anonymous) {
        continue;
      }

      results[userId] = { email: user.email, emailsSent: 0 };

      const userName = user.user_metadata?.full_name || user.email.split("@")[0];

      // Send emails based on days since registration
      for (const emailTemplate of welcomeSequence) {
        if (daysSinceRegistration === emailTemplate.daysSinceRegistration) {
          try {
            await resend.emails.send({
              from: "CA Saarthi <noreply@casaarthi.in>",
              to: user.email,
              subject: emailTemplate.subject,
              html: emailTemplate.htmlContent(userName),
            });

            results[userId].emailsSent++;
            sentCount++;
          } catch (error) {
            results[userId].error = String(error);
            console.error(
              `Failed to send welcome email to ${user.email}:`,
              error
            );
          }
        }
      }
    }

    return NextResponse.json({
      message: "Welcome sequence emails processed",
      sent: sentCount,
      totalProcessed: profiles.length,
      details: results,
    });
  } catch (error) {
    console.error("Welcome sequence error:", error);
    return NextResponse.json(
      {
        error: "Failed to process welcome sequence",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
