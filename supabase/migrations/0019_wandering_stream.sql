/*
  # Add Bruno Quiroga Medal
  
  1. Documentation
    - Adds support for the new "Bruno Quiroga" medal
    - Medal is awarded for getting a "chupa chupa" in the street
    
  2. No schema changes needed
    - Medals are handled through the existing medals table
    - Medal types are managed in the frontend application
*/

-- Add comment to document the new medal type
COMMENT ON TABLE public.medals IS 'Stores user medals including the new Bruno Quiroga medal for getting a chupa chupa in the street';