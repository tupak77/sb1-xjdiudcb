-- Habilitar la extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos enumerados
CREATE TYPE interaction_type AS ENUM ('lio', 'chupachupa', 'mandanga');

-- Tabla de usuarios
CREATE TABLE public.users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    gold_buttons INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de interacciones
CREATE TABLE public.interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users NOT NULL,
    type interaction_type NOT NULL,
    target_user TEXT NOT NULL,
    points INTEGER NOT NULL,
    has_raza BOOLEAN DEFAULT false,
    has_nationality BOOLEAN DEFAULT false,
    used_gold_button BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de medallas
CREATE TABLE public.medals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users NOT NULL,
    medal_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, medal_id)
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Users can view all profiles"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Políticas de seguridad para interacciones
CREATE POLICY "Users can view all interactions"
    ON public.interactions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert own interactions"
    ON public.interactions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions"
    ON public.interactions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Políticas de seguridad para medallas
CREATE POLICY "Users can view all medals"
    ON public.medals FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can receive medals"
    ON public.medals FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Función para actualizar puntos de usuario
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.users
        SET points = points + NEW.points
        WHERE id = NEW.user_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.users
        SET points = points - OLD.points
        WHERE id = OLD.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar puntos automáticamente
CREATE TRIGGER on_interaction_change
    AFTER INSERT OR DELETE ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

-- Función para verificar límite de mandangas
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
            AND created_at > NOW() - INTERVAL '1 year'
        ) >= 3 THEN
            RAISE EXCEPTION 'Límite de mandangas alcanzado con esta persona';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para verificar límite de mandangas
CREATE TRIGGER check_mandanga_limit_trigger
    BEFORE INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION check_mandanga_limit();

-- Función para verificar botones de oro disponibles
CREATE OR REPLACE FUNCTION check_gold_buttons()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.used_gold_button THEN
        IF (
            SELECT gold_buttons
            FROM public.users
            WHERE id = NEW.user_id
        ) <= 0 THEN
            RAISE EXCEPTION 'No hay botones de oro disponibles';
        END IF;
        
        UPDATE public.users
        SET gold_buttons = gold_buttons - 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para verificar botones de oro
CREATE TRIGGER check_gold_buttons_trigger
    BEFORE INSERT ON public.interactions
    FOR EACH ROW
    EXECUTE FUNCTION check_gold_buttons();