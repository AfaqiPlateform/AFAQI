-- Migration script to add phone and bac_filiere columns to profiles table
-- Run this on your existing Supabase database

-- Create ENUM type for bac filiere if it doesn't exist
DO $$ BEGIN
    CREATE TYPE bac_filiere_enum AS ENUM (
        'Sciences Mathématiques',
        'Sciences Expérimentales',
        'Sciences Économiques',
        'Lettres',
        'Sciences et Technologies',
        'Autre'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add phone column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add bac_filiere column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bac_filiere bac_filiere_enum;

-- Add comments for documentation
COMMENT ON COLUMN profiles.phone IS 'User phone number';
COMMENT ON COLUMN profiles.bac_filiere IS 'Baccalaureate stream/track (filière)';

