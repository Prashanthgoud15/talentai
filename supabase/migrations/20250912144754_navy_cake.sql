/*
  # Fix RLS Policies Infinite Recursion

  1. Security Changes
    - Drop all existing problematic RLS policies on user_profiles table
    - Create simple, non-recursive policies
    - Ensure policies use direct auth.uid() comparisons only

  2. Policy Changes
    - Users can read their own profile: auth.uid() = id
    - Users can insert their own profile: auth.uid() = id
    - Users can update their own profile: auth.uid() = id
    - Remove complex coach policies that cause recursion
*/

-- Drop all existing policies on user_profiles to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Coaches can read athlete profiles" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;