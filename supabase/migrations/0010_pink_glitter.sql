/*
  # Fix Profile-Interactions Relationship

  1. Changes
    - Add foreign key constraint between interactions and profiles
    - Update interactions query to use profiles
    - Add index for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- Update interactions table to properly reference profiles
ALTER TABLE public.interactions
DROP CONSTRAINT IF EXISTS interactions_user_id_fkey,
ADD CONSTRAINT interactions_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- Add index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_interactions_user_id_created_at 
ON public.interactions(user_id, created_at DESC);

-- Update the profiles query to use a more efficient subquery for last interaction
CREATE OR REPLACE FUNCTION get_profile_last_interaction(profile_id uuid)
RETURNS timestamptz AS $$
  SELECT MAX(created_at)
  FROM public.interactions
  WHERE user_id = profile_id;
$$ LANGUAGE sql STABLE;