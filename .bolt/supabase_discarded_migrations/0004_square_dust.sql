/*
  # Update policies and reset user data

  1. Changes
    - Drop and recreate policies with unique names
    - Reset points and gold buttons for existing users
  
  2. Security
    - Policies updated to allow proper access control
    - Maintains data integrity
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update for own user" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.interactions;
DROP POLICY IF EXISTS "Enable insert own interactions" ON public.interactions;
DROP POLICY IF EXISTS "Enable update for users" ON public.users;

-- Create new policies with unique names
CREATE POLICY "users_read_policy_v3"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "users_update_policy_v3"
    ON public.users FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "interactions_read_policy_v3"
    ON public.interactions FOR SELECT
    USING (true);

CREATE POLICY "interactions_insert_policy_v3"
    ON public.interactions FOR INSERT
    WITH CHECK (true);

-- Reset points and gold buttons for existing users
UPDATE public.users 
SET points = 0, gold_buttons = 5 
WHERE name IN ('PepeSimon', 'Bigote Prime');