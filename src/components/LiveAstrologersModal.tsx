import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  Users, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Heart,
  Volume2
} from 'lucide-react';
import { Expert } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';

interface LiveAstrologersModalProps {
  experts: Expert[];
  onClose: () => void;
  onStartChat: (expert: Expert) => void;
}

export const LiveAstrologersModal: React.FC<LiveAstrologersModalProps> = ({
  experts,
  onClose,
  onStartChat
}) => {
  // Pick online experts as live stream hosts
  const liveExperts = experts.filter((e) => e.availability === 'online');
  const [selectedExpert, setSelectedExpert] = useState<Expert>(liveExperts[0] || experts[0]);

  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'Pooja S.', text: 'Namaste Guruji! Please check my marriage compatibility.', time: 'Just now' },
    { id: '2', user: 'Vikram R.', text: 'Can you tell about government exam results in July?', time: '1m ago' },
    { id: '3', user: 'Anjali M.', text: 'Your previous remedy worked like a charm! Thank you so much 🙏', time: '2m ago' },
    { id: '4', user: 'Rohan K.', text: 'Is this the right time to switch my IT job?', time: '3m ago' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [heartsCount, setHeartsCount] = useState(128);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now().toString(),
        user: 'You',
        text: newComment.trim(),
        time: 'Just now'
      },
      ...prev
    ]);
    setNewComment('');
  };

  const handleHeart = () => {
    setHeartsCount((c) => c + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-extrabold uppercase tracking-wider animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              Live Sessions
            </span>
            <span className="text-xs sm:text-sm text-slate-300 font-medium hidden sm:inline">
              Watch live astrologers, ask instant questions
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Video / Stage Simulation */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Left 2 Cols: Main Live Stream Area */}
            <div className="lg:col-span-2 p-3 sm:p-5 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800">
              
              {/* Stream Video Screen Simulation */}
              <div className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group flex items-center justify-center">
                <AstrologerAvatar
                  expert={selectedExpert}
                  size="lg"
                  className="w-full h-full rounded-none border-none shadow-none"
                />
                
                {/* Dark gradient overlay for stream text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Stream Header Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Users className="w-3 h-3 text-red-400" />
                      342 Watching
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/90 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      FREE Q&amp;A
                    </span>
                    <button
                      onClick={handleHeart}
                      className="bg-black/60 hover:bg-rose-600/80 text-white p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1 text-xs px-2.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{heartsCount}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Stream Info Overlay */}
                <div className="absolute bottom-3 inset-x-3 pointer-events-auto">
                  <div className="bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-sm sm:text-base truncate">
                          {selectedExpert.name}
                        </h4>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-xs text-amber-300 truncate mt-0.5">
                        {selectedExpert.specialisations.slice(0, 2).join(' • ')} • {selectedExpert.experienceYears} yrs exp
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onStartChat(selectedExpert);
                      }}
                      className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer active:scale-95 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat 1-on-1</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Other Currently Live Astrologers Carousel */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Other Live Astrologers
                </p>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {liveExperts.map((exp) => {
                    const isCurrent = exp.id === selectedExpert.id;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => setSelectedExpert(exp)}
                        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer shrink-0 ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-400 text-white'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                          <AstrologerAvatar expert={exp} size="xs" className="w-full h-full rounded-full border-none" />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border border-black z-20" />
                        </div>
                        <span className="text-xs font-semibold max-w-[100px] truncate">{exp.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Col: Live Chat Stream Comments */}
            <div className="p-3 sm:p-4 flex flex-col justify-between bg-slate-950 max-h-[380px] lg:max-h-full">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Live Chat Stream
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  Active
                </span>
              </div>

              {/* Comments Feed */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[260px] lg:max-h-[320px] scrollbar-thin">
                {comments.map((c) => (
                  <div key={c.id} className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-amber-300">{c.user}</span>
                      <span className="text-slate-500 text-[10px]">{c.time}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSendComment} className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a live question..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 p-2 rounded-xl cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
