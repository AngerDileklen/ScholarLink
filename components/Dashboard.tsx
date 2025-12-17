import React, { useState } from 'react';
import { UserRole } from '../types';
import { Users, FileText, Eye, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

interface DashboardProps {
  initialRole: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialRole }) => {
  const [role, setRole] = useState<UserRole>(initialRole);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Role Toggle for Demo */}
      <div className="mb-8 flex justify-end items-center gap-3">
         <span className="text-sm text-slate-500">Viewing as:</span>
         <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
            <button 
               onClick={() => setRole('professor')}
               className={`px-3 py-1.5 text-sm font-medium rounded ${role === 'professor' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
               Professor
            </button>
            <button 
               onClick={() => setRole('student')}
               className={`px-3 py-1.5 text-sm font-medium rounded ${role === 'student' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
               Student
            </button>
         </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {role === 'professor' ? 'Lab Dashboard' : 'My Applications'}
      </h1>

      {role === 'professor' ? (
        /* Professor Dashboard Specs */
        <div className="space-y-8">
           {/* Top Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                       <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+3 this week</span>
                 </div>
                 <div className="text-3xl font-bold text-slate-900">12</div>
                 <div className="text-sm text-slate-500">Pending Student Inquiries</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                       <Eye className="w-6 h-6" />
                    </div>
                 </div>
                 <div className="text-3xl font-bold text-slate-900">1,402</div>
                 <div className="text-sm text-slate-500">Profile Views (30 days)</div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                       <FileText className="w-6 h-6" />
                    </div>
                 </div>
                 <div className="text-3xl font-bold text-slate-900">2</div>
                 <div className="text-sm text-slate-500">Active Openings</div>
              </div>
           </div>

           {/* Pending Requests List */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800">Recent Inquiries</h3>
                 <button className="text-sm text-brand-600 font-medium hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-100">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                             {String.fromCharCode(64 + i)}
                          </div>
                          <div>
                             <p className="font-medium text-slate-900">Candidate Name {i}</p>
                             <p className="text-xs text-slate-500">PhD Inquiry • "Deep Learning Alignment..."</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full"><CheckCircle className="w-5 h-5"/></button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"><XCircle className="w-5 h-5"/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        /* Student Dashboard Specs */
        <div className="space-y-8">
           {/* Application Status Widget */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                 <h3 className="font-bold text-slate-800">Application Status</h3>
              </div>
              <div className="divide-y divide-slate-100">
                 <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                       <h4 className="font-bold text-slate-900">Dr. Yoshua Tremblay</h4>
                       <p className="text-sm text-slate-500">Mila - Quebec AI Institute</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Under Review
                       </span>
                    </div>
                 </div>
                 <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                       <h4 className="font-bold text-slate-900">Dr. Marie Laurent</h4>
                       <p className="text-sm text-slate-500">Sorbonne Université</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                           Draft Saved
                        </span>
                        <button className="text-sm text-brand-600 font-semibold hover:underline">Continue</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Suggested Matches Widget */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Saved Labs</h3>
                 <div className="text-center py-8 text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">You haven't saved any profiles yet.</p>
                 </div>
              </div>
              
              <div className="bg-gradient-to-br from-brand-50 to-white p-6 rounded-xl border border-brand-100 shadow-sm">
                 <h3 className="font-bold text-brand-900 mb-2">Complete Your Profile</h3>
                 <p className="text-sm text-brand-700 mb-4">
                    You are 40% complete. Uploading a CV increases response rates by 3x.
                 </p>
                 <div className="w-full bg-brand-200 rounded-full h-2 mb-4">
                    <div className="bg-brand-500 h-2 rounded-full w-[40%]"></div>
                 </div>
                 <button className="text-sm font-bold text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700">
                    Edit Profile
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};