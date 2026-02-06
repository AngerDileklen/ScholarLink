import React, { useState } from 'react';
import { SearchInterface } from './components/SearchInterface';
import { ScholarCard } from './components/ScholarCard';
import { LandingSegments } from './components/LandingSegments';
import { ConnectModal } from './components/ConnectModal';
import { ProfilePage } from './components/ProfilePage';
import { Dashboard } from './components/Dashboard';
import { OpportunitiesBoard } from './components/OpportunitiesBoard';
import { Feed } from './components/Feed';
import { AuthModal } from './components/AuthModal';
import { ChatWidget } from './components/ChatWidget';
import { PaywallModal } from './components/PaywallModal';
import { CreatePostModal } from './components/CreatePostModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MOCK_SCHOLARS } from './services/mockData';
import { ScholarProfile, SearchFilters, UserRole } from './types';
import { calculateDistanceKm } from './utils/geo';
import { GraduationCap, Users, Globe2, Home, Map, Briefcase, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout, role } = useAuth();
  
  // Navigation State
  const [view, setView] = useState<'feed' | 'discover' | 'dashboard' | 'opportunities' | 'profile'>('feed');
  const [previousView, setPreviousView] = useState<'feed' | 'discover'>('feed');
  
  // Data State
  const [scholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [filteredScholars, setFilteredScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  // Modal State
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Paywall & Post State
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isGrantPostModalOpen, setIsGrantPostModalOpen] = useState(false);

  // Auth Guard
  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  // Handlers
  const handleConnect = (scholar: ScholarProfile) => {
    requireAuth(() => {
      setSelectedScholar(scholar);
      setIsConnectOpen(true);
    });
  };

  const handleViewProfile = (scholar: ScholarProfile) => {
    setSelectedScholar(scholar);
    // If we are currently in a main view, save it so we can go back
    if (view !== 'profile') {
      setPreviousView(view as 'feed' | 'discover');
    }
    setView('profile');
  };

  const handleBackFromProfile = () => {
    setView(previousView);
    setSelectedScholar(null);
  };

  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true);
    setCurrentFilters(filters);
    setTimeout(() => {
      let results = [...scholars];
      if (filters.topic) {
        const topicLower = filters.topic.toLowerCase();
        results = results.filter(s => 
          s.researchInterests.some(i => i.toLowerCase().includes(topicLower)) ||
          s.bio.toLowerCase().includes(topicLower) ||
          s.name.toLowerCase().includes(topicLower)
        );
      }
      if (filters.coordinates) {
        results = results.map(s => {
          const dist = calculateDistanceKm(filters.coordinates!, s.location.coordinates);
          return { ...s, distance: dist }; 
        }).filter((s: any) => s.distance <= filters.radiusKm);
        results.sort((a: any, b: any) => a.distance - b.distance);
      } else if (filters.locationName) {
        results = results.filter(s => 
          s.location.city.toLowerCase().includes(filters.locationName.toLowerCase())
        );
      }
      setFilteredScholars(results);
      setIsLoading(false);
    }, 600);
  };

  // Paywall Logic
  const handlePostOpportunityClick = () => {
    // In a real app, check if user has active subscription. 
    // Here we simulate checking and finding no subscription.
    setIsPaywallOpen(true);
  };

  const handlePaywallSuccess = () => {
    setIsPaywallOpen(false);
    // Simulate slight delay before opening the post modal
    setTimeout(() => {
      setIsGrantPostModalOpen(true);
    }, 300);
  };

  const handleGrantPostSubmit = (post: any) => {
    console.log("New Grant Created:", post);
    setIsGrantPostModalOpen(false);
    // In real app, we would add this to the grants list
  };

  // Determine effective role for UI logic (default to student if public)
  const effectiveRole = isAuthenticated && role ? role : 'student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm h-16 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('feed')}>
              <div className="bg-brand-600 p-1.5 rounded-lg">
                 <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight hidden md:block">ScholarLink</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 md:space-x-8 h-full">
               <button onClick={() => setView('feed')} className={`h-full flex flex-col justify-center items-center gap-1 px-3 border-b-2 transition-all ${view === 'feed' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <Home className={`w-5 h-5 ${view === 'feed' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium hidden md:block">Home</span>
               </button>
               <button onClick={() => setView('discover')} className={`h-full flex flex-col justify-center items-center gap-1 px-3 border-b-2 transition-all ${view === 'discover' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <Map className={`w-5 h-5 ${view === 'discover' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium hidden md:block">Discover</span>
               </button>
               <button onClick={() => setView('opportunities')} className={`h-full flex flex-col justify-center items-center gap-1 px-3 border-b-2 transition-all ${view === 'opportunities' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <Briefcase className={`w-5 h-5 ${view === 'opportunities' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium hidden md:block">Jobs & Grants</span>
               </button>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[120px]">
                      {(user as any).title || (user as any).industry}
                    </span>
                  </div>
                  <img src={user.avatarUrl} alt="User" className="w-9 h-9 rounded-full border border-slate-200 cursor-pointer" onClick={() => setView('dashboard')} />
                  <button onClick={logout} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Log Out">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden md:block">
                    Log In
                  </button>
                  <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} className="text-sm font-medium bg-transparent border border-brand-600 text-brand-600 hover:bg-brand-50 px-4 py-1.5 rounded-full transition-colors">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {view === 'feed' && (
          <Feed 
            onSignupRequest={() => requireAuth(() => {})} 
            onViewProfile={handleViewProfile}
          />
        )}
        
        {view === 'opportunities' && (
           <div className="max-w-6xl mx-auto px-4 py-8 w-full">
              <OpportunitiesBoard 
                role={effectiveRole} 
                onPostClick={handlePostOpportunityClick}
              />
           </div>
        )}
        
        {view === 'dashboard' && isAuthenticated && <Dashboard initialRole="professor" />}
        
        {view === 'dashboard' && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
             <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-6">
               <GraduationCap className="w-8 h-8 text-brand-600" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Please Log In</h2>
             <p className="text-slate-500 max-w-md mb-8">You need to be signed in to view your dashboard, manage applications, and track grants.</p>
             <button onClick={() => setIsAuthModalOpen(true)} className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-all">
               Log In to Dashboard
             </button>
          </div>
        )}

        {view === 'profile' && selectedScholar && (
          <ProfilePage 
            scholar={selectedScholar} 
            onBack={handleBackFromProfile} 
            onConnect={() => handleConnect(selectedScholar)}
          />
        )}

        {view === 'discover' && (
          <SearchInterface 
            onSearch={handleSearch} 
            results={filteredScholars}
            isLoading={isLoading} 
            onConnect={handleConnect}
          />
        )}
      </div>

      {/* Global Widgets */}
      {isAuthenticated && <ChatWidget />}

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab={authMode} />
      
      {selectedScholar && (
        <ConnectModal scholar={selectedScholar} isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
      )}

      {/* Paywall & Posting Modals */}
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onUpgrade={handlePaywallSuccess} 
      />
      
      <CreatePostModal 
        isOpen={isGrantPostModalOpen} 
        onClose={() => setIsGrantPostModalOpen(false)} 
        onSubmit={handleGrantPostSubmit}
      />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;