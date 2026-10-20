import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Compass, 
  Heart,
  Briefcase,
  Gem,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap
} from 'lucide-react';

interface TarotVedicServicesSectionProps {
  onSelectMethod: (method: string) => void;
}

export const TarotVedicServicesSection: React.FC<TarotVedicServicesSectionProps> = ({
  onSelectMethod
}) => {
  const services = [
    {
      id: 'vedic',
      title: 'Vedic Astrology & Janam Kundli',
      subtitle: 'Ancient Jyotish Planetary Calculations',
      desc: 'Comprehensive natal chart analysis (D-1 Lagna & D-9 Navamsha) decoding life destiny, current Mahadasha cycles, and Mangal Dosha remedies.',
      icon: Compass,
      gradient: 'from-amber-500 to-orange-500',
      badge: 'Most Popular',
      features: ['D-1 Lagna & Navamsha Charts', 'Mahadasha & Antardasha Timing', 'Mangal & Kaal Sarp Dosha Analysis'],
      cta: 'Consult Vedic Astrologer'
    },
    {
      id: 'love',
      title: 'Love Compatibility & Calculator',
      subtitle: 'Elemental Harmony & Deep Love Readings',
      desc: 'Authentic 36-Guna matching, Venus-Mars alignment, and ₹49 Deep Love Readings to uncover partner intentions and resolve relationship friction.',
      icon: Heart,
      gradient: 'from-rose-500 to-pink-600',
      badge: 'Trending Service',
      features: ['Zodiac & DOB Compatibility', 'Ex Reconciliation & Silent Treatments', 'Deep Love Reading at ₹49'],
      cta: 'Check Love Compatibility'
    },
    {
      id: 'tarot',
      title: 'Intuitive Tarot Card Reading',
      subtitle: 'Subconscious Clarity for Immediate Choices',
      desc: 'Symbolic Celtic Cross and 3-card spread readings revealing hidden feelings, third-party blockages, and the most auspicious path forward.',
      icon: Layers,
      gradient: 'from-purple-600 to-indigo-600',
      badge: 'Instant Answers',
      features: ['Celtic Cross & Relationship Spreads', 'Mindset & Unspoken Thoughts', 'Fast & Direct Decision Guidance'],
      cta: 'Consult Tarot Reader'
    },
    {
      id: 'career',
      title: 'Career, Job Switch & Business Luck',
      subtitle: '10th House Professional Forecasts',
      desc: 'Decide the optimal window for job switches, promotion appraisals, and business startups calculated via planetary dasha and shubh muhurat.',
      icon: Briefcase,
      gradient: 'from-blue-600 to-cyan-600',
      badge: 'High Accuracy',
      features: ['Job Change Timing Windows', 'Promotion & Appraisal Forecasts', 'Business & Startup Muhurat'],
      cta: 'Get Career Insights'
    },
    {
      id: 'remedies',
      title: 'Authentic Vedic Remedies & Gemstones',
      subtitle: 'Practical Solutions for Planetary Peace',
      desc: 'Tailored gemstone recommendations, energised Rudraksha advice, sacred mantra chanting, and daily lifestyle practices to overcome hurdles.',
      icon: Gem,
      gradient: 'from-emerald-600 to-teal-600',
      badge: 'Proven Remedies',
      features: ['Certified Gemstone Prescription', 'Rudraksha & Yantra Guidance', 'Simple Vedic Charity & Mantras'],
      cta: 'Explore Vedic Remedies'
    },
    {
      id: 'horoscope',
      title: 'Daily Horoscope & Zodiac Forecasts',
      subtitle: 'Real-Time Planetary Transit Guidance',
      desc: 'Daily transit predictions across all 12 signs with personalized love scores, career outlooks, lucky numbers, and auspicious daily colors.',
      icon: Sparkles,
      gradient: 'from-amber-600 to-yellow-600',
      badge: 'Daily Updated',
      features: ['12 Zodiac Sign Daily Forecasts', 'Daily Love & Career Scores', 'Auspicious Numbers & Colors'],
      cta: 'Read Daily Horoscope'
    }
  ];

  return (
    <section 
      id="vedic-services" 
      className="py-10 sm:py-14 bg-[#FFFDF7] border-b border-amber-200/70 relative"
      itemScope 
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="My-Astro Verified Astrology & Tarot Services" />
      <meta itemProp="description" content="Explore online Vedic astrology, Love Calculator, Tarot readings, career guidance, and authentic Vedic remedies." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* SEO Optimized Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-3 py-1 rounded-full mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Comprehensive Astrology Services &amp; Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-serif-cinzel">
            Online Vedic Astrology, Tarot &amp; Love Guidance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Discover India&apos;s leading online astrology hub. From instant love calculations and deep readings to career transitions and authentic remedies, our verified specialists provide grounded planetary clarity.
          </p>
        </div>

        {/* 6 Comprehensive Service Cards Grid with Rich SEO Microdata */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/Service"
                className="bg-white rounded-2xl border border-amber-200/90 hover:border-amber-400 p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group hover:-translate-y-0.5"
              >
                <meta itemProp="position" content={String(idx + 1)} />
                <div>
                  {/* Top: Icon + Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200/90 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 
                    itemProp="name"
                    className="text-base sm:text-lg font-bold font-serif-cinzel text-slate-900 mb-0.5 group-hover:text-amber-700 transition-colors"
                  >
                    {item.title}
                  </h3>
                  <h4 className="text-xs font-semibold text-amber-800 mb-2">
                    {item.subtitle}
                  </h4>

                  {/* Description */}
                  <p 
                    itemProp="description"
                    className="text-xs text-slate-600 leading-relaxed mb-3.5"
                  >
                    {item.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-amber-100/80 mb-4">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-3 border-t border-amber-100/80">
                  <button
                    onClick={() => onSelectMethod(item.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-500 hover:text-white border border-amber-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:shadow-xs active:scale-98"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & SEO Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border border-amber-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Verified Specialists
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
              <Zap className="w-4 h-4 text-amber-600" />
              Instant &lt; 60s Connect
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              4.95★ Highest Rated
            </span>
          </div>

          <div className="text-[11px] text-amber-900 font-semibold">
            First Chat Consultation is 100% Free • No Credit Card Needed
          </div>
        </div>

      </div>
    </section>
  );
};
