/*
  # Fix database permissions

  1. Changes
    - Add missing INSERT permissions for users table
    - Add missing UPDATE permissions for users table
    - Add missing UPDATE permissions for interactions table
    - Update RLS policies to be more permissive for development
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.interactions;
DROP POLICY IF EXISTS "Allow public read access" ON public.medals;
DROP POLICY IF EXISTS "Allow insert own interactions" ON public.interactions;

-- Create new policies for users table
CREATE POLICY "Enable read access for all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for all users"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for all users"
    ON public.users FOR UPDATE
    USING (true);

-- Create new policies for interactions table
CREATE POLICY "Enable read access for all users"
    ON public.interactions FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for all users"
    ON public.interactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for all users"
    ON public.interactions FOR UPDATE
    USING (true);

-- Create new policies for medals table
CREATE POLICY "Enable read access for all users"
    ON public.medals FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for all users"
    ON public.medals FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for all users"
    ON public.medals FOR UPDATE
    USING (true);