/*
  # Add interaction update functionality
  
  1. Changes
    - Add policy to allow users to update their own interactions
    - Add policy to allow users to delete their own interactions
  
  2. Security
    - Users can only update/delete their own interactions
    - Maintains RLS protection
*/

-- Add update policy for interactions
CREATE POLICY "Users can update own interactions"
    ON public.interactions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add delete policy for interactions
CREATE POLICY "Users can delete own interactions"
    ON public.interactions
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);