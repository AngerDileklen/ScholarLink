import React, { useState } from 'react';
import { X, Image, Link, Send, FileText, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Post, PostType } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user, role } = useAuth();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('paper_share');

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: `new_${Date.now()}`,
      author: user,
      type: postType,
      content: content,
      timestamp: 'Just now',
      metrics: { likes: 0, comments: 0 }
    };

    onSubmit(newPost);
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Create Post</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-4">
             <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
             <div>
                <h4 className="font-bold text-slate-900">{user.name}</h4>
                <div className="flex gap-2 mt-1">
                   {role === 'professor' && (
                     <button 
                        onClick={() => setPostType('paper_share')}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${postType === 'paper_share' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                     >
                       Paper Share
                     </button>
                   )}
                   <button 
                      onClick={() => setPostType('project_update')}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${postType === 'project_update' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                   >
                     Project Update
                   </button>
                   {role === 'corporate' && (
                     <button 
                        onClick={() => setPostType('grant_post')}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${postType === 'grant_post' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                     >
                       Grant/Challenge
                     </button>
                   )}
                </div>
             </div>
          </div>

          <textarea
            className="w-full min-h-[150px] p-4 bg-slate-50 rounded-xl border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none text-lg"
            placeholder={
               postType === 'grant_post' ? "Describe the grant opportunity, amount, and deadlines..." :
               postType === 'paper_share' ? "Share your abstract or key findings..." :
               "What are you working on today?"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />

          <div className="mt-6 flex justify-between items-center">
             <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors" title="Add Image">
                   <Image className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors" title="Attach Link">
                   <Link className="w-5 h-5" />
                </button>
                {postType === 'grant_post' && (
                   <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors" title="Attach Document">
                      <FileText className="w-5 h-5" />
                   </button>
                )}
             </div>
             
             <button 
               onClick={handleSubmit}
               disabled={!content.trim()}
               className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold shadow-sm flex items-center gap-2 transition-all"
             >
               <Send className="w-4 h-4" />
               Post
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};