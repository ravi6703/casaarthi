-- ============================================================
-- RPC: update_topic_progress
-- Called after each practice session to upsert topic accuracy
-- ============================================================
CREATE OR REPLACE FUNCTION update_topic_progress(
  p_user_id     UUID,
  p_topic_id    UUID,
  p_correct     INT,
  p_attempted   INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing RECORD;
  v_new_correct     INT;
  v_new_attempted   INT;
  v_new_accuracy    NUMERIC;
BEGIN
  SELECT * INTO v_existing
  FROM topic_progress
  WHERE user_id = p_user_id AND topic_id = p_topic_id;

  IF v_existing IS NULL THEN
    v_new_correct   := p_correct;
    v_new_attempted := p_attempted;
  ELSE
    v_new_correct   := v_existing.total_correct + p_correct;
    v_new_attempted := v_existing.total_attempted + p_attempted;
  END IF;

  IF v_new_attempted > 0 THEN
    v_new_accuracy := ROUND((v_new_correct::NUMERIC / v_new_attempted::NUMERIC) * 100, 2);
  ELSE
    v_new_accuracy := 0;
  END IF;

  INSERT INTO topic_progress (user_id, topic_id, total_correct, total_attempted, accuracy_rate, last_practiced_at)
  VALUES (p_user_id, p_topic_id, v_new_correct, v_new_attempted, v_new_accuracy, NOW())
  ON CONFLICT (user_id, topic_id)
  DO UPDATE SET
    total_correct     = v_new_correct,
    total_attempted   = v_new_attempted,
    accuracy_rate     = v_new_accuracy,
    last_practiced_at = NOW();
END;
$$;

-- ============================================================
-- RPC: update_study_streak
-- Called after each practice session. Increments or resets streak.
-- ============================================================
CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_streak RECORD;
  v_today  DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  SELECT * INTO v_streak
  FROM study_streaks
  WHERE user_id = p_user_id;

  IF v_streak IS NULL THEN
    -- First ever practice
    INSERT INTO study_streaks (user_id, current_streak, longest_streak, last_study_date)
    VALUES (p_user_id, 1, 1, v_today);
  ELSIF v_streak.last_study_date = v_today THEN
    -- Already practiced today — no change
    NULL;
  ELSIF v_streak.last_study_date = v_yesterday THEN
    -- Continuing streak
    UPDATE study_streaks SET
      current_streak  = current_streak + 1,
      longest_streak  = GREATEST(longest_streak, current_streak + 1),
      last_study_date = v_today
    WHERE user_id = p_user_id;
  ELSE
    -- Streak broken
    UPDATE study_streaks SET
      current_streak  = 1,
      last_study_date = v_today
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

-- ============================================================
-- RPC: update_readiness_scores
-- Recalculates overall readiness from topic_progress data.
-- Called after 50+ total questions or on demand.
-- ============================================================
CREATE OR REPLACE FUNCTION update_readiness_scores(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_paper         RECORD;
  v_paper_score   NUMERIC;
  v_paper_scores  JSONB := '{}';
  v_topic_scores  JSONB := '{}';
  v_overall       NUMERIC := 0;
  v_paper_count   INT := 0;
  v_topic         RECORD;
BEGIN
  -- For each paper, compute weighted average topic accuracy
  FOR v_paper IN SELECT id FROM papers ORDER BY id LOOP
    v_paper_score := 0;
    v_paper_count := 0;

    FOR v_topic IN
      SELECT tp.topic_id, tp.accuracy_rate, tp.total_attempted
      FROM topic_progress tp
      JOIN topics t ON t.id = tp.topic_id
      WHERE tp.user_id = p_user_id AND t.paper_id = v_paper.id AND tp.total_attempted > 0
    LOOP
      v_topic_scores := v_topic_scores || jsonb_build_object(
        v_topic.topic_id::TEXT,
        jsonb_build_object('score', ROUND(v_topic.accuracy_rate))
      );
      v_paper_score := v_paper_score + v_topic.accuracy_rate;
      v_paper_count := v_paper_count + 1;
    END LOOP;

    IF v_paper_count > 0 THEN
      v_paper_scores := v_paper_scores || jsonb_build_object(
        v_paper.id::TEXT, ROUND(v_paper_score / v_paper_count)
      );
    END IF;
  END LOOP;

  -- Overall = average of paper scores
  SELECT AVG(value::NUMERIC) INTO v_overall
  FROM jsonb_each_text(v_paper_scores);

  INSERT INTO readiness_scores (user_id, overall_score, paper_scores, topic_scores, computed_at)
  VALUES (p_user_id, COALESCE(ROUND(v_overall), 0), v_paper_scores, v_topic_scores, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    overall_score = COALESCE(ROUND(v_overall), 0),
    paper_scores  = v_paper_scores,
    topic_scores  = v_topic_scores,
    computed_at   = NOW();
END;
$$;

-- Grant execute to authenticated users (SECURITY DEFINER runs as owner)
GRANT EXECUTE ON FUNCTION update_topic_progress TO authenticated;
GRANT EXECUTE ON FUNCTION update_study_streak TO authenticated;
GRANT EXECUTE ON FUNCTION update_readiness_scores TO authenticated;
