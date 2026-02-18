import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, ScholarProfile, CorporateProfile } from '../types';
import { supabase } from '../services/supabase';
import { fetchProfileById, upsertProfile } from '../services/api';

interface AuthContextType {
  user: ScholarProfile | CorporateProfile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ScholarProfile | CorporateProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile from database
          const profile = await fetchProfileById(session.user.id);
          if (profile) {
            setUser(profile);
            setRole(profile.role || 'student');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfileById(session.user.id);
        if (profile) {
          setUser(profile);
          setRole(profile.role || 'student');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch or create profile
        let profile = await fetchProfileById(data.user.id);
        
        if (!profile) {
          // Create basic profile if doesn't exist
          await upsertProfile({
            email,
            name: email.split('@')[0],
            role: 'student',
          }, data.user.id);
          profile = await fetchProfileById(data.user.id);
        }

        if (profile) {
          setUser(profile);
          setRole(profile.role || 'student');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, selectedRole: UserRole) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: selectedRole,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await upsertProfile({
          email,
          name,
          role: selectedRole,
        }, data.user.id);

        // Fetch created profile
        const profile = await fetchProfileById(data.user.id);
        if (profile) {
          setUser(profile);
          setRole(selectedRole);
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      role, 
      loading, 
      hasCompletedOnboarding,
      login, 
      signup, 
      logout,
      completeOnboarding 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
