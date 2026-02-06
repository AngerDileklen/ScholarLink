import React from 'react';
import { MOCK_POSTS, MOCK_SCHOLARS } from '../services/mockData';
import { Post, ScholarProfile, CorporateProfile } from '../types';
import { 
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, Link as LinkIcon, 
  MoreHorizontal, Verified, Building2, GraduationCap, TrendingUp, UserPlus 
} from 'lucide-react';
import { Badge } from './Badge';

interface FeedProps {
  onSignupRequest: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onSignupRequest }) => {
  // Helper to distinguish types (Type Guard)
  const isCorporate = (author: ScholarProfile | CorporateProfile): author is CorporateProfile => {
    return (author as CorporateProfile).industry !== undefined;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* LEFT COLUMN: Identity / Sidebar */}
      <div className="hidden lg:block space-y-4">
        {/* Guest Identity Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
          <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-800"></div>
          <div className="px-6 pb-6 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-white mx-auto -mt-10 flex items-center justify-center text-slate-300">
               <GraduationCap className="w-10 h-10" />
            </div>
            <h3 className="mt-3 font-bold text-slate-900 text-lg">Welcome, Guest!</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Join the global network of scholars and industry partners.
            </p>
            <button 
              onClick={onSignupRequest}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm"
            >
              Sign Up / Login
            </button>
          </div>
          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
             <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Profile Views</span>
                <span className="font-medium text-slate-400">--</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Connections</span>
                <span className="font-medium text-slate-400">--</span>
             </div>
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Feed */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Create Post Widget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"></div>
            <div 
              onClick={onSignupRequest}
              className="flex-grow bg-slate-50 rounded-full border border-slate-200 px-4 flex items-center text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Start a post, share a paper, or update your project...
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center pt-3 border-t border-slate-100">
             <div className="flex gap-4">
                <button onClick={onSignupRequest} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 text-sm font-medium">
                   <ImageIcon className="w-4 h-4 text-blue-500" /> Media
                </button>
                <button onClick={onSignupRequest} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 text-sm font-medium">
                   <LinkIcon className="w-4 h-4 text-amber-500" /> Link Paper
                </button>
             </div>
             <button 
               onClick={onSignupRequest} 
               className="bg-slate-100 text-slate-400 font-medium px-4 py-1.5 rounded-lg text-sm cursor-not-allowed"
             >
               Post
             </button>
          </div>
        </div>

        {/* Posts List */}
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Post Header */}
            <div className="p-4 flex gap-3 items-start">
               <img 
                 src={post.author.avatarUrl} 
                 alt={post.author.name} 
                 className="w-12 h-12 rounded-full object-cover border border-slate-100"
               />
               <div className="flex-grow">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-1">
                          {post.author.name}
                          {isCorporate(post.author) && <Verified className="w-3 h-3 text-blue-500 fill-blue-50" />}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isCorporate(post.author) ? post.author.industry : post.author.title}
                          {' • '} 
                          {isCorporate(post.author) ? post.author.location.city : post.author.university.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                           {post.timestamp} • <span className="bg-slate-100 px-1 rounded">{post.type.replace('_', ' ')}</span>
                        </p>
                     </div>
                     <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
               <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
               </p>
               
               {post.relatedLink && (
                  <div className="mt-3 mb-2 bg-slate-50 border border-slate-200 rounded-lg p-3 hover:bg-slate-100 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded border border-slate-100 group-hover:border-brand-200">
                           <LinkIcon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-700">{post.relatedLink.title}</p>
                           <p className="text-xs text-slate-500 truncate">{post.relatedLink.url}</p>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Post Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-50">
               <div className="flex items-center gap-1">
                  <div className="bg-blue-100 p-1 rounded-full"><Heart className="w-3 h-3 text-blue-600 fill-blue-600" /></div>
                  <span>{post.metrics.likes}</span>
               </div>
               <div className="flex gap-3">
                  <span>{post.metrics.comments} comments</span>
                  {post.metrics.shares && <span>{post.metrics.shares} shares</span>}
               </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex justify-between">
               <button onClick={onSignupRequest} className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm transition-colors">
                  <Heart className="w-4 h-4" /> Like
               </button>
               <button onClick={onSignupRequest} className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Comment
               </button>
               <button onClick={onSignupRequest} className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm transition-colors">
                  <Share2 className="w-4 h-4" /> Share
               </button>
               <button onClick={onSignupRequest} className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-lg text-slate-600 font-medium text-sm transition-colors">
                  <Send className="w-4 h-4" /> Send
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN: Widgets */}
      <div className="hidden lg:block space-y-6">
         {/* Trending */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-slate-500" /> Trending Topics
            </h3>
            <div className="space-y-3">
               {['#GenerativeAI', '#CrisprCas9', '#ClimateEngineering', '#MedievalStudies'].map(tag => (
                  <div key={tag} className="cursor-pointer group">
                     <p className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">{tag}</p>
                     <p className="text-xs text-slate-500">2,304 posts</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Suggested Scholars */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <UserPlus className="w-4 h-4 text-slate-500" /> Suggested Scholars
            </h3>
            <div className="space-y-4">
               {MOCK_SCHOLARS.slice(0, 3).map(scholar => (
                  <div key={scholar.id} className="flex items-center gap-3">
                     <img src={scholar.avatarUrl} alt={scholar.name} className="w-10 h-10 rounded-full object-cover" />
                     <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{scholar.name}</p>
                        <p className="text-xs text-slate-500 truncate">{scholar.university.name}</p>
                     </div>
                     <button 
                        onClick={onSignupRequest}
                        className="p-1.5 border border-slate-300 rounded-full hover:bg-slate-50 text-slate-500"
                     >
                        <UserPlus className="w-4 h-4" />
                     </button>
                  </div>
               ))}
            </div>
            <button className="w-full mt-4 text-sm text-brand-600 font-medium hover:underline">
               View all suggestions
            </button>
         </div>
      </div>

    </div>
  );
};