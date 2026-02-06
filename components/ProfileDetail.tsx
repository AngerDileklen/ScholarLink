import React from 'react';
import { ScholarProfile } from '../types';
import { Badge } from './Badge';
import { MapPin, Building, BookOpen, Mail, Link as LinkIcon, Lock, X, Briefcase, Zap, ArrowUpRight } from 'lucide-react';

interface ProfileDetailProps {
  scholar: ScholarProfile;
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ scholar, isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  // Mock extended data
  const publications = [
    "Deep Learning in Low-Resource Settings (2024)",
    "Biological Constraints in Neural Networks (2023)",
    "A Survey of Generative AI Models (2023)"
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-slate-100 z-10 transition-colors"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>

        {/* Hero Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100">
          <div className="flex gap-6 items-start">
             <img 
               src={scholar.avatarUrl} 
               className="w-24 h-24 rounded-xl border-4 border-white shadow-sm object-cover"
               alt={scholar.name} 
             />
             <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900">{scholar.name}</h2>
                  {scholar.openToIndustry && (
                    <div className="hidden sm:block">
                      <Badge 
                        label="Open to Industry" 
                        variant="info" 
                        icon={<Briefcase className="w-3 h-3" />} 
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-lg text-slate-600 font-medium">{scholar.title}</p>
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                   <Building className="w-4 h-4" />
                   {scholar.university.name}
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                   <MapPin className="w-4 h-4" />
                   {scholar.location.city}, {scholar.location.country}
                </div>

                {/* Mobile only badge placement */}
                {scholar.openToIndustry && (
                   <div className="mt-3 sm:hidden">
                      <Badge 
                        label="Open to Industry" 
                        variant="info" 
                        icon={<Briefcase className="w-3 h-3" />} 
                      />
                   </div>
                )}
             </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
               onClick={onConnect}
               className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
              Connect
            </button>
            <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors">
              Share Profile
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
             <p className="text-slate-600 leading-relaxed">{scholar.bio}</p>
          </section>

          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-3">Research Focus</h3>
             <div className="flex flex-wrap gap-2">
                {scholar.researchInterests.map(tag => (
                   <span key={tag} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                   </span>
                ))}
             </div>
          </section>

          {/* Active Projects Section */}
          {scholar.activeProjects && scholar.activeProjects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Current Active Projects
              </h3>
              <div className="space-y-3">
                {scholar.activeProjects.map((project, i) => (
                  <div 
                    key={i} 
                    className="group p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                           <p className="text-slate-900 font-medium text-sm leading-snug">{project}</p>
                           <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                         </div>
                         <p className="text-xs text-slate-500 mt-1">Status: Active • Funding Secured</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-3">Recent Publications</h3>
             <ul className="space-y-3">
                {publications.map((pub, i) => (
                   <li key={i} className="flex items-start gap-3 text-slate-600">
                      <BookOpen className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{pub}</span>
                   </li>
                ))}
             </ul>
          </section>

          {/* Blurred / Private Section */}
          <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6">
             <div className="filter blur-[4px] select-none opacity-60">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact & Application Details</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-700">yoshua.tremblay@mila.quebec.ca</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-slate-500" />
                      <span className="text-brand-600">https://mila.quebec/apply/lab-104</span>
                   </div>
                   <div className="bg-white p-4 rounded border">
                      <p>Specific funding requirements: Must have...</p>
                   </div>
                </div>
             </div>
             
             {/* Login Prompt Overlay */}
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 z-10">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm border border-slate-100">
                   <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600">
                      <Lock className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-slate-900 mb-1">Login to View Details</h4>
                   <p className="text-sm text-slate-500 mb-4">
                      Contact information and application guidelines are visible to verified members only.
                   </p>
                   <button className="text-sm font-semibold text-brand-600 hover:text-brand-800">
                      Sign In or Create Account
                   </button>
                </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};