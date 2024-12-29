/*
  # Add 24h boost tracking
  
  1. New Table
    - `boosts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `activated_at` (timestamptz)
      - `expires_at` (timestamptz)

  2. Security
    - Enable RLS on `boosts` table
    - Add policies for authenticated users
*/

-- Create boosts table
CREATE TABLE public.boosts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activated_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT valid_boost_period CHECK (expires_at > activated_at)
);

-- Enable RLS
ALTER TABLE public.boosts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own boosts"
    ON public.boosts
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own boosts"
    ON public.boosts
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Create index for better query performance
CREATE INDEX idx_boosts_user_expires 
ON public.boosts(user_id, expires_at);

-- Function to check if user has active boost
CREATE OR REPLACE FUNCTION has_active_boost(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.boosts 
        WHERE user_id = user_uuid 
        AND now() BETWEEN activated_at AND expires_at
    );
END;
$$ LANGUAGE plpgsql;