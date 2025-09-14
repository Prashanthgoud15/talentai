/*
  # Fix Coach-Athlete Connections RLS Policy

  1. Security Updates
    - Drop existing problematic policies for coach_athlete_connections table
    - Create new simple policies that allow athletes to create connection requests
    - Allow both coaches and athletes to read their own connections
    - Allow both parties to update connection status

  2. Policy Details
    - INSERT: Athletes can create connection requests where they are the athlete
    - SELECT: Users can read connections where they are either coach or athlete
    - UPDATE: Users can update connections where they are either coach or athlete
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Coaches can create connections" ON coach_athlete_connections;
DROP POLICY IF EXISTS "Users can read own connections" ON coach_athlete_connections;
DROP POLICY IF EXISTS "Users can update own connections" ON coach_athlete_connections;

-- Create new simple policies
CREATE POLICY "Athletes can create connection requests"
  ON coach_athlete_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Users can read their connections"
  ON coach_athlete_connections
  FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid());

CREATE POLICY "Users can update their connections"
  ON coach_athlete_connections
  FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid())
  WITH CHECK (coach_id = auth.uid() OR athlete_id = auth.uid());