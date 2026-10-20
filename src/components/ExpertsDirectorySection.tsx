import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown,
  ChevronUp,
  Users,
  LayoutGrid,
  Heart,
  Briefcase,
  Sparkles,
  Sun,
  Moon,
  Hash
} from 'lucide-react';
import { Expert } from '../types';
import { AstrologerCard } from './AstrologerCard';

interface ExpertsDirectorySectionProps {
  experts: Expert[];
  onStartChat: (expert: Expert) => void;
  onStartCall: (expert: Expert) => void;
  onViewProfile: (expert: Expert) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ExpertsDirectorySection: React.FC<ExpertsDirectorySectionProps> = ({
  experts,
  onStartChat,
  onViewProfile,
  searchQuery,
  onSearchChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Online astrologers count continuously shuffling every 2.5 seconds between 100 and 700
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

  // Exact sequence requested: all, love, career, new, vedic, tarot, numerology
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
    return experts
      .filter((e) => {
        // Category filtering
        if (selectedCategory === 'all') {
          // match all
        } else if (selectedCategory === 'new') {
          // newly added / rising talent
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

        // Search query filter
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

  return (
    <section id="experts-directory" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20 relative">
      <div id="experts" className="absolute -top-24 left-0 pointer-events-none" />
      
      {/* Header: Our Astrologers & Online Astrologer Section */}
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-serif-cinzel">
          Our Astrologers
        </h2>

        {/* Live Now Indicator */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-xs font-bold shadow-2xs border border-pink-300/60 shrink-0 select-none">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="tabular-nums font-bold tracking-tight transition-all duration-300">
            {liveCount} Astrologer Live Now
          </span>
        </div>
      </div>

      {/* Category Tabs: Sequence: All, Love, Career, New, Vedic, Tarot, Numerology */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] px-3 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-1 ring-amber-300'
                  : 'bg-white border-slate-200/90 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${cat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Directory Grid of Redesigned Astrologer Profile Cards */}
      {filteredExperts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-amber-200 p-8 space-y-3">
          <p className="text-lg font-bold text-slate-800">No astrologers found in this category</p>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try switching to "All" or clearing your search term.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 cursor-pointer"
          >
            Show All Astrologers
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredExperts.slice(0, visibleCount).map((expert) => (
              <AstrologerCard
                key={expert.id}
                expert={expert}
                onStartChat={onStartChat}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>

          {/* View All / Show Top 10 Astrologers Button */}
          {filteredExperts.length > 10 && (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              {visibleCount < filteredExperts.length ? (
                <button
                  onClick={() => setVisibleCount(filteredExperts.length)}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer saffron-glow"
                >
                  <Users className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
                  <span>View All Astrologers ({filteredExperts.length})</span>
                  <ChevronDown className="w-4 h-4 text-amber-100 group-hover:translate-y-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setVisibleCount(10);
                    const el = document.getElementById('experts-directory') || document.getElementById('experts');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-slate-700 bg-white border border-amber-300 hover:bg-amber-50 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Show Top 10 Astrologers</span>
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};
