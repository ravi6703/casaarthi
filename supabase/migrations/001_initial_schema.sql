-- ============================================================
-- CA SAARTHI — INITIAL DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search on questions

-- ============================================================
-- TAXONOMY — Reference tables (static, seeded once)
-- ============================================================

CREATE TABLE IF NOT EXISTS papers (
  id            SERIAL PRIMARY KEY,
  code          VARCHAR(4) NOT NULL UNIQUE,  -- P1, P2, P3, P4
  name          TEXT NOT NULL,
  format        VARCHAR(20) NOT NULL CHECK (format IN ('descriptive', 'objective')),
  total_marks   INT NOT NULL DEFAULT 100,
  duration_minutes INT NOT NULL,
  negative_marking NUMERIC(4,2) NOT NULL DEFAULT 0,
  sort_order    INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS topics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id      INT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  exam_weightage INT NOT NULL DEFAULT 5,  -- % weightage in exam
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(paper_id, slug)
);

CREATE TABLE IF NOT EXISTS sub_topics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id      UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(topic_id, slug)
);

-- ============================================================
-- QUESTION BANK
-- ============================================================

CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id        INT NOT NULL REFERENCES papers(id),
  topic_id        UUID NOT NULL REFERENCES topics(id),
  sub_topic_id    UUID NOT NULL REFERENCES sub_topics(id),
  question_text   TEXT NOT NULL,
  question_type   VARCHAR(20) NOT NULL DEFAULT 'mcq'
                  CHECK (question_type IN ('mcq','short_answer','fill_blank','matching')),
  option_a        TEXT,
  option_b        TEXT,
  option_c        TEXT,
  option_d        TEXT,
  correct_option  CHAR(1) CHECK (correct_option IN ('a','b','c','d')),
  correct_answer_text TEXT,  -- for short_answer/fill_blank
  explanation     TEXT NOT NULL,
  difficulty      VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  source_type     VARCHAR(20) NOT NULL DEFAULT 'original'
                  CHECK (source_type IN ('icai_past','original','ai_generated')),
  source_year     INT,
  concept_keywords TEXT[] DEFAULT '{}',
  status          VARCHAR(20) NOT NULL DEFAULT 'pending_review'
                  CHECK (status IN ('pending_review','approved','retired')),
  is_diagnostic   BOOLEAN NOT NULL DEFAULT FALSE,  -- can be used in diagnostic test
  created_by      UUID REFERENCES auth.users(id),
  reviewed_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast question selection
CREATE INDEX IF NOT EXISTS idx_questions_paper_topic_diff
  ON questions(paper_id, topic_id, difficulty, status);
CREATE INDEX IF NOT EXISTS idx_questions_diagnostic
  ON questions(is_diagnostic, paper_id, topic_id, difficulty) WHERE is_diagnostic = TRUE;
CREATE INDEX IF NOT EXISTS idx_questions_text_search
  ON questions USING gin(question_text gin_trgm_ops);

CREATE TABLE IF NOT EXISTS question_reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  reason      TEXT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'open'
              CHECK (status IN ('open','resolved','dismissed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STUDENT PROFILES & ONBOARDING (Module 1)
-- ============================================================

CREATE TABLE IF NOT EXISTS student_profiles (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_background     TEXT NOT NULL DEFAULT 'class_12',
  attempt_number          INT NOT NULL DEFAULT 1,
  icai_registration_date  DATE,
  target_exam_cycle       VARCHAR(20) NOT NULL DEFAULT 'may'
                          CHECK (target_exam_cycle IN ('january','may','september')),
  target_exam_year        INT NOT NULL DEFAULT 2026,
  previous_marks          JSONB,   -- {p1: 45, p2: 30, p3: 52, p4: 41}
  previous_hard_topics    TEXT[],
  self_assessment         JSONB NOT NULL DEFAULT '{}',  -- {topic_id: 'weak'|'average'|'good'}
  aptitude_data           JSONB,
  learning_style          VARCHAR(20)
                          CHECK (learning_style IN ('text_heavy','video_heavy','practice_heavy')),
  onboarding_completed_at TIMESTAMPTZ,
  diagnostic_completed_at TIMESTAMPTZ,
  diagnostic_locked_until TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diagnostic_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status            VARCHAR(20) NOT NULL DEFAULT 'in_progress'
                    CHECK (status IN ('in_progress','completed','expired')),
  questionnaire_data JSONB,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '72 hours')
);

CREATE TABLE IF NOT EXISTS diagnostic_responses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES questions(id),
  selected_option VARCHAR(1),
  is_correct      BOOLEAN,
  time_spent_sec  INT NOT NULL DEFAULT 0,
  answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- ============================================================
-- READINESS SCORES (computed, updated periodically)
-- ============================================================

CREATE TABLE IF NOT EXISTS readiness_scores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score   INT NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
  paper_scores    JSONB NOT NULL DEFAULT '{}',    -- {1: 72, 2: 58, 3: 45, 4: 61}
  topic_scores    JSONB NOT NULL DEFAULT '{}',    -- {topic_id: {score: 65, color: "amber"}}
  sub_topic_scores JSONB NOT NULL DEFAULT '{}',
  self_assessment JSONB NOT NULL DEFAULT '{}',
  computed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)  -- upsert on user_id
);

-- ============================================================
-- PRACTICE ENGINE (Module 2)
-- ============================================================

CREATE TABLE IF NOT EXISTS practice_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type    VARCHAR(20) NOT NULL
                  CHECK (session_type IN ('topic','mixed','weak_area','revision','exam_sim','challenge')),
  paper_id        INT REFERENCES papers(id),
  topic_id        UUID REFERENCES topics(id),
  sub_topic_id    UUID REFERENCES sub_topics(id),
  status          VARCHAR(20) NOT NULL DEFAULT 'in_progress'
                  CHECK (status IN ('in_progress','completed','abandoned')),
  total_questions INT NOT NULL DEFAULT 0,
  correct         INT NOT NULL DEFAULT 0,
  wrong           INT NOT NULL DEFAULT 0,
  skipped         INT NOT NULL DEFAULT 0,
  time_spent_sec  INT NOT NULL DEFAULT 0,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_practice_sessions_user
  ON practice_sessions(user_id, started_at DESC);

CREATE TABLE IF NOT EXISTS practice_responses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES questions(id),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  selected_option VARCHAR(1),
  is_correct      BOOLEAN,
  time_spent_sec  INT NOT NULL DEFAULT 0,
  is_bookmarked   BOOLEAN NOT NULL DEFAULT FALSE,
  attempt_seq     INT NOT NULL DEFAULT 1,
  answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_practice_responses_user_q
  ON practice_responses(user_id, question_id);

CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Topic progress (materialised, maintained by trigger / API)
CREATE TABLE IF NOT EXISTS topic_progress (
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id          UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  sub_topic_id      UUID REFERENCES sub_topics(id) ON DELETE CASCADE,
  total_attempted   INT NOT NULL DEFAULT 0,
  total_correct     INT NOT NULL DEFAULT 0,
  accuracy_rate     NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_topic_progress_user
  ON topic_progress(user_id, accuracy_rate ASC);

-- Study streaks
CREATE TABLE IF NOT EXISTS study_streaks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak  INT NOT NULL DEFAULT 0,
  longest_streak  INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MOCK TESTS (Module 3)
-- ============================================================

CREATE TABLE IF NOT EXISTS mock_tests (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id              INT NOT NULL REFERENCES papers(id),
  test_number           INT NOT NULL CHECK (test_number BETWEEN 1 AND 10),
  title                 TEXT NOT NULL,
  difficulty_label      VARCHAR(20) NOT NULL DEFAULT 'standard'
                        CHECK (difficulty_label IN ('warm-up','standard','exam-mode')),
  unlock_condition      VARCHAR(30) NOT NULL DEFAULT 'always'
                        CHECK (unlock_condition IN ('always','after_500_questions','after_mock_3','within_60_days')),
  scheduled_release_date DATE,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(paper_id, test_number)
);

CREATE TABLE IF NOT EXISTS mock_test_questions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mock_test_id  UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_id   UUID NOT NULL REFERENCES questions(id),
  question_order INT NOT NULL,
  UNIQUE(mock_test_id, question_id),
  UNIQUE(mock_test_id, question_order)
);

CREATE TABLE IF NOT EXISTS mock_test_attempts (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mock_test_id          UUID NOT NULL REFERENCES mock_tests(id),
  status                VARCHAR(20) NOT NULL DEFAULT 'in_progress'
                        CHECK (status IN ('in_progress','completed','auto_submitted')),
  total_score           NUMERIC(6,2),
  percentage            NUMERIC(5,2),
  topic_scores          JSONB,   -- {topic_id: {correct: 5, total: 10, pct: 50}}
  time_analytics        JSONB,   -- {question_id: time_sec}
  fullscreen_exit_count INT NOT NULL DEFAULT 0,
  started_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mock_attempts_user
  ON mock_test_attempts(user_id, mock_test_id, started_at DESC);

CREATE TABLE IF NOT EXISTS mock_test_responses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id      UUID NOT NULL REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES questions(id),
  selected_option VARCHAR(1),
  is_correct      BOOLEAN,
  time_spent_sec  INT NOT NULL DEFAULT 0,
  marked_for_review BOOLEAN NOT NULL DEFAULT FALSE,
  answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- ============================================================
-- SUBSCRIPTIONS & PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier                VARCHAR(20) NOT NULL DEFAULT 'free'
                      CHECK (tier IN ('free','foundation','complete','pro')),
  papers_unlocked     INT[] NOT NULL DEFAULT '{}',  -- [1,2,3,4] for complete
  valid_from          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until         TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '180 days'),
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- MODULE 4 — RECOMMENDATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS recommendations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          VARCHAR(30) NOT NULL
                CHECK (type IN ('study_today','revision_alert','danger_flag','next_level','countdown')),
  content       JSONB NOT NULL DEFAULT '{}',
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  is_seen       BOOLEAN NOT NULL DEFAULT FALSE,
  is_acted_on   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_active
  ON recommendations(user_id, expires_at DESC) WHERE is_seen = FALSE;

-- ============================================================
-- TEACHING RESOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS teaching_resources (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id      UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  resource_type VARCHAR(20) NOT NULL
                CHECK (resource_type IN ('icai_pdf','youtube','concept_card')),
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  description   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all user-data tables
ALTER TABLE student_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_responses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_scores       ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_responses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress         ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_reports       ENABLE ROW LEVEL SECURITY;

-- Student profiles: users can only see/edit their own
CREATE POLICY "Users own their profile"
  ON student_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their diagnostic sessions"
  ON diagnostic_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their diagnostic responses"
  ON diagnostic_responses FOR ALL
  USING (session_id IN (SELECT id FROM diagnostic_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users own their readiness scores"
  ON readiness_scores FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their practice sessions"
  ON practice_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their practice responses"
  ON practice_responses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their topic progress"
  ON topic_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their streaks"
  ON study_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their mock attempts"
  ON mock_test_attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their mock responses"
  ON mock_test_responses FOR ALL
  USING (attempt_id IN (SELECT id FROM mock_test_attempts WHERE user_id = auth.uid()));

CREATE POLICY "Users own their subscription"
  ON subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their recommendations"
  ON recommendations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can report questions"
  ON question_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their reports"
  ON question_reports FOR SELECT
  USING (auth.uid() = user_id);

-- Public read for reference tables
CREATE POLICY "Public read papers"     ON papers     FOR SELECT USING (TRUE);
CREATE POLICY "Public read topics"     ON topics     FOR SELECT USING (TRUE);
CREATE POLICY "Public read sub_topics" ON sub_topics FOR SELECT USING (TRUE);
CREATE POLICY "Public read mock_tests" ON mock_tests FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read resources"  ON teaching_resources FOR SELECT USING (is_active = TRUE);

-- Questions: approved only for non-admins
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved questions are readable"
  ON questions FOR SELECT
  USING (status = 'approved');

-- ============================================================
-- UPDATED_AT trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_student_profiles
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_questions
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
