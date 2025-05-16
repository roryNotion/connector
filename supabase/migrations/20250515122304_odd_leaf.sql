/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add new RLS policy to allow users to insert their own profile
    - Policy ensures users can only create a profile with their own auth.uid()

  2. Security
    - Policy maintains security by ensuring users can only create their own profile
    - Matches existing RLS pattern for profiles table
*/

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);