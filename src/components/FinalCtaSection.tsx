import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartFreeChat: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onStartFreeChat
}) => {
  const [btnTextIndex, setBtnTextIndex] = useState(0);
  const [animStage, setAnimStage] = useState<'visible' | 'exiting' | 'entering'>('visible');

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimStage('exiting');
      setTimeout(() => {
        setBtnTextIndex((prev) => (prev === 0 ? 1 : 0));
        setAnimStage('entering');
        requestAnimationFrame(() => {
          setTimeout(() => {
            setAnimStage('visible');
          }, 30);
        });
      }, 350);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-6 sm:py-8 bg-[#FFFDF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 p-5 sm:p-7 text-white text-center shadow-lg overflow-hidden">
          
          <div className="relative space-y-3 max-w-xl mx-auto">
            {/* Compact Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-900/40 text-amber-100 text-[11px] font-bold border border-amber-300/30 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Begin Your Journey to Clarity</span>
            </div>

            {/* Compact Heading */}
            <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-white tracking-tight leading-snug">
              Ready for Clear Answers in Love or Career?
            </h2>

            {/* Concise Subtext */}
            <p className="text-xs sm:text-sm text-amber-100/95 leading-relaxed">
              Connect with India&apos;s screened Vedic astrologers &amp; tarot specialists. Your first chat is 100% free with no obligation.
            </p>

            {/* Animated Compact CTA Button */}
            <div className="pt-1">
              <button
                onClick={onStartFreeChat}
                className="min-w-[220px] sm:min-w-[290px] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-amber-50 shadow-md transition-all hover:scale-102 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <div 
                  className={`flex items-center justify-center gap-1.5 transition-all duration-350 ease-out transform ${
                    animStage === 'visible'
                      ? 'opacity-100 translate-y-0 scale-100'
                      : animStage === 'exiting'
                      ? 'opacity-0 -translate-y-3 scale-95'
                      : 'opacity-0 translate-y-3 scale-95'
                  }`}
                >
                  {btnTextIndex === 0 ? (
                    <>
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      <span>Start Free Chat Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span className="text-amber-800 font-extrabold">100% Free First Consultation</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Compact Trust Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-amber-100/90 font-medium">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> 100% Private &amp; Confidential
              </span>
              <span>•</span>
              <span>No Card Required</span>
              <span>•</span>
              <span>24/7 Available</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
