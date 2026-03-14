import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://cmjbarwlzxalnzjoeosr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fix the update_study_streak function via the SQL API
const url = 'https://cmjbarwlzxalnzjoeosr.supabase.co/rest/v1/rpc/';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// We need to use the pg_net or execute raw SQL.
// The supabase-js client doesn't have a raw SQL method,
// so let's use the Management API approach via fetch.

const sql = `
CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $fn$
DECLARE
  v_streak RECORD;
  v_today  DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  SELECT * INTO v_streak
  FROM study_streaks
  WHERE user_id = p_user_id;

  IF v_streak IS NULL THEN
    INSERT INTO study_streaks (user_id, current_streak, longest_streak, last_active_date)
    VALUES (p_user_id, 1, 1, v_today);
  ELSIF v_streak.last_active_date = v_today THEN
    NULL;
  ELSIF v_streak.last_active_date = v_yesterday THEN
    UPDATE study_streaks SET
      current_streak  = current_streak + 1,
      longest_streak  = GREATEST(longest_streak, current_streak + 1),
      last_active_date = v_today
    WHERE user_id = p_user_id;
  ELSE
    UPDATE study_streaks SET
      current_streak  = 1,
      last_active_date = v_today
    WHERE user_id = p_user_id;
  END IF;
END;
$fn$;
`;

// Use the Supabase SQL API (requires project ref + service role key)
const projectRef = 'cmjbarwlzxalnzjoeosr';
const mgmtUrl = `https://${projectRef}.supabase.co/pg/sql`;

const res = await fetch(mgmtUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
  },
  body: JSON.stringify({ query: sql }),
});

if (res.ok) {
  console.log('✅ update_study_streak function fixed (last_study_date → last_active_date)');
} else {
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);

  // Fallback: try via supabase's built-in query method
  console.log('\nTrying alternative approach...');

  // Check if there's a pg extension we can use
  const { data, error } = await s.from('study_streaks').select('*').limit(0);
  if (!error) {
    console.log('✅ study_streaks table exists and is accessible');
    console.log('⚠️  Cannot execute DDL via REST API - the function fix needs to be applied via Supabase Dashboard SQL Editor');
    console.log('\n📋 Copy and run this SQL in Supabase Dashboard → SQL Editor:');
    console.log('---');
    console.log(sql);
    console.log('---');
  }
}
