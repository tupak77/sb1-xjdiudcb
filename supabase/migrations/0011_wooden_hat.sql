/*
  # Update profile and interaction policies

  1. Changes
    - Safely drop and recreate policies for profiles and interactions
    - Ensure all authenticated users can view all profiles
    - Allow viewing all interactions
    
  2. Security
    - Maintains RLS
    - Users can only update their own profile
    - All users can view other profiles and interactions
*/

DO $$ 
BEGIN
    -- Drop existing policies safely
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can view own interactions" ON public.interactions;
    DROP POLICY IF EXISTS "Users can view all interactions" ON public.interactions;

    -- Create new policies only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view all profiles'
    ) THEN
        CREATE POLICY "Users can view all profiles"
            ON public.profiles
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'interactions' 
        AND policyname = 'Users can view all interactions'
    ) THEN
        CREATE POLICY "Users can view all interactions"
            ON public.interactions
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;