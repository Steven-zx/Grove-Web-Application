# Fix for Report Issue Feature (Concerns API)

## Problem
Users are getting a 500 error when submitting reports through the "Report an Issue" form. This is caused by Row Level Security (RLS) policies in Supabase blocking the insert operation.

## Solution
You need to update the RLS policies for the `concerns` table in your Supabase database.

### Steps to Fix:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Grove Web Application project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Fix Script**
   - Open the file `backend/fix-concerns-rls.sql`
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the script

4. **Verify the Fix**
   - The script will update the RLS policies to allow:
     - Authenticated users to submit (INSERT) concerns
     - Users to view their own concerns
     - Admins to view and update all concerns

5. **Test the Feature**
   - Go to your deployed frontend: https://augustine-grove.netlify.app
   - Log in as a regular user
   - Click "Report an Issue"
   - Fill out and submit the form
   - Check the admin panel Reports page to verify it appears

## What the Fix Does

The SQL script creates proper RLS policies that:
- Allow authenticated users (`auth.uid()`) to create concerns
- Ensure users can only see their own reports
- Allow admins to manage all reports
- Maintain security while enabling the feature to work

## Alternative: Temporary Bypass (Not Recommended for Production)

If you need a quick temporary fix for testing, you can disable RLS on the concerns table:

```sql
ALTER TABLE public.concerns DISABLE ROW LEVEL SECURITY;
```

**Warning:** This removes all security restrictions. Re-enable it after testing with:

```sql
ALTER TABLE public.concerns ENABLE ROW LEVEL SECURITY;
```

Then apply the proper policies from `fix-concerns-rls.sql`.
