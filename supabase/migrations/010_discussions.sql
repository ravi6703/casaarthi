-- ============================================================
-- 010: Discussion Forum / Doubt Board
-- ============================================================

CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id),
  paper_id INT REFERENCES papers(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  upvote_count INT NOT NULL DEFAULT 0,
  reply_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  upvote_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discussion_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('discussion','reply')),
  vote INT NOT NULL CHECK (vote IN (1, -1)),
  PRIMARY KEY (user_id, target_id)
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read discussions" ON discussions FOR SELECT USING (TRUE);
CREATE POLICY "Users create discussions" ON discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own discussions" ON discussions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public read replies" ON discussion_replies FOR SELECT USING (TRUE);
CREATE POLICY "Users create replies" ON discussion_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own replies" ON discussion_replies FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users own votes" ON discussion_votes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_discussions_paper ON discussions(paper_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_topic ON discussions(topic_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussion_replies ON discussion_replies(discussion_id, created_at);
