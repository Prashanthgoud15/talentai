/*
  # Create user profiles and sports ecosystem tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `user_type` (enum: athlete, coach)
      - `age` (integer)
      - `primary_sport` (text)
      - `location_state` (text)
      - `preferred_language` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `assessment_type` (text)
      - `video_url` (text)
      - `ai_analysis` (jsonb)
      - `performance_score` (integer)
      - `metrics` (jsonb)
      - `recommendations` (text[])
      - `created_at` (timestamp)
    
    - `coach_athlete_connections`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, references user_profiles)
      - `athlete_id` (uuid, references user_profiles)
      - `status` (enum: pending, accepted, rejected)
      - `created_at` (timestamp)
    
    - `training_videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `youtube_url` (text)
      - `sport` (text)
      - `difficulty_level` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create enum types
CREATE TYPE user_type_enum AS ENUM ('athlete', 'coach');
CREATE TYPE connection_status_enum AS ENUM ('pending', 'accepted', 'rejected');

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  user_type user_type_enum NOT NULL,
  age integer,
  primary_sport text,
  location_state text,
  preferred_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  assessment_type text NOT NULL,
  video_url text,
  ai_analysis jsonb,
  performance_score integer,
  metrics jsonb,
  recommendations text[],
  created_at timestamptz DEFAULT now()
);

-- Coach-athlete connections table
CREATE TABLE IF NOT EXISTS coach_athlete_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  status connection_status_enum DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(coach_id, athlete_id)
);

-- Training videos table
CREATE TABLE IF NOT EXISTS training_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  youtube_url text NOT NULL,
  sport text,
  difficulty_level text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_athlete_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Coaches can read athlete profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'athlete' OR 
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.user_type = 'coach'
    )
  );

-- RLS Policies for assessments
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Coaches can read athlete assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM coach_athlete_connections cac
      JOIN user_profiles up ON up.id = auth.uid()
      WHERE cac.coach_id = auth.uid() 
      AND cac.athlete_id = user_id 
      AND cac.status = 'accepted'
      AND up.user_type = 'coach'
    )
  );

-- RLS Policies for coach_athlete_connections
CREATE POLICY "Users can read own connections"
  ON coach_athlete_connections
  FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid());

CREATE POLICY "Coaches can create connections"
  ON coach_athlete_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    coach_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND user_type = 'coach'
    )
  );

CREATE POLICY "Users can update own connections"
  ON coach_athlete_connections
  FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid());

-- RLS Policies for training_videos
CREATE POLICY "Anyone can read training videos"
  ON training_videos
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample training videos
INSERT INTO training_videos (title, description, youtube_url, sport, difficulty_level) VALUES
('Sprint Technique Fundamentals', 'Learn proper sprinting form and technique', 'https://www.youtube.com/watch?v=tkC7k_zW5_4', 'Athletics', 'Beginner'),
('Advanced Speed Training', 'High-intensity sprint workouts for competitive athletes', 'https://www.youtube.com/watch?v=30Z2SIJ0OaI', 'Athletics', 'Advanced'),
('Swimming Stroke Technique', 'Perfect your freestyle swimming technique', 'https://www.youtube.com/watch?v=5HLW2AI1Ink', 'Swimming', 'Intermediate'),
('Basketball Shooting Drills', 'Improve your shooting accuracy and form', 'https://www.youtube.com/watch?v=8z8SpgRYJ2s', 'Basketball', 'Beginner'),
('Football Agility Training', 'Enhance your agility and quick movements', 'https://www.youtube.com/watch?v=jjSj7QaXKOg', 'Football', 'Intermediate'),
('Badminton Footwork Basics', 'Master the fundamentals of badminton footwork', 'https://www.youtube.com/watch?v=yoRtWJCVBcg', 'Badminton', 'Beginner');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();