export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      papers: {
        Row: {
          id: number;
          code: string;
          name: string;
          format: "descriptive" | "objective";
          total_marks: number;
          duration_minutes: number;
          negative_marking: number;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["papers"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["papers"]["Row"]>;
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          paper_id: number;
          chapter_number: number;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["chapters"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["chapters"]["Row"]>;
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          paper_id: number;
          chapter_id: string | null;
          name: string;
          slug: string;
          exam_weightage: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["topics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["topics"]["Row"]>;
        Relationships: [];
      };
      sub_topics: {
        Row: {
          id: string;
          topic_id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sub_topics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sub_topics"]["Row"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          paper_id: number;
          topic_id: string;
          sub_topic_id: string;
          question_text: string;
          question_type: "mcq" | "short_answer" | "fill_blank" | "matching";
          option_a: string | null;
          option_b: string | null;
          option_c: string | null;
          option_d: string | null;
          correct_option: "a" | "b" | "c" | "d" | null;
          correct_answer_text: string | null;
          explanation: string;
          difficulty: "easy" | "medium" | "hard";
          source_type: "icai_past" | "original" | "ai_generated";
          source_year: number | null;
          concept_keywords: string[];
          status: "pending_review" | "approved" | "retired";
          is_diagnostic: boolean;
          created_by: string | null;
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["questions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["questions"]["Row"]>;
        Relationships: [];
      };
      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          academic_background: string;
          attempt_number: number;
          icai_registration_date: string | null;
          target_exam_cycle: "january" | "may" | "september";
          target_exam_year: number;
          previous_marks: Json | null;
          previous_hard_topics: string[] | null;
          self_assessment: Json;
          aptitude_data: Json | null;
          learning_style: "text_heavy" | "video_heavy" | "practice_heavy" | null;
          onboarding_completed_at: string | null;
          diagnostic_completed_at: string | null;
          diagnostic_locked_until: string | null;
          referral_code: string | null;
          referred_by: string | null;
          referral_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["student_profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["student_profiles"]["Row"]>;
        Relationships: [];
      };
      diagnostic_sessions: {
        Row: {
          id: string;
          user_id: string;
          status: "in_progress" | "completed" | "expired";
          questionnaire_data: Json | null;
          started_at: string;
          completed_at: string | null;
          expires_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["diagnostic_sessions"]["Row"], "id" | "started_at">;
        Update: Partial<Database["public"]["Tables"]["diagnostic_sessions"]["Row"]>;
        Relationships: [];
      };
      diagnostic_responses: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          selected_option: string | null;
          is_correct: boolean | null;
          time_spent_sec: number;
          answered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["diagnostic_responses"]["Row"], "id" | "answered_at">;
        Update: Partial<Database["public"]["Tables"]["diagnostic_responses"]["Row"]>;
        Relationships: [];
      };
      readiness_scores: {
        Row: {
          id: string;
          user_id: string;
          overall_score: number;
          paper_scores: Json;
          topic_scores: Json;
          sub_topic_scores: Json;
          self_assessment: Json;
          calculated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["readiness_scores"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["readiness_scores"]["Row"]>;
        Relationships: [];
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: "topic" | "mixed" | "weak_area" | "revision" | "exam_sim" | "challenge";
          paper_id: number | null;
          topic_id: string | null;
          sub_topic_id: string | null;
          status: "in_progress" | "completed" | "abandoned";
          total_questions: number;
          correct: number;
          wrong: number;
          skipped: number;
          time_spent_sec: number;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["practice_sessions"]["Row"], "id" | "started_at">;
        Update: Partial<Database["public"]["Tables"]["practice_sessions"]["Row"]>;
        Relationships: [];
      };
      practice_responses: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          user_id: string;
          selected_option: string | null;
          is_correct: boolean | null;
          time_spent_sec: number;
          is_bookmarked: boolean;
          attempt_seq: number;
          answered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["practice_responses"]["Row"], "id" | "answered_at">;
        Update: Partial<Database["public"]["Tables"]["practice_responses"]["Row"]>;
        Relationships: [];
      };
      topic_progress: {
        Row: {
          user_id: string;
          topic_id: string;
          sub_topic_id: string | null;
          total_attempted: number;
          correct: number;
          accuracy_rate: number;
          last_practiced_at: string | null;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["topic_progress"]["Row"];
        Update: Partial<Database["public"]["Tables"]["topic_progress"]["Row"]>;
        Relationships: [];
      };
      study_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["study_streaks"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["study_streaks"]["Row"]>;
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookmarks"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["bookmarks"]["Row"]>;
        Relationships: [];
      };
      mock_tests: {
        Row: {
          id: string;
          paper_id: number;
          test_number: number;
          title: string;
          difficulty_label: "warm-up" | "standard" | "exam-mode";
          unlock_condition: "always" | "after_500_questions" | "after_mock_3" | "within_60_days";
          scheduled_release_date: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["mock_tests"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["mock_tests"]["Row"]>;
        Relationships: [];
      };
      mock_test_questions: {
        Row: {
          id: string;
          mock_test_id: string;
          question_id: string;
          question_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["mock_test_questions"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["mock_test_questions"]["Row"]>;
        Relationships: [];
      };
      mock_test_attempts: {
        Row: {
          id: string;
          user_id: string;
          mock_test_id: string;
          status: "in_progress" | "completed" | "auto_submitted";
          total_score: number | null;
          percentage: number | null;
          topic_scores: Json | null;
          time_analytics: Json | null;
          fullscreen_exit_count: number;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["mock_test_attempts"]["Row"], "id" | "started_at">;
        Update: Partial<Database["public"]["Tables"]["mock_test_attempts"]["Row"]>;
        Relationships: [];
      };
      mock_test_responses: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_option: string | null;
          is_correct: boolean | null;
          time_spent_sec: number;
          marked_for_review: boolean;
          answered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["mock_test_responses"]["Row"], "id" | "answered_at">;
        Update: Partial<Database["public"]["Tables"]["mock_test_responses"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: "free" | "foundation" | "complete" | "pro";
          papers_unlocked: number[];
          valid_from: string;
          valid_until: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          type: "study_today" | "revision_alert" | "danger_flag" | "next_level" | "countdown";
          content: Json;
          generated_at: string;
          expires_at: string;
          is_seen: boolean;
          is_acted_on: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["recommendations"]["Row"], "id" | "generated_at">;
        Update: Partial<Database["public"]["Tables"]["recommendations"]["Row"]>;
        Relationships: [];
      };
      teaching_resources: {
        Row: {
          id: string;
          topic_id: string;
          resource_type: "icai_pdf" | "youtube" | "concept_card";
          title: string;
          url: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teaching_resources"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["teaching_resources"]["Row"]>;
        Relationships: [];
      };
      question_reports: {
        Row: {
          id: string;
          question_id: string;
          user_id: string;
          reason: string;
          status: "open" | "resolved" | "dismissed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["question_reports"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["question_reports"]["Row"]>;
        Relationships: [];
      };
      daily_challenges: {
        Row: {
          id: string;
          question_id: string;
          challenge_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_challenges"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["daily_challenges"]["Row"]>;
        Relationships: [];
      };
      daily_challenge_responses: {
        Row: {
          id: string;
          user_id: string;
          challenge_date: string;
          question_id: string;
          selected_option: string | null;
          is_correct: boolean | null;
          time_spent_sec: number;
          answered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_challenge_responses"]["Row"], "id" | "answered_at">;
        Update: Partial<Database["public"]["Tables"]["daily_challenge_responses"]["Row"]>;
        Relationships: [];
      };
      badge_definitions: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: "practice" | "mock" | "streak" | "milestone";
          sort_order: number;
        };
        Insert: Database["public"]["Tables"]["badge_definitions"]["Row"];
        Update: Partial<Database["public"]["Tables"]["badge_definitions"]["Row"]>;
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_badges"]["Row"], "id" | "earned_at">;
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Row"]>;
        Relationships: [];
      };
      user_xp: {
        Row: {
          user_id: string;
          total_xp: number;
          level: number;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["user_xp"]["Row"];
        Update: Partial<Database["public"]["Tables"]["user_xp"]["Row"]>;
        Relationships: [];
      };
      micro_challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          challenge_type: "speed" | "accuracy" | "volume";
          config: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["micro_challenges"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["micro_challenges"]["Row"]>;
        Relationships: [];
      };
      spaced_repetition: {
        Row: {
          user_id: string;
          topic_id: string;
          easiness_factor: number;
          interval_days: number;
          repetition_count: number;
          next_review_date: string;
          last_quality: number | null;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["spaced_repetition"]["Row"];
        Update: Partial<Database["public"]["Tables"]["spaced_repetition"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "badge_earned" | "streak_reminder" | "revision_due" | "weekly_report" | "challenge" | "system";
          title: string;
          body: string | null;
          action_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      flashcards: {
        Row: {
          id: string;
          topic_id: string;
          front_text: string;
          back_text: string;
          card_type: "definition" | "formula" | "section" | "case_law" | "concept";
          difficulty: "easy" | "medium" | "hard";
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["flashcards"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["flashcards"]["Row"]>;
        Relationships: [];
      };
      flashcard_progress: {
        Row: {
          user_id: string;
          flashcard_id: string;
          confidence: "unseen" | "again" | "hard" | "good" | "easy";
          review_count: number;
          next_review_date: string;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["flashcard_progress"]["Row"];
        Update: Partial<Database["public"]["Tables"]["flashcard_progress"]["Row"]>;
        Relationships: [];
      };
      discussions: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          paper_id: number | null;
          title: string;
          body: string;
          is_resolved: boolean;
          upvote_count: number;
          reply_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          body: string;
          topic_id?: string | null;
          paper_id?: number | null;
          is_resolved?: boolean;
          upvote_count?: number;
          reply_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["discussions"]["Row"]>;
        Relationships: [];
      };
      discussion_replies: {
        Row: {
          id: string;
          discussion_id: string;
          user_id: string;
          body: string;
          is_accepted: boolean;
          upvote_count: number;
          created_at: string;
        };
        Insert: {
          discussion_id: string;
          user_id: string;
          body: string;
          is_accepted?: boolean;
          upvote_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["discussion_replies"]["Row"]>;
        Relationships: [];
      };
      discussion_votes: {
        Row: {
          user_id: string;
          target_id: string;
          target_type: "discussion" | "reply";
          vote: number;
        };
        Insert: Database["public"]["Tables"]["discussion_votes"]["Row"];
        Update: Partial<Database["public"]["Tables"]["discussion_votes"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
