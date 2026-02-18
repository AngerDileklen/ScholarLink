import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ArrowUpRight, Zap, Briefcase, GraduationCap, Building, Link as LinkIcon, Mail, SlidersHorizontal } from 'lucide-react';
import { SearchFilters, ScholarProfile } from '../types';
import { Badge } from './Badge';

interface SearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  results: ScholarProfile[];
  isLoading: boolean;
  onConnect: (scholar: ScholarProfile) => void;
  onViewProfile: (scholar: ScholarProfile) => void;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch, results, isLoading, onConnect, onViewProfile }) => {
  const [topic, setTopic] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
        onlyAcceptingStudents: false
     });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const selectedScholar = results.find(s => s.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f6f6f8] overflow-hidden">
       {/* Main Workspace */}
       <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Search & List (Fixed width) */}
          <aside className="w-full md:w-[420px] flex-none flex flex-col border-r border-slate-200 bg-white z-10">
             
             {/* Filter Header */}
             <div className="p-4 border-b border-slate-200 space-y-4">
                <div className="relative">
                   <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                   <input 
                      className="w-full bg-slate-100 border-transparent focus:border-primary focus:ring-0 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-500"
                      placeholder="Search keywords, topics, or names..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={handleKeyDown}
                   />
                </div>
                <div className="flex gap-2">
                   <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                      <input 
                         className="w-full bg-slate-100 border-transparent focus:border-primary focus:ring-0 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-500"
                         placeholder="Location"
                         value={locationName}
                         onChange={(e) => setLocationName(e.target.value)}
                         onKeyDown={handleKeyDown}
                      />
                   </div>
                   <button className="flex-none px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors border border-transparent">
                      <SlidersHorizontal className="w-4 h-4" />
                   </button>
                </div>
                
                {/* Toggles */}
                <div className="flex flex-wrap gap-2">
                   <button className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent">
                      Accepting Students
                   </button>
                   <button className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent">
                      Open to Industry
                   </button>
                </div>

                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider pt-2 flex justify-between">
                   <span>{results.length} Scholars Found</span>
                   <span className="cursor-pointer hover:text-primary">Sort by: Relevance</span>
                </div>
             </div>

             {/* Scrollable List */}
             <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
                {results.map(scholar => (
                   <div 
                      key={scholar.id}
                      onClick={() => setSelectedId(scholar.id)}
                      className={`group relative p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                         selectedId === scholar.id 
                         ? 'bg-white border-primary shadow-md' 
                         : 'bg-white border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                      }`}
                   >
                      {selectedId === scholar.id && (
                         <div className="absolute -right-1 -top-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex gap-3">
                            <img src={scholar.avatarUrl} alt={scholar.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                            <div>
                               <h3 className="text-sm font-bold text-slate-900">{scholar.name}</h3>
                               <p className="text-xs text-slate-500">{scholar.university.name}</p>
                               <div className="flex items-center gap-1 mt-1">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">h-index: {scholar.hIndex}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="mt-3">
                         <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            <span className="text-primary font-medium">Active:</span> {scholar.activeProjects[0] || 'No active project listed'}
                         </p>
                      </div>
                      
                      <div className="mt-3 flex gap-2 overflow-hidden flex-wrap">
                         {scholar.researchInterests.slice(0, 2).map(tag => (
                            <span key={tag} className="inline-block px-2 py-1 text-[10px] rounded bg-slate-100 text-slate-500 border border-slate-200">
                               {tag}
                            </span>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          </aside>

          {/* Right Panel: Detail View */}
          <main className="flex-1 overflow-y-auto bg-[#f6f6f8] p-6 lg:p-10 hidden md:block">
             {selectedScholar ? (
                <div className="max-w-4xl mx-auto space-y-8">
                   {/* Profile Header */}
                   <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-slate-200 pb-8">
                      <div className="flex gap-6">
                         <div className="relative">
                            <img src={selectedScholar.avatarUrl} className="w-32 h-32 rounded-xl object-cover shadow-xl border-4 border-white" alt="Profile" />
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white" title="Online Now"></div>
                         </div>
                         <div className="space-y-2 pt-2">
                            <div>
                               <h1 className="text-3xl font-bold text-gray-900">{selectedScholar.name}</h1>
                               <p className="text-lg text-primary font-medium">{selectedScholar.title}</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                               <Building className="w-4 h-4" />
                               <span>{selectedScholar.university.name}</span>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                               {selectedScholar.acceptingStudents && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium border border-green-200">
                                     <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Accepting Students
                                  </span>
                               )}
                               {selectedScholar.openToIndustry && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-200">
                                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Open to Industry
                                  </span>
                               )}
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col gap-3 min-w-[140px]">
                         <button onClick={() => onConnect(selectedScholar)} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                            Connect
                         </button>
                         <button onClick={() => onViewProfile(selectedScholar)} className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-all flex items-center justify-center gap-2">
                            View Full Profile
                         </button>
                      </div>
                   </div>

                   {/* Metrics Grid */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">h-index</p>
                         <p className="text-3xl font-bold text-gray-900">{selectedScholar.hIndex}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Citations</p>
                         <p className="text-3xl font-bold text-gray-900">{selectedScholar.citationCount.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Papers</p>
                         <p className="text-3xl font-bold text-gray-900">{selectedScholar.papers?.length || '12'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Projects</p>
                         <p className="text-3xl font-bold text-gray-900">{selectedScholar.activeProjects.length}</p>
                      </div>
                   </div>

                   {/* Content Area */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Bio */}
                      <div className="lg:col-span-1 space-y-8">
                         <section>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">Research Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                               {selectedScholar.researchInterests.map(tag => (
                                  <span key={tag} className="px-3 py-1.5 rounded-md text-sm bg-primary/5 text-primary border border-primary/20">
                                     {tag}
                                  </span>
                               ))}
                            </div>
                         </section>
                         <section>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">About</h3>
                            <p className="text-sm leading-relaxed text-slate-600">
                               {selectedScholar.bio}
                            </p>
                         </section>
                      </div>

                      {/* Right: Projects */}
                      <div className="lg:col-span-2 space-y-8">
                         <section>
                            <div className="flex items-center justify-between mb-4">
                               <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
                            </div>
                            <div className="space-y-4">
                               {selectedScholar.activeProjects.length > 0 ? selectedScholar.activeProjects.map((proj, i) => (
                                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors group">
                                     <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">{proj}</h3>
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Grant Active</span>
                                     </div>
                                     <p className="text-sm text-slate-600 mb-4">
                                        Researching advanced methodologies in this domain to solve critical efficiency problems.
                                     </p>
                                     <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                           <Zap className="w-3 h-3 text-slate-400" /> Active
                                        </div>
                                     </div>
                                  </div>
                               )) : <p className="text-slate-500 text-sm">No projects listed.</p>}
                            </div>
                         </section>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                      <Search className="w-8 h-8 opacity-50" />
                   </div>
                   <p className="font-medium">Select a scholar to view details</p>
                </div>
             )}
          </main>
       </div>
    </div>
  );
};