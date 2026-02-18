import React, { useState } from 'react';
import { Shield, Check, X, AlertCircle, Mail, Building, Loader2 } from 'lucide-react';

// List of accepted academic email domains
const VERIFIED_DOMAINS = [
  '.edu', '.ac.uk', '.ac.jp', '.ac.fr', '.ac.de', '.ac.au', '.ac.nz',
  '.edu.au', '.edu.cn', '.edu.sg', '.edu.hk', '.edu.tw',
  'univ-', 'university', 'college',
  // Top institutions
  'mit.edu', 'stanford.edu', 'harvard.edu', 'caltech.edu', 'ox.ac.uk', 
  'cam.ac.uk', 'imperial.ac.uk', 'ucl.ac.uk', 'eth.ch', 'epfl.ch',
  'polytechnique.fr', 'ens.psl.eu', 'sorbonne-universite.fr',
  '东京大学.ac.jp', '京都大学.ac.jp',
  // Research institutes
  'inria.fr', 'cnrs.fr', 'helmholtz.de', 'maxplanck.de', 'fraunhofer.de',
  'cern.ch', 'nasa.gov', 'noaa.gov'
];

interface EmailVerificationProps {
  email: string;
  onVerified: (isProfessor: boolean) => void;
  onCancel: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  onCancel
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [isProfessor, setIsProfessor] = useState(false);

  const getDomain = (email: string): string => {
    const parts = email.split('@');
    return parts.length > 1 ? parts[1].toLowerCase() : '';
  };

  const isAcademicEmail = (email: string): { valid: boolean; domain: string } => {
    const domain = getDomain(email);
    
    // Check exact matches
    if (VERIFIED_DOMAINS.some(d => domain === d)) {
      return { valid: true, domain };
    }
    
    // Check suffix matches
    if (VERIFIED_DOMAINS.some(d => domain.endsWith(d))) {
      return { valid: true, domain };
    }
    
    // Check prefix matches for special cases
    if (VERIFIED_DOMAINS.some(d => domain.startsWith(d.replace('-', '')))) {
      return { valid: true, domain };
    }
    
    return { valid: false, domain };
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { valid, domain } = isAcademicEmail(email);
    
    if (valid) {
      setVerificationStatus('success');
      // Auto-detect professor role based on email pattern
      const professorIndicators = ['prof', 'dr.', 'faculty', 'staff'];
      const detectedAsProfessor = professorIndicators.some(indicator => 
        email.toLowerCase().includes(indicator)
      ) || domain.includes('prof') || domain.includes('faculty');
      
      setIsProfessor(detectedAsProfessor);
    } else {
      setVerificationStatus('failed');
    }
    
    setIsVerifying(false);
  };

  const handleConfirm = () => {
    onVerified(isProfessor);
  };

  const domain = getDomain(email);
  const { valid } = isAcademicEmail(email);

  return (
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
          verificationStatus === 'success' 
            ? 'bg-green-100' 
            : verificationStatus === 'failed'
              ? 'bg-red-100'
              : 'bg-blue-100'
        }`}>
          {verificationStatus === 'success' ? (
            <Check className="w-8 h-8 text-green-600" />
          ) : verificationStatus === 'failed' ? (
            <X className="w-8 h-8 text-red-600" />
          ) : (
            <Shield className="w-8 h-8 text-blue-600" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900">
          {verificationStatus === 'idle' && 'Verify Your Email'}
          {verificationStatus === 'success' && 'Email Verified!'}
          {verificationStatus === 'failed' && 'Verification Failed'}
        </h3>
      </div>

      {verificationStatus === 'idle' && (
        <>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <span className="font-medium text-slate-700">{email}</span>
            </div>
            
            {valid ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                <span>Academic domain detected: {domain}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>This domain is not recognized as an academic institution. You may still proceed as a student.</span>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-slate-700">Accepted Domains Include:</h4>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {['.edu', '.ac.uk', 'university', 'inria', 'cnrs'].map(d => (
                <span key={d} className="px-2 py-1 bg-slate-100 rounded">{d}</span>
              ))}
              <span className="px-2 py-1 bg-slate-100 rounded">+ more</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleVerify}
              disabled={isVerifying}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>
        </>
      )}

      {verificationStatus === 'success' && (
        <>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Building className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Academic Email Confirmed</p>
                <p className="text-sm text-green-600">Domain: {domain}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Your Role</label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isProfessor 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input 
                    type="radio" 
                    name="role" 
                    checked={isProfessor}
                    onChange={() => setIsProfessor(true)}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-slate-900">Professor / Researcher</p>
                    <p className="text-xs text-slate-500">I run a lab or lead research projects</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  !isProfessor 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input 
                    type="radio" 
                    name="role" 
                    checked={!isProfessor}
                    onChange={() => setIsProfessor(false)}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <p className="font-medium text-slate-900">Student / PhD Candidate</p>
                    <p className="text-xs text-slate-500">I'm looking for research opportunities</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            Continue as {isProfessor ? 'Professor' : 'Student'}
          </button>
        </>
      )}

      {verificationStatus === 'failed' && (
        <>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Unable to Verify Academic Email</p>
                <p className="text-sm text-red-600 mt-1">
                  We couldn't verify that {domain} belongs to an academic institution.
                </p>
                <p className="text-sm text-red-600 mt-2">
                  You can still create a student account to browse opportunities, but some features may be limited.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Try Different Email
            </button>
            <button 
              onClick={() => onVerified(false)}
              className="flex-1 py-2.5 rounded-lg bg-slate-600 text-white font-medium hover:bg-slate-700 transition-colors"
            >
              Continue as Student
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to check if email is verified (can be used elsewhere)
export const isAcademicEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return VERIFIED_DOMAINS.some(d => 
    domain === d || domain.endsWith(d) || domain.startsWith(d.replace('-', ''))
  );
};
