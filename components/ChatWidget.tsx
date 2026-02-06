import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ChevronUp, ChevronDown, Send, ArrowLeft, MoreHorizontal, Check, Circle } from 'lucide-react';
import { MOCK_SCHOLARS } from '../services/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
}

interface ChatSession {
  scholarId: string;
  messages: Message[];
}

/**
 * ChatWidget Component
 * 
 * SECURITY NOTE: This component operates in purely SIMULATION mode.
 * No external API calls are made to AI services or backend servers.
 * All responses are pre-defined mock data to ensure API key security.
 */
export const ChatWidget: React.FC = () => {
  // UI State
  const [isOpen, setIsOpen] = useState(false); // Collapsed vs Expanded
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // Null = List View, String = Chat View
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Scroll Ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Data Initialization
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({
    [MOCK_SCHOLARS[0].id]: {
      scholarId: MOCK_SCHOLARS[0].id,
      messages: [
        { id: '1', text: "Hello! I saw your profile and I'm interested in your work on Generative Models.", sender: 'them', timestamp: new Date(Date.now() - 86400000) },
        { id: '2', text: "Hi Dr. Tremblay! Thanks for reaching out. I've been following your lab's papers on causal representation learning.", sender: 'me', timestamp: new Date(Date.now() - 82000000) },
      ]
    },
    [MOCK_SCHOLARS[1].id]: {
      scholarId: MOCK_SCHOLARS[1].id,
      messages: [
        { id: '1', text: "Are you attending the Digital Humanities conference in Paris next month?", sender: 'them', timestamp: new Date(Date.now() - 172800000) }
      ]
    }
  });

  // Derived state for the list view
  const activeConversations = Object.keys(chatSessions).map(id => {
    const scholar = MOCK_SCHOLARS.find(s => s.id === id);
    const session = chatSessions[id];
    const lastMsg = session.messages[session.messages.length - 1];
    return {
      id,
      name: scholar?.name || 'Unknown User',
      avatar: scholar?.avatarUrl || '',
      lastMessage: lastMsg.text,
      timestamp: lastMsg.timestamp
    };
  });

  const activeScholar = activeChatId ? MOCK_SCHOLARS.find(s => s.id === activeChatId) : null;
  const currentMessages = activeChatId ? chatSessions[activeChatId]?.messages || [] : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (activeChatId && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, activeChatId, isOpen, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date()
    };

    // Update state immediately with user message
    setChatSessions(prev => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        messages: [...prev[activeChatId].messages, newMessage]
      }
    }));

    setInputText('');
    setIsTyping(true);

    // SIMULATION LOGIC:
    // Generate a pre-written response regardless of input content.
    // This ensures no API keys are required.
    setTimeout(() => {
      const responses = [
        "That sounds very interesting! Could you send me the PDF?",
        "I'm currently traveling for a conference, but let's connect when I'm back.",
        "Have you considered how this applies to low-resource settings?",
        "Great point. Let's discuss this further via email.",
        "I'll have my PhD student review this and get back to you.",
        "Thanks for the update. Keep me posted on your progress."
      ];
      
      // Select random response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'them',
        timestamp: new Date()
      };

      setChatSessions(prev => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: [...prev[activeChatId].messages, reply]
        }
      }));
      setIsTyping(false);
    }, 1500); // 1.5s simulated network delay
  };

  // Render Component
  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 right-4 w-72 bg-white rounded-t-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-x border-t border-slate-200 cursor-pointer z-50 hover:bg-slate-50 transition-colors"
      >
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
               <img src={MOCK_SCHOLARS[0].avatarUrl} className="w-6 h-6 rounded-full border border-white" alt="" />
               <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="font-bold text-slate-700 text-sm">Messaging</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
             <ChevronUp className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 h-[450px] bg-white rounded-t-xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-10 duration-200">
      
      {/* Header */}
      <div 
        className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-xl cursor-pointer"
        onClick={(e) => {
           // Only collapse if clicking the header background, not buttons
           if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div className="flex items-center gap-2">
           {activeChatId && (
             <button onClick={() => setActiveChatId(null)} className="p-1 hover:bg-slate-100 rounded-full mr-1">
                <ArrowLeft className="w-4 h-4 text-slate-500" />
             </button>
           )}
           <div className="flex items-center gap-2" onClick={() => !activeChatId && setIsOpen(false)}>
              {activeScholar ? (
                 <>
                    <div className="relative">
                       <img src={activeScholar.avatarUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                       <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-slate-800 leading-tight">{activeScholar.name}</h4>
                       <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                          <Circle className="w-1.5 h-1.5 fill-current" /> Active now
                       </span>
                    </div>
                 </>
              ) : (
                 <span className="font-bold text-slate-800 text-sm">Messaging</span>
              )}
           </div>
        </div>
        <div className="flex items-center gap-1">
           <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500">
              <MoreHorizontal className="w-4 h-4" />
           </button>
           <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500">
              <ChevronDown className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {!activeChatId ? (
           // Conversation List
           <div className="divide-y divide-slate-100 bg-white">
              {activeConversations.map(chat => (
                 <div 
                   key={chat.id} 
                   onClick={() => setActiveChatId(chat.id)}
                   className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors"
                 >
                    <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" alt="" />
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-semibold text-sm text-slate-900 truncate">{chat.name}</h4>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                             {chat.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                       </div>
                       <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                    </div>
                 </div>
              ))}
              {activeConversations.length === 0 && (
                 <div className="p-8 text-center text-slate-500 text-sm">
                    No active conversations. Connect with a scholar to start chatting.
                 </div>
              )}
           </div>
        ) : (
           // Chat Messages
           <div className="p-4 space-y-4">
              {/* Profile Context Header in Chat */}
              <div className="flex flex-col items-center pb-4 border-b border-slate-200/50 mb-4">
                 <img src={activeScholar?.avatarUrl} className="w-16 h-16 rounded-full object-cover mb-2 border-4 border-white shadow-sm" alt="" />
                 <h3 className="font-bold text-slate-900">{activeScholar?.name}</h3>
                 <p className="text-xs text-slate-500">{activeScholar?.title}</p>
                 <p className="text-xs text-slate-400">{activeScholar?.university.name}</p>
              </div>

              {currentMessages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                       msg.sender === 'me' 
                       ? 'bg-brand-600 text-white rounded-tr-none' 
                       : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                       {msg.text}
                    </div>
                 </div>
              ))}
              
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-tl-none shadow-sm flex gap-1 items-center h-9">
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>
        )}
      </div>

      {/* Footer (Input) - Only visible in active chat */}
      {activeChatId && (
        <div className="p-3 bg-white border-t border-slate-200">
           <form onSubmit={handleSend} className="relative">
              <input
                 type="text"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="Write a message..."
                 className="w-full pl-3 pr-10 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="absolute right-1.5 top-1.5 p-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                 <Send className="w-3.5 h-3.5" />
              </button>
           </form>
        </div>
      )}
    </div>
  );
};