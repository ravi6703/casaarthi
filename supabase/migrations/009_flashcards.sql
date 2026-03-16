-- ============================================================
-- 009: Flashcards
-- ============================================================

CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  card_type VARCHAR(20) NOT NULL DEFAULT 'definition' CHECK (card_type IN ('definition','formula','section','case_law','concept')),
  difficulty VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcard_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  confidence VARCHAR(10) NOT NULL DEFAULT 'unseen' CHECK (confidence IN ('unseen','again','hard','good','easy')),
  review_count INT NOT NULL DEFAULT 0,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, flashcard_id)
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active flashcards" ON flashcards FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users own flashcard progress" ON flashcard_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_flashcards_topic ON flashcards(topic_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user ON flashcard_progress(user_id, next_review_date);
