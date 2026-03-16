-- ============================================================
-- 006: Engagement Features
-- Daily Challenges, Badges, User XP, Micro-Challenges, Referrals
-- ============================================================

-- ── Daily Challenges ──
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id),
  challenge_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_challenge_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  question_id UUID NOT NULL REFERENCES questions(id),
  selected_option VARCHAR(1),
  is_correct BOOLEAN,
  time_spent_sec INT NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read daily challenges" ON daily_challenges FOR SELECT USING (TRUE);
CREATE POLICY "Users own daily challenge responses" ON daily_challenge_responses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Badge Definitions ──
CREATE TABLE IF NOT EXISTS badge_definitions (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('practice','mock','streak','milestone')),
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id VARCHAR(50) NOT NULL REFERENCES badge_definitions(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read badge definitions" ON badge_definitions FOR SELECT USING (TRUE);
CREATE POLICY "Users see own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users earn badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed badge definitions
INSERT INTO badge_definitions (id, name, description, icon, category, sort_order) VALUES
  ('first_practice',       'First Steps',       'Complete your first practice session',          '🎯', 'practice',  1),
  ('50_questions',         'Half Century',       'Answer 50 questions',                          '🏏', 'practice',  2),
  ('100_questions',        'Century Club',       'Answer 100 questions',                         '💯', 'practice',  3),
  ('500_questions',        'Practice Warrior',   'Answer 500 questions',                         '⚔️', 'practice',  4),
  ('1000_questions',       'Grand Master',       'Answer 1000 questions',                        '👑', 'practice',  5),
  ('first_mock',           'Mock Champion',      'Complete your first mock test',                '📝', 'mock',      6),
  ('mock_70_percent',      'High Scorer',        'Score 70%+ on a mock test',                    '🌟', 'mock',      7),
  ('perfect_score',        'Perfectionist',      'Score 100% on a session with 10+ questions',   '💎', 'practice',  8),
  ('3_day_streak',         'Getting Started',    'Maintain a 3-day streak',                      '🔥', 'streak',    9),
  ('7_day_streak',         'Weekly Warrior',     'Maintain a 7-day streak',                      '🔥', 'streak',   10),
  ('30_day_streak',        'Monthly Master',     'Maintain a 30-day streak',                     '🏆', 'streak',   11),
  ('all_papers',           'Well Rounded',       'Practice all 4 papers',                        '📚', 'milestone',12),
  ('first_diagnostic',     'Self Aware',         'Complete the diagnostic test',                 '🔍', 'milestone',13),
  ('readiness_70',         'Exam Ready',         'Reach readiness score 70+',                    '🎓', 'milestone',14),
  ('daily_challenge_7',    'Challenge Streak',   'Complete 7 daily challenges',                  '⚡', 'milestone',15),
  ('first_subjective',     'Essay Writer',       'Submit your first subjective answer',          '✍️', 'practice', 16)
ON CONFLICT (id) DO NOTHING;

-- ── User XP ──
CREATE TABLE IF NOT EXISTS user_xp (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own XP" ON user_xp FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Micro-Challenges ──
CREATE TABLE IF NOT EXISTS micro_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type VARCHAR(20) NOT NULL CHECK (challenge_type IN ('speed','accuracy','volume')),
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE micro_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active challenges" ON micro_challenges FOR SELECT USING (is_active = TRUE);

-- Seed some micro-challenges
INSERT INTO micro_challenges (title, description, challenge_type, config) VALUES
  ('Speed Demon',     'Answer 5 questions in under 2 minutes',           'speed',    '{"question_count": 5, "time_limit_sec": 120, "xp_reward": 50}'),
  ('Accuracy Master', 'Get 10 questions right in a row',                  'accuracy', '{"question_count": 10, "min_accuracy": 100, "xp_reward": 75}'),
  ('Marathon Runner',  'Complete 25 questions in one session',             'volume',   '{"question_count": 25, "xp_reward": 100}'),
  ('Quick Fire',       'Answer 3 hard questions in 90 seconds',           'speed',    '{"question_count": 3, "time_limit_sec": 90, "difficulty": "hard", "xp_reward": 60}'),
  ('Paper Hopper',     'Answer questions from all 4 papers in one session','volume',   '{"min_papers": 4, "question_count": 12, "xp_reward": 80}')
ON CONFLICT DO NOTHING;

-- ── Referral columns on student_profiles ──
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS referral_code VARCHAR(10) UNIQUE;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS referral_count INT NOT NULL DEFAULT 0;

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_daily_challenge_responses_user ON daily_challenge_responses(user_id, challenge_date);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
