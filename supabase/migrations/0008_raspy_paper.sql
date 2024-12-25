/*
  # Fix interactions table foreign key

  1. Changes
    - Drop existing foreign key constraint
    - Update foreign key to reference profiles table
    - Ensure RLS policies are correct
*/

-- Drop existing foreign key constraint if it exists
ALTER TABLE IF EXISTS public.interactions
DROP CONSTRAINT IF EXISTS interactions_user_id_fkey;

-- Create interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    type TEXT NOT NULL,
    target_user TEXT NOT NULL,
    points INTEGER NOT NULL,
    has_raza BOOLEAN DEFAULT false,
    has_nationality BOOLEAN DEFAULT false,
    used_gold_button BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can insert own interactions" ON public.interactions;

-- Create new policies
CREATE POLICY "Users can view own interactions"
    ON public.interactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
    ON public.interactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);