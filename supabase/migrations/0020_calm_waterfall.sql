/*
  # Add predictions system
  
  1. New Tables
    - `predictions`
      - `id` (uuid, primary key)
      - `predictor_id` (uuid, references profiles)
      - `target_id` (uuid, references profiles)
      - `points` (integer)
      - `quarter` (text)
      - `year` (integer)
      - `status` (enum: pending/correct/incorrect)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on predictions table
    - Add policies for authenticated users
*/

-- Create predictions table
CREATE TABLE public.predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    predictor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    quarter TEXT NOT NULL,
    year INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'correct', 'incorrect')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_points CHECK (points >= 0),
    CONSTRAINT valid_quarter CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4'))
);

-- Enable RLS
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all predictions"
    ON public.predictions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create own predictions"
    ON public.predictions
    FOR INSERT
    TO authenticated
    WITH CHECK (predictor_id = auth.uid());

-- Create index for better query performance
CREATE INDEX idx_predictions_predictor_target 
ON public.predictions(predictor_id, target_id);

-- Function to get current quarter
CREATE OR REPLACE FUNCTION get_current_quarter()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Q' || EXTRACT(QUARTER FROM CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;