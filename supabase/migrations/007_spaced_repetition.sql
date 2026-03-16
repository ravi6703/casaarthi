-- ============================================================
-- 007: Spaced Repetition (SM-2 Algorithm)
-- ============================================================

CREATE TABLE IF NOT EXISTS spaced_repetition (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  easiness_factor NUMERIC(4,2) NOT NULL DEFAULT 2.5,
  interval_days INT NOT NULL DEFAULT 1,
  repetition_count INT NOT NULL DEFAULT 0,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_quality INT CHECK (last_quality BETWEEN 0 AND 5),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, topic_id)
);

ALTER TABLE spaced_repetition ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own SR data" ON spaced_repetition
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sr_next_review ON spaced_repetition(user_id, next_review_date);
