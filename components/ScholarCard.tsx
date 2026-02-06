import React from 'react';
import { ScholarProfile } from '../types';
import { Badge } from './Badge';
import { MapPin, BookOpen, GraduationCap, CheckCircle2, UserPlus, Banknote } from 'lucide-react';

interface ScholarCardProps {
  scholar: ScholarProfile;
  distanceKm?: number | null;
  onConnect: (scholar: ScholarProfile) => void;
  onViewProfile: (scholar: ScholarProfile) => void;
}

export const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, distanceKm, onConnect, onViewProfile }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col md:flex-row">
      {/* Avatar Section */}
      <div className="md:w-48 bg-slate-50 flex items-center justify-center p-6 border-r border-slate-100">
        <div className="relative">
          <img
            src={scholar.avatarUrl}
            alt={scholar.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm cursor-pointer"
            onClick={() => onViewProfile(scholar)}
          />
          {scholar.verified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm" title="Verified Affiliation">
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 
                className="text-xl font-bold text-slate-900 cursor-pointer hover:underline"
                onClick={() => onViewProfile(scholar)}
              >
                {scholar.name}
              </h3>
              <p className="text-sm text-slate-600 font-medium">{scholar.title}</p>
              <div className="flex items-center mt-1 text-slate-500 text-sm">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>{scholar.university.name} • {scholar.department}</span>
              </div>
              <div className="flex items-center mt-1 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{scholar.location.city}, {scholar.location.country}</span>
                {distanceKm !== undefined && distanceKm !== null && (
                  <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {distanceKm.toFixed(1)} km away
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
               {/* Metrics - Tiny Dashboard within card */}
               <div className="text-right">
                  <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">H-Index</span>
                  <span className="block text-lg font-bold text-slate-700">{scholar.hIndex}</span>
               </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Research Interests</h4>
            <div className="flex flex-wrap gap-2">
              {scholar.researchInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600 line-clamp-2">
            {scholar.bio}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {scholar.acceptingStudents && (
              <Badge 
                label="Accepting Students" 
                variant="success" 
                icon={<UserPlus className="w-3 h-3" />} 
              />
            )}
            {scholar.fundingAvailable && (
              <Badge 
                label="Funding Available" 
                variant="info" 
                icon={<Banknote className="w-3 h-3" />} 
              />
            )}
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => onViewProfile(scholar)}
               className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
             >
               View Full Profile
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};