import React from 'react';
import { MOCK_GRANTS } from '../services/mockData';
import { UserRole } from '../types';
import { Calendar, Building2, Banknote, ArrowRight, Plus } from 'lucide-react';
import { Badge } from './Badge';

interface OpportunitiesBoardProps {
  role: UserRole;
}

export const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ role }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grants & Funding Opportunities</h1>
          <p className="text-slate-500 mt-1">Discover research grants, fellowships, and corporate challenges.</p>
        </div>
        
        {role === 'corporate' && (
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            Post Opportunity
          </button>
        )}
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GRANTS.map((grant) => (
          <div 
            key={grant.id} 
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <div className="p-6 flex-grow">
              {/* Organization & Title */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Building2 className="w-4 h-4" />
                  {grant.organizationName}
                </div>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold font-mono">
                  {grant.amount}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                {grant.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {grant.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {grant.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer / Action */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {grant.deadline}</span>
              </div>
              
              <button 
                onClick={() => alert(`Applied to ${grant.title}`)}
                className="text-sm font-semibold text-brand-600 flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};