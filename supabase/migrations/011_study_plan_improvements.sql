-- Add study pace preference to student profiles (persists across sessions)
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS study_pace TEXT DEFAULT 'balanced' CHECK (study_pace IN ('relaxed', 'balanced', 'intensive', 'crash'));

-- Add study_plan_created_at to track when user first chose a plan
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS study_plan_created_at TIMESTAMPTZ;
