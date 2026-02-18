import React from 'react';
import { Microscope, GraduationCap, ArrowRight } from 'lucide-react';

export const LandingSegments: React.FC = () => {
  return (
    <div className="bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        
        {/* For Professors Section */}
        <div className="p-8 md:p-12 hover:bg-slate-50 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-brand-600">
              <Microscope className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-brand-600 uppercase tracking-wide">For Professors</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Recruit the Best Talent for Your Lab
          </h2>
          
          <ul className="space-y-3 mb-8 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2" />
              <span>Target students by specific research interests, not just GPA.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2" />
              <span>Receive structured, high-quality applications (no spam).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2" />
              <span>Broadcast funding availability to a global talent pool.</span>
            </li>
          </ul>
          
          <button className="flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-3 transition-all">
            Create Lab Profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* For Students Section */}
        <div className="p-8 md:p-12 hover:bg-slate-50 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">For Students</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Find Your Ideal Supervisor & Funding
          </h2>
          
          <ul className="space-y-3 mb-8 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
              <span>Discover labs working on exactly what you want to study.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
              <span>Filter by "Accepting Students" and "Funding Available".</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
              <span>Verify supervisor activity levels and mentorship styles.</span>
            </li>
          </ul>
          
          <button className="flex items-center gap-2 text-emerald-700 font-semibold group-hover:gap-3 transition-all">
            Find Supervisors <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};