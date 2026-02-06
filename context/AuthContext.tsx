import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, ScholarProfile, CorporateProfile } from '../types';
import { MOCK_SCHOLARS, MOCK_CORPORATES } from '../services/mockData';

interface AuthContextType {
  user: ScholarProfile | CorporateProfile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (role: UserRole) => void;
  signup: (role: UserRole, data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ScholarProfile | CorporateProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  // Initialize from local storage or default (optional, keeping it simple for MVP)
  // For demo: default is logged out.

  const login = (selectedRole: UserRole) => {
    // Simulate API Call delay
    setTimeout(() => {
      if (selectedRole === 'professor') {
        setUser(MOCK_SCHOLARS[0]); // Log in as Dr. Tremblay
        setRole('professor');
      } else if (selectedRole === 'student') {
        setUser(MOCK_SCHOLARS[3]); // Log in as Sarah Connor (using scholar profile as student for demo)
        setRole('student');
      } else if (selectedRole === 'corporate') {
        setUser(MOCK_CORPORATES[0]); // Log in as DeepMind
        setRole('corporate');
      }
    }, 300);
  };

  const signup = (selectedRole: UserRole, data: any) => {
    console.log('Signup data:', data);
    // Auto-login after signup simulation
    login(selectedRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role, login, signup, logout }}>
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