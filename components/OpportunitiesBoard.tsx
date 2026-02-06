import React from 'react';
import { MOCK_GRANTS } from '../services/mockData';
import { UserRole } from '../types';
import { Calendar, Building2, Banknote, ArrowRight, Plus, Lock, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';

interface OpportunitiesBoardProps {
  role: UserRole;
  onPostClick?: () => void;
}

export const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({ role, onPostClick }) => {
  
  // 1. Access Control Block for Students
  if (role === 'student') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
          
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Restricted Access</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The Grants & Jobs board is exclusively available to <strong>Professors</strong> and <strong>Corporate Partners</strong>.
          </p>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500 mb-6">
            Students can browse labs and apply for existing positions via the Search/Discover tab.
          </div>

          <button className="text-brand-600 font-semibold text-sm hover:underline">
            Learn more about membership tiers
          </button>
        </div>
      </div>
    );
  }

  // 2. Main Board for Professors & Corporates
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grants & Funding Opportunities</h1>
          <p className="text-slate-500 mt-1">Discover research grants, fellowships, and corporate challenges.</p>
        </div>
        
        {role === 'corporate' && (
          <button 
            onClick={onPostClick}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Post Opportunity
          </button>
        )}
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GRANTS.map((grant) => (
          <div 
            key={grant.id} 
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
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
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                {grant.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {grant.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {grant.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
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