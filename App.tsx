import React, { useState } from 'react';
import { SearchInterface } from './components/SearchInterface';
import { ScholarCard } from './components/ScholarCard';
import { LandingSegments } from './components/LandingSegments';
import { ConnectModal } from './components/ConnectModal';
import { ProfileDetail } from './components/ProfileDetail';
import { Dashboard } from './components/Dashboard';
import { MOCK_SCHOLARS } from './services/mockData';
import { ScholarProfile, SearchFilters } from './types';
import { calculateDistanceKm } from './utils/geo';
import { GraduationCap, BookOpen, Users, Globe2, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [scholars, setScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [filteredScholars, setFilteredScholars] = useState<ScholarProfile[]>(MOCK_SCHOLARS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  // Modal State
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    setView('home'); // Ensure we go back to home on search

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setView('home')}
            >
              <div className="bg-brand-600 p-1.5 rounded-lg">
                 <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">ScholarLink</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setView('dashboard')} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
                For Professors
              </button>
              <button onClick={() => setView('dashboard')} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                For Students
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  view === 'dashboard' ? 'bg-brand-100 text-brand-700' : 'text-brand-600 hover:text-brand-700'
                }`}
              >
                {view === 'dashboard' ? 'My Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      {view === 'dashboard' ? (
        <Dashboard initialRole="professor" />
      ) : (
        <>
          {/* Hero Section */}
          <div className="bg-brand-900 pb-20 pt-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Discover Academic Talent <br/> Beyond Your Network
              </h1>
              <p className="text-brand-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                The global discovery engine for research collaboration. Find supervisors, peers, and experts by topic and location.
              </p>
              
              <div className="mt-8 flex justify-center gap-8 text-brand-200 opacity-80">
                <div className="flex items-center gap-2">
                   <Globe2 className="w-5 h-5" />
                   <span className="text-sm font-medium">Global Reach</span>
                </div>
                 <div className="flex items-center gap-2">
                   <Users className="w-5 h-5" />
                   <span className="text-sm font-medium">Verified Profiles</span>
                </div>
                 <div className="flex items-center gap-2">
                   <BookOpen className="w-5 h-5" />
                   <span className="text-sm font-medium">Research Focused</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Interface */}
          <SearchInterface onSearch={handleSearch} isLoading={isLoading} />

          {/* Landing Page Content Segments */}
          {!currentFilters && <div className="mt-16"><LandingSegments /></div>}

          {/* Results List */}
          <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <GraduationCap className="w-6 h-6 text-brand-600" />
             <span className="text-lg font-bold text-slate-900">ScholarLink</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 ScholarLink. Connecting the academic world.
          </p>
        </div>
      </footer>

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