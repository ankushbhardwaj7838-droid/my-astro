import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onStartFreeChat: () => void;
  onExploreExperts?: () => void;
  onSearch?: (query: string) => void;
  onSelectCategory: (category: 'love' | 'career') => void;
}

interface QuestionItem {
  id: number;
  category: 'love' | 'career';
  hindi: string;
  english: string;
}

// Exactly 10 questions: 7 Love & Relationships, then 3 Career
// Exact text, spelling, and punctuation as specified
const QUESTIONS_DATA: QuestionItem[] = [
  // Love & Relationships – 7 questions
  {
    id: 1,
    category: 'love',
    hindi: 'क्या मेरा एक्स वापस आएगा?',
    english: 'Will my ex come back?'
  },
  {
    id: 2,
    category: 'love',
    hindi: 'क्या मेरा एक्स अभी भी मुझसे प्यार करता है?',
    english: 'Does my ex still love me?'
  },
  {
    id: 3,
    category: 'love',
    hindi: 'मेरी शादी कब होगी?',
    english: 'When will I get married?'
  },
  {
    id: 4,
    category: 'love',
    hindi: 'क्या मेरा रिश्ता शादी तक पहुंचेगा?',
    english: 'Will my relationship lead to marriage?'
  },
  {
    id: 5,
    category: 'love',
    hindi: 'क्या मेरा पार्टनर मुझसे कुछ छुपा रहा है?',
    english: 'Is my partner hiding something from me?'
  },
  {
    id: 6,
    category: 'love',
    hindi: 'मेरी लव मैरिज होगी या अरेंज मैरिज?',
    english: 'Will I have a love marriage or an arranged marriage?'
  },
  {
    id: 7,
    category: 'love',
    hindi: 'मुझे सच्चा प्यार कब मिलेगा?',
    english: 'When will I find true love?'
  },
  // Career – 3 questions
  {
    id: 8,
    category: 'career',
    hindi: 'मुझे नई नौकरी कब मिलेगी?',
    english: 'When will I get a new job?'
  },
  {
    id: 9,
    category: 'career',
    hindi: 'क्या मुझे नौकरी बदलनी चाहिए?',
    english: 'Should I change my job?'
  },
  {
    id: 10,
    category: 'career',
    hindi: 'क्या मुझे करियर में तरक्की और प्रमोशन मिलेगा?',
    english: 'Will I achieve career success and get promoted?'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartFreeChat,
  onSelectCategory
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Continuous 4.5-second vertical slide-roll animation between the two promo lines inside the single button
  const [btnTextIndex, setBtnTextIndex] = useState(0);
  const [animStage, setAnimStage] = useState<'visible' | 'exiting' | 'entering'>('visible');

  useEffect(() => {
    const timer = setInterval(() => {
      // Step 1: Slide up & fade out
      setAnimStage('exiting');
      setTimeout(() => {
        // Step 2: Swap message and stage at bottom
        setBtnTextIndex((prev) => (prev === 0 ? 1 : 0));
        setAnimStage('entering');
        // Step 3: Slide up into visible view
        requestAnimationFrame(() => {
          setTimeout(() => {
            setAnimStage('visible');
          }, 30);
        });
      }, 350);
    }, 4500); // 4.5 seconds timing

    return () => clearInterval(timer);
  }, []);

  // Smooth continuous cycling through all 10 questions
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % QUESTIONS_DATA.length);
        setIsFading(false);
      }, 350);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = QUESTIONS_DATA[currentIndex];

  const handleQuestionClick = () => {
    onSelectCategory(currentQuestion.category);
    onStartFreeChat();
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFFDF7] to-amber-50/40 border-b border-amber-200/70 pt-4 pb-6 sm:pt-6 sm:pb-10 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20">
      
      {/* Decorative Sacred Mandala Geometry Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-[950px] h-[950px] text-amber-900 animate-[spin_120s_linear_infinite]">
          <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="400" cy="400" r="220" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <polygon points="400,20 480,240 700,240 520,380 590,600 400,470 210,600 280,380 100,240 320,240" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="400,780 480,560 700,560 520,420 590,200 400,330 210,200 280,420 100,560 320,560" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 relative">
        
        {/* Main Hero Showcase Box: Compact on Mobile, Spacious on Desktop */}
        <div 
          onClick={handleQuestionClick}
          className="w-full relative rounded-2xl sm:rounded-[28px] md:rounded-[36px] bg-gradient-to-r from-[#FFFDF9] via-[#FFFBF2] to-[#FFF7EB] border-[1.5px] border-[#E8A366] shadow-[0_10px_30px_-10px_rgba(232,163,102,0.25)] md:shadow-[0_16px_45px_-12px_rgba(232,163,102,0.25)] p-4 sm:p-6 md:p-10 lg:p-12 xl:p-14 flex flex-col md:flex-row items-center justify-between gap-0 md:gap-10 xl:gap-14 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-[0_20px_50px_-8px_rgba(232,163,102,0.35)]"
          title="Click to ask this question in Free Chat"
        >
          
          {/* Subtle Ambient Background Warmth */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />

          {/* Left Side: Animated Questions (Hindi Headline + English Translation Underneath) */}
          <div className="flex-1 w-full text-center flex flex-col items-center justify-center min-h-[90px] sm:min-h-[130px] md:min-h-[180px] lg:min-h-[200px] relative z-10 px-1 sm:px-4 md:px-6 py-1 md:py-0">
            
            {/* Top Ornamental Divider: Line with Golden Heart */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-40 sm:w-56 md:w-72 mx-auto mb-2 sm:mb-4 md:mb-6 opacity-85">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E5A367]/80 to-[#E5A367]" />
              <span className="text-[#E5A367] text-xs sm:text-sm md:text-base select-none">✨</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E5A367]/80 to-[#E5A367]" />
            </div>

            {/* Animated Question Block with Smooth Fade-in & Subtle Slide-up */}
            <div 
              className={`transition-all duration-400 ease-out flex flex-col items-center justify-center motion-reduce:transition-none motion-reduce:transform-none ${
                isFading 
                  ? 'opacity-0 translate-y-2' 
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Main Question Headline in Hindi (Dark Navy Blue) */}
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-[2.85rem] xl:text-[3.25rem] font-bold text-[#0C2340] leading-snug sm:leading-tight tracking-tight text-center font-sans drop-shadow-2xs">
                {currentQuestion.hindi}
              </h2>

              {/* English Translation Underneath (Warm Gold/Orange Serif) */}
              <p className="text-sm sm:text-lg md:text-2xl xl:text-[2rem] font-serif-playfair text-[#C27835] font-medium tracking-normal mt-1.5 sm:mt-3 md:mt-4 text-center">
                {currentQuestion.english}
              </p>
            </div>
          </div>

          {/* Right Side: Astrology Zodiac Circle Illustration with Glowing Twin Hearts (Strictly Hidden on Mobile, Visible on Desktop md+) */}
          <div className="hidden md:flex w-full md:w-[320px] lg:w-[380px] xl:w-[440px] shrink-0 items-center justify-center relative select-none pointer-events-none py-2">
            
            {/* Soft Rose-Coral Glow behind hearts */}
            <div className="absolute left-[20%] top-[40%] w-28 h-28 rounded-full bg-rose-400/25 blur-2xl pointer-events-none" />

            <svg 
              viewBox="0 0 340 240" 
              className="w-[270px] sm:w-[320px] lg:w-[380px] xl:w-[430px] h-auto overflow-visible"
            >
              <defs>
                {/* Golden Gradient for Wheel */}
                <linearGradient id="wheelGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E5A367" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#D97706" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#E5A367" stopOpacity="0.85" />
                </linearGradient>

                {/* Rose Pink Heart Gradient */}
                <linearGradient id="roseHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="50%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>

                {/* Peach Coral Front Heart Gradient */}
                <linearGradient id="peachHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDBA74" />
                  <stop offset="50%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>

                {/* Soft Heart Glow Filter */}
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* --- Zodiac Circle Group (Center at x=210, y=120) --- */}
              <g className="animate-[spin_90s_linear_infinite] origin-[210px_120px] motion-reduce:animate-none">
                {/* Concentric Golden Circles */}
                <circle cx="210" cy="120" r="95" fill="none" stroke="url(#wheelGoldGrad)" strokeWidth="1.2" />
                <circle cx="210" cy="120" r="76" fill="none" stroke="url(#wheelGoldGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                <circle cx="210" cy="120" r="48" fill="none" stroke="url(#wheelGoldGrad)" strokeWidth="1" />
                <circle cx="210" cy="120" r="28" fill="none" stroke="url(#wheelGoldGrad)" strokeWidth="0.8" opacity="0.6" />

                {/* 12 House Dividing Rays */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 210 + 48 * Math.sin(angle);
                  const y1 = 120 - 48 * Math.cos(angle);
                  const x2 = 210 + 95 * Math.sin(angle);
                  const y2 = 120 - 95 * Math.cos(angle);
                  return (
                    <line
                      key={`ray-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#wheelGoldGrad)"
                      strokeWidth="0.8"
                      opacity="0.75"
                    />
                  );
                })}

                {/* 12 Astrological Zodiac Symbols */}
                {[
                  { sym: '♈', deg: 0 },
                  { sym: '♉', deg: 30 },
                  { sym: '♊', deg: 60 },
                  { sym: '♋', deg: 90 },
                  { sym: '♌', deg: 120 },
                  { sym: '♍', deg: 150 },
                  { sym: '♎', deg: 180 },
                  { sym: '♏', deg: 210 },
                  { sym: '♐', deg: 240 },
                  { sym: '♑', deg: 270 },
                  { sym: '♒', deg: 300 },
                  { sym: '♓', deg: 330 },
                ].map((zodiac, i) => {
                  const midAngle = ((zodiac.deg + 15) * Math.PI) / 180;
                  const x = 210 + 85.5 * Math.sin(midAngle);
                  const y = 120 - 85.5 * Math.cos(midAngle);
                  return (
                    <text
                      key={`sym-${i}`}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#B45309"
                      fontSize="12.5"
                      fontWeight="bold"
                      className="font-serif select-none"
                      opacity="0.85"
                    >
                      {zodiac.sym}
                    </text>
                  );
                })}
              </g>

              {/* Central 8-Pointed Golden Sunburst Star (Stationary) */}
              <g transform="translate(210, 120)">
                <polygon
                  points="0,-18 4,-5 18,0 4,5 0,18 -4,5 -18,0 -4,-5"
                  fill="#D97706"
                  opacity="0.85"
                />
                <polygon
                  points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3"
                  fill="#F59E0B"
                  transform="rotate(45)"
                  opacity="0.75"
                />
                <circle cx="0" cy="0" r="2.5" fill="#FFF" />
              </g>

              {/* --- Glowing Twin 3D Hearts on the Lower-Left Arc --- */}
              <g filter="url(#softGlow)">
                
                {/* Orbital Translucent Planetary Ring around Hearts */}
                <ellipse 
                  cx="120" 
                  cy="146" 
                  rx="44" 
                  ry="17" 
                  transform="rotate(-22 120 146)" 
                  fill="none" 
                  stroke="rgba(255, 235, 220, 0.85)" 
                  strokeWidth="1.8" 
                />

                {/* Back Heart (Rose-Pink) */}
                <path 
                  d="M104,124 C94,110 74,115 74,133 C74,152 104,171 104,171 C104,171 134,152 134,133 C134,115 114,110 104,124 Z" 
                  fill="url(#roseHeartGrad)" 
                  opacity="0.95" 
                />

                {/* Front Heart (Peach-Coral with Subtle Glow Highlight) */}
                <path 
                  d="M128,132 C118,118 98,123 98,141 C98,160 128,179 128,179 C128,179 158,160 158,141 C158,123 138,118 128,132 Z" 
                  fill="url(#peachHeartGrad)" 
                />

                {/* Soft Light Highlight on Front Heart */}
                <circle cx="118" cy="132" r="3.5" fill="rgba(255,255,255,0.7)" filter="blur(1px)" />
              </g>

              {/* --- Celestial 4-Pointed Sparkle Stars --- */}
              <path
                d="M65,75 Q65,85 75,85 Q65,85 65,95 Q65,85 55,85 Q65,85 65,75 Z"
                fill="#E5A367"
                opacity="0.8"
              />
              <path
                d="M315,68 Q315,75 322,75 Q315,75 315,82 Q315,75 308,75 Q315,75 315,68 Z"
                fill="#E5A367"
                opacity="0.75"
              />
              <path
                d="M312,175 Q312,182 319,182 Q312,182 312,189 Q312,182 305,182 Q312,182 312,175 Z"
                fill="#E5A367"
                opacity="0.8"
              />
              <path
                d="M72,192 C69,188 64,189 64,194 C64,199 72,204 72,204 C72,204 80,199 80,194 C80,189 75,188 72,192 Z"
                fill="#E5A367"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>

        {/* Primary Call-to-Action: Start Free Chat Orange Button with 2s Animated Promo Cycle */}
        <div className="w-full pt-4 sm:pt-6 md:pt-10 flex flex-col items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartFreeChat();
            }}
            className="group relative overflow-hidden inline-flex items-center justify-center min-w-[270px] xs:min-w-[320px] sm:min-w-[420px] md:min-w-[490px] h-[48px] sm:h-[54px] md:h-[60px] px-5 sm:px-8 md:px-10 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 shadow-[0_6px_25px_-3px_rgba(234,88,12,0.45)] hover:shadow-[0_12px_35px_-4px_rgba(234,88,12,0.6)] border border-amber-300/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer saffron-glow select-none"
            title={btnTextIndex === 0 ? "Start Free Chat with a Verified Astrologer" : "Get 100% Free Extra Cash on Next Recharge"}
          >
            {/* Animated Shimmer Light Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            {/* Pulsing Highlight Dot */}
            <span className="absolute top-2 right-4 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>

            {/* Animated Content Transitioning Continuously Every 4-5 Seconds with Vertical Slide-Roll */}
            <div 
              className={`flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-350 ease-out transform ${
                animStage === 'visible'
                  ? 'opacity-100 translate-y-0 scale-100'
                  : animStage === 'exiting'
                  ? 'opacity-0 -translate-y-4 scale-95'
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              {btnTextIndex === 0 ? (
                <>
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100 group-hover:scale-110 transition-transform duration-200 shrink-0" />
                  <span className="tracking-wide whitespace-nowrap font-bold">Start Free Chat</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-pulse shrink-0" />
                  <span className="tracking-tight whitespace-nowrap font-extrabold text-amber-50">
                    Get 100% Free Extra Cash on Next Recharge
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                </>
              )}
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
