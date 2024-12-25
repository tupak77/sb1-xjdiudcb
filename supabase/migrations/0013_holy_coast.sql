/*
  # Fix medals table foreign key constraint

  1. Changes
    - Drop existing foreign key constraint if exists
    - Add correct foreign key constraint to reference profiles table
    - Ensure RLS policies are properly set

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Drop existing foreign key constraint if exists
ALTER TABLE public.medals
DROP CONSTRAINT IF EXISTS medals_user_id_fkey;

-- Add correct foreign key constraint
ALTER TABLE public.medals
ADD CONSTRAINT medals_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Ensure RLS is enabled
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;

-- Recreate policies to ensure proper access
DROP POLICY IF EXISTS "Users can view all medals" ON public.medals;
DROP POLICY IF EXISTS "Users can insert own medals" ON public.medals;

CREATE POLICY "Users can view all medals"
    ON public.medals
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert own medals"
    ON public.medals
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_medals_user_unlocked
ON public.medals(user_id, unlocked_at DESC);