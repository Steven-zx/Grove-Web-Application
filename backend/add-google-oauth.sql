-- Add google_id column to user_profiles table for Google OAuth
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_google_id ON public.user_profiles(google_id);

-- Add comment
COMMENT ON COLUMN public.user_profiles.google_id IS 'Google OAuth user ID for social login';
