-- Add missing columns to profiles table to match the application's requirements
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_type TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS preparatory_school_type TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS current_grade_level TEXT,
ADD COLUMN IF NOT EXISTS school_name TEXT,
ADD COLUMN IF NOT EXISTS gpa NUMERIC(3, 2),
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS dream_university TEXT,
ADD COLUMN IF NOT EXISTS dream_major TEXT,
ADD COLUMN IF NOT EXISTS target_country TEXT,
ADD COLUMN IF NOT EXISTS english_proficiency_level TEXT,
ADD COLUMN IF NOT EXISTS extracurricular_activities TEXT[];

-- Add comment to track migration
COMMENT ON TABLE public.profiles IS 'Extended profile fields for comprehensive user data';