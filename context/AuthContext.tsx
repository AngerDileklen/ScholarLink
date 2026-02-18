import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

// Helper: build a minimal ScholarProfile from Supabase auth user
const buildFallbackProfile = (authUser: any, name: string, role: UserRole): ScholarProfile => ({
  id: authUser.id,
  name: name || authUser.email?.split('@')[0] || 'User',
  title: '',
  bio: '',
  avatarUrl: '',
  university: { name: '' },
  department: '',
  location: { city: '', country: '', coordinates: { lat: 0, lng: 0 } },
  researchInterests: [],
  acceptingStudents: false,
  fundingAvailable: false,
  openToIndustry: false,
  verified: false,
  hIndex: 0,
  citationCount: 0,
  role,
  activeProjects: [],
  papers: [],
  attendingEvents: [],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ScholarProfile | CorporateProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  // Prevent double-loading from both checkSession and onAuthStateChange
  const isHandlingAuth = useRef(false);

  const completeOnboarding = () => setHasCompletedOnboarding(true);

  // Load profile from DB, fall back to minimal profile if not found
  const loadUserProfile = async (authUser: any): Promise<void> => {
    try {
      const profile = await fetchProfileById(authUser.id);
      if (profile) {
        setUser(profile);
        setRole((profile.role as UserRole) || 'student');
        // If profile has research interests and bio, mark onboarding complete
        if (profile.researchInterests?.length >= 5 && profile.bio) {
          setHasCompletedOnboarding(true);
        }
      } else {
        // Profile doesn't exist yet — use fallback so UI doesn't break
        const metaRole = (authUser.user_metadata?.role as UserRole) || 'student';
        const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
        const fallback = buildFallbackProfile(authUser, metaName, metaRole);
        setUser(fallback);
        setRole(metaRole);
        setHasCompletedOnboarding(false);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      // Still set a fallback so the app doesn't hang
      const metaRole = (authUser.user_metadata?.role as UserRole) || 'student';
      const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
      setUser(buildFallbackProfile(authUser, metaName, metaRole));
      setRole(metaRole);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes (sign in / sign out from other tabs, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        setHasCompletedOnboarding(false);
        setLoading(false);
        return;
      }

      // TOKEN_REFRESHED and SIGNED_IN are handled — but skip if we're already handling login
      if (session?.user && (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        await loadUserProfile(session.user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
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
          data: { name, role: selectedRole },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in DB
        await upsertProfile({
          email,
          name,
          role: selectedRole,
        }, data.user.id);

        // Try to fetch the created profile, fall back to minimal
        const profile = await fetchProfileById(data.user.id);
        if (profile) {
          setUser(profile);
          setRole(selectedRole);
        } else {
          setUser(buildFallbackProfile(data.user, name, selectedRole));
          setRole(selectedRole);
        }
        setHasCompletedOnboarding(false);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setHasCompletedOnboarding(false);
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
      completeOnboarding,
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
