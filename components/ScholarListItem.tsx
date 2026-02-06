import React from 'react';
import { ScholarProfile } from '../types';
import { MapPin, Building, CheckCircle2, Briefcase } from 'lucide-react';

interface ScholarListItemProps {
  scholar: ScholarProfile;
  isSelected: boolean;
  onClick: () => void;
}

export const ScholarListItem: React.FC<ScholarListItemProps> = ({ scholar, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50 relative ${
        isSelected ? 'bg-brand-50 border-l-4 border-l-brand-600' : 'border-l-4 border-l-transparent bg-white'
      }`}
    >
      <div className="flex gap-3 items-start">
        <img
          src={scholar.avatarUrl}
          alt={scholar.name}
          className="w-12 h-12 rounded bg-white object-cover border border-slate-200 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold text-base truncate ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
              {scholar.name}
              {scholar.verified && (
                 <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-50 inline ml-1 align-baseline" />
              )}
            </h3>
            {scholar.openToIndustry && (
              <span title="Open to Industry" className="shrink-0">
                <Briefcase className="w-3 h-3 text-brand-600" />
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-700 truncate">{scholar.title}</p>
          
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
             <Building className="w-3 h-3 shrink-0" />
             <span className="truncate">{scholar.university.name}</span>
             <span className="mx-1">•</span>
             <span className="truncate">{scholar.location.city}</span>
          </div>
          
          {scholar.activeProjects.length > 0 && (
             <p className="text-xs text-brand-600 mt-2 font-medium truncate">
                <span className="text-slate-400 font-normal">Active: </span>
                {scholar.activeProjects[0]}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};