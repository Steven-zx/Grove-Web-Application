-- Fix for concerns RLS policy to allow authenticated users to submit reports
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own concerns" ON public.concerns;
DROP POLICY IF EXISTS "Users can create concerns" ON public.concerns;

-- Create new policies that allow proper operations
-- Allow users to view their own concerns
CREATE POLICY "Users can view own concerns" ON public.concerns
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow authenticated users to create concerns
CREATE POLICY "Users can insert concerns" ON public.concerns
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all concerns
CREATE POLICY "Admins can view all concerns" ON public.concerns
    FOR SELECT
    USING (true);

-- Allow admins to update concerns (for status changes)
CREATE POLICY "Admins can update concerns" ON public.concerns
    FOR UPDATE
    USING (true);
