import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false); // Set to false by default

  // Simplified auth context - no automatic session checking
  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      console.log('Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            full_name: profileData.full_name || '',
            user_type: profileData.user_type || 'athlete',
            age: profileData.age,
            primary_sport: profileData.primary_sport,
            location_state: profileData.location_state,
            preferred_language: profileData.preferred_language || 'en',
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw error, continue anyway
        }

        setUser(data.user);
        setProfile({
          id: data.user.id,
          full_name: profileData.full_name || '',
          user_type: profileData.user_type || 'athlete',
          age: profileData.age,
          primary_sport: profileData.primary_sport,
          location_state: profileData.location_state,
          preferred_language: profileData.preferred_language || 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        // Try to fetch profile, but don't fail if it doesn't work
        try {
          const { data: profileDataArray } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .limit(1);
          
          if (profileDataArray && profileDataArray.length > 0) {
            setProfile(profileDataArray[0]);
          }
        } catch (profileError) {
          console.log('Could not fetch profile:', profileError);
        }
      }
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};