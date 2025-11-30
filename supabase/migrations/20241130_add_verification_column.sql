-- Add is_verified column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Update existing profiles to be unverified by default (already handled by DEFAULT, but good to be explicit if needed)
-- UPDATE profiles SET is_verified = false WHERE is_verified IS NULL;
