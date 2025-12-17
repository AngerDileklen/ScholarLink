import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ScholarProfile } from '../types';

interface ConnectModalProps {
  scholar: ScholarProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ scholar, isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [inquiryType, setInquiryType] = useState('phd');
  const [researchMatch, setResearchMatch] = useState('');
  const [fundingStatus, setFundingStatus] = useState('seeking');
  const [cvLink, setCvLink] = useState('');
  
  // Validation State
  const [isTouched, setIsTouched] = useState(false);
  
  if (!isOpen) return null;

  const isValid = researchMatch.length >= 50 && cvLink.length > 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Simulate API call
      setTimeout(() => {
        setStep('success');
      }, 500);
    } else {
      setIsTouched(true);
    }
  };

  const handleClose = () => {
    setStep('form');
    setResearchMatch('');
    setCvLink('');
    setIsTouched(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">
            Connect with {scholar.name}
          </h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                To reduce spam, this professor requires a structured inquiry. Please complete all fields detailing your research fit.
              </p>
            </div>

            {/* Field 1: Inquiry Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Inquiry Type</label>
              <select 
                value={inquiryType} 
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="phd">PhD Application / Supervision</option>
                <option value="master">Masters Project</option>
                <option value="collab">Research Collaboration</option>
                <option value="postdoc">Postdoc Inquiry</option>
              </select>
            </div>

            {/* Field 2: Research Fit (The most important validation) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Research Topic Match <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">How does your past work or future interest align with their specific papers or lab focus?</p>
              <textarea
                value={researchMatch}
                onChange={(e) => setResearchMatch(e.target.value)}
                onBlur={() => setIsTouched(true)}
                className={`w-full rounded-lg border px-3 py-2 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px] ${
                  isTouched && researchMatch.length < 50 ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="I noticed your recent work on [Topic]..."
              />
              <div className="flex justify-between mt-1">
                 <span className={`text-xs ${isTouched && researchMatch.length < 50 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                   {isTouched && researchMatch.length < 50 ? 'Must be at least 50 characters.' : 'Minimum 50 characters.'}
                 </span>
                 <span className="text-xs text-slate-400">{researchMatch.length} chars</span>
              </div>
            </div>

            {/* Field 3: Funding Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Funding Status</label>
              <select 
                value={fundingStatus} 
                onChange={(e) => setFundingStatus(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="seeking">I am seeking funding</option>
                <option value="self">I have my own funding / scholarship</option>
                <option value="applying">I am currently applying for grants</option>
              </select>
            </div>

            {/* Field 4: CV Link */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                 Link to CV / Portfolio <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                  isValid ? 'bg-brand-600 hover:bg-brand-700 shadow-md' : 'bg-slate-300 cursor-not-allowed'
                }`}
                disabled={!isValid}
              >
                <Send className="w-4 h-4" />
                Send Inquiry
              </button>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="p-10 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Request Sent!</h3>
            <p className="text-slate-600 mb-6">
              Your inquiry has been forwarded to Dr. {scholar.name.split(' ').pop()}. 
              You will receive a notification via email if they are interested in proceeding.
            </p>
            <button 
              onClick={handleClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};