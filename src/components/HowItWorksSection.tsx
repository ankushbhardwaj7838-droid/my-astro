import React from 'react';
import { 
  UserCheck, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  Zap
} from 'lucide-react';

export const HowItWorksSection: React.FC<{ onStartFreeChat: () => void }> = ({
  onStartFreeChat
}) => {
  const steps = [
    {
      num: '01',
      title: 'Pick Your Astrologer',
      desc: 'Browse verified Vedic & Tarot specialists. Filter by experience, language, and specific concerns.',
      icon: UserCheck,
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/20',
      badge: 'Step 01',
      tag: '⚡ Connect in < 1 min'
    },
    {
      num: '02',
      title: 'Start Free First Chat',
      desc: 'Enter your birth date, time, and questions in a private, end-to-end encrypted consultation room.',
      icon: MessageSquare,
      gradient: 'from-orange-500 to-rose-500',
      shadowColor: 'shadow-orange-500/20',
      badge: 'Step 02',
      tag: '🎁 100% Free Consultation'
    },
    {
      num: '03',
      title: 'Gain Clarity & Remedies',
      desc: 'Receive planetary timing insights, actionable life guidance, and authentic Vedic remedies.',
      icon: Sparkles,
      gradient: 'from-purple-600 to-amber-600',
      shadowColor: 'shadow-purple-500/20',
      badge: 'Step 03',
      tag: '📜 Authentic Vedic Solutions'
    }
  ];

  return (
    <section 
      id="how-it-works"
      className="min-h-[calc(100vh-4rem)] lg:min-h-screen flex flex-col justify-center py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-[#FFFDF7] via-amber-50/60 to-[#FFFDF7] border-y border-amber-200/80 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 relative z-10 my-auto flex flex-col justify-center">
        
        {/* Header - Centered & proportioned for one-page viewport */}
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300/80 text-amber-900 text-xs font-bold tracking-wide uppercase shadow-2xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>3 Simple Steps • Fast &amp; Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-cinzel">
            How <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">My-Astro</span> Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-lg mx-auto">
            Connect with verified Vedic astrologers in under 60 seconds with 100% privacy and real-time guidance.
          </p>
        </div>

        {/* 3 Step Cards - Balanced layout fitting seamlessly on screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 max-w-5xl mx-auto w-full">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="group relative bg-white/95 rounded-xl border border-amber-200/90 hover:border-amber-400 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                {/* Top Row: Step Tag + Desktop Connector */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs">
                    {s.badge}
                  </span>
                  
                  {idx < steps.length - 1 && (
                    <div className="hidden md:flex items-center text-amber-300 group-hover:text-amber-500 transition-colors">
                      <ArrowRight className="w-4 h-4 opacity-75" />
                    </div>
                  )}
                </div>

                {/* Card Main: Icon + Title + 2-3 lines Description */}
                <div>
                  <div className="flex items-start gap-3.5 mb-2.5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shrink-0 shadow-sm ${s.shadowColor} group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif-cinzel leading-snug">
                        {s.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-1">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom micro-tag */}
                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-amber-900/90 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {s.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Row - Clean & centered */}
        <div className="mt-6 sm:mt-7 text-center flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <button
            onClick={onStartFreeChat}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 group active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-amber-100 group-hover:rotate-6 transition-transform" />
            <span>Start Free First Chat Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="inline-flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Confidential
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              4.9/5 Rating
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Instant Connect
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
