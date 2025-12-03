-- Fix for concerns RLS policy to allow authenticated users to submit reports
-- Run this in your Supabase SQL Editor

-- The app uses custom JWT authentication (not Supabase Auth), 
-- so we need to allow all operations and rely on backend JWT verification

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own concerns" ON public.concerns;
DROP POLICY IF EXISTS "Users can create concerns" ON public.concerns;
DROP POLICY IF EXISTS "Users can insert concerns" ON public.concerns;
DROP POLICY IF EXISTS "Admins can view all concerns" ON public.concerns;
DROP POLICY IF EXISTS "Admins can update concerns" ON public.concerns;

-- Disable RLS and create permissive policies since we handle auth in the backend
ALTER TABLE public.concerns DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, use these permissive policies:
-- ALTER TABLE public.concerns ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all select on concerns" ON public.concerns
--     FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow all insert on concerns" ON public.concerns
--     FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow all update on concerns" ON public.concerns
--     FOR UPDATE USING (true);
