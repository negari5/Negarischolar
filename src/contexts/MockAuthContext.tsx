import React, { createContext, useContext, useEffect, useState } from 'react';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  user_type: 'student' | 'parent' | 'mentor' | 'school' | 'admin' | 'super_admin';
  city: string | null;
  preparatory_school_type: string | null;
  education_level: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  current_grade_level: string | null;
  school_name: string | null;
  gpa: number | null;
  career_interests: string[] | null;
  preferred_countries: string[] | null;
  preferred_fields: string[] | null;
  language_proficiency: any | null;
  has_completed_profile: boolean;
  subscription_tier: string;
  subscription_expires_at: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
}

interface MockUser {
  id: string;
  email: string;
  user_metadata: any;
}

interface MockAuthContextType {
  user: MockUser | null;
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Mock users database
const mockUsers: Array<{
  id: string;
  email: string;
  password: string;
  profile: Profile;
}> = [
  {
    id: '1',
    email: 'negari@gmail.com',
    password: '#DoHardThings5',
    profile: {
      id: '1',
      email: 'negari@gmail.com',
      first_name: 'Super',
      last_name: 'Admin',
      full_name: 'Super Admin',
      user_type: 'super_admin' as const,
      city: 'System City',
      preparatory_school_type: null,
      education_level: null,
      phone: null,
      date_of_birth: null,
      gender: null,
      current_grade_level: null,
      school_name: null,
      gpa: null,
      career_interests: null,
      preferred_countries: null,
      preferred_fields: null,
      language_proficiency: null,
      has_completed_profile: true,
      subscription_tier: 'premium',
      subscription_expires_at: null,
      is_admin: true,
      is_super_admin: true,
    }
  },
  {
    id: '2',
    email: 'student@test.com',
    password: 'password123',
    profile: {
      id: '2',
      email: 'student@test.com',
      first_name: 'Test',
      last_name: 'Student',
      full_name: 'Test Student',
      user_type: 'student' as const,
      city: 'Test City',
      preparatory_school_type: null,
      education_level: 'undergraduate',
      phone: null,
      date_of_birth: null,
      gender: null,
      current_grade_level: null,
      school_name: null,
      gpa: null,
      career_interests: null,
      preferred_countries: null,
      preferred_fields: null,
      language_proficiency: null,
      has_completed_profile: false,
      subscription_tier: 'free',
      subscription_expires_at: null,
      is_admin: false,
      is_super_admin: false,
    }
  }
];

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('mockAuthSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const mockUser = mockUsers.find(u => u.id === sessionData.userId);
      if (mockUser) {
        setUser({
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: {}
        });
        setSession(sessionData);
        setProfile(mockUser.profile);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    // Mock signup - just add to our mock users array
    const newUserId = (mockUsers.length + 1).toString();
    const newUser = {
      id: newUserId,
      email,
      password,
      profile: {
        id: newUserId,
        email,
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || email,
        user_type: userData.user_type || 'student' as Profile['user_type'],
        city: userData.city || null,
        preparatory_school_type: null,
        education_level: userData.education_level || null,
        phone: null,
        date_of_birth: null,
        gender: null,
        current_grade_level: null,
        school_name: null,
        gpa: null,
        career_interests: null,
        preferred_countries: null,
        preferred_fields: null,
        language_proficiency: null,
        has_completed_profile: false,
        subscription_tier: 'free',
        subscription_expires_at: null,
        is_admin: false,
        is_super_admin: false,
      }
    };
    
    mockUsers.push(newUser);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        return { error: { message: 'Invalid login credentials' } };
      }

      const sessionData = {
        userId: mockUser.id,
        access_token: 'mock_token_' + mockUser.id,
        expires_at: Date.now() + 3600000, // 1 hour
      };

      setUser({
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: {}
      });
      setSession(sessionData);
      setProfile(mockUser.profile);

      // Save to localStorage for persistence
      localStorage.setItem('mockAuthSession', JSON.stringify(sessionData));
      
      return { error: null };
    } catch (error: any) {
      console.error("Mock sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem('mockAuthSession');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No user logged in' };
    
    try {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      
      // Update in mock users array
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex].profile = updatedProfile;
      }
      
      return { error: null };
    } catch (error) {
      console.error('Mock profile update error:', error);
      return { error };
    }
  };

  return (
    <MockAuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </MockAuthContext.Provider>
  );
};