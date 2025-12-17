import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Loader2 } from 'lucide-react';
import { SearchFilters, Coordinates } from '../types';
import { MOCK_LOCATIONS } from '../services/mockData';

interface SearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [locationName, setLocationName] = useState('');
  const [radius, setRadius] = useState(50);
  const [onlyAccepting, setOnlyAccepting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock Geocoding Logic
  const handleSearch = () => {
    // In a real app, this would call a Geocoding API
    // Here we use a dictionary lookup for demo purposes
    let coords: Coordinates | null = null;
    
    // Simple case-insensitive match
    const cityKey = Object.keys(MOCK_LOCATIONS).find(
        key => key.toLowerCase() === locationName.toLowerCase()
    );

    if (cityKey) {
        coords = MOCK_LOCATIONS[cityKey];
    }

    onSearch({
      topic,
      locationName,
      coordinates: coords,
      radiusKm: radius,
      onlyAcceptingStudents: onlyAccepting
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="w-full max-w-4xl mx-auto -mt-10 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 md:p-6">
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Topic Input */}
          <div className="flex-1 relative">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Research Topic</label>
            <div className="relative group">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand-500" />
              <input
                type="text"
                placeholder="e.g., Deep Learning, Medieval Art..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="flex-1 relative">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Location</label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand-500" />
              <input
                type="text"
                placeholder="City (e.g. Montreal, Paris)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-auto h-[46px] bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Discover"}
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-4 pt-4 border-t border-slate-100">
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors"
           >
             <SlidersHorizontal className="w-4 h-4 mr-2" />
             {isExpanded ? 'Hide Filters' : 'Advanced Filters'}
           </button>

           {isExpanded && (
             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Radius Slider */}
                <div>
                   <div className="flex justify-between mb-2">
                     <label className="text-sm font-medium text-slate-700">Search Radius</label>
                     <span className="text-sm text-slate-500">{radius} km</span>
                   </div>
                   <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                   />
                   <p className="text-xs text-slate-400 mt-1">
                     {locationName ? `Searching around ${locationName}` : 'Enter a location to use radius'}
                   </p>
                </div>

                {/* Toggles */}
                <div className="flex items-center">
                   <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={onlyAccepting}
                          onChange={(e) => setOnlyAccepting(e.target.checked)}
                        />
                        <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        Only "Accepting Students"
                      </span>
                   </label>
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};