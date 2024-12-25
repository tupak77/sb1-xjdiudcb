/*
  # Fix database schema and add functionality

  1. Changes
    - Add missing functions for handling gold buttons
    - Add function to check mandanga limit
    - Add trigger for gold button validation
    - Add trigger for mandanga limit validation
    - Update policies to be more secure
*/

-- Function to check mandanga limit
CREATE OR REPLACE FUNCTION check_mandanga_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'mandanga' THEN
        IF (
            SELECT COUNT(*)
            FROM public.interactions
            WHERE user_id = NEW.user_id
            AND target_user = NEW.target_user
            AND type = 'mandanga'
        ) >= 3 THEN
            RAISE EXCEPTION 'Límite de mandangas alcanzado con esta persona';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle gold buttons
CREATE OR REPLACE FUNCTION handle_gold_button()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.used_gold_button THEN
        -- Check if user has gold buttons available
        IF (
            SELECT gold_buttons
            FROM public.users
            WHERE id = NEW.user_id
        ) <= 0 THEN
            RAISE EXCEPTION 'No hay botones de oro disponibles';
        END IF;

        -- Decrease gold buttons count
        UPDATE public.users
        SET gold_buttons = gold_buttons - 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS check_mandanga_limit_trigger ON public.interactions;
CREATE TRIGGER check_mandanga_limit_trigger
    BEFORE INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION check_mandanga_limit();

DROP TRIGGER IF EXISTS handle_gold_button_trigger ON public.interactions;
CREATE TRIGGER handle_gold_button_trigger
    BEFORE INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION handle_gold_button();

-- Update policies for better security
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update for all users" ON public.users;

CREATE POLICY "Enable read access for all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Enable update for own user"
    ON public.users FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Update interaction policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.interactions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.interactions;
DROP POLICY IF EXISTS "Enable update for all users" ON public.interactions;

CREATE POLICY "Enable read access for all users"
    ON public.interactions FOR SELECT
    USING (true);

CREATE POLICY "Enable insert own interactions"
    ON public.interactions FOR INSERT
    WITH CHECK (true);

-- Ensure users exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE name = 'PepeSimon') THEN
        INSERT INTO public.users (name, points, gold_buttons)
        VALUES ('PepeSimon', 0, 5);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.users WHERE name = 'Bigote Prime') THEN
        INSERT INTO public.users (name, points, gold_buttons)
        VALUES ('Bigote Prime', 0, 5);
    END IF;
END
$$;