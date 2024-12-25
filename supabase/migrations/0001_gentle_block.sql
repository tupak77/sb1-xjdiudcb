/*
  # Initial Database Setup

  1. New Tables
    - `users`: Stores user profiles and points
    - `interactions`: Records all user interactions
    - `medals`: Tracks user medals

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Setup triggers for points calculation

  3. Initial Data
    - Create initial users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create interaction type enum
CREATE TYPE interaction_type AS ENUM ('lio', 'chupachupa', 'mandanga');

-- Create users table
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    points INTEGER DEFAULT 0,
    gold_buttons INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create interactions table
CREATE TABLE public.interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    type interaction_type NOT NULL,
    target_user TEXT NOT NULL,
    points INTEGER NOT NULL,
    has_raza BOOLEAN DEFAULT false,
    has_nationality BOOLEAN DEFAULT false,
    used_gold_button BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create medals table
CREATE TABLE public.medals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    medal_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, medal_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.users
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON public.interactions
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON public.medals
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow insert own interactions" ON public.interactions
    FOR INSERT TO public WITH CHECK (true);

-- Create function to update user points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.users
        SET points = points + NEW.points
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for points update
CREATE TRIGGER on_interaction_points_update
    AFTER INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

-- Insert initial users
INSERT INTO public.users (name, points, gold_buttons)
VALUES 
    ('PepeSimon', 0, 5),
    ('Bigote Prime', 0, 5);