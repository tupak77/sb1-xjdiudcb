/*
  # Fix interactions table and policies

  1. Changes
    - Drop existing policies safely
    - Create or update interactions table
    - Add proper RLS policies
    - Update points calculation function
*/

-- Drop existing policies safely
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own interactions" ON public.interactions;
    DROP POLICY IF EXISTS "Users can insert own interactions" ON public.interactions;
END $$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_interaction_points_update ON public.interactions;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_user_points();

-- Create or replace the points update function
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

-- Create trigger for points update
CREATE TRIGGER on_interaction_points_update
    AFTER INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

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