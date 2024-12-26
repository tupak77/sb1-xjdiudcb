/*
  # Chat System Implementation

  1. New Tables
    - `chat_rooms`: Stores chat rooms/conversations
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `name` (text, optional for group chats)
      - `is_group` (boolean)
    
    - `chat_participants`: Links users to chat rooms
      - `id` (uuid, primary key)
      - `room_id` (uuid, references chat_rooms)
      - `user_id` (uuid, references profiles)
      - `joined_at` (timestamp)
      - `last_read` (timestamp)
    
    - `chat_messages`: Stores all messages
      - `id` (uuid, primary key)
      - `room_id` (uuid, references chat_rooms)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_status`: Tracks online status
      - `user_id` (uuid, references profiles)
      - `status` (text)
      - `last_seen` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create chat_rooms table
CREATE TABLE public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    name TEXT,
    is_group BOOLEAN DEFAULT false
);

-- Create chat_participants table
CREATE TABLE public.chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    last_read TIMESTAMPTZ DEFAULT now(),
    UNIQUE(room_id, user_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_status table
CREATE TABLE public.user_status (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    status TEXT DEFAULT 'offline',
    last_seen TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- Policies for chat_rooms
CREATE POLICY "Users can view rooms they participate in"
    ON public.chat_rooms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE room_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create rooms"
    ON public.chat_rooms
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policies for chat_participants
CREATE POLICY "Users can view participants in their rooms"
    ON public.chat_participants
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE room_id = chat_participants.room_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join rooms"
    ON public.chat_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policies for chat_messages
CREATE POLICY "Users can view messages in their rooms"
    ON public.chat_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE room_id = chat_messages.room_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to their rooms"
    ON public.chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE room_id = chat_messages.room_id 
            AND user_id = auth.uid()
        )
        AND sender_id = auth.uid()
    );

-- Policies for user_status
CREATE POLICY "Users can view all statuses"
    ON public.user_status
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own status"
    ON public.user_status
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Function to update room's updated_at timestamp
CREATE OR REPLACE FUNCTION update_room_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_rooms
    SET updated_at = now()
    WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update room timestamp on new message
CREATE TRIGGER update_room_timestamp_trigger
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_room_timestamp();

-- Function to handle user status
CREATE OR REPLACE FUNCTION handle_user_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_status (user_id, status)
    VALUES (NEW.id, 'offline')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize user status on profile creation
CREATE TRIGGER handle_user_status_trigger
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_status();