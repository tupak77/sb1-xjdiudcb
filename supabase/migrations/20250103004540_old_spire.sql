/*
  # Reset User Data

  1. Changes
    - Reset all user points to 0
    - Delete all medals
    - Delete all interactions
*/

-- Reset points for all users
UPDATE public.profiles
SET points = 0;

-- Delete all medals
DELETE FROM public.medals;

-- Delete all interactions
DELETE FROM public.interactions;