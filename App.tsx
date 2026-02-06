import React, { useState } from 'react';
import { SearchInterface } from './components/SearchInterface';
import { ScholarCard } from './components/ScholarCard';
import { LandingSegments } from './components/LandingSegments';
import { ConnectModal } from './components/ConnectModal';
import { ProfileDetail } from './components/ProfileDetail';
import { Dashboard } from './components/Dashboard';
import { OpportunitiesBoard } from './components/OpportunitiesBoard';
import { Feed } from './components/Feed';
import { MOCK_SCHOLARS } from './services/mockData';
import { ScholarProfile, SearchFilters } from './types';
import { calculateDistanceKm } from './utils/geo';
import { GraduationCap, BookOpen, Users, Globe2, Banknote, Home, Map, Briefcase, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  // State: 'feed' is the new default home
  const [view, setView] = useState<'feed' | 'discover' | 'dashboard' | 'opportunities'>('feed');
  const [scholars, setScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [filteredScholars, setFilteredScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  // Modal State
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Guest Interaction Hook
  const handleGuestInteraction = () => {
    // In a real app, this opens a signup modal
    const confirmed = window.confirm("Join ScholarLink to connect, like, and comment.\n\nWould you like to sign up now?");
    if (confirmed) {
       setView('dashboard'); // Redirect to login/signup view simulation
    }
  };

  // Handlers
  const handleConnect = (scholar: ScholarProfile) => {
    setSelectedScholar(scholar);
    setIsConnectOpen(true);
  };

  const handleViewProfile = (scholar: ScholarProfile) => {
    setSelectedScholar(scholar);
    setIsProfileOpen(true);
  };

  // Search Logic
  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true);
    setCurrentFilters(filters);
    
    // Simulate API delay
    setTimeout(() => {
      let results = [...scholars];

      if (filters.topic) {
        const topicLower = filters.topic.toLowerCase();
        results = results.filter(s => 
          s.researchInterests.some(i => i.toLowerCase().includes(topicLower)) ||
          s.bio.toLowerCase().includes(topicLower) ||
          s.department.toLowerCase().includes(topicLower)
        );
      }

      if (filters.coordinates) {
        results = results.map(s => {
          const dist = calculateDistanceKm(filters.coordinates!, s.location.coordinates);
          return { ...s, distance: dist }; 
        }).filter((s: any) => s.distance <= filters.radiusKm);
        results.sort((a: any, b: any) => a.distance - b.distance);
      } else {
        if (filters.locationName) {
           results = results.filter(s => 
             s.location.city.toLowerCase().includes(filters.locationName.toLowerCase()) ||
             s.location.country.toLowerCase().includes(filters.locationName.toLowerCase())
           );
        }
      }

      if (filters.onlyAcceptingStudents) {
        results = results.filter(s => s.acceptingStudents);
      }

      setFilteredScholars(results);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Navigation - Sticky Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 md:h-16">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setView('feed')}
            >
              <div className="bg-brand-600 p-1.5 rounded-lg">
                 <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight hidden md:block">ScholarLink</span>
            </div>

            {/* Central Navigation Tabs */}
            <div className="flex items-center space-x-1 md:space-x-8">
               <button 
                  onClick={() => setView('feed')}
                  className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 border-b-2 transition-all ${
                     view === 'feed' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
               >
                  <Home className={`w-5 h-5 ${view === 'feed' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">Home</span>
               </button>

               <button 
                  onClick={() => setView('discover')}
                  className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 border-b-2 transition-all ${
                     view === 'discover' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
               >
                  <Map className={`w-5 h-5 ${view === 'discover' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">Discover</span>
               </button>

               <button 
                  onClick={() => setView('opportunities')}
                  className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 border-b-2 transition-all ${
                     view === 'opportunities' ? 'border-brand-600 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
               >
                  <Briefcase className={`w-5 h-5 ${view === 'opportunities' ? 'fill-current' : ''}`} />
                  <span className="text-xs md:text-sm font-medium">Jobs & Grants</span>
               </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('dashboard')}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden md:block"
              >
                Log In
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="text-sm font-medium bg-transparent border border-brand-600 text-brand-600 hover:bg-brand-50 px-4 py-1.5 rounded-full transition-colors"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      <div className="flex-grow">
      
        {view === 'feed' && (
           <Feed onSignupRequest={handleGuestInteraction} />
        )}

        {view === 'opportunities' && (
           <div className="max-w-6xl mx-auto px-4 py-8 w-full">
              <OpportunitiesBoard role="student" />
           </div>
        )}
        
        {view === 'dashboard' && (
           <Dashboard initialRole="professor" />
        )}

        {view === 'discover' && (
          <>
            {/* Hero Section - Only shown on Discover/Map view */}
            <div className="bg-brand-900 pb-20 pt-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Global Scholar Map
                </h1>
                <p className="text-brand-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Search by topic and location to visualize the academic landscape.
                </p>
                
                <div className="mt-6 flex justify-center gap-8 text-brand-200 opacity-80">
                  <div className="flex items-center gap-2">
                     <Globe2 className="w-4 h-4" />
                     <span className="text-xs font-medium">Global Reach</span>
                  </div>
                   <div className="flex items-center gap-2">
                     <Users className="w-4 h-4" />
                     <span className="text-xs font-medium">Verified Profiles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Interface */}
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />

            {/* Landing Page Content Segments */}
            {!currentFilters && <div className="mt-16"><LandingSegments /></div>}

            {/* Results List */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {currentFilters ? 'Search Results' : 'Featured Scholars'}
                </h2>
                <span className="text-sm text-slate-500">
                  Showing {filteredScholars.length} scholars
                </span>
              </div>

              {filteredScholars.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchInterfaceIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No scholars found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your filters or increasing the search radius.</p>
                  <button 
                    onClick={() => {
                      setFilteredScholars(MOCK_SCHOLARS);
                      setCurrentFilters(null);
                    }}
                    className="mt-4 text-brand-600 font-medium hover:underline"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredScholars.map((scholar: any) => (
                    <ScholarCard 
                      key={scholar.id} 
                      scholar={scholar} 
                      distanceKm={scholar.distance}
                      onConnect={handleConnect}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* Modals */}
      {selectedScholar && (
        <>
          <ConnectModal 
            scholar={selectedScholar} 
            isOpen={isConnectOpen} 
            onClose={() => setIsConnectOpen(false)} 
          />
          <ProfileDetail
            scholar={selectedScholar}
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onConnect={() => {
               setIsProfileOpen(false);
               setIsConnectOpen(true);
            }}
          />
        </>
      )}

    </div>
  );
};

// Helper for the empty state icon
const SearchInterfaceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default App;