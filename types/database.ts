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
      };
      topics: {
        Row: {
          id: string;
          paper_id: number;
          name: string;
          slug: string;
          exam_weightage: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["topics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["topics"]["Row"]>;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["student_profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["student_profiles"]["Row"]>;
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
