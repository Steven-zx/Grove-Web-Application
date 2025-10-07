-- Fix for announcements RLS policy
-- Run this in your Supabase SQL Editor to allow admin operations

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can view announcements" ON public.announcements;

-- Create new policies that allow admin operations
CREATE POLICY "Anyone can view announcements" ON public.announcements
    FOR SELECT USING (true);

CREATE POLICY "Allow all operations on announcements" ON public.announcements
    FOR ALL USING (true);

-- Alternative: If you want to be more secure, you can create a policy that allows
-- operations only from specific IP addresses or disable RLS temporarily:
-- ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;