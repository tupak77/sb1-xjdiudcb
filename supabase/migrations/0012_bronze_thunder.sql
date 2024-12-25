/*
  # Update medals table schema

  1. Changes
    - Add description column to medals table
    - Add unlocked_at column if not exists
    - Update RLS policies for medals table

  2. Security
    - Enable RLS on medals table
    - Add policies for authenticated users
*/

-- Add description column to medals table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'medals' AND column_name = 'description'
    ) THEN
        ALTER TABLE public.medals ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add unlocked_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'medals' AND column_name = 'unlocked_at'
    ) THEN
        ALTER TABLE public.medals ADD COLUMN unlocked_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all medals" ON public.medals;
DROP POLICY IF EXISTS "Users can insert own medals" ON public.medals;

-- Create new policies
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_medals_user_id_medal_id 
ON public.medals(user_id, medal_id);