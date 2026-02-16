import React, { useState, useEffect } from 'react';
import { MapPin, List, Map as MapIcon, Search, Filter, SlidersHorizontal, X, Users, GraduationCap, Building } from 'lucide-react';
import { ScholarProfile, Coordinates } from '../types';

interface MapSearchProps {
  scholars: ScholarProfile[];
  onConnect: (scholar: ScholarProfile) => void;
  onViewProfile: (scholar: ScholarProfile) => void;
}

export const MapSearch: React.FC<MapSearchProps> = ({
  scholars,
  onConnect,
  onViewProfile
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filters, setFilters] = useState({
    acceptingStudents: false,
    openToIndustry: false,
    topic: ''
  });

  // Filter scholars based on current filters
  const filteredScholars = scholars.filter(s => {
    if (filters.acceptingStudents && !s.acceptingStudents) return false;
    if (filters.openToIndustry && !s.openToIndustry) return false;
    if (filters.topic) {
      const topicLower = filters.topic.toLowerCase();
      const matchesTopic = s.researchInterests.some(i => 
        i.toLowerCase().includes(topicLower)
      ) || s.bio.toLowerCase().includes(topicLower);
      if (!matchesTopic) return false;
    }
    return true;
  });

  // Calculate center of all scholars
  const getMapCenter = (): Coordinates => {
    if (filteredScholars.length === 0) {
      return { lat: 48.8566, lng: 2.3522 }; // Default: Paris
    }
    
    const avgLat = filteredScholars.reduce((sum, s) => sum + s.location.coordinates.lat, 0) / filteredScholars.length;
    const avgLng = filteredScholars.reduce((sum, s) => sum + s.location.coordinates.lng, 0) / filteredScholars.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleScholarClick = (scholar: ScholarProfile) => {
    setSelectedScholar(scholar);
  };

  const center = getMapCenter();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f6f6f8]">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilters(f => ({ ...f, acceptingStudents: !f.acceptingStudents }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filters.acceptingStudents
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-slate-100 text-slate-600 border border-transparent'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                Accepting Students
              </button>
              <button 
                onClick={() => setFilters(f => ({ ...f, openToIndustry: !f.openToIndustry }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filters.openToIndustry
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-600 border border-transparent'
                }`}
              >
                <Building className="w-3 h-3" />
                Open to Industry
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {filteredScholars.length} scholars found
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Filter by research topic..."
            value={filters.topic}
            onChange={(e) => setFilters(f => ({ ...f, topic: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {filters.topic && (
            <button 
              onClick={() => setFilters(f => ({ ...f, topic: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map View */}
        {viewMode === 'map' && (
          <div className="flex-1 relative bg-slate-200">
            {/* Simulated Map Background */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, #e2e8f0 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, #e2e8f0 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            >
              {/* Map would be rendered here with Leaflet */}
              {/* This is a placeholder visualization */}
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <MapIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scholar Pins */}
            {mapLoaded && filteredScholars.map((scholar, index) => {
              // Calculate position based on coordinates (simplified)
              const x = ((scholar.location.coordinates.lng + 180) / 360) * 100;
              const y = ((90 - scholar.location.coordinates.lat) / 180) * 100;
              
              return (
                <button
                  key={scholar.id}
                  onClick={() => handleScholarClick(scholar)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                    selectedScholar?.id === scholar.id ? 'z-20' : 'z-10'
                  }`}
                  style={{ left: `${Math.min(95, Math.max(5, x))}%`, top: `${Math.min(95, Math.max(5, y))}%` }}
                >
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg transition-all ${
                    selectedScholar?.id === scholar.id
                      ? 'bg-primary border-white scale-110'
                      : scholar.acceptingStudents
                        ? 'bg-green-500 border-white'
                        : 'bg-white border-slate-300'
                  }`}>
                    <span className="text-xs font-bold">
                      {scholar.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                    
                    {scholar.acceptingStudents && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {scholar.name}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
              <p className="font-semibold text-slate-700 mb-2">Legend</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-slate-600">Accepting Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white border border-slate-300"></span>
                  <span className="text-slate-600">Other</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-slate-600">Selected</span>
                </div>
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 text-xs text-slate-500">
              Center: {center.lat.toFixed(2)}°, {center.lng.toFixed(2)}°
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScholars.map(scholar => (
                <div 
                  key={scholar.id}
                  onClick={() => handleScholarClick(scholar)}
                  className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer ${
                    selectedScholar?.id === scholar.id 
                      ? 'border-primary shadow-md' 
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex gap-3 mb-3">
                    <img 
                      src={scholar.avatarUrl} 
                      alt={scholar.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{scholar.name}</h4>
                      <p className="text-sm text-slate-500 truncate">{scholar.university.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {scholar.researchInterests.slice(0, 2).map(interest => (
                      <span key={interest} className="px-2 py-0.5 text-[10px] rounded bg-slate-100 text-slate-600">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    {scholar.location.city}, {scholar.location.country}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(scholar);
                      }}
                      className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onConnect(scholar);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Scholar Sidebar */}
        {selectedScholar && (
          <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto hidden lg:block">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900">Scholar Details</h3>
                <button 
                  onClick={() => setSelectedScholar(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="text-center mb-4">
                <img 
                  src={selectedScholar.avatarUrl} 
                  alt={selectedScholar.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-slate-100"
                />
                <h4 className="font-bold text-lg text-slate-900 mt-3">{selectedScholar.name}</h4>
                <p className="text-sm text-slate-500">{selectedScholar.title}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building className="w-4 h-4" />
                  {selectedScholar.university.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  {selectedScholar.location.city}, {selectedScholar.location.country}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  h-index: {selectedScholar.hIndex}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedScholar.acceptingStudents && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Accepting Students
                  </span>
                )}
                {selectedScholar.openToIndustry && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    Open to Industry
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-4">
                {selectedScholar.bio.slice(0, 150)}...
              </p>

              <div className="space-y-2">
                <button 
                  onClick={() => onViewProfile(selectedScholar)}
                  className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200"
                >
                  View Full Profile
                </button>
                <button 
                  onClick={() => onConnect(selectedScholar)}
                  className="w-full py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
