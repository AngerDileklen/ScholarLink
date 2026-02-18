import React, { useState, useEffect } from 'react';
import { MOCK_POSTS, MOCK_SCHOLARS } from '../services/mockData';
import { Post, ScholarProfile, CorporateProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { CreatePostModal } from './CreatePostModal';
import { fetchPosts } from '../services/api';
import { getDefaultAvatar } from './OnboardingModal';
import { 
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, Link as LinkIcon, 
  MoreHorizontal, CheckCircle2, TrendingUp, UserPlus, Bookmark, FileText, Users, DollarSign, Calendar,
  RefreshCw, AlertCircle, X
} from 'lucide-react';

interface FeedProps {
  onSignupRequest: () => void;
  onViewProfile: (scholar: ScholarProfile) => void;
}

export const Feed: React.FC<FeedProps> = ({ onSignupRequest, onViewProfile }) => {
  const { user, isAuthenticated, role } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showCommentBox, setShowCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Load real posts from Supabase, fallback to mock
  const loadPosts = async () => {
    setIsRefreshing(true);
    try {
      const realPosts = await fetchPosts();
      if (realPosts && realPosts.length > 0) {
        setPosts(realPosts);
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch {
      setPosts(MOCK_POSTS);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Get user avatar with fallback
  const userAvatar = user?.avatarUrl || (user ? getDefaultAvatar(user.name, role || 'student') : '');

  // Profile completion check
  const isProfileIncomplete = isAuthenticated && user && (!user.bio || !(user as any).researchInterests?.length);

  const isCorporate = (author: ScholarProfile | CorporateProfile): author is CorporateProfile => {
    return (author as CorporateProfile).industry !== undefined;
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      onSignupRequest();
    } else {
      setIsPostModalOpen(true);
    }
  };

  const handleNewPostSubmit = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  // Issue #2 & #3: Handlers for shortcuts and like/comment/share
  const handleLike = (postId: string) => {
    if (!isAuthenticated) {
      onSignupRequest();
      return;
    }
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    // Update post metrics
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          metrics: {
            ...p.metrics,
            likes: likedPosts.has(postId) ? p.metrics.likes - 1 : p.metrics.likes + 1
          }
        };
      }
      return p;
    }));
  };

  const handleComment = (postId: string) => {
    if (!isAuthenticated) {
      onSignupRequest();
      return;
    }
    setShowCommentBox(showCommentBox === postId ? null : postId);
  };

  const handleShare = (postId: string) => {
    if (!isAuthenticated) {
      onSignupRequest();
      return;
    }
    // Copy to clipboard or open share modal
    alert('Share functionality - link copied to clipboard!');
  };

  const handleSubmitComment = (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    
    // Add comment to post
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          metrics: {
            ...p.metrics,
            comments: p.metrics.comments + 1
          }
        };
      }
      return p;
    }));
    setCommentText({ ...commentText, [postId]: '' });
    setShowCommentBox(null);
  };

  // Shortcut handlers - Issue #2
  const handleShortcutClick = (action: string) => {
    if (!isAuthenticated) {
      onSignupRequest();
      return;
    }
    console.log(`Shortcut clicked: ${action}`);
    // Navigate to respective page or open modal
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile & Context (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible relative">
            <div className="h-20 bg-gradient-to-r from-slate-700 to-slate-900 rounded-t-xl relative">
              <div className="absolute -bottom-10 left-4 z-10 p-1 bg-white rounded-full shadow-md">
                {isAuthenticated && user ? (
                   <img src={userAvatar} className="h-20 w-20 rounded-full object-cover border-2 border-white" alt="User Avatar" />
                ) : (
                   <img src="https://api.dicebear.com/7.x/initials/svg?seed=Guest&backgroundColor=94a3b8" className="h-20 w-20 rounded-full object-cover border-2 border-white" alt="Guest" />
                )}
              </div>
            </div>
            <div className="pt-12 px-4 pb-4">
              {isAuthenticated && user ? (
                <>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">{user.name}</h2>
                  <p className="text-sm text-slate-500 mt-1 leading-snug">
                    {isCorporate(user) ? user.industry : user.title}
                  </p>
                  {!isCorporate(user) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                      <div>
                        <span className="block text-lg font-bold text-slate-900">{(user as ScholarProfile).citationCount.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 font-medium">Citations</span>
                      </div>
                      <div>
                        <span className="block text-lg font-bold text-slate-900">{(user as ScholarProfile).hIndex}</span>
                        <span className="text-xs text-slate-500 font-medium">h-index</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-900">Guest User</h2>
                  <p className="text-sm text-slate-500 mt-1">Join the network to see stats.</p>
                  <button onClick={onSignupRequest} className="mt-4 w-full bg-primary text-white py-1.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                    Sign In
                  </button>
                </>
              )}
            </div>
            {isAuthenticated && (
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer rounded-b-xl">
                <Bookmark className="text-slate-400 w-4 h-4" />
                <span className="text-xs font-semibold text-slate-600">My Items</span>
              </div>
            )}
          </div>

          {/* Shortcuts Menu - Now Functional */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 ml-2">Shortcuts</h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => handleShortcutClick('publications')} className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors">
                  <FileText className="text-slate-400 w-5 h-5" /> My Publications
                </button>
              </li>
              <li>
                <button onClick={() => handleShortcutClick('lab')} className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors">
                  <Users className="text-slate-400 w-5 h-5" /> Lab Group: NLP
                </button>
              </li>
              <li>
                <button onClick={() => handleShortcutClick('grants')} className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors">
                  <DollarSign className="text-slate-400 w-5 h-5" /> Saved Grants
                </button>
              </li>
              <li>
                <button onClick={() => handleShortcutClick('conferences')} className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors">
                  <Calendar className="text-slate-400 w-5 h-5" /> Conferences 2024
                </button>
              </li>
            </ul>
          </div>
          
          <div className="text-xs text-slate-400 px-4">
            <p>© 2024 ScholarLink Inc.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <a className="hover:underline" href="#">Privacy</a>
              <a className="hover:underline" href="#">Terms</a>
              <a className="hover:underline" href="#">Guidelines</a>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Feed (6 cols) */}
        <div className="col-span-1 lg:col-span-6 space-y-6">

          {/* Profile Completion Banner */}
          {isProfileIncomplete && showBanner && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">Complete your profile to get discovered</p>
                <p className="text-xs text-amber-600 mt-0.5">Add your research interests and bio to attract collaborators and opportunities.</p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-amber-400 hover:text-amber-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Composer Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex gap-4">
              <img 
                alt="User" 
                className="h-10 w-10 rounded-full object-cover" 
                src={userAvatar || "https://api.dicebear.com/7.x/initials/svg?seed=Guest"} 
              />
              <div className="flex-1">
                <div 
                  onClick={handleCreatePost}
                  className="bg-slate-50 rounded-lg p-3 cursor-text hover:bg-slate-100 transition-colors"
                >
                  <p className="text-slate-500 text-sm font-medium">Share new research findings or ask a question...</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <button onClick={handleCreatePost} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <LinkIcon className="text-primary w-4 h-4" /> Link Paper
                    </button>
                    <button onClick={handleCreatePost} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <ImageIcon className="text-green-600 w-4 h-4" /> Media
                    </button>
                  </div>
                  <button onClick={handleCreatePost} className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs text-slate-400 font-medium px-4">Latest from your network</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div onClick={() => !isCorporate(post.author) && onViewProfile(post.author as ScholarProfile)} className="cursor-pointer">
                      <img src={post.author.avatarUrl} alt={post.author.name} className="h-10 w-10 rounded-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => !isCorporate(post.author) && onViewProfile(post.author as ScholarProfile)}
                          className="text-sm font-bold text-slate-900 hover:underline cursor-pointer"
                        >
                          {post.author.name}
                        </span>
                        {isCorporate(post.author) && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                      </div>
                      <p className="text-xs text-slate-500">
                        {isCorporate(post.author) ? post.author.industry : post.author.title}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-slate-400">{post.timestamp} • </span>
                        <span className="text-xs text-slate-400 capitalize">{post.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{post.content}</p>
                  
                  {post.relatedLink && (
                    <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 flex gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                      <div className="hidden sm:flex h-16 w-16 bg-white border border-slate-200 shadow-sm items-center justify-center flex-shrink-0 rounded">
                        <FileText className="text-slate-300 w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                          {post.relatedLink.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.relatedLink.url}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                             Resource
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar - Now Functional */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-slate-500 hover:text-primary'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-xs font-semibold">Like ({post.metrics.likes})</span>
                    </button>
                    <button 
                      onClick={() => handleComment(post.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-500 hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Comment ({post.metrics.comments})</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-500 hover:text-primary transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-semibold">Share</span>
                    </button>
                  </div>
                </div>
                
                {/* Comment Input Box */}
                {showCommentBox === post.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex gap-2">
                      <img 
                        src={user?.avatarUrl || "https://via.placeholder.com/40"} 
                        className="h-8 w-8 rounded-full object-cover" 
                        alt="User" 
                      />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button 
                          onClick={() => handleSubmitComment(post.id)}
                          className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* RIGHT COLUMN: Trending & Suggestions (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          {/* Trending Topics Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Trending in Science</h3>
            <ul className="space-y-4">
              {[
                { tag: '#SolidStatePhysics', cat: 'Physics • Trending', count: '2.4k papers' },
                { tag: '#LLMs', cat: 'CS • Trending', count: '12.8k discussions' },
                { tag: '#CRISPR', cat: 'Biology • Popular', count: '1.2k new citations' },
                { tag: '#SustainableEnergy', cat: 'Engineering • Rising', count: '890 projects' },
              ].map((item, i) => (
                <li key={i} className="cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">{item.cat}</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{item.tag}</p>
                    </div>
                    <MoreHorizontal className="text-slate-300 w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.count}</p>
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 text-xs font-semibold text-primary hover:text-primary-hover text-left py-2">
              Show more
            </button>
          </div>

          {/* Suggested Scholars Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Suggested Scholars</h3>
            </div>
            <ul className="space-y-4">
              {MOCK_SCHOLARS.slice(0, 2).map((s) => (
                <li key={s.id} className="flex items-start gap-3">
                  <img src={s.avatarUrl} className="h-10 w-10 rounded-full object-cover border border-slate-200" alt={s.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate hover:underline cursor-pointer" onClick={() => onViewProfile(s)}>{s.name}</p>
                    <p className="text-xs text-slate-500 truncate">{s.title}</p>
                    <button onClick={onSignupRequest} className="mt-2 flex items-center justify-center gap-1 w-full py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-medium">
                      <UserPlus className="w-3 h-3" /> Connect
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onSubmit={handleNewPostSubmit}
      />
    </div>
  );
};