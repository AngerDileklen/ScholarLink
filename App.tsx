import React, { useState } from 'react';
import { SearchInterface } from './components/SearchInterface';
import { ScholarCard } from './components/ScholarCard';
import { LandingSegments } from './components/LandingSegments';
import { ConnectModal } from './components/ConnectModal';
import { ProfileDetail } from './components/ProfileDetail';
import { Dashboard } from './components/Dashboard';
import { OpportunitiesBoard } from './components/OpportunitiesBoard';
import { Feed } from './components/Feed';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MOCK_SCHOLARS } from './services/mockData';
import { ScholarProfile, SearchFilters, UserRole } from './types';
import { calculateDistanceKm } from './utils/geo';
import { GraduationCap, Users, Globe2, Home, Map, Briefcase, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  // Navigation State
  const [view, setView] = useState<'feed' | 'discover' | 'dashboard' | 'opportunities'>('feed');
  
  // Data State
  const [scholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [filteredScholars, setFilteredScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  // Modal State
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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
    setIsProfileOpen(true);
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
          s.bio.toLowerCase().includes(topicLower)
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 md:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('feed')}>
              <div className="bg-brand-600 p-1.5 rounded-lg">
                 <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight hidden md:block">ScholarLink</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 md:space-x-8">
               <button onClick={() => setView('feed')} className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 border-b-2 transition-all ${view === 'feed' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <Home className={`w-5 h-5 ${view === 'feed' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">Home</span>
               </button>
               <button onClick={() => setView('discover')} className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 border-b-2 transition-all ${view === 'discover' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <Map className={`w-5 h-5 ${view === 'discover' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">Discover</span>
               </button>
               <button onClick={() => setView('opportunities')} className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 border-b-2 transition-all ${view === 'opportunities' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <Briefcase className={`w-5 h-5 ${view === 'opportunities' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">Jobs & Grants</span>
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
      <div className="flex-grow">
        {view === 'feed' && <Feed onSignupRequest={() => requireAuth(() => {})} />}
        {view === 'opportunities' && (
           <div className="max-w-6xl mx-auto px-4 py-8 w-full">
              <OpportunitiesBoard role={isAuthenticated ? 'corporate' : 'student'} />
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

        {view === 'discover' && (
          <>
            <div className="bg-brand-900 pb-20 pt-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">Global Scholar Map</h1>
                <p className="text-brand-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">Search by topic and location to visualize the academic landscape.</p>
                <div className="mt-6 flex justify-center gap-8 text-brand-200 opacity-80">
                  <div className="flex items-center gap-2"><Globe2 className="w-4 h-4" /><span className="text-xs font-medium">Global Reach</span></div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span className="text-xs font-medium">Verified Profiles</span></div>
                </div>
              </div>
            </div>
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
            {!currentFilters && <div className="mt-16"><LandingSegments /></div>}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-slate-800">{currentFilters ? 'Search Results' : 'Featured Scholars'}</h2>
                <span className="text-sm text-slate-500">Showing {filteredScholars.length} scholars</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {filteredScholars.map((scholar) => (
                  <ScholarCard key={scholar.id} scholar={scholar} distanceKm={(scholar as any).distance} onConnect={handleConnect} onViewProfile={handleViewProfile} />
                ))}
              </div>
            </main>
          </>
        )}
      </div>

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab={authMode} />
      {selectedScholar && (
        <>
          <ConnectModal scholar={selectedScholar} isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
          <ProfileDetail scholar={selectedScholar} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onConnect={() => { setIsProfileOpen(false); handleConnect(selectedScholar); }} />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

// Helper for the empty state icon
const SearchInterfaceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default App;