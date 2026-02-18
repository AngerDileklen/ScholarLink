import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Building2, User, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultTab);
  
  // Reset mode when modal opens with new defaultTab
  useEffect(() => {
    if (isOpen) {
      setMode(defaultTab);
      // Clear form when switching
      setEmail('');
      setPassword('');
      setName('');
      setError('');
    }
  }, [isOpen, defaultTab]);
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('professor');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  if (!isOpen) return null;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/?reset=true`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  // University email domain validation
  const ACADEMIC_DOMAINS = ['.edu', '.ac.uk', '.ac.', '.edu.', '.uni-', '.univ.', '.university.'];
  const CORPORATE_ALLOWED = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
  
  const isAcademicEmail = (emailAddr: string): boolean => {
    const domain = emailAddr.split('@')[1]?.toLowerCase() || '';
    return ACADEMIC_DOMAINS.some(d => domain.includes(d));
  };

  const validateEmail = (emailAddr: string, role: string): string => {
    if (!emailAddr.includes('@')) return 'Please enter a valid email address.';
    if (mode === 'signup' && role !== 'corporate') {
      if (!isAcademicEmail(emailAddr)) {
        return '⚠️ Please use your university email (e.g. name@university.edu or name@uni.ac.uk). Corporate partners may use any email.';
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters.');
          setLoading(false);
          return;
        }
        // University email check (soft warning for now — will be enforced later)
        const emailWarning = validateEmail(email, selectedRole);
        if (emailWarning) {
          setError(emailWarning);
          setLoading(false);
          return;
        }
        await signup(email, password, name, selectedRole);
      }
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const RoleButton = ({ role, icon: Icon, label, desc }: any) => (
    <button
      type="button"
      onClick={() => setSelectedRole(role)}
      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
        selectedRole === role 
          ? 'border-primary bg-primary/10' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
        selectedRole === role ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className={`font-bold ${selectedRole === role ? 'text-primary' : 'text-slate-900'}`}>{label}</h4>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
      
      {selectedRole === role && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full animate-pulse" />
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

          {/* FORGOT PASSWORD MODE */}
          {forgotMode ? (
            <div>
              <button onClick={() => { setForgotMode(false); setResetSent(false); setError(''); }} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>

              {resetSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h3>
                  <p className="text-sm text-slate-500">We sent a password reset link to <strong>{resetEmail}</strong>. Click the link in the email to set a new password.</p>
                  <button onClick={() => { setForgotMode(false); setResetSent(false); }} className="mt-6 text-sm font-semibold text-primary hover:underline">
                    Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Reset your password</h3>
                    <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send you a reset link.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="name@university.edu"
                    />
                  </div>
                  {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </div>
          ) : (
          <>
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
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Dr. John Smith"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="name@university.edu"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

          {/* Forgot password link — only on login */}
          {mode === 'login' && (
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => { setForgotMode(true); setError(''); setResetEmail(email); }}
                className="text-sm text-slate-400 hover:text-primary hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Switcher */}
          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 font-bold text-primary hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};
