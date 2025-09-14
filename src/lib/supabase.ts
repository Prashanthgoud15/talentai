import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found, using demo mode');
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co', 
  supabaseAnonKey || 'demo-key', 
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export type UserProfile = {
  id: string;
  full_name: string;
  user_type: 'athlete' | 'coach';
  age?: number;
  primary_sport?: string;
  location_state?: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
};

export type Assessment = {
  id: string;
  user_id: string;
  assessment_type: string;
  video_url?: string;
  ai_analysis?: any;
  performance_score?: number;
  metrics?: any;
  recommendations?: string[];
  created_at: string;
};

export type CoachAthleteConnection = {
  id: string;
  coach_id: string;
  athlete_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  athlete?: UserProfile;
  coach?: UserProfile;
};

export type TrainingVideo = {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  sport?: string;
  difficulty_level?: string;
  created_at: string;
};