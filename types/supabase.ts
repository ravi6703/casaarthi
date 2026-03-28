export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      badge_definitions: {
        Row: {
          category: string
          description: string
          icon: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          description: string
          icon: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string
          content: string
          excerpt: string
          id: string
          is_published: boolean
          keywords: string[] | null
          meta_description: string
          published_at: string
          read_time: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          content: string
          excerpt: string
          id?: string
          is_published?: boolean
          keywords?: string[] | null
          meta_description: string
          published_at?: string
          read_time?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          keywords?: string[] | null
          meta_description?: string
          published_at?: string
          read_time?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          chapter_number: number | null
          created_at: string
          id: string
          name: string
          paper_id: number
          slug: string
          sort_order: number
        }
        Insert: {
          chapter_number?: number | null
          created_at?: string
          id?: string
          name: string
          paper_id: number
          slug: string
          sort_order?: number
        }
        Update: {
          chapter_number?: number | null
          created_at?: string
          id?: string
          name?: string
          paper_id?: number
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapters_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenge_responses: {
        Row: {
          answered_at: string
          challenge_date: string
          id: string
          is_correct: boolean | null
          question_id: string
          selected_option: string | null
          time_spent_sec: number
          user_id: string
        }
        Insert: {
          answered_at?: string
          challenge_date: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          selected_option?: string | null
          time_spent_sec?: number
          user_id: string
        }
        Update: {
          answered_at?: string
          challenge_date?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          selected_option?: string | null
          time_spent_sec?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenge_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          created_at: string
          id: string
          question_id: string
        }
        Insert: {
          challenge_date: string
          created_at?: string
          id?: string
          question_id: string
        }
        Update: {
          challenge_date?: string
          created_at?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenges_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_responses: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean | null
          question_id: string
          selected_option: string | null
          session_id: string
          time_spent_sec: number
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          selected_option?: string | null
          session_id: string
          time_spent_sec?: number
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          selected_option?: string | null
          session_id?: string
          time_spent_sec?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_sessions: {
        Row: {
          completed_at: string | null
          expires_at: string
          id: string
          questionnaire_data: Json | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          expires_at?: string
          id?: string
          questionnaire_data?: Json | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          expires_at?: string
          id?: string
          questionnaire_data?: Json | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          body: string
          created_at: string
          discussion_id: string
          id: string
          is_accepted: boolean
          upvote_count: number
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          discussion_id: string
          id?: string
          is_accepted?: boolean
          upvote_count?: number
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_accepted?: boolean
          upvote_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_votes: {
        Row: {
          target_id: string
          target_type: string
          user_id: string
          vote: number
        }
        Insert: {
          target_id: string
          target_type: string
          user_id: string
          vote: number
        }
        Update: {
          target_id?: string
          target_type?: string
          user_id?: string
          vote?: number
        }
        Relationships: []
      }
      discussions: {
        Row: {
          body: string
          created_at: string
          id: string
          is_resolved: boolean
          paper_id: number | null
          reply_count: number
          title: string
          topic_id: string | null
          updated_at: string
          upvote_count: number
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          paper_id?: number | null
          reply_count?: number
          title: string
          topic_id?: string | null
          updated_at?: string
          upvote_count?: number
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          paper_id?: number | null
          reply_count?: number
          title?: string
          topic_id?: string | null
          updated_at?: string
          upvote_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussions_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_progress: {
        Row: {
          confidence: string
          flashcard_id: string
          next_review_date: string
          review_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: string
          flashcard_id: string
          next_review_date?: string
          review_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: string
          flashcard_id?: string
          next_review_date?: string
          review_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back_text: string
          card_type: string
          created_at: string
          difficulty: string
          front_text: string
          id: string
          is_active: boolean
          sort_order: number
          topic_id: string
        }
        Insert: {
          back_text: string
          card_type?: string
          created_at?: string
          difficulty?: string
          front_text: string
          id?: string
          is_active?: boolean
          sort_order?: number
          topic_id: string
        }
        Update: {
          back_text?: string
          card_type?: string
          created_at?: string
          difficulty?: string
          front_text?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_challenges: {
        Row: {
          challenge_type: string
          config: Json
          created_at: string
          description: string
          id: string
          is_active: boolean
          title: string
        }
        Insert: {
          challenge_type: string
          config?: Json
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          title: string
        }
        Update: {
          challenge_type?: string
          config?: Json
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          title?: string
        }
        Relationships: []
      }
      mock_test_attempts: {
        Row: {
          completed_at: string | null
          fullscreen_exit_count: number
          id: string
          mock_test_id: string
          percentage: number | null
          started_at: string
          status: string
          time_analytics: Json | null
          topic_scores: Json | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          fullscreen_exit_count?: number
          id?: string
          mock_test_id: string
          percentage?: number | null
          started_at?: string
          status?: string
          time_analytics?: Json | null
          topic_scores?: Json | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          fullscreen_exit_count?: number
          id?: string
          mock_test_id?: string
          percentage?: number | null
          started_at?: string
          status?: string
          time_analytics?: Json | null
          topic_scores?: Json | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_attempts_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_test_questions: {
        Row: {
          id: string
          mock_test_id: string
          question_id: string
          question_order: number
        }
        Insert: {
          id?: string
          mock_test_id: string
          question_id: string
          question_order: number
        }
        Update: {
          id?: string
          mock_test_id?: string
          question_id?: string
          question_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_questions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_test_responses: {
        Row: {
          answered_at: string
          attempt_id: string
          id: string
          is_correct: boolean | null
          marked_for_review: boolean
          question_id: string
          selected_option: string | null
          time_spent_sec: number
        }
        Insert: {
          answered_at?: string
          attempt_id: string
          id?: string
          is_correct?: boolean | null
          marked_for_review?: boolean
          question_id: string
          selected_option?: string | null
          time_spent_sec?: number
        }
        Update: {
          answered_at?: string
          attempt_id?: string
          id?: string
          is_correct?: boolean | null
          marked_for_review?: boolean
          question_id?: string
          selected_option?: string | null
          time_spent_sec?: number
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_responses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "mock_test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          created_at: string
          difficulty_label: string
          id: string
          is_active: boolean
          paper_id: number
          scheduled_release_date: string | null
          test_number: number
          title: string
          unlock_condition: string
        }
        Insert: {
          created_at?: string
          difficulty_label?: string
          id?: string
          is_active?: boolean
          paper_id: number
          scheduled_release_date?: string | null
          test_number: number
          title: string
          unlock_condition?: string
        }
        Update: {
          created_at?: string
          difficulty_label?: string
          id?: string
          is_active?: boolean
          paper_id?: number
          scheduled_release_date?: string | null
          test_number?: number
          title?: string
          unlock_condition?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_tests_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      papers: {
        Row: {
          code: string
          description: string | null
          duration_minutes: number
          format: string
          id: number
          name: string
          negative_marking: number
          passing_marks: number | null
          question_type: string | null
          short_name: string | null
          slug: string | null
          sort_order: number
          total_marks: number
          total_questions: number | null
        }
        Insert: {
          code: string
          description?: string | null
          duration_minutes: number
          format: string
          id?: number
          name: string
          negative_marking?: number
          passing_marks?: number | null
          question_type?: string | null
          short_name?: string | null
          slug?: string | null
          sort_order?: number
          total_marks?: number
          total_questions?: number | null
        }
        Update: {
          code?: string
          description?: string | null
          duration_minutes?: number
          format?: string
          id?: number
          name?: string
          negative_marking?: number
          passing_marks?: number | null
          question_type?: string | null
          short_name?: string | null
          slug?: string | null
          sort_order?: number
          total_marks?: number
          total_questions?: number | null
        }
        Relationships: []
      }
      practice_responses: {
        Row: {
          answered_at: string
          attempt_seq: number
          id: string
          is_bookmarked: boolean
          is_correct: boolean | null
          question_id: string
          selected_option: string | null
          session_id: string
          time_spent_sec: number
          user_id: string
        }
        Insert: {
          answered_at?: string
          attempt_seq?: number
          id?: string
          is_bookmarked?: boolean
          is_correct?: boolean | null
          question_id: string
          selected_option?: string | null
          session_id: string
          time_spent_sec?: number
          user_id: string
        }
        Update: {
          answered_at?: string
          attempt_seq?: number
          id?: string
          is_bookmarked?: boolean
          is_correct?: boolean | null
          question_id?: string
          selected_option?: string | null
          session_id?: string
          time_spent_sec?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          completed_at: string | null
          correct: number
          id: string
          paper_id: number | null
          session_type: string
          skipped: number
          started_at: string
          status: string
          sub_topic_id: string | null
          subjective_score: number | null
          subjective_total: number | null
          time_spent_sec: number
          topic_id: string | null
          total_questions: number
          user_id: string
          wrong: number
        }
        Insert: {
          completed_at?: string | null
          correct?: number
          id?: string
          paper_id?: number | null
          session_type: string
          skipped?: number
          started_at?: string
          status?: string
          sub_topic_id?: string | null
          subjective_score?: number | null
          subjective_total?: number | null
          time_spent_sec?: number
          topic_id?: string | null
          total_questions?: number
          user_id: string
          wrong?: number
        }
        Update: {
          completed_at?: string | null
          correct?: number
          id?: string
          paper_id?: number | null
          session_type?: string
          skipped?: number
          started_at?: string
          status?: string
          sub_topic_id?: string | null
          subjective_score?: number | null
          subjective_total?: number | null
          time_spent_sec?: number
          topic_id?: string | null
          total_questions?: number
          user_id?: string
          wrong?: number
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_sessions_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reports: {
        Row: {
          created_at: string
          id: string
          question_id: string
          reason: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          reason: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          reason?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_reports_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          concept_keywords: string[] | null
          correct_answer_text: string | null
          correct_option: string | null
          created_at: string
          created_by: string | null
          difficulty: string
          explanation: string
          id: string
          is_diagnostic: boolean
          marking_rubric: Json | null
          max_marks: number | null
          model_answer: string | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          paper_id: number
          question_text: string
          question_type: string
          reviewed_by: string | null
          source_type: string
          source_year: number | null
          status: string
          sub_topic_id: string | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          concept_keywords?: string[] | null
          correct_answer_text?: string | null
          correct_option?: string | null
          created_at?: string
          created_by?: string | null
          difficulty: string
          explanation: string
          id?: string
          is_diagnostic?: boolean
          marking_rubric?: Json | null
          max_marks?: number | null
          model_answer?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          paper_id: number
          question_text: string
          question_type?: string
          reviewed_by?: string | null
          source_type?: string
          source_year?: number | null
          status?: string
          sub_topic_id?: string | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          concept_keywords?: string[] | null
          correct_answer_text?: string | null
          correct_option?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string
          explanation?: string
          id?: string
          is_diagnostic?: boolean
          marking_rubric?: Json | null
          max_marks?: number | null
          model_answer?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          paper_id?: number
          question_text?: string
          question_type?: string
          reviewed_by?: string | null
          source_type?: string
          source_year?: number | null
          status?: string
          sub_topic_id?: string | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      readiness_scores: {
        Row: {
          computed_at: string
          id: string
          overall_score: number
          paper_scores: Json
          self_assessment: Json
          sub_topic_scores: Json
          topic_scores: Json
          user_id: string
        }
        Insert: {
          computed_at?: string
          id?: string
          overall_score?: number
          paper_scores?: Json
          self_assessment?: Json
          sub_topic_scores?: Json
          topic_scores?: Json
          user_id: string
        }
        Update: {
          computed_at?: string
          id?: string
          overall_score?: number
          paper_scores?: Json
          self_assessment?: Json
          sub_topic_scores?: Json
          topic_scores?: Json
          user_id?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          content: Json
          expires_at: string
          generated_at: string
          id: string
          is_acted_on: boolean
          is_seen: boolean
          type: string
          user_id: string
        }
        Insert: {
          content?: Json
          expires_at?: string
          generated_at?: string
          id?: string
          is_acted_on?: boolean
          is_seen?: boolean
          type: string
          user_id: string
        }
        Update: {
          content?: Json
          expires_at?: string
          generated_at?: string
          id?: string
          is_acted_on?: boolean
          is_seen?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      spaced_repetition: {
        Row: {
          easiness_factor: number
          interval_days: number
          last_quality: number | null
          next_review_date: string
          repetition_count: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          easiness_factor?: number
          interval_days?: number
          last_quality?: number | null
          next_review_date?: string
          repetition_count?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          easiness_factor?: number
          interval_days?: number
          last_quality?: number | null
          next_review_date?: string
          repetition_count?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaced_repetition_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          academic_background: string
          aptitude_data: Json | null
          attempt_number: number
          created_at: string
          diagnostic_completed_at: string | null
          diagnostic_locked_until: string | null
          icai_registration_date: string | null
          id: string
          learning_style: string | null
          onboarding_completed_at: string | null
          previous_hard_topics: string[] | null
          previous_marks: Json | null
          referral_code: string | null
          referral_count: number
          referred_by: string | null
          self_assessment: Json
          study_pace: string | null
          study_plan_created_at: string | null
          target_exam_cycle: string
          target_exam_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_background?: string
          aptitude_data?: Json | null
          attempt_number?: number
          created_at?: string
          diagnostic_completed_at?: string | null
          diagnostic_locked_until?: string | null
          icai_registration_date?: string | null
          id?: string
          learning_style?: string | null
          onboarding_completed_at?: string | null
          previous_hard_topics?: string[] | null
          previous_marks?: Json | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          self_assessment?: Json
          study_pace?: string | null
          study_plan_created_at?: string | null
          target_exam_cycle?: string
          target_exam_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_background?: string
          aptitude_data?: Json | null
          attempt_number?: number
          created_at?: string
          diagnostic_completed_at?: string | null
          diagnostic_locked_until?: string | null
          icai_registration_date?: string | null
          id?: string
          learning_style?: string | null
          onboarding_completed_at?: string | null
          previous_hard_topics?: string[] | null
          previous_marks?: Json | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          self_assessment?: Json
          study_pace?: string | null
          study_plan_created_at?: string | null
          target_exam_cycle?: string
          target_exam_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_streaks: {
        Row: {
          current_streak: number
          id: string
          last_active_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_active_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_active_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sub_topics: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      subjective_responses: {
        Row: {
          ai_feedback: string | null
          ai_model_used: string | null
          ai_rubric_scores: Json | null
          ai_score: number | null
          answer_text: string
          created_at: string
          evaluated_at: string | null
          id: string
          question_id: string
          session_id: string
          time_spent_sec: number
          user_id: string
          word_count: number
        }
        Insert: {
          ai_feedback?: string | null
          ai_model_used?: string | null
          ai_rubric_scores?: Json | null
          ai_score?: number | null
          answer_text: string
          created_at?: string
          evaluated_at?: string | null
          id?: string
          question_id: string
          session_id: string
          time_spent_sec?: number
          user_id: string
          word_count?: number
        }
        Update: {
          ai_feedback?: string | null
          ai_model_used?: string | null
          ai_rubric_scores?: Json | null
          ai_score?: number | null
          answer_text?: string
          created_at?: string
          evaluated_at?: string | null
          id?: string
          question_id?: string
          session_id?: string
          time_spent_sec?: number
          user_id?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "subjective_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjective_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          papers_unlocked: number[]
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          tier: string
          user_id: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          id?: string
          papers_unlocked?: number[]
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          tier?: string
          user_id: string
          valid_from?: string
          valid_until?: string
        }
        Update: {
          created_at?: string
          id?: string
          papers_unlocked?: number[]
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          tier?: string
          user_id?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      teaching_resources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          resource_type: string
          title: string
          topic_id: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          resource_type: string
          title: string
          topic_id: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          resource_type?: string
          title?: string
          topic_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "teaching_resources_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_progress: {
        Row: {
          accuracy_rate: number
          last_practiced_at: string | null
          sub_topic_id: string | null
          topic_id: string
          total_attempted: number
          total_correct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_rate?: number
          last_practiced_at?: string | null
          sub_topic_id?: string | null
          topic_id: string
          total_attempted?: number
          total_correct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_rate?: number
          last_practiced_at?: string | null
          sub_topic_id?: string | null
          topic_id?: string
          total_attempted?: number
          total_correct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_progress_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          chapter_id: string | null
          created_at: string
          exam_weightage: number
          id: string
          name: string
          paper_id: number
          slug: string
          sort_order: number
          study_notes: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          exam_weightage?: number
          id?: string
          name: string
          paper_id: number
          slug: string
          sort_order?: number
          study_notes?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          exam_weightage?: number
          id?: string
          name?: string
          paper_id?: number
          slug?: string
          sort_order?: number
          study_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp: {
        Row: {
          level: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          level?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          level?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_readiness_scores: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_study_streak: { Args: { p_user_id: string }; Returns: undefined }
      update_topic_progress: {
        Args: {
          p_attempted: number
          p_correct: number
          p_topic_id: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

