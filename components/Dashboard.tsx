import React, { useState } from 'react';
import { UserRole, Inquiry, ApplicationStatus, AcademicEvent, ScholarProfile } from '../types';
import { MOCK_SCHOLARS, MOCK_INQUIRIES, MOCK_EVENTS } from '../services/mockData';
import {
   Users, Eye, FileText, CheckCircle, XCircle, ArrowRight, Calendar, Ticket,
   LayoutDashboard, User, Settings, MessageSquare, TrendingUp, Mail, Search, ExternalLink,
   Briefcase, GraduationCap, Clock
} from 'lucide-react';
import { ApplicationReviewModal } from './ApplicationReviewModal';

interface DashboardProps {
   userRole: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
   const [activeSection, setActiveSection] = useState<'overview' | 'candidates' | 'research' | 'inquiries'>('overview');
   const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
   const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
   const [rsvpedEvents, setRsvpedEvents] = useState<string[]>([]);

   // Current professor context (Mock Dr. Tremblay)
   const currentProfessor = MOCK_SCHOLARS[0];
   const recommendedEvents = MOCK_EVENTS.slice(0, 3);

   const handleInquiryClick = (inquiry: Inquiry) => {
      setSelectedInquiry(inquiry);
      setIsReviewModalOpen(true);
   };

   const handleStatusUpdate = (id: string, newStatus: ApplicationStatus) => {
      setInquiries(prev => prev.map(inq =>
         inq.id === id ? { ...inq, status: newStatus } : inq
      ));
      setIsReviewModalOpen(false);
   };

   const handleRsvp = (eventId: string) => {
      setRsvpedEvents(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
   };

   // Get status color
   const getStatusColor = (status: ApplicationStatus) => {
      switch (status) {
         case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
         case 'interviewing': return 'bg-blue-50 text-blue-700 border-blue-200';
         case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
         case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
         default: return 'bg-slate-50 text-slate-700 border-slate-200';
      }
   };

   // Get status icon
   const getStatusIcon = (status: ApplicationStatus) => {
      switch (status) {
         case 'pending': return <Clock className="w-3 h-3" />;
         case 'interviewing': return <MessageSquare className="w-3 h-3" />;
         case 'accepted': return <CheckCircle className="w-3 h-3" />;
         case 'rejected': return <XCircle className="w-3 h-3" />;
         default: return null;
      }
   };

   return (
      <div className="flex h-[calc(100vh-64px)] bg-[#f6f6f8] overflow-hidden">

         {/* Sidebar */}
         <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">
            <div className="p-6">
               <h2 className="text-lg font-bold text-slate-900 tracking-tight">ScholarLink</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
               <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'overview'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-500 hover:bg-slate-50'
                     }`}
               >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
               </button>
               <button
                  onClick={() => setActiveSection('candidates')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'candidates'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-500 hover:bg-slate-50'
                     }`}
               >
                  <Users className="w-5 h-5" /> Candidates
                  <span className="ml-auto bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                     {inquiries.length}
                  </span>
               </button>
               <button
                  onClick={() => setActiveSection('research')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'research'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-500 hover:bg-slate-50'
                     }`}
               >
                  <FileText className="w-5 h-5" /> Research
               </button>
               <button
                  onClick={() => setActiveSection('inquiries')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'inquiries'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-500 hover:bg-slate-50'
                     }`}
               >
                  <MessageSquare className="w-5 h-5" /> Inquiries
                  <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                     {inquiries.filter(i => i.status === 'pending').length}
                  </span>
               </button>
            </nav>
            <div className="p-4 border-t border-slate-200">
               <div className="flex items-center gap-3 px-2 py-2">
                  <img src={currentProfessor.avatarUrl} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" alt="Prof" />
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-semibold truncate text-slate-900">{currentProfessor.name}</p>
                     <p className="text-xs text-slate-500 truncate">Settings</p>
                  </div>
                  <Settings className="w-5 h-5 text-slate-400" />
               </div>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto w-full space-y-8">

               {/* Overview Section */}
               {activeSection === 'overview' && (
                  <>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                           <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                           <p className="text-slate-500 mt-1">Welcome back, {currentProfessor.name.split(' ')[1]}. Here's your lab activity.</p>
                        </div>
                     </div>

                     {/* Stats Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-medium text-slate-500">Pending Applications</p>
                                 <p className="text-3xl font-bold text-slate-900 mt-2">{inquiries.filter(i => i.status === 'pending').length}</p>
                              </div>
                              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                 <Mail className="w-6 h-6 text-amber-600" />
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-medium text-slate-500">Profile Views</p>
                                 <p className="text-3xl font-bold text-slate-900 mt-2">1,240</p>
                              </div>
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                 <Eye className="w-6 h-6 text-blue-600" />
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-medium text-slate-500">Active Projects</p>
                                 <p className="text-3xl font-bold text-slate-900 mt-2">{currentProfessor.activeProjects.length}</p>
                              </div>
                              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                 <Briefcase className="w-6 h-6 text-emerald-600" />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Recent Applications */}
                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
                           <button
                              onClick={() => setActiveSection('candidates')}
                              className="text-sm text-primary font-medium hover:underline"
                           >
                              View All
                           </button>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                       <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Candidate</th>
                                       <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                                       <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Match</th>
                                       <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                                       <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Action</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-200">
                                    {inquiries.slice(0, 4).map((inquiry) => (
                                       <tr key={inquiry.id} className="hover:bg-slate-50">
                                          <td className="px-6 py-4">
                                             <div className="flex items-center gap-3">
                                                <img src={inquiry.candidateAvatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                                                <span className="font-medium text-slate-900">{inquiry.candidateName}</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4 capitalize text-slate-600">{inquiry.type}</td>
                                          <td className="px-6 py-4">
                                             <span className={`font-medium ${inquiry.matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {inquiry.matchScore}%
                                             </span>
                                          </td>
                                          <td className="px-6 py-4">
                                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(inquiry.status)}`}>
                                                {getStatusIcon(inquiry.status)}
                                                {inquiry.status}
                                             </span>
                                          </td>
                                          <td className="px-6 py-4">
                                             <button
                                                onClick={() => handleInquiryClick(inquiry)}
                                                className="text-primary text-sm font-medium hover:underline"
                                             >
                                                Review
                                             </button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </>
               )}

               {/* Candidates Section - Issue #8 Fix */}
               {activeSection === 'candidates' && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input
                              placeholder="Search candidates..."
                              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64"
                           />
                        </div>
                     </div>

                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                 <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Candidate</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Match</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Applied</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                 {inquiries.map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-slate-50">
                                       <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                             <img src={inquiry.candidateAvatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                                             <div>
                                                <p className="font-medium text-slate-900">{inquiry.candidateName}</p>
                                                <p className="text-xs text-slate-500">{inquiry.cvLink}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 capitalize">
                                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{inquiry.type}</span>
                                       </td>
                                       <td className="px-6 py-4">
                                          <div className="w-20">
                                             <div className="flex justify-between text-xs mb-1">
                                                <span className={`font-bold ${inquiry.matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{inquiry.matchScore}%</span>
                                             </div>
                                             <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full ${inquiry.matchScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${inquiry.matchScore}%` }}></div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(inquiry.status)}`}>
                                             {getStatusIcon(inquiry.status)}
                                             {inquiry.status}
                                          </span>
                                       </td>
                                       <td className="px-6 py-4 text-sm text-slate-500">{inquiry.timestamp}</td>
                                       <td className="px-6 py-4">
                                          <div className="flex gap-2">
                                             <button
                                                onClick={() => handleInquiryClick(inquiry)}
                                                className="px-3 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-primary-hover"
                                             >
                                                Review
                                             </button>
                                             <button className="px-3 py-1 text-xs font-medium border border-slate-200 rounded hover:bg-slate-50">
                                                Message
                                             </button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {/* Research Section - Issue #8 Fix */}
               {activeSection === 'research' && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">Research</h1>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Active Projects */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                           <h2 className="text-lg font-bold text-slate-900 mb-4">Active Projects</h2>
                           <div className="space-y-4">
                              {currentProfessor.activeProjects.map((project, i) => (
                                 <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                       <h3 className="font-medium text-slate-900">{project}</h3>
                                       <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Active</span>
                                    </div>
                                    <p className="text-sm text-slate-500">Research in progress with full funding support</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Publications */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                           <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Publications</h2>
                           <div className="space-y-4">
                              {currentProfessor.papers?.map((paper, i) => (
                                 <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                       <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                       <h3 className="font-medium text-slate-900 text-sm">{paper.title}</h3>
                                       <p className="text-xs text-slate-500">{paper.journal} • {paper.year}</p>
                                       <p className="text-xs text-slate-400 mt-1">{paper.citations} citations</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Inquiries Section - Issue #8 Fix */}
               {activeSection === 'inquiries' && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">Inquiries</h1>
                        <div className="flex gap-2">
                           <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                              <option>All Status</option>
                              <option>Pending</option>
                              <option>Interviewing</option>
                              <option>Accepted</option>
                              <option>Rejected</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {inquiries.map((inquiry) => (
                           <div key={inquiry.id} className="bg-white rounded-xl border border-slate-200 p-6">
                              <div className="flex items-start justify-between gap-4">
                                 <div className="flex gap-4">
                                    <img src={inquiry.candidateAvatar} className="w-14 h-14 rounded-full object-cover" alt="" />
                                    <div>
                                       <div className="flex items-center gap-2">
                                          <h3 className="font-bold text-slate-900">{inquiry.candidateName}</h3>
                                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${getStatusColor(inquiry.status)}`}>
                                             {getStatusIcon(inquiry.status)}
                                             {inquiry.status}
                                          </span>
                                       </div>
                                       <p className="text-sm text-slate-500 capitalize">{inquiry.type} Candidate</p>
                                       <p className="text-xs text-slate-400 mt-1">Applied {inquiry.timestamp}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm text-slate-500">Match Score</p>
                                    <p className={`text-2xl font-bold ${inquiry.matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                       {inquiry.matchScore}%
                                    </p>
                                 </div>
                              </div>
                              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                                 <p className="text-sm text-slate-600 line-clamp-3">{inquiry.message}</p>
                              </div>
                              <div className="mt-4 flex gap-3">
                                 <button
                                    onClick={() => handleInquiryClick(inquiry)}
                                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover"
                                 >
                                    Review Application
                                 </button>
                                 <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">
                                    Message
                                 </button>
                                 <a
                                    href={inquiry.cvLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2"
                                 >
                                    View CV <ExternalLink className="w-3 h-3" />
                                 </a>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </main>

         <ApplicationReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            inquiry={selectedInquiry}
            onUpdateStatus={handleStatusUpdate}
         />
      </div>
   );
};
