import React, { useState } from 'react';
import { SearchInterface } from './components/SearchInterface';
import { ProfilePage } from './components/ProfilePage';
import { Dashboard } from './components/Dashboard';
import { OpportunitiesBoard } from './components/OpportunitiesBoard';
import { Feed } from './components/Feed';
import { AuthModal } from './components/AuthModal';
import { ChatWidget } from './components/ChatWidget';
import { PaywallModal } from './components/PaywallModal';
import { CreatePostModal } from './components/CreatePostModal';
import { ConnectModal } from './components/ConnectModal';
import { ConferenceCompanion } from './components/ConferenceCompanion';
import { MapSearch } from './components/MapSearch';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingModal } from './components/OnboardingModal';
import { MOCK_SCHOLARS, MOCK_EVENTS } from './services/mockData';
import { ScholarProfile, SearchFilters } from './types';
import { calculateDistanceKm } from './utils/geo';
import {
  GraduationCap, Home, Map as MapIcon, Briefcase, MessageSquare,
  Bell, Search, LogOut, Menu, User, Calendar
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, logout, role, hasCompletedOnboarding, completeOnboarding } = useAuth();

  // Navigation State
  const [view, setView] = useState<'feed' | 'discover' | 'dashboard' | 'opportunities' | 'profile' | 'conference'>('feed');
  const [previousView, setPreviousView] = useState<'feed' | 'discover'>('feed');
  const [networkView, setNetworkView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [scholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [filteredScholars, setFilteredScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [isLoading, setIsLoading] = useState(false);

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

  const handlePostOpportunityClick = () => {
    setIsPaywallOpen(true);
  };

  const handlePaywallSuccess = () => {
    setIsPaywallOpen(false);
    setTimeout(() => {
      setIsGrantPostModalOpen(true);
    }, 300);
  };

  const handleGrantPostSubmit = (post: any) => {
    console.log("New Grant Created:", post);
    setIsGrantPostModalOpen(false);
  };

  const effectiveRole = isAuthenticated && role ? role : 'student';

  const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-4 py-1 border-b-2 transition-colors ${active
          ? 'border-primary text-primary'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] md:text-xs font-medium mt-0.5">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex flex-col font-sans text-slate-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full items-center">

            {/* Left: Logo & Search */}
            <div className="flex items-center gap-6 flex-1">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setView('feed')}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 hidden md:block">ScholarLink</span>
              </div>

              <div className="hidden md:block w-full max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400 w-4 h-4" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search for papers, people, or topics..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        // Perform search and navigate to discover
                        const topicLower = searchQuery.toLowerCase();
                        const results = scholars.filter(s =>
                          s.researchInterests.some(i => i.toLowerCase().includes(topicLower)) ||
                          s.bio.toLowerCase().includes(topicLower) ||
                          s.name.toLowerCase().includes(topicLower) ||
                          s.university.name.toLowerCase().includes(topicLower)
                        );
                        setFilteredScholars(results);
                        setView('discover');
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Center: Nav Icons */}
            <div className="flex items-center justify-center gap-1">
              <NavItem icon={Home} label="Feed" active={view === 'feed'} onClick={() => setView('feed')} />
              <NavItem icon={MapIcon} label="Network" active={view === 'discover'} onClick={() => setView('discover')} />
              <NavItem icon={Calendar} label="Events" active={view === 'conference'} onClick={() => setView('conference')} />
              {/* Jobs - Only visible to professors and corporate */}
              {(effectiveRole === 'professor' || effectiveRole === 'corporate') && (
                <NavItem icon={Briefcase} label="Jobs" active={view === 'opportunities'} onClick={() => setView('opportunities')} />
              )}
              {/* Dashboard - Only visible when authenticated */}
              {isAuthenticated && effectiveRole !== 'student' && (
                <NavItem icon={Menu} label="Dash" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
              )}
            </div>

            {/* Right: Profile & Actions */}
            <div className="flex items-center justify-end gap-4 flex-1">
              <button className="p-1 rounded-full text-slate-500 hover:text-slate-700 focus:outline-none hidden sm:block">
                <Bell className="w-5 h-5" />
              </button>

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  {/* Profile Avatar - goes to own profile */}
                  <div
                    className="cursor-pointer group"
                    onClick={() => {
                      // Find current user's scholar profile
                      const myProfile = scholars.find(s => s.name === user.name);
                      if (myProfile) {
                        setSelectedScholar(myProfile);
                        setView('profile');
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 group-hover:border-primary transition-colors">
                      <img alt={user.name} className="w-full h-full object-cover" src={user.avatarUrl} />
                    </div>
                  </div>
                  {/* Name and dropdown */}
                  <div className="relative group">
                    <div className="hidden xl:block text-sm font-medium text-slate-700 cursor-pointer">
                      {user.name.split(' ')[1] || user.name}
                    </div>
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            const myProfile = scholars.find(s => s.name === user.name);
                            if (myProfile) {
                              setSelectedScholar(myProfile);
                              setView('profile');
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => setView('dashboard')}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); logout(); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="text-sm font-medium text-slate-600 hover:text-primary">
                    Log In
                  </button>
                  <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} className="text-sm font-medium bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-hover transition-colors shadow-sm">
                    Sign Up
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow">
        {view === 'feed' && (
          <Feed
            onSignupRequest={() => requireAuth(() => { })}
            onViewProfile={handleViewProfile}
          />
        )}

        {view === 'opportunities' && (
          <OpportunitiesBoard
            role={effectiveRole}
            onPostClick={handlePostOpportunityClick}
          />
        )}

        {view === 'dashboard' && isAuthenticated && role && <Dashboard userRole={role} />}

        {view === 'dashboard' && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Please Log In</h2>
            <p className="text-slate-500 max-w-md mb-8">Access your analytics dashboard and manage applications.</p>
            <button onClick={() => setIsAuthModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-all">
              Log In
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

        {view === 'discover' && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MapIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Discover the Scholar Network</h2>
            <p className="text-slate-500 max-w-md mb-8">Sign up to search and filter thousands of professors, PhD students, and researchers by topic, location, and availability.</p>
            <div className="flex gap-3">
              <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-all">
                Join ScholarLink
              </button>
              <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-all">
                Log In
              </button>
            </div>
          </div>
        )}

        {view === 'discover' && isAuthenticated && (
          <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* View Toggle */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNetworkView('list')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${networkView === 'list'
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setNetworkView('map')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${networkView === 'map'
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  Map View
                </button>
              </div>
              <span className="text-sm text-slate-500">{filteredScholars.length} scholars found</span>
            </div>

            {networkView === 'list' ? (
              <SearchInterface
                onSearch={handleSearch}
                results={filteredScholars}
                isLoading={isLoading}
                onConnect={handleConnect}
                onViewProfile={handleViewProfile}
              />
            ) : (
              <MapSearch
                scholars={filteredScholars}
                onConnect={handleConnect}
                onViewProfile={handleViewProfile}
              />
            )}
          </div>
        )}

        {view === 'conference' && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Academic Events & Conferences</h2>
            <p className="text-slate-500 max-w-md mb-8">Sign up to browse upcoming conferences, see who's attending, and schedule meetings with researchers before the event starts.</p>
            <div className="flex gap-3">
              <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-all">
                Join ScholarLink
              </button>
              <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-all">
                Log In
              </button>
            </div>
          </div>
        )}

        {view === 'conference' && isAuthenticated && (
          <ConferenceCompanion
            events={MOCK_EVENTS}
            scholars={scholars}
            currentUser={user as unknown as ScholarProfile}
            onBack={() => setView('feed')}
          />
        )}
      </div>

      {/* Global Widgets */}
      {isAuthenticated && <ChatWidget />}

      {/* Modals */}
      <OnboardingModal 
        isOpen={isAuthenticated && !hasCompletedOnboarding} 
        onComplete={completeOnboarding} 
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab={authMode} />

      {selectedScholar && (
        <ConnectModal scholar={selectedScholar} isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
      )}

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