import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  Briefcase, 
  ArrowLeft,
  Share2,
  Check, 
  Sun,
  ShieldCheck,
  Star,
  Compass,
  MessageCircle
} from 'lucide-react';
import { ZODIAC_FORECASTS } from '../data/mockData';
import { ZodiacDailyForecast, Expert } from '../types';
import { ZodiacSignLogo } from './ZodiacIcons';

interface DailyHoroscopeSectionProps {
  onStartFreeChat: () => void;
  onStartChatWithExpert?: (expert: Expert, question?: string) => void;
  experts?: Expert[];
}

export const DailyHoroscopeSection: React.FC<DailyHoroscopeSectionProps> = ({
  onStartFreeChat,
  onStartChatWithExpert,
  experts = []
}) => {
  // State for opening dedicated Horoscope page/screen for the selected sign
  const [activeSignPage, setActiveSignPage] = useState<string | null>(null);
  const [timelineTab, setTimelineTab] = useState<'yesterday' | 'today' | 'tomorrow'>('today');
  const [copiedLink, setCopiedLink] = useState(false);

  // Prevent background scrolling when full-screen page is open
  useEffect(() => {
    if (activeSignPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSignPage]);

  // Handle escape key to close dedicated page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSignPage) {
        setActiveSignPage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSignPage]);

  const activeForecast = activeSignPage 
    ? ZODIAC_FORECASTS.find(z => z.sign === activeSignPage) || ZODIAC_FORECASTS[0]
    : null;

  // Astrologer to recommend for this sign
  const matchingAstrologer = experts.find(e => 
    e.specialisations.includes('Vedic') || e.specialisations.includes('Kundali')
  ) || experts[0];

  const handleShare = () => {
    if (navigator.share && activeForecast) {
      navigator.share({
        title: `${activeForecast.sign} Daily Horoscope`,
        text: `Read today's ${activeForecast.sign} horoscope and celestial prediction on My-Astro!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      <section id="horoscope" className="py-12 sm:py-16 bg-[#FFFDF7] border-b border-amber-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>DAILY ASTROLOGICAL FORECAST</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif-cinzel">
              Horoscope
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Select your zodiac sign to read today's celestial guidance and planetary insights.
            </p>
          </div>

          {/* 2 Zodiac Signs Per Line Grid (exact requirement: "show two zodiac sign in the line") */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
            {ZODIAC_FORECASTS.map((z) => {
              return (
                <button
                  key={z.sign}
                  type="button"
                  onClick={() => {
                    setActiveSignPage(z.sign);
                    setTimelineTab('today');
                  }}
                  className="group relative text-left p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/20 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3 sm:gap-3.5"
                >
                  {/* Authentic Zodiac Sign Logo Container matching reference image */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white border border-slate-100/90 p-1 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                    <ZodiacSignLogo sign={z.sign} className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                  </div>

                  {/* Sign Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate tracking-wide uppercase font-serif-cinzel">
                        {z.sign}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate font-medium">
                      {z.dateRange}
                    </p>
                    <span className="text-[10px] text-amber-700/80 font-medium">
                      {z.sanskritName} • {z.element}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* DEDICATED FULL SCREEN HOROSCOPE PAGE (Opens like a new tab / dedicated screen when tapped) */}
      {activeForecast && (
        <div 
          className="fixed inset-0 z-50 bg-[#FFFDF7] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Navigation Bar: Back Button, Title, Share */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveSignPage(null)}
                className="p-2 -ml-1 rounded-xl text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                aria-label="Back to Horoscope List"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-amber-200" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-serif-cinzel text-sm sm:text-base">
                  {activeForecast.sign} Horoscope
                </span>
                <span className="text-[11px] text-amber-700 font-medium hidden sm:inline">
                  ({activeForecast.sanskritName})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-600 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer text-xs flex items-center gap-1"
                title="Share horoscope"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span className="text-[11px] font-semibold hidden sm:inline">
                  {copiedLink ? 'Copied' : 'Share'}
                </span>
              </button>
            </div>
          </div>

          {/* Scrollable Page Body */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-8">
            <div className="max-w-xl mx-auto space-y-6">

              {/* Sign Hero Card */}
              <div className="bg-white rounded-3xl border border-amber-200/90 p-5 sm:p-6 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-100/40 rounded-full blur-xl pointer-events-none" />
                
                {/* Large Authentic Logo */}
                <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-amber-100 p-2.5 flex items-center justify-center shadow-sm mb-3">
                  <ZodiacSignLogo sign={activeForecast.sign} className="w-16 h-16 object-contain" />
                </div>

                {/* Sign Titles */}
                <h1 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-slate-900 uppercase tracking-wide">
                  {activeForecast.sign}
                </h1>
                <p className="text-xs font-semibold text-amber-800 mt-1">
                  {activeForecast.sanskritName} • {activeForecast.element} Element
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {activeForecast.dateRange}
                </p>

                {/* Timeline Selector Tabs: Yesterday | Today | Tomorrow */}
                <div className="inline-flex items-center p-1 bg-amber-50 border border-amber-200/80 rounded-xl mt-5 text-xs font-semibold shadow-2xs">
                  {(['yesterday', 'today', 'tomorrow'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTimelineTab(tab)}
                      className={`px-4 sm:px-6 py-2 rounded-lg capitalize transition-all cursor-pointer ${
                        timelineTab === tab
                          ? 'bg-amber-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cosmic Highlights (Lucky Number, Color, Elemental alignment) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-amber-200/80 p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Lucky Number
                  </span>
                  <span className="text-lg font-bold text-amber-700 font-mono mt-0.5 block">
                    {activeForecast.luckyNumber}
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-amber-200/80 p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Lucky Color
                  </span>
                  <span className="text-sm font-bold text-amber-700 truncate mt-1 block">
                    {activeForecast.luckyColor}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-amber-200/80 p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                    Cosmic Element
                  </span>
                  <span className="text-sm font-bold text-amber-700 mt-1 block">
                    {activeForecast.element}
                  </span>
                </div>
              </div>

              {/* Forecast Details: Love & Relationship */}
              <div className="bg-white rounded-2xl border border-rose-200/90 p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                    Love &amp; Relationships
                  </h3>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-mono">
                    {activeForecast.loveScore}% Alignment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {timelineTab === 'yesterday'
                    ? `Yesterday's Reflection: Cosmic vibrations highlighted honest dialogue and mutual respect. ${activeForecast.loveForecast}`
                    : timelineTab === 'tomorrow'
                    ? `Tomorrow's Forecast: Venus brings calming warmth and deeper mutual understanding. ${activeForecast.loveForecast}`
                    : activeForecast.loveForecast}
                </p>
              </div>

              {/* Forecast Details: Career & Wealth */}
              <div className="bg-white rounded-2xl border border-blue-200/90 p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-700" />
                    Career &amp; Business
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-mono">
                    {activeForecast.careerScore}% Potential
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {timelineTab === 'yesterday'
                    ? `Yesterday's Work Energy: Prudent choices helped establish steady professional footing. ${activeForecast.careerForecast}`
                    : timelineTab === 'tomorrow'
                    ? `Tomorrow's Outlook: High analytical clarity empowers decisive project execution. ${activeForecast.careerForecast}`
                    : activeForecast.careerForecast}
                </p>
              </div>

              {/* Quick Zodiac Switcher Bar with Logos */}
              <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Check Another Zodiac Sign</span>
                </h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {ZODIAC_FORECASTS.map((z) => (
                    <button
                      key={z.sign}
                      onClick={() => setActiveSignPage(z.sign)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        z.sign === activeForecast.sign
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200/80 hover:bg-amber-50'
                      }`}
                    >
                      <ZodiacSignLogo sign={z.sign} className="w-4 h-4 shrink-0" />
                      <span>{z.sign}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation CTA */}
              <div className="pt-2 pb-6">
                <button
                  onClick={() => {
                    setActiveSignPage(null);
                    if (matchingAstrologer && onStartChatWithExpert) {
                      onStartChatWithExpert(matchingAstrologer, `Hello, I'd like a personalized horoscope & birth chart reading for ${activeForecast.sign} (${activeForecast.sanskritName}).`);
                    } else {
                      onStartFreeChat();
                    }
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consult Astrologer for {activeForecast.sign} Chart • First Chat Free</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
