import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Zap, Building, SlidersHorizontal, X, ChevronDown, GraduationCap, Users, DollarSign, Globe, CheckCircle2, BookOpen } from 'lucide-react';
import { SearchFilters, ScholarProfile } from '../types';

interface SearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  results: ScholarProfile[];
  isLoading: boolean;
  onConnect: (scholar: ScholarProfile) => void;
  onViewProfile: (scholar: ScholarProfile) => void;
}

// LinkedIn-style filter options adapted for ScholarLink
const ROLE_OPTIONS = ['All Roles', 'Professor / PI', 'PhD Candidate', 'Postdoc', 'Research Scientist', 'Master Student'];
const CAREER_STAGE_OPTIONS = ['Any Stage', 'Early Career (0-5 yrs)', 'Mid Career (5-15 yrs)', 'Senior (15+ yrs)'];
const AVAILABILITY_OPTIONS = ['Any', 'Accepting Students', 'Open to Industry', 'Funding Available', 'Seeking Supervisor'];
const SORT_OPTIONS = ['Relevance', 'h-index (High to Low)', 'Citations (High to Low)', 'Recently Active', 'Alphabetical'];

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch, results, isLoading, onConnect, onViewProfile }) => {
  const [topic, setTopic] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');

  // Advanced filters (LinkedIn-style)
  const [filters, setFilters] = useState({
    role: 'All Roles',
    careerStage: 'Any Stage',
    availability: [] as string[],
    institution: '',
    minHIndex: '',
    maxHIndex: '',
    onlyVerified: false,
    onlyWithFunding: false,
    onlyAcceptingStudents: false,
    onlyOpenToIndustry: false,
  });

  const activeFilterCount = [
    filters.role !== 'All Roles',
    filters.careerStage !== 'Any Stage',
    filters.availability.length > 0,
    filters.institution !== '',
    filters.minHIndex !== '',
    filters.onlyVerified,
    filters.onlyWithFunding,
    filters.onlyAcceptingStudents,
    filters.onlyOpenToIndustry,
  ].filter(Boolean).length;

  useEffect(() => {
    if (results.length > 0 && !selectedId) {
      setSelectedId(results[0].id);
    }
  }, [results, selectedId]);

  const handleSearch = () => {
    onSearch({
      topic,
      locationName,
      coordinates: null,
      radiusKm: 50,
      onlyAcceptingStudents: filters.onlyAcceptingStudents,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleAvailability = (option: string) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option],
    }));
  };

  const clearFilters = () => {
    setFilters({
      role: 'All Roles',
      careerStage: 'Any Stage',
      availability: [],
      institution: '',
      minHIndex: '',
      maxHIndex: '',
      onlyVerified: false,
      onlyWithFunding: false,
      onlyAcceptingStudents: false,
      onlyOpenToIndustry: false,
    });
  };

  // Apply client-side filters
  const filteredResults = results.filter(s => {
    if (filters.onlyAcceptingStudents && !s.acceptingStudents) return false;
    if (filters.onlyOpenToIndustry && !s.openToIndustry) return false;
    if (filters.onlyWithFunding && !s.fundingAvailable) return false;
    if (filters.onlyVerified && !s.verified) return false;
    if (filters.institution && !s.university.name.toLowerCase().includes(filters.institution.toLowerCase())) return false;
    if (filters.minHIndex && s.hIndex < parseInt(filters.minHIndex)) return false;
    if (filters.maxHIndex && s.hIndex > parseInt(filters.maxHIndex)) return false;
    return true;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'h-index (High to Low)') return b.hIndex - a.hIndex;
    if (sortBy === 'Citations (High to Low)') return b.citationCount - a.citationCount;
    if (sortBy === 'Alphabetical') return a.name.localeCompare(b.name);
    return 0;
  });

  const selectedScholar = sortedResults.find(s => s.id === selectedId) || sortedResults[0] || null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f6f6f8] overflow-hidden">
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL: Search & Filters */}
        <aside className="w-full md:w-[420px] flex-none flex flex-col border-r border-slate-200 bg-white z-10">

          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input
                className="w-full bg-slate-100 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 outline-none"
                placeholder="Search by topic, name, or keyword..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  className="w-full bg-slate-100 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 outline-none"
                  placeholder="City or country..."
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-primary text-white border-primary'
                    : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleSearch}
                className="flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Search
              </button>
            </div>

            {/* Quick Filter Pills (LinkedIn-style) */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Accepting Students', key: 'onlyAcceptingStudents' },
                { label: 'Open to Industry', key: 'onlyOpenToIndustry' },
                { label: 'Funding Available', key: 'onlyWithFunding' },
                { label: 'Verified', key: 'onlyVerified' },
              ].map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filters[key as keyof typeof filters]
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Panel (LinkedIn-style dropdown) */}
          {showFilters && (
            <div className="border-b border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Advanced Filters</h3>
                <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Academic Role</label>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_OPTIONS.map(role => (
                    <button
                      key={role}
                      onClick={() => setFilters(prev => ({ ...prev, role }))}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        filters.role === role
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-primary'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Institution Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Institution</label>
                <input
                  type="text"
                  value={filters.institution}
                  onChange={e => setFilters(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="MIT, Oxford, CNRS..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              {/* h-index Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">h-index Range</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={filters.minHIndex}
                    onChange={e => setFilters(prev => ({ ...prev, minHIndex: e.target.value }))}
                    placeholder="Min"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-1 focus:ring-primary outline-none"
                  />
                  <span className="text-slate-400 text-sm">–</span>
                  <input
                    type="number"
                    value={filters.maxHIndex}
                    onChange={e => setFilters(prev => ({ ...prev, maxHIndex: e.target.value }))}
                    placeholder="Max"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Sort By</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-1 focus:ring-primary outline-none"
                >
                  {SORT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Results Count & Sort */}
          <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-white">
            <span className="text-xs font-medium text-slate-500">
              {isLoading ? 'Searching...' : `${sortedResults.length} scholars found`}
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs text-slate-500 border-none outline-none bg-transparent cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          {/* Scholar List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && sortedResults.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium text-sm">No scholars found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}

            {!isLoading && sortedResults.map(scholar => (
              <div
                key={scholar.id}
                onClick={() => setSelectedId(scholar.id)}
                className={`group relative p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                  selectedId === scholar.id
                    ? 'bg-white border-primary shadow-md ring-1 ring-primary/20'
                    : 'bg-white border-slate-200 hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className="flex gap-3">
                  <img src={scholar.avatarUrl} alt={scholar.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{scholar.name}</h3>
                      {scholar.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{scholar.title}</p>
                    <p className="text-xs text-slate-400 truncate">{scholar.university.name}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                        h={scholar.hIndex}
                      </span>
                      {scholar.acceptingStudents && (
                        <span className="px-1.5 py-0.5 rounded-full bg-green-50 text-[10px] font-medium text-green-700 border border-green-200">
                          Accepting
                        </span>
                      )}
                      {scholar.openToIndustry && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-medium text-blue-700 border border-blue-200">
                          Industry
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {scholar.researchInterests.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL: Scholar Detail */}
        <main className="flex-1 overflow-y-auto bg-[#f6f6f8] p-6 lg:p-8 hidden md:block">
          {selectedScholar ? (
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Profile Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary to-blue-700" />
                <div className="px-6 pb-6">
                  <div className="flex items-end justify-between -mt-12 mb-4">
                    <div className="relative">
                      <img
                        src={selectedScholar.avatarUrl}
                        className="w-24 h-24 rounded-xl object-cover shadow-xl border-4 border-white"
                        alt="Profile"
                      />
                      {selectedScholar.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pb-1">
                      <button
                        onClick={() => onConnect(selectedScholar)}
                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all"
                      >
                        Connect
                      </button>
                      <button
                        onClick={() => onViewProfile(selectedScholar)}
                        className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-lg font-semibold text-sm border border-slate-200 transition-all"
                      >
                        Full Profile
                      </button>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-slate-900">{selectedScholar.name}</h1>
                  <p className="text-primary font-medium mt-0.5">{selectedScholar.title}</p>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                    <Building className="w-4 h-4" />
                    <span>{selectedScholar.university.name}</span>
                    {selectedScholar.location.city && (
                      <>
                        <span className="text-slate-300">•</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{selectedScholar.location.city}, {selectedScholar.location.country}</span>
                      </>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedScholar.acceptingStudents && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Accepting Students
                      </span>
                    )}
                    {selectedScholar.openToIndustry && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Open to Industry
                      </span>
                    )}
                    {selectedScholar.fundingAvailable && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Funding Available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'h-index', value: selectedScholar.hIndex, icon: BookOpen },
                  { label: 'Citations', value: selectedScholar.citationCount.toLocaleString(), icon: Zap },
                  { label: 'Papers', value: selectedScholar.papers?.length || '—', icon: GraduationCap },
                  { label: 'Projects', value: selectedScholar.activeProjects.length, icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {selectedScholar.bio && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">About</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedScholar.bio}</p>
                </div>
              )}

              {/* Research Interests */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Research Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScholar.researchInterests.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg text-sm bg-primary/5 text-primary border border-primary/20 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Projects */}
              {selectedScholar.activeProjects.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Active Projects</h3>
                  <div className="space-y-3">
                    {selectedScholar.activeProjects.map((proj, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{proj}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Active research project</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                <Search className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">Select a scholar to view details</p>
              <p className="text-sm mt-1">Use the filters to find the right match</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
