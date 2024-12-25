/*
  # Update interactions table policies and functions

  1. Changes
    - Add points column to profiles table
    - Update policies for interactions table
    - Add functions for points calculation and validation

  2. Security
    - Update RLS policies for better security
    - Add validation functions
*/

-- Add points column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'points'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN points INTEGER DEFAULT 0;
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can insert own interactions" ON public.interactions;

-- Create new policies
CREATE POLICY "Users can view own interactions"
    ON public.interactions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
    ON public.interactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to update user points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET points = (
        SELECT COALESCE(SUM(points), 0)
        FROM public.interactions
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_interaction_points_update ON public.interactions;

-- Create trigger for points update
CREATE TRIGGER on_interaction_points_update
    AFTER INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

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

-- Create trigger for interaction type validation
CREATE TRIGGER validate_interaction_type_trigger
    BEFORE INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION validate_interaction_type();