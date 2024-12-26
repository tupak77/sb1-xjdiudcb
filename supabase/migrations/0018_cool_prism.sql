/*
  # Fix chat policies - Final version

  1. Changes
    - Simplify policies to prevent recursion
    - Add direct policies for group chat
    - Remove complex policy chains
*/

-- Drop existing complex policies
DROP POLICY IF EXISTS "Anyone can view group chat" ON public.chat_rooms;
DROP POLICY IF EXISTS "Users can view rooms they participate in" ON public.chat_rooms;
DROP POLICY IF EXISTS "Anyone can view group chat participants" ON public.chat_participants;
DROP POLICY IF EXISTS "Users can join group chat" ON public.chat_participants;
DROP POLICY IF EXISTS "Anyone can view group chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages to group chat" ON public.chat_messages;

-- Simple direct policies for chat rooms
CREATE POLICY "Enable read access for group chat"
    ON public.chat_rooms
    FOR SELECT
    USING (is_group = true);

-- Simple direct policies for chat participants
CREATE POLICY "Enable read access for group chat participants"
    ON public.chat_participants
    FOR SELECT
    USING (
        room_id IN (
            SELECT id FROM public.chat_rooms WHERE is_group = true
        )
    );

CREATE POLICY "Enable insert for group chat participants"
    ON public.chat_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (
        room_id IN (
            SELECT id FROM public.chat_rooms WHERE is_group = true
        )
    );

-- Simple direct policies for chat messages
CREATE POLICY "Enable read access for group chat messages"
    ON public.chat_messages
    FOR SELECT
    USING (
        room_id IN (
            SELECT id FROM public.chat_rooms WHERE is_group = true
        )
    );

CREATE POLICY "Enable insert for group chat messages"
    ON public.chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        room_id IN (
            SELECT id FROM public.chat_rooms WHERE is_group = true
        )
        AND sender_id = auth.uid()
    );

-- Ensure the group chat room exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.chat_rooms 
        WHERE name = 'Formidable Chat' AND is_group = true
    ) THEN
        INSERT INTO public.chat_rooms (name, is_group)
        VALUES ('Formidable Chat', true);
    END IF;
END $$;