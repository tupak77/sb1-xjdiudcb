/*
  # Create group chat room

  1. Changes
    - Create a single group chat room
    - Add all users to the room
    - Update policies for group access
*/

-- Create the main group chat room if it doesn't exist
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

-- Function to automatically add new users to the group chat
CREATE OR REPLACE FUNCTION add_user_to_group_chat()
RETURNS TRIGGER AS $$
DECLARE
  group_room_id UUID;
BEGIN
  SELECT id INTO group_room_id
  FROM public.chat_rooms
  WHERE name = 'Formidable Chat' AND is_group = true;

  IF group_room_id IS NOT NULL THEN
    INSERT INTO public.chat_participants (room_id, user_id)
    VALUES (group_room_id, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add new users to group chat
CREATE TRIGGER add_user_to_group_chat_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION add_user_to_group_chat();

-- Add existing users to group chat
DO $$
DECLARE
  group_room_id UUID;
BEGIN
  SELECT id INTO group_room_id
  FROM public.chat_rooms
  WHERE name = 'Formidable Chat' AND is_group = true;

  IF group_room_id IS NOT NULL THEN
    INSERT INTO public.chat_participants (room_id, user_id)
    SELECT group_room_id, id
    FROM public.profiles
    ON CONFLICT DO NOTHING;
  END IF;
END $$;