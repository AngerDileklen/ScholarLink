import React, { useState } from 'react';
import { ScholarProfile } from '../types';
import { 
  Building, MapPin, Briefcase, Zap, GraduationCap, 
  BarChart2, ArrowLeft, Mail, Link as LinkIcon, Share2, Edit,
  BookOpen, Users, Calendar, Award, ExternalLink
} from 'lucide-react';

interface ProfilePageProps {
  scholar: ScholarProfile;
  onBack: () => void;
  onConnect: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ scholar, onBack, onConnect }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'network'>('overview');

  return (
    <div className="bg-[#f6f6f8] min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
           <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Hero Header - Fixed overflow for avatar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 relative group">
           {/* Cover Image */}
           <div className="h-48 w-full relative rounded-t-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-900 mix-blend-multiply z-10 opacity-90"></div>
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                 <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 rounded-lg transition-colors border border-white/10">
                    <Share2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
           
           <div className="px-6 sm:px-8 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-end -mt-16 sm:-mt-20 gap-6">
                 {/* Avatar - Fixed positioning with proper sizing */}
                 <div className="relative z-20 shrink-0 -mt-8 sm:mt-0">
                    <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-xl ring-4 ring-white bg-white shadow-lg" style={{ marginTop: '-2rem' }}>
                       <img src={scholar.avatarUrl} className="w-full h-full object-cover rounded-xl" alt={scholar.name} />
                    </div>
                    {scholar.acceptingStudents && (
                       <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 border-2 border-white shadow-sm">
                          <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                       </div>
                    )}
                 </div>
                 
                 {/* Name and Info - Fixed margin issue */}
                 <div className="flex-1 pt-6 sm:pt-0 text-center sm:text-left min-w-0 w-full">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                       <h1 className="text-3xl font-bold text-slate-900 leading-tight truncate">{scholar.name}</h1>
                       {scholar.verified && <span className="text-primary font-bold text-xl shrink-0">✓</span>}
                    </div>
                    <div className="text-slate-600 font-medium text-lg mb-4 leading-snug">{scholar.title}</div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1 shrink-0"><Building className="w-4 h-4 opacity-70" /> {scholar.university.name}</span>
                       <span className="flex items-center gap-1 shrink-0"><MapPin className="w-4 h-4 opacity-70" /> {scholar.location.city}, {scholar.location.country}</span>
                    </div>
                 </div>

                 <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto shrink-0">
                    <button onClick={onConnect} className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all">
                       Connect
                    </button>
                    <button className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg font-medium transition-all">
                       Message
                    </button>
                 </div>
              </div>
           </div>

           {/* Tabs - Now Functional */}
           <div className="px-6 sm:px-8 border-t border-slate-200 bg-slate-50/50">
              <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
                 <button 
                   onClick={() => setActiveTab('overview')}
                   className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors ${
                     activeTab === 'overview' 
                       ? 'border-primary text-primary' 
                       : 'border-transparent text-slate-500 hover:text-slate-700'
                   }`}
                 >
                    Overview
                 </button>
                 <button 
                   onClick={() => setActiveTab('publications')}
                   className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors ${
                     activeTab === 'publications' 
                       ? 'border-primary text-primary' 
                       : 'border-transparent text-slate-500 hover:text-slate-700'
                   }`}
                 >
                    Publications ({scholar.papers?.length || 0})
                 </button>
                 <button 
                   onClick={() => setActiveTab('network')}
                   className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors ${
                     activeTab === 'network' 
                       ? 'border-primary text-primary' 
                       : 'border-transparent text-slate-500 hover:text-slate-700'
                   }`}
                 >
                    Network
                 </button>
              </div>
           </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Main Content */}
           <div className="lg:col-span-8 space-y-8">
              
              {activeTab === 'overview' && (
                <>
                  <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200">
                     <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Zap className="text-primary w-5 h-5" /> Research Ethos
                     </h3>
                     <p className="text-slate-600 leading-relaxed mb-6">
                        {scholar.bio}
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {scholar.researchInterests.map(tag => (
                           <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </section>

                  <section>
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                           <Briefcase className="text-primary w-5 h-5" /> Active Projects
                        </h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scholar.activeProjects.map((proj, i) => (
                           <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-primary/50 transition-colors group cursor-pointer">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <Zap className="text-emerald-500 w-5 h-5" />
                                 </div>
                                 <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2 leading-snug">{proj}</h4>
                              <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                 Leading investigation into this domain with full funding support.
                              </p>
                           </div>
                        ))}
                     </div>
                  </section>
                </>
              )}

              {activeTab === 'publications' && (
                <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200">
                   <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <BookOpen className="text-primary w-5 h-5" /> Publications
                   </h3>
                   <div className="space-y-4">
                      {scholar.papers && scholar.papers.length > 0 ? (
                        scholar.papers.map((paper, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <BookOpen className="text-primary w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 mb-1">{paper.title}</h4>
                              <p className="text-sm text-slate-500">{paper.journal} • {paper.year}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-slate-400">{paper.citations} citations</span>
                                <a href={paper.url || '#'} className="text-xs text-primary hover:underline flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> View
                                </a>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>No publications listed yet</p>
                        </div>
                      )}
                   </div>
                </section>
              )}

              {activeTab === 'network' && (
                <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200">
                   <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Users className="text-primary w-5 h-5" /> Academic Network
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Collaborators */}
                      <div className="p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" /> Collaborators
                        </h4>
                        <p className="text-sm text-slate-500">View collaboration network and co-authors</p>
                      </div>
                      {/* Students */}
                      <div className="p-4 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-primary" /> Current Students
                        </h4>
                        <p className="text-sm text-slate-500">PhD candidates and research assistants</p>
                      </div>
                   </div>
                </section>
              )}

           </div>

           {/* Sidebar */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Research Impact */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-900 mb-6">Research Impact</h3>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-[#f6f6f8] border border-slate-100">
                       <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Citations</div>
                       <div className="text-2xl font-bold text-slate-900">{scholar.citationCount.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#f6f6f8] border border-slate-100">
                       <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">h-index</div>
                       <div className="text-2xl font-bold text-slate-900">{scholar.hIndex}</div>
                    </div>
                 </div>
              </div>

              {/* Education - NEW */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" /> Education
                 </h3>
                 <div className="space-y-4">
                    {scholar.education && scholar.education.length > 0 ? (
                      scholar.education.map((edu, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{edu.degree}</p>
                            <p className="text-xs text-slate-500">{edu.institution} • {edu.yearStart} - {edu.yearEnd}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No education data available</p>
                    )}
                 </div>
              </div>

              {/* Status Badges */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">Status</h3>
                 <div className="space-y-3">
                    {scholar.acceptingStudents && (
                      <div className="flex items-center gap-2 text-green-600">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-medium">Accepting Students</span>
                      </div>
                    )}
                    {scholar.fundingAvailable && (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">Funding Available</span>
                      </div>
                    )}
                    {scholar.openToIndustry && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm font-medium">Open to Industry</span>
                      </div>
                    )}
                    {scholar.verified && (
                      <div className="flex items-center gap-2 text-primary">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">Verified Scholar</span>
                      </div>
                    )}
                 </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">Contact</h3>
                 <ul className="space-y-4">
                    <li>
                       <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                             <LinkIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm">Lab Website</span>
                       </a>
                    </li>
                    <li>
                       <a href="#" className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                             <Mail className="w-4 h-4" />
                          </div>
                          <span className="text-sm">Email Hidden</span>
                       </a>
                    </li>
                 </ul>
              </div>

           </div>

        </div>
      </div>
    </div>
  );
};
