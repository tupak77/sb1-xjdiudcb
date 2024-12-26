/*
  # Fix chat policies

  1. Changes
    - Fix recursive policies for chat_participants
    - Update room access policies
    - Add public group chat access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON public.chat_participants;
DROP POLICY IF EXISTS "Users can join rooms" ON public.chat_participants;
DROP POLICY IF EXISTS "Users can view rooms they participate in" ON public.chat_rooms;

-- Create new policies for chat_rooms
CREATE POLICY "Anyone can view group chat"
    ON public.chat_rooms
    FOR SELECT
    USING (is_group = true);

CREATE POLICY "Users can view rooms they participate in"
    ON public.chat_rooms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE room_id = id AND user_id = auth.uid()
        )
        OR is_group = true
    );

-- Create new policies for chat_participants
CREATE POLICY "Anyone can view group chat participants"
    ON public.chat_participants
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id AND is_group = true
        )
    );

CREATE POLICY "Users can join group chat"
    ON public.chat_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id AND is_group = true
        )
    );

-- Update message policies
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages to their rooms" ON public.chat_messages;

CREATE POLICY "Anyone can view group chat messages"
    ON public.chat_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id AND is_group = true
        )
    );

CREATE POLICY "Users can send messages to group chat"
    ON public.chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_rooms
            WHERE id = room_id AND is_group = true
        )
        AND sender_id = auth.uid()
    );