import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ArrowUpRight, Zap, Briefcase, GraduationCap, Building, Link as LinkIcon, Mail } from 'lucide-react';
import { SearchFilters, ScholarProfile } from '../types';
import { ScholarListItem } from './ScholarListItem';
import { Badge } from './Badge';

interface SearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  results: ScholarProfile[];
  isLoading: boolean;
  onConnect: (scholar: ScholarProfile) => void;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch, results, isLoading, onConnect }) => {
  // Search State
  const [topic, setTopic] = useState('');
  const [locationName, setLocationName] = useState('');
  
  // Selection State
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Initialize selection
  useEffect(() => {
    if (results.length > 0 && !selectedId) {
      setSelectedId(results[0].id);
    }
  }, [results, selectedId]);

  const handleSearch = () => {
     // Trigger search
     onSearch({
        topic,
        locationName,
        coordinates: null, // simplified for this view
        radiusKm: 50,
        onlyAcceptingStudents: false
     });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const selectedScholar = results.find(s => s.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
       {/* Top Filter Bar */}
       <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 flex flex-col md:flex-row gap-4 items-center shadow-sm z-10">
          <div className="flex-1 flex gap-2 w-full md:w-auto">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                   className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-md text-sm focus:ring-2 focus:ring-brand-500"
                   placeholder="Search by topic, keywords, or name..."
                   value={topic}
                   onChange={(e) => setTopic(e.target.value)}
                   onKeyDown={handleKeyDown}
                />
             </div>
             <div className="relative flex-1 hidden sm:block">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                   className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-md text-sm focus:ring-2 focus:ring-brand-500"
                   placeholder="City, state, or zip code"
                   value={locationName}
                   onChange={(e) => setLocationName(e.target.value)}
                   onKeyDown={handleKeyDown}
                />
             </div>
             <button 
               onClick={handleSearch}
               className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-700 whitespace-nowrap"
             >
               Search
             </button>
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
             <button className="px-3 py-1.5 border border-slate-300 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap transition-colors">
                Accepting Students
             </button>
             <button className="px-3 py-1.5 border border-slate-300 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap transition-colors">
                Open to Industry
             </button>
             <button className="px-3 py-1.5 border border-slate-300 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap flex items-center gap-1 transition-colors">
                <Filter className="w-3 h-3" /> All Filters
             </button>
          </div>
       </div>

       {/* Main Split Content */}
       <div className="flex flex-1 overflow-hidden">
          
          {/* Left: Scrollable List (Master) */}
          <div className="w-full md:w-2/5 lg:w-[450px] overflow-y-auto border-r border-slate-200 bg-white">
             {/* Header for List */}
             <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 text-sm">
                   {isLoading ? 'Searching...' : `${results.length} Scholars Found`}
                </h2>
                <span className="text-xs text-slate-500">Sorted by relevance</span>
             </div>

             {results.map(scholar => (
                <ScholarListItem 
                   key={scholar.id} 
                   scholar={scholar} 
                   isSelected={selectedId === scholar.id}
                   onClick={() => setSelectedId(scholar.id)}
                />
             ))}
             
             {results.length === 0 && !isLoading && (
                <div className="p-8 text-center text-slate-500">
                   <p className="text-sm">No scholars found matching your criteria.</p>
                   <p className="text-xs mt-2 text-slate-400">Try broadening your search.</p>
                </div>
             )}
          </div>

          {/* Right: Detail View (Detail) */}
          <div className="hidden md:block flex-1 overflow-y-auto bg-slate-50 p-6">
             {selectedScholar ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-full">
                   {/* Profile Header */}
                   <div className="p-8 border-b border-slate-100 relative">
                      {selectedScholar.openToIndustry && (
                        <div className="absolute top-8 right-8">
                           <Badge label="Open to Industry" variant="info" icon={<Briefcase className="w-3 h-3"/>} />
                        </div>
                      )}
                      
                      <div className="flex gap-5">
                         <img 
                            src={selectedScholar.avatarUrl} 
                            alt={selectedScholar.name} 
                            className="w-20 h-20 rounded-lg object-cover border border-slate-200 shadow-sm"
                         />
                         <div>
                            <h1 className="text-2xl font-bold text-slate-900">{selectedScholar.name}</h1>
                            <p className="text-lg text-slate-700">{selectedScholar.title}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                               <Building className="w-4 h-4" />
                               {selectedScholar.university.name} • {selectedScholar.location.city}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                               <span className="text-brand-600 font-medium">{selectedScholar.citationCount.toLocaleString()} Citations</span>
                               <span>h-index: {selectedScholar.hIndex}</span>
                            </div>
                         </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                         <button 
                           onClick={() => onConnect(selectedScholar)}
                           className="bg-brand-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-700 transition-colors shadow-sm"
                         >
                            Connect
                         </button>
                         <button className="border border-brand-600 text-brand-600 px-6 py-2 rounded-full font-semibold hover:bg-brand-50 transition-colors">
                            Save Profile
                         </button>
                      </div>
                   </div>

                   {/* Profile Body */}
                   <div className="p-8 space-y-8">
                      {/* Active Projects */}
                      <section>
                         <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                           <Zap className="w-5 h-5 text-amber-500" /> Active Projects
                         </h3>
                         <div className="grid gap-3">
                            {selectedScholar.activeProjects.map((proj, i) => (
                               <div key={i} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex justify-between items-center group hover:border-brand-300 hover:bg-white transition-all">
                                  <span className="font-medium text-slate-800 text-sm">{proj}</span>
                                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                               </div>
                            ))}
                            {selectedScholar.activeProjects.length === 0 && (
                               <p className="text-sm text-slate-500 italic">No public active projects listed.</p>
                            )}
                         </div>
                      </section>

                      {/* About */}
                      <section>
                         <h3 className="text-lg font-bold text-slate-900 mb-3">About the Scholar</h3>
                         <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                            {selectedScholar.bio}
                         </p>
                      </section>

                      {/* Expertise */}
                      <section>
                         <h3 className="text-lg font-bold text-slate-900 mb-3">Research Expertise</h3>
                         <div className="flex flex-wrap gap-2">
                            {selectedScholar.researchInterests.map(tag => (
                               <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                                  {tag}
                               </span>
                            ))}
                         </div>
                      </section>

                      {/* Top Papers */}
                      <section>
                         <h3 className="text-lg font-bold text-slate-900 mb-3">Selected Publications</h3>
                         <ul className="space-y-3">
                            {selectedScholar.papers?.map(paper => (
                               <li key={paper.id} className="text-sm border-l-2 border-slate-200 pl-3">
                                  <a href="#" className="font-medium text-brand-600 hover:underline">{paper.title}</a>
                                  <p className="text-slate-500 text-xs mt-0.5">{paper.journal}, {paper.year} • {paper.citations} citations</p>
                               </li>
                            )) || <p className="text-slate-500 italic text-sm">No publications listed.</p>}
                         </ul>
                      </section>

                      {/* Contact */}
                      <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h4 className="font-bold text-slate-900 mb-2 text-sm">Contact Information</h4>
                          <div className="space-y-2 text-sm text-slate-600">
                             <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span>Contact accessible after connection</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-slate-400" />
                                <span className="text-brand-600 cursor-pointer hover:underline">University Profile Page</span>
                             </div>
                          </div>
                      </section>
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 opacity-50" />
                   </div>
                   <p className="font-medium">Select a scholar to view details</p>
                </div>
             )}
          </div>

       </div>
    </div>
  );
};