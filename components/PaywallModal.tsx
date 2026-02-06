import React from 'react';
import { X, Check, ShieldCheck, CreditCard } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Premium Header */}
        <div className="bg-gradient-to-br from-slate-900 to-brand-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-10 h-10 text-brand-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Upgrade to Partner</h2>
            <p className="text-brand-100 text-sm mt-2 font-medium">Unlock full recruitment & posting capabilities</p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="p-8">
          <div className="space-y-4 mb-8">
            {[
              "Post unlimited verified grants & jobs",
              "Access AI-matched scholar recommendations",
              "Priority listing on discovery feed",
              "Direct messaging with research labs"
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="bg-green-100 p-1 rounded-full mt-0.5">
                  <Check className="w-3 h-3 text-green-700 font-bold" />
                </div>
                <span className="text-slate-700 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-slate-900">Monthly Subscription</span>
              <span className="text-xl font-bold text-slate-900">$299<span className="text-sm text-slate-500 font-normal">/mo</span></span>
            </div>
            <p className="text-xs text-slate-500">Cancel anytime. Secure payment via Stripe.</p>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 group"
          >
            <CreditCard className="w-5 h-5 group-hover:scale-105 transition-transform" />
            Subscribe & Post Opportunity
          </button>
        </div>

      </div>
    </div>
  );
};