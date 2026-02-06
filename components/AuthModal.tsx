import React, { useState } from 'react';
import { X, GraduationCap, Building2, User } from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>('professor');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      if (mode === 'login') {
        login(selectedRole);
      } else {
        signup(selectedRole, {}); 
      }
      setLoading(false);
      onClose();
    }, 800);
  };

  const RoleButton = ({ role, icon: Icon, label, desc }: any) => (
    <button
      type="button"
      onClick={() => setSelectedRole(role)}
      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
        selectedRole === role 
          ? 'border-brand-600 bg-brand-50' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
        selectedRole === role ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className={`font-bold ${selectedRole === role ? 'text-brand-900' : 'text-slate-900'}`}>{label}</h4>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
      
      {selectedRole === role && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-brand-600 rounded-full animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Join ScholarLink'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              I am a...
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <RoleButton 
                role="professor" 
                icon={GraduationCap} 
                label="Professor" 
                desc="Recruit talent & manage lab"
              />
              <RoleButton 
                role="student" 
                icon={User} 
                label="Student" 
                desc="Find grants & supervisors"
              />
              <RoleButton 
                role="corporate" 
                icon={Building2} 
                label="Partner" 
                desc="R&D grants & challenges"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="name@university.edu"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                mode === 'login' ? 'Log In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Switcher */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 font-bold text-brand-600 hover:text-brand-800 hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};