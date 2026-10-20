import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  MessageCircle, 
  LayoutGrid, 
  Heart, 
  Briefcase, 
  Sparkles, 
  Sun, 
  Moon, 
  Hash,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Expert } from '../types';
import { AstrologerCard } from './AstrologerCard';

interface AstrologerListModalProps {
  experts: Expert[];
  onClose: () => void;
  onStartChat: (expert: Expert) => void;
  onViewProfile?: (expert: Expert) => void;
}

export const AstrologerListModal: React.FC<AstrologerListModalProps> = ({
  experts,
  onClose,
  onStartChat,
  onViewProfile
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Online count shuffling
  const [liveCount, setLiveCount] = useState<number>(() => Math.floor(Math.random() * (700 - 100 + 1)) + 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveCount((prev) => {
        let next = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
        if (next === prev) {
          next = next >= 690 ? next - 20 : next + 20;
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { key: 'all', label: 'All', icon: LayoutGrid, color: 'bg-orange-100 text-orange-600' },
    { key: 'love', label: 'Love', icon: Heart, color: 'bg-pink-100 text-rose-500' },
    { key: 'career', label: 'Career', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { key: 'new', label: 'New', icon: Sparkles, color: 'bg-teal-100 text-teal-600' },
    { key: 'vedic', label: 'Vedic', icon: Sun, color: 'bg-amber-100 text-amber-600' },
    { key: 'tarot', label: 'Tarot', icon: Moon, color: 'bg-purple-100 text-purple-600' },
    { key: 'numerology', label: 'Numerology', icon: Hash, color: 'bg-indigo-100 text-indigo-600' },
  ];

  const filteredExperts = useMemo(() => {
    return experts.filter((e) => {
      if (selectedCategory === 'all') {
        // all
      } else if (selectedCategory === 'new') {
        const isNew = e.experienceYears <= 13 || ['exp-14', 'exp-10', 'exp-7', 'exp-9'].includes(e.id);
        if (!isNew) return false;
      } else if (selectedCategory === 'love') {
        const match = 
          e.primaryCategory === 'love' || 
          e.secondaryCategories.includes('love') ||
          e.specialisations.some(s => s.toLowerCase().includes('love'));
        if (!match) return false;
      } else if (selectedCategory === 'career') {
        const match = 
          e.primaryCategory === 'career' || 
          e.secondaryCategories.includes('career') ||
          e.specialisations.some(s => s.toLowerCase().includes('career'));
        if (!match) return false;
      } else if (selectedCategory === 'vedic') {
        const match = 
          e.primaryCategory === 'vedic' || 
          e.secondaryCategories.includes('vedic') ||
          e.specialisations.some(s => s.toLowerCase().includes('vedic') || s.toLowerCase().includes('kundali'));
        if (!match) return false;
      } else if (selectedCategory === 'tarot') {
        const match = 
          e.primaryCategory === 'tarot' || 
          e.secondaryCategories.includes('tarot') ||
          e.specialisations.some(s => s.toLowerCase().includes('tarot'));
        if (!match) return false;
      } else if (selectedCategory === 'numerology') {
        const match = 
          e.primaryCategory === 'numerology' || 
          e.secondaryCategories.includes('numerology') ||
          e.specialisations.some(s => s.toLowerCase().includes('numerology'));
        if (!match) return false;
      }

      // Kuldeep is always included and shown on top
      if (e.id === 'exp-kuldeep') return true;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.specialisations.some((s) => s.toLowerCase().includes(q)) ||
        e.languages.some((l) => l.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (a.id === 'exp-kuldeep') return -1;
      if (b.id === 'exp-kuldeep') return 1;
      return 0;
    });
  }, [experts, searchQuery, selectedCategory]);

  // Alternating Hindi and English banner content (Hindi first, then English)
  const BANNER_CONTENT = [
    {
      heading: 'पहले जुड़ें, फिर फैसला करें।',
      description: 'पहले बात करें, अच्छा लगे तो आगे बढ़ें।'
    },
    {
      heading: 'Connect First. Decide Later.',
      description: 'Chat first. Continue if you love the experience.'
    }
  ];

  const [contentIndex, setContentIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  // 4-5 second interval (4.5s) alternating automatically between Hindi and English
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setContentIndex((prev) => (prev === 0 ? 1 : 0));
        setIsFading(false);
      }, 350);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF7] w-full max-w-5xl h-[100dvh] sm:h-[92vh] rounded-none sm:rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white p-3.5 sm:p-5 flex items-center justify-between shrink-0 shadow-xs">
          {/* Alternating Hindi / English Content (Target Selected Section) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 pr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div 
                className={`transition-all duration-300 ease-out transform ${
                  isFading ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
                }`}
              >
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-serif-cinzel tracking-tight text-white leading-tight">
                  {BANNER_CONTENT[contentIndex].heading}
                </h2>
                <p className="text-[11px] sm:text-xs md:text-sm text-amber-100 leading-snug mt-1 font-medium line-clamp-2 sm:line-clamp-none">
                  {BANNER_CONTENT[contentIndex].description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Count Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/90 text-white text-xs font-bold border border-pink-300/40 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{liveCount} Live Now</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Astrologer List"
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filters Strip */}
        <div className="bg-amber-50/70 p-3 sm:p-4 border-b border-amber-200/80 space-y-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-700/60 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search astrologers by name, language, tarot, vedic..."
              className="w-full bg-white border border-amber-300 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-amber-100/70 border border-amber-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Astrologers Grid List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#FFFDF7]">
          {filteredExperts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-base font-bold text-slate-700">No astrologers found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 cursor-pointer"
              >
                View All Astrologers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredExperts.map((expert) => (
                <AstrologerCard
                  key={expert.id}
                  expert={expert}
                  onStartChat={(exp) => {
                    onClose();
                    onStartChat(exp);
                  }}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-white p-2.5 sm:p-3 border-t border-amber-200 flex items-center justify-between px-4 sm:px-6 text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Screened &amp; Verified Astrologers</span>
          </div>
          <span className="font-semibold text-amber-800">
            Showing {filteredExperts.length} Astrologers
          </span>
        </div>

      </div>
    </div>
  );
};
