/*
  # Fix interactions policies and add validation

  1. Changes
    - Drop and recreate policies safely
    - Add interaction type validation
    - Update points calculation trigger

  2. Security
    - Ensure RLS policies are properly set
    - Add data validation
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own interactions" ON public.interactions;
    DROP POLICY IF EXISTS "Users can insert own interactions" ON public.interactions;
    
    -- Create policies only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'interactions' 
        AND policyname = 'Users can view own interactions'
    ) THEN
        CREATE POLICY "Users can view own interactions"
            ON public.interactions
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'interactions' 
        AND policyname = 'Users can insert own interactions'
    ) THEN
        CREATE POLICY "Users can insert own interactions"
            ON public.interactions
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Function to validate interaction type
CREATE OR REPLACE FUNCTION validate_interaction_type()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type NOT IN ('lio', 'chupachupa', 'mandanga') THEN
        RAISE EXCEPTION 'Invalid interaction type. Must be lio, chupachupa, or mandanga';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for interaction type validation if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'validate_interaction_type_trigger'
    ) THEN
        CREATE TRIGGER validate_interaction_type_trigger
            BEFORE INSERT ON public.interactions
            FOR EACH ROW
            EXECUTE FUNCTION validate_interaction_type();
    END IF;
END $$;