import React, { useState } from 'react';
import { MOCK_GRANTS } from '../services/mockData';
import { UserRole, GrantOpportunity } from '../types';
import { Calendar, Building2, ArrowRight, Plus, Lock, CheckCircle2, Clock, Globe, Search, Filter, X } from 'lucide-react';

interface OpportunitiesBoardProps {
  role: UserRole;
  onPostClick?: () => void;
}

export const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ role, onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(MOCK_GRANTS.flatMap(g => g.tags)));

  // Filter grants
  const filteredGrants = MOCK_GRANTS.filter(grant => {
    const matchesSearch = searchTerm === '' || 
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || grant.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
  };

  if (role === 'student') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Restricted Access</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The Grants & Jobs board is exclusively available to <strong>Professors</strong> and <strong>Corporate Partners</strong>.
          </p>
          <button className="text-primary font-semibold text-sm hover:underline">
            Learn more about membership tiers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Utility Bar */}
      <div className="bg-white/50 backdrop-blur-md sticky top-16 z-10 border-b border-slate-200 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-900">Active Opportunities</h1>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{filteredGrants.length}</span>
         </div>
         
         <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
              />
            </div>
            
            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || selectedTag 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {role === 'corporate' && (
               <button 
                  onClick={onPostClick}
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
               >
                  <Plus className="w-4 h-4" /> Post Opportunity
               </button>
            )}
         </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-900">Filter by Topic</h3>
            {(searchTerm || selectedTag) && (
              <button 
                onClick={clearFilters}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      {filteredGrants.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No opportunities found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
          <button 
            onClick={clearFilters}
            className="text-primary font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGrants.map((grant) => (
            <div 
              key={grant.id} 
              onClick={() => setSelectedGrant(grant)}
              className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative flex flex-col h-full cursor-pointer"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 p-1.5 flex items-center justify-center shadow-sm border border-slate-100">
                    <Building2 className="w-6 h-6 text-slate-600" />
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-primary font-mono font-bold text-lg">{grant.amount}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Award</span>
                 </div>
              </div>

              {/* Body */}
              <div className="mb-4 flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-500">{grant.organizationName}</span>
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                 </div>
                 <h3 className="text-lg font-bold leading-tight text-slate-900 group-hover:text-primary transition-colors mb-2">
                    {grant.title}
                 </h3>
                 {/* Full Description - Issue #7 Fix */}
                 <p className="text-sm text-slate-500">
                    {grant.description}
                 </p>
              </div>

              {/* Footer */}
              <div className="mt-auto space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {grant.tags.slice(0, 3).map(tag => (
                       <span 
                        key={tag} 
                        className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                          selectedTag === tag
                            ? 'bg-primary text-white border-primary'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                       >
                          #{tag}
                       </span>
                    ))}
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-orange-500">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="font-medium">Due: {grant.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                       <Globe className="w-3.5 h-3.5" /> Global
                    </div>
                 </div>
              </div>
            </div>
          ))}

          {/* Create New Card (CTA) */}
          <div onClick={onPostClick} className="group bg-primary/5 border border-dashed border-primary/30 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-colors cursor-pointer min-h-[300px]">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-2">Create New Grant</h3>
             <p className="text-sm text-slate-500 max-w-xs mb-6">Looking for researchers? Post your R&D challenge here.</p>
             <button className="px-4 py-2 bg-transparent border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all">
                Draft Opportunity
             </button>
          </div>
        </div>
      )}

      {/* Grant Detail Modal - Issue #7 Fix */}
      {selectedGrant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGrant(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedGrant.title}</h2>
                    <p className="text-sm text-slate-500">{selectedGrant.organizationName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedGrant(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-bold text-primary text-xl">{selectedGrant.amount}</span>
                  <span className="text-slate-500">Total Award</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {selectedGrant.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>Global</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedGrant.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGrant.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href={selectedGrant.applyLink}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Apply Now
                </a>
                <button 
                  onClick={() => setSelectedGrant(null)}
                  className="px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
