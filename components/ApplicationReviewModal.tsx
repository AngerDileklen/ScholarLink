import React from 'react';
import { X, Calendar, CheckCircle, XCircle, FileText, ExternalLink, Download, User } from 'lucide-react';
import { Inquiry, ApplicationStatus } from '../types';
import { Badge } from './Badge';

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
}

export const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  inquiry, 
  onUpdateStatus 
}) => {
  if (!isOpen || !inquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
             <h2 className="text-xl font-bold text-slate-900">Application Review</h2>
             <p className="text-sm text-slate-500">Received {inquiry.timestamp}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Left Column: Candidate Profile */}
          <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto">
             <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={inquiry.candidateAvatar} 
                  alt={inquiry.candidateName} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-sm mb-3"
                />
                <h3 className="text-xl font-bold text-slate-900">{inquiry.candidateName}</h3>
                <p className="text-sm text-slate-600 font-medium capitalize">{inquiry.type} Candidate</p>
             </div>

             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="text-center">
                   <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Match Score</span>
                   <div className={`text-3xl font-bold ${inquiry.matchScore >= 80 ? 'text-green-600' : 'text-amber-500'}`}>
                      {inquiry.matchScore}%
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${inquiry.matchScore >= 80 ? 'bg-green-500' : 'bg-amber-400'}`} 
                        style={{ width: `${inquiry.matchScore}%` }}
                      ></div>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Stats</h4>
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-600">GPA (Est.)</span>
                         <span className="font-semibold text-slate-900">3.9/4.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-600">University</span>
                         <span className="font-semibold text-slate-900">TBD</span>
                      </div>
                   </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</h4>
                   <Badge 
                      label={inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      variant={
                        inquiry.status === 'accepted' ? 'success' : 
                        inquiry.status === 'rejected' ? 'warning' : 
                        inquiry.status === 'interviewing' ? 'info' : 'neutral'
                      }
                   />
                </div>
             </div>
          </div>

          {/* Right Column: Application Details */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
             
             {/* Cover Letter Section */}
             <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-brand-600" /> Cover Letter
                </h3>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                   {inquiry.message}
                </div>
             </div>

             {/* CV / Portfolio Section */}
             <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                   <User className="w-5 h-5 text-brand-600" /> CV & Portfolio
                </h3>
                <div className="flex items-center gap-4">
                   <a 
                     href={inquiry.cvLink} 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group flex-1"
                   >
                      <div className="bg-brand-50 p-2 rounded text-brand-600 group-hover:bg-brand-100 transition-colors">
                         <ExternalLink className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                         <div className="font-semibold text-slate-900 group-hover:text-brand-700">View LinkedIn / Portfolio</div>
                         <div className="text-xs text-slate-500 truncate">{inquiry.cvLink}</div>
                      </div>
                   </a>
                   
                   <button className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-500">
                      <Download className="w-5 h-5" />
                   </button>
                </div>
             </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
           <button 
             onClick={() => onUpdateStatus(inquiry.id, 'rejected')}
             className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-red-600 rounded-lg font-medium transition-colors"
           >
              <XCircle className="w-4 h-4" /> Decline
           </button>
           <button 
             onClick={() => onUpdateStatus(inquiry.id, 'interviewing')}
             className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg font-medium transition-colors"
           >
              <Calendar className="w-4 h-4" /> Schedule Interview
           </button>
           <button 
             onClick={() => onUpdateStatus(inquiry.id, 'accepted')}
             className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium shadow-sm transition-colors"
           >
              <CheckCircle className="w-4 h-4" /> Accept Candidate
           </button>
        </div>

      </div>
    </div>
  );
};