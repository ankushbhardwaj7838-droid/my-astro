import React from 'react';
import { 
  X, 
  Star, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  GraduationCap, 
  MapPin, 
  Globe, 
  Sparkles,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Expert } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';

interface ExpertProfileModalProps {
  expert: Expert;
  onClose: () => void;
  onStartChat: (expert: Expert) => void;
  onStartCall: (expert: Expert) => void;
}

export const ExpertProfileModal: React.FC<ExpertProfileModalProps> = ({
  expert,
  onClose,
  onStartChat,
  onStartCall
}) => {
  const isOnline = expert.availability === 'online';
  const isBusy = expert.availability === 'busy';

  // Universal skills list in easy human language for all astrologers
  const skillsList = expert.skills && expert.skills.length > 0 
    ? expert.skills 
    : (expert.primaryCategory === 'tarot'
        ? ['Tarot Card Reading', 'Intuitive Guidance', 'Relationship Healing']
        : expert.primaryCategory === 'career'
        ? ['Career Astrology', 'Job Timing', 'Vedic Kundli']
        : expert.primaryCategory === 'numerology'
        ? ['Numerology', 'Name Analysis', 'Lucky Numbers']
        : ['Vedic Astrology', 'Kundli Analysis', 'Simple Remedies']);

  const expertiseList = expert.specialisations.filter(
    (s) => !skillsList.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF7] w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Banner - Compact, Short & Properly Aligned */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 px-4 sm:px-6 py-4 text-white relative shrink-0 shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Small “AI Astrologer” label - clean, small size and neatly aligned */}
          {(expert.id === 'exp-kuldeep' || expert.isAiAstrologer) && (
            <div className="mb-2 flex items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/45 text-amber-200 border border-amber-300/40 shadow-xs tracking-normal">
                <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                AI Astrologer
              </span>
            </div>
          )}

          {/* Avatar and Header Details - Properly Aligned Horizontally */}
          <div className="flex items-center gap-3.5 sm:gap-4 pr-6">
            <div className="shrink-0">
              <AstrologerAvatar expert={expert} size="lg" className="border-2 border-white/85 shadow-md" />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold font-serif-cinzel truncate">{expert.name}</h3>
                <span title="Verified Astrologer" className="inline-flex shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 fill-emerald-800" />
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium truncate">{expert.title}</p>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-amber-50 pt-0.5">
                <span className="flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {expert.rating.toFixed(1)} ({expert.reviewCount.toLocaleString()}+ reviews)
                </span>
                <span>•</span>
                <span>{expert.experienceYears}+ Yrs Experience</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {expert.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Details - In Easy Human-Understandable Language */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Availability & Price Bar - Perfectly Contained Inside Border */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between sm:justify-start gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : isBusy ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {isOnline ? 'Available Now' : isBusy ? 'Busy in Consultation' : 'Offline'}
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Free First Chat Available
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3.5 flex-wrap sm:flex-nowrap">
              <div className="text-left sm:text-right flex items-baseline gap-1 shrink-0">
                <span className="text-lg sm:text-xl font-extrabold text-[#c45500] font-mono">
                  ₹{expert.discountedPrice || expert.pricePerMin}/min
                </span>
                {expert.discountedPrice && (
                  <span className="text-xs text-slate-400 line-through font-mono">
                    ₹{expert.pricePerMin}/min
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    onStartCall(expert);
                  }}
                  className="px-3 sm:px-4 py-2 bg-[#167d47] hover:bg-[#126338] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onStartChat(expert);
                  }}
                  className="px-3.5 sm:px-4 py-2 bg-[#167d47] hover:bg-[#126338] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Simple, Easy Human Language: About the Astrologer */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>About the Astrologer</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 sm:p-4 rounded-xl border border-amber-100 shadow-2xs">
              {expert.bio}
            </p>
          </div>

          {/* Skills & Methods - Easy Human Language */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Astrology Skills &amp; Methods</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Topics I Can Help You With - Human Friendly */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Topics You Can Ask About</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {(expertiseList.length > 0 ? expertiseList : expert.specialisations).map((spec) => (
                <span key={spec} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-amber-200 shadow-2xs">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Languages */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-amber-100 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Qualifications &amp; Training</span>
              </div>
              <p className="text-xs text-slate-600">{expert.education}</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-100 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>Languages Spoken</span>
              </div>
              <p className="text-xs text-slate-600">{expert.languages.join(', ')}</p>
            </div>
          </div>

          {/* Simple Consultation Promise / Reassurance */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>What to Expect in Every Consultation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-0.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Clear answers &amp; timelines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Easy home remedies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Private &amp; Confidential</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

