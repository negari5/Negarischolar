-- Add additional missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS career_interests TEXT[],
ADD COLUMN IF NOT EXISTS preferred_countries TEXT[],
ADD COLUMN IF NOT EXISTS preferred_fields TEXT[],
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN public.profiles.is_super_admin IS 'Indicates if user has super admin privileges';