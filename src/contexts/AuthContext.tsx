import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  profileLoaded: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fetchProfile = async (userId: string) => {
    setProfileLoading(true);
    setProfileLoaded(false);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
      setProfileLoaded(true);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);

      // Always store session and user (prevents deadlocks)
      setSession(session);
      setUser(session?.user ?? null);

      // Handle invite acceptance - when user clicks email invite link and sets password
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in (possibly from invite):', session.user.email);
      }

      if (session?.user) {
        setProfileLoading(true);
        setProfileLoaded(false);
        // Defer any Supabase calls
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setProfileLoading(false);
        setProfileLoaded(false);
      }

      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfileLoading(true);
        setProfileLoaded(false);
        fetchProfile(session.user.id);
      } else {
        setProfileLoaded(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    // Get the current domain for redirect URL
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    // If signup succeeded and we have a user, persist profile details
    try {
      if (!error && data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            ...userData,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error saving profile during signup:', profileError);
        }
      }
    } catch (profileException) {
      console.error('Unexpected error while saving profile during signup:', profileException);
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;

      // Ensure profile exists
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error updating user profile:", profileError);
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileLoading(false);
    setProfileLoaded(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      console.log('Updating profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        return { error };
      }
      
      if (data) {
        console.log('Profile updated in DB, updating local state:', data);
        setProfile(data);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      profileLoading,
      profileLoaded,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
