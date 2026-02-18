import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, BookOpen, Settings, Check, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { upsertProfile } from '../services/api';
import { UserRole } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

// Generate a default avatar URL from name and role
export const getDefaultAvatar = (name: string, role?: UserRole): string => {
  const colors: Record<string, string> = {
    professor: '2b6cee',
    student: '16a34a',
    corporate: '7c3aed',
  };
  const bg = colors[role || 'student'] || '2b6cee';
  const seed = encodeURIComponent(name || 'User');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=${bg}&fontFamily=Inter&fontSize=40`;
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skipped, setSkipped] = useState(false);

  const userRole = (user as any)?.role as UserRole || 'student';
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: (user as any)?.name || '',
    title: '',
    avatarUrl: '',
    institution: '',
    department: '',
    city: '',
    country: '',
    bio: '',
    researchInterests: [] as string[],
    newInterest: '',
    acceptingStudents: false,
    fundingAvailable: false,
    openToIndustry: false,
    seekingSupervisor: false,
    companyName: '',
    industry: '',
  });

  // Update name when user loads
  useEffect(() => {
    if (user && (user as any).name) {
      setFormData(prev => ({ ...prev, name: (user as any).name }));
    }
  }, [user]);

  if (!isOpen) return null;

  const completionPercent = Math.round((step / totalSteps) * 100);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await saveProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    onComplete();
  };

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const avatarUrl = formData.avatarUrl || getDefaultAvatar(formData.name, userRole);

      const profileData = {
        name: formData.name,
        title: formData.title || (userRole === 'professor' ? 'Professor' : userRole === 'student' ? 'PhD Student' : 'Industry Partner'),
        bio: formData.bio,
        avatar_url: avatarUrl,
        university_name: formData.institution || formData.companyName,
        location_city: formData.city,
        location_country: formData.country,
        research_interests: formData.researchInterests,
        role: userRole,
        accepting_students: formData.acceptingStudents,
        funding_available: formData.fundingAvailable,
        open_to_industry: formData.openToIndustry,
      };

      const success = await upsertProfile(profileData, user.id);
      if (success) {
        onComplete();
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addInterest = () => {
    const trimmed = formData.newInterest.trim();
    if (trimmed && !formData.researchInterests.includes(trimmed)) {
      setFormData({ ...formData, researchInterests: [...formData.researchInterests, trimmed], newInterest: '' });
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, researchInterests: formData.researchInterests.filter(i => i !== interest) });
  };

  const presetInterests: Record<UserRole, string[]> = {
    professor: ['Machine Learning', 'NLP', 'Computer Vision', 'Bioinformatics', 'Quantum Computing', 'Climate Science', 'Neuroscience'],
    student: ['Deep Learning', 'Data Science', 'Robotics', 'Genomics', 'Materials Science', 'Astrophysics', 'Economics'],
    corporate: ['AI/ML', 'Biotech', 'Clean Energy', 'Semiconductors', 'Drug Discovery', 'Autonomous Systems'],
  };

  const roleLabel = userRole === 'professor' ? 'Professor / PI' : userRole === 'student' ? 'Student / Researcher' : 'Industry Partner';
  const roleColor = userRole === 'professor' ? 'from-blue-600 to-blue-800' : userRole === 'student' ? 'from-green-600 to-green-800' : 'from-purple-600 to-purple-800';

  const previewAvatar = formData.avatarUrl || getDefaultAvatar(formData.name || 'User', userRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className={`px-6 py-5 bg-gradient-to-r ${roleColor} relative`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-xs font-medium uppercase tracking-wider">{roleLabel}</span>
              </div>
              <h2 className="text-xl font-bold text-white">Set Up Your Profile</h2>
              <p className="text-white/70 text-sm mt-0.5">Step {step} of {totalSteps}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{completionPercent}%</div>
              <div className="text-white/70 text-xs">Complete</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto">

          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={previewAvatar}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Profile photo URL (optional)</p>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-slate-400 mt-1">Leave blank for auto-generated avatar</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder={userRole === 'professor' ? 'Dr. Jane Smith' : userRole === 'student' ? 'John Doe' : 'Company Name'}
                />
              </div>

              {userRole !== 'corporate' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title / Position</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder={userRole === 'professor' ? 'Associate Professor of Computer Science' : 'PhD Candidate in Machine Learning'}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select industry...</option>
                    <option>Technology</option>
                    <option>Pharmaceuticals</option>
                    <option>Energy</option>
                    <option>Finance</option>
                    <option>Manufacturing</option>
                    <option>Healthcare</option>
                    <option>Defense</option>
                    <option>Other</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    {userRole === 'corporate' ? 'Company' : 'University / Institution'}
                  </label>
                  <input
                    type="text"
                    value={userRole === 'corporate' ? formData.companyName : formData.institution}
                    onChange={(e) => setFormData({ ...formData, [userRole === 'corporate' ? 'companyName' : 'institution']: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    placeholder={userRole === 'corporate' ? 'Acme Corp' : 'MIT, Oxford...'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    placeholder="Paris, London..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Research / Focus */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {userRole === 'corporate' ? 'R&D Focus / Description' : 'Bio / Research Summary'}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 resize-none text-sm"
                  placeholder={
                    userRole === 'professor'
                      ? 'I lead a research group focused on...'
                      : userRole === 'student'
                      ? 'I am a PhD student researching...'
                      : 'Our company focuses on R&D in...'
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {userRole === 'corporate' ? 'Research Areas of Interest' : 'Research Keywords'}
                </label>

                {/* Quick-add preset tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {presetInterests[userRole].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!formData.researchInterests.includes(tag)) {
                          setFormData({ ...formData, researchInterests: [...formData.researchInterests, tag] });
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        formData.researchInterests.includes(tag)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.newInterest}
                    onChange={(e) => setFormData({ ...formData, newInterest: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    placeholder="Add custom keyword..."
                  />
                  <button type="button" onClick={addInterest} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm font-medium">
                    Add
                  </button>
                </div>

                {formData.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.researchInterests.map((interest) => (
                      <span key={interest} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {interest}
                        <button type="button" onClick={() => removeInterest(interest)} className="hover:text-red-500 ml-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">These settings help others find you for the right opportunities.</p>

              {userRole === 'professor' && (
                <>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.acceptingStudents}
                      onChange={(e) => setFormData({ ...formData, acceptingStudents: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Accepting Students</div>
                      <div className="text-sm text-slate-500">Show PhD/Postdoc candidates you have open positions</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.fundingAvailable}
                      onChange={(e) => setFormData({ ...formData, fundingAvailable: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Funding Available</div>
                      <div className="text-sm text-slate-500">Indicate you have research funding for students</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.openToIndustry}
                      onChange={(e) => setFormData({ ...formData, openToIndustry: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Open to Industry Collaboration</div>
                      <div className="text-sm text-slate-500">Let companies know you're open to R&D partnerships</div>
                    </div>
                  </label>
                </>
              )}

              {userRole === 'student' && (
                <>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.seekingSupervisor}
                      onChange={(e) => setFormData({ ...formData, seekingSupervisor: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Seeking Supervisor</div>
                      <div className="text-sm text-slate-500">Professors will see you're looking for a supervisor</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.openToIndustry}
                      onChange={(e) => setFormData({ ...formData, openToIndustry: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Open to Industry Internships</div>
                      <div className="text-sm text-slate-500">Companies can reach out for research internships</div>
                    </div>
                  </label>
                </>
              )}

              {userRole === 'corporate' && (
                <>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.openToIndustry}
                      onChange={(e) => setFormData({ ...formData, openToIndustry: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Seeking Research Partners</div>
                      <div className="text-sm text-slate-500">Professors will see you're open to co-publishing and R&D</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.fundingAvailable}
                      onChange={(e) => setFormData({ ...formData, fundingAvailable: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-primary rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Offering Research Grants</div>
                      <div className="text-sm text-slate-500">Post funding opportunities for academic researchers</div>
                    </div>
                  </label>
                </>
              )}

              {/* Completion preview */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <img src={previewAvatar} alt="Preview" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-slate-900">{formData.name || 'Your Name'}</div>
                    <div className="text-sm text-slate-500">{formData.title || roleLabel}</div>
                    {formData.institution && <div className="text-xs text-slate-400">{formData.institution}</div>}
                  </div>
                </div>
                {formData.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {formData.researchInterests.slice(0, 4).map(i => (
                      <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{i}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          {step > 1 && (
            <button onClick={handleBack} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-white font-medium text-sm">
              Back
            </button>
          )}

          <button
            onClick={handleSkip}
            className="text-sm text-slate-400 hover:text-slate-600 px-2"
          >
            Skip for now
          </button>

          <button
            onClick={handleNext}
            disabled={loading || (step === 1 && !formData.name)}
            className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold text-sm disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : step === totalSteps ? (
              <>Complete Profile <Check className="w-4 h-4" /></>
            ) : (
              <>Next <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
