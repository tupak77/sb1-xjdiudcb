/*
  # Add Yoko Ono Medal Support

  1. Changes
    - No schema changes required, just documentation of new medal type
    - Medal ID: yoko-ono
    - Description: Points with girls from the same family
*/

-- No schema changes needed as medals are handled through the medals table
-- This migration serves as documentation for the new medal type

COMMENT ON TABLE public.medals IS 'Stores user medals including the new Yoko Ono medal for points with girls from the same family';