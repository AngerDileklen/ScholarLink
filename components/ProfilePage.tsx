import React from 'react';
import { ScholarProfile } from '../types';
import { Badge } from './Badge';
import { 
  MapPin, Building, Briefcase, Zap, GraduationCap, 
  FileText, BarChart2, Quote, ArrowLeft, Mail, Link as LinkIcon
} from 'lucide-react';

interface ProfilePageProps {
  scholar: ScholarProfile;
  onBack: () => void;
  onConnect: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ scholar, onBack, onConnect }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Navigation Helper */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-20 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Feed/Search
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT/MAIN COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card (LinkedIn Style) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-32 md:h-40 bg-gradient-to-r from-slate-700 to-slate-900 relative">
               {scholar.openToIndustry && (
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                     <Briefcase className="w-3 h-3" /> Open to Industry
                  </div>
               )}
            </div>
            
            <div className="px-6 md:px-8 pb-6 relative">
              {/* Avatar Overlap */}
              <div className="flex justify-between items-end -mt-12 mb-4">
                 <img 
                   src={scholar.avatarUrl} 
                   alt={scholar.name} 
                   className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                 />
                 <div className="hidden sm:flex gap-2 mb-2">
                    <button 
                      onClick={onConnect}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-1.5 px-4 rounded-full transition-colors shadow-sm"
                    >
                      Connect
                    </button>
                    <button className="bg-white border border-slate-300 text-slate-700 font-medium py-1.5 px-4 rounded-full hover:bg-slate-50 transition-colors">
                      Message
                    </button>
                 </div>
              </div>

              {/* Identity Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                   {scholar.name}
                   {scholar.verified && (
                     <div className="bg-blue-100 p-0.5 rounded-full" title="Verified">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                     </div>
                   )}
                </h1>
                <p className="text-lg text-slate-700 font-medium mt-1">{scholar.title}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-slate-500 text-sm">
                   <span className="flex items-center gap-1.5">
                     <Building className="w-4 h-4" /> {scholar.university.name}
                   </span>
                   <span className="flex items-center gap-1.5">
                     <MapPin className="w-4 h-4" /> {scholar.location.city}, {scholar.location.country}
                   </span>
                </div>

                {/* Mobile Connect Buttons */}
                <div className="flex sm:hidden gap-2 mt-6">
                    <button 
                      onClick={onConnect}
                      className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-sm"
                    >
                      Connect
                    </button>
                    <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors">
                      Message
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* About / Ethos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Quote className="w-5 h-5 text-slate-400" /> Research Ethos
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
               {scholar.bio}
            </p>
          </div>

          {/* AI Keywords (Tags) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> AI-Generated Keywords
               </h2>
               <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">Based on 12 papers</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {scholar.researchInterests.map(tag => (
                   <span key={tag} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors cursor-default border border-transparent hover:border-slate-300">
                      #{tag.replace(/\s+/g, '')}
                   </span>
                ))}
             </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
             <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" /> Active Projects
             </h2>
             <div className="space-y-4">
                {scholar.activeProjects && scholar.activeProjects.length > 0 ? (
                  scholar.activeProjects.map((proj, i) => (
                     <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:border-brand-200 hover:shadow-sm transition-all group">
                        <div className="mt-1">
                           <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 group-hover:text-brand-700 shadow-sm">
                              <Zap className="w-5 h-5" />
                           </div>
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{proj}</h3>
                           <p className="text-sm text-slate-500 mt-1">Leading PI • Funding Secured</p>
                           <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                              This project investigates novel approaches to specific domain challenges, integrating cross-disciplinary methodologies.
                           </p>
                        </div>
                     </div>
                  ))
                ) : (
                   <p className="text-slate-500 italic">No public active projects listed.</p>
                )}
             </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
             <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-slate-400" /> Education
             </h2>
             <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {scholar.education && scholar.education.map((edu) => (
                   <div key={edu.id} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                         <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                      </div>
                      <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                      <p className="text-slate-800 font-medium">{edu.degree}</p>
                      <span className="text-sm text-slate-500">{edu.yearStart} - {edu.yearEnd}</span>
                   </div>
                ))}
                {!scholar.education && <p className="text-slate-500 pl-12">Education history not provided.</p>}
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width) - ResearchGate Style Stats */}
        <div className="space-y-6">
           
           {/* Stats Widget */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                 <BarChart2 className="w-5 h-5 text-brand-600" /> Research Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <span className="block text-2xl font-bold text-slate-900">{scholar.citationCount.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Citations</span>
                 </div>
                 <div>
                    <span className="block text-2xl font-bold text-slate-900">{scholar.hIndex}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">h-index</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="font-bold text-slate-800 text-sm">Top Publications</h4>
                 {scholar.papers ? (
                    <ul className="space-y-4">
                       {scholar.papers.map((paper) => (
                          <li key={paper.id} className="group cursor-pointer">
                             <div className="font-medium text-brand-600 leading-snug group-hover:underline">
                                {paper.title}
                             </div>
                             <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                <span>{paper.journal}, {paper.year}</span>
                                <span className="font-semibold text-slate-600">Cited by {paper.citations}</span>
                             </div>
                          </li>
                       ))}
                    </ul>
                 ) : (
                    <p className="text-sm text-slate-500">Publications loading...</p>
                 )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                 <h4 className="font-bold text-slate-800 text-sm mb-2">Contact Info</h4>
                 <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                       <Mail className="w-4 h-4 text-slate-400" />
                       <span className="truncate">View email address</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                       <LinkIcon className="w-4 h-4 text-slate-400" />
                       <span className="truncate">Lab Website</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};