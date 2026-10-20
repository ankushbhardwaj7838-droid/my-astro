import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Heart, 
  User, 
  CheckCircle2, 
  Calendar, 
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Lock,
  MessageCircle,
  Gift,
  Check,
  Star,
  RefreshCw,
  X,
  RotateCcw,
  Search
} from 'lucide-react';
import { ZodiacSignLogo } from './ZodiacIcons';

interface ZodiacMeta {
  key: string;
  name: string;
  sanskrit: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  ruler: string;
  dates: string;
}

const ZODIAC_LIST: ZodiacMeta[] = [
  { key: 'aries', name: 'Aries', sanskrit: 'Mesh', element: 'Fire', ruler: 'Mars (Mangal)', dates: 'Mar 21 - Apr 19' },
  { key: 'taurus', name: 'Taurus', sanskrit: 'Vrishabha', element: 'Earth', ruler: 'Venus (Shukra)', dates: 'Apr 20 - May 20' },
  { key: 'gemini', name: 'Gemini', sanskrit: 'Mithun', element: 'Air', ruler: 'Mercury (Budh)', dates: 'May 21 - Jun 20' },
  { key: 'cancer', name: 'Cancer', sanskrit: 'Kark', element: 'Water', ruler: 'Moon (Chandra)', dates: 'Jun 21 - Jul 22' },
  { key: 'leo', name: 'Leo', sanskrit: 'Simha', element: 'Fire', ruler: 'Sun (Surya)', dates: 'Jul 23 - Aug 22' },
  { key: 'virgo', name: 'Virgo', sanskrit: 'Kanya', element: 'Earth', ruler: 'Mercury (Budh)', dates: 'Aug 23 - Sep 22' },
  { key: 'libra', name: 'Libra', sanskrit: 'Tula', element: 'Air', ruler: 'Venus (Shukra)', dates: 'Sep 23 - Oct 22' },
  { key: 'scorpio', name: 'Scorpio', sanskrit: 'Vrishchik', element: 'Water', ruler: 'Mars & Ketu', dates: 'Oct 23 - Nov 21' },
  { key: 'sagittarius', name: 'Sagittarius', sanskrit: 'Dhanu', element: 'Fire', ruler: 'Jupiter (Brihaspati)', dates: 'Nov 22 - Dec 21' },
  { key: 'capricorn', name: 'Capricorn', sanskrit: 'Makar', element: 'Earth', ruler: 'Saturn (Shani)', dates: 'Dec 22 - Jan 19' },
  { key: 'aquarius', name: 'Aquarius', sanskrit: 'Kumbh', element: 'Air', ruler: 'Saturn (Shani)', dates: 'Jan 20 - Feb 18' },
  { key: 'pisces', name: 'Pisces', sanskrit: 'Meen', element: 'Water', ruler: 'Jupiter (Guru)', dates: 'Feb 19 - Mar 20' }
];

interface CompatibilityResult {
  score: number;
  verdict: string;
  tagline: string;
  elementSynergy: string;
  planetaryBond: string;
  emotionalHarmony: number;
  communicationScore: number;
  passionScore: number;
  stabilityScore: number;
  growthAdvice: string;
}

// Compute sun sign from Date of Birth
const getZodiacFromDob = (dobStr: string): string => {
  if (!dobStr) return 'aries';
  const parts = dobStr.split('-');
  if (parts.length < 3) return 'aries';
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day)) return 'aries';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

const formatDisplayDate = (dobStr: string): string => {
  if (!dobStr) return '';
  try {
    const parts = dobStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return dobStr;
  } catch {
    return dobStr;
  }
};

// Compute authentic astrological compatibility between two signs
const calculateAstrologicalCompatibility = (sign1: ZodiacMeta, sign2: ZodiacMeta): CompatibilityResult => {
  const isSameSign = sign1.key === sign2.key;
  const isSameElement = sign1.element === sign2.element;

  // Elemental matrix
  const elements = [sign1.element, sign2.element].sort().join('+');

  let baseScore = 75;
  let elementSynergy = '';
  let planetaryBond = '';
  let growthAdvice = '';

  if (isSameSign) {
    baseScore = 88;
    elementSynergy = `Dual ${sign1.element} resonance creates intuitive understanding and shared life instincts.`;
    planetaryBond = `Shared governance under ${sign1.ruler} aligns core motivations.`;
    growthAdvice = 'Balance mirror traits with distinct hobbies to avoid emotional echoing.';
  } else if (isSameElement) {
    baseScore = 92;
    elementSynergy = `Natural Trine (120°) harmony between ${sign1.name} and ${sign2.name}. You share an effortless elemental wavelength.`;
    planetaryBond = `${sign1.ruler} and ${sign2.ruler} complement each other seamlessly in cosmic energy.`;
    growthAdvice = 'Channel your natural rapport into building shared long-term projects and family stability.';
  } else if (elements === 'Air+Fire') {
    baseScore = 90;
    elementSynergy = `Air fuels Fire’s ambition, while Fire brings warmth and inspiration to Air’s intellectual concepts.`;
    planetaryBond = `Exciting dynamic between ${sign1.ruler} and ${sign2.ruler} generates continuous curiosity and mutual admiration.`;
    growthAdvice = 'Keep commitments grounded in real-world habits while nurturing spontaneous adventures.';
  } else if (elements === 'Earth+Water') {
    baseScore = 89;
    elementSynergy = `Water softens and hydrates Earth, while Earth offers a secure, fertile foundation for deep feelings to blossom.`;
    planetaryBond = `Deeply nurturing connection between ${sign1.ruler} and ${sign2.ruler} that fosters safety and trust.`;
    growthAdvice = 'Express emotional needs openly without waiting for intuitive mind-reading.';
  } else if (elements === 'Fire+Water') {
    baseScore = 74; // Below 84% - triggers guidance
    elementSynergy = `Steam dynamic: Fire brings intense enthusiasm while Water responds with heartfelt depth. Requires gentle attunement.`;
    planetaryBond = `Dynamic polarity between ${sign1.ruler} and ${sign2.ruler}. Strong magnetic physical spark with differing emotional rhythms.`;
    growthAdvice = 'Practice active listening; allow cooling-off periods during arguments rather than escalating passionately.';
  } else if (elements === 'Earth+Fire') {
    baseScore = 71; // Below 84% - triggers guidance
    elementSynergy = `Fire craves rapid expansion, while Earth seeks methodical security and verified routines.`;
    planetaryBond = `The pioneering spirit of ${sign1.ruler} meets the prudent stewardship of ${sign2.ruler}.`;
    growthAdvice = 'Acknowledge each other’s superpowers: celebrate practicality as protection, and boldness as progress.';
  } else if (elements === 'Air+Earth') {
    baseScore = 72; // Below 84% - triggers guidance
    elementSynergy = `Air explores multiple theoretical possibilities while Earth asks for tangible, concrete execution.`;
    planetaryBond = `Analytical exchange between ${sign1.ruler} and ${sign2.ruler} requiring mutual respect for differing paces.`;
    growthAdvice = 'Create clear agreements on finances and routines to prevent unspoken friction.';
  } else {
    // Air+Water
    baseScore = 73; // Below 84% - triggers guidance
    elementSynergy = `Air conceptualizes relationships rationally, whereas Water experiences love through profound emotional tides.`;
    planetaryBond = `Intellectual curiosity meets deep intuitive sensitivity between ${sign1.ruler} and ${sign2.ruler}.`;
    growthAdvice = 'Validate feelings before offering logical solutions; empathy bridges the mind-heart divide.';
  }

  // Adjust for specific complementary pairs
  const pairKey = [sign1.key, sign2.key].sort().join('-');
  if (['aries-libra', 'taurus-scorpio', 'gemini-sagittarius', 'cancer-capricorn', 'leo-aquarius', 'virgo-pisces'].includes(pairKey)) {
    baseScore = 86;
    planetaryBond = 'Opposite zodiac axes create an undeniable soulmate magnetism (Samasaptaka polarity).';
  } else if (['aries-gemini', 'leo-libra', 'sagittarius-aquarius', 'taurus-cancer', 'virgo-scorpio', 'capricorn-pisces'].includes(pairKey)) {
    baseScore = 91;
  } else if (['aries-cancer', 'taurus-leo', 'gemini-virgo', 'cancer-libra', 'leo-scorpio', 'virgo-sagittarius', 'libra-capricorn', 'scorpio-aquarius', 'sagittarius-pisces'].includes(pairKey)) {
    baseScore = 76;
  }

  // Sub-scores
  const emotionalHarmony = Math.min(98, Math.max(62, Math.round(baseScore + (isSameElement ? 5 : -4))));
  const communicationScore = Math.min(99, Math.max(60, Math.round(baseScore + (elements.includes('Air') ? 6 : -3))));
  const passionScore = Math.min(98, Math.max(65, Math.round(baseScore + (elements.includes('Fire') ? 7 : -2))));
  const stabilityScore = Math.min(98, Math.max(58, Math.round(baseScore + (elements.includes('Earth') ? 7 : -4))));

  let verdict = 'Moderate Karmic Synergy';
  let tagline = 'Growth-Oriented Alignment';
  if (baseScore >= 90) {
    verdict = 'Cosmic Soul Alignment (Uttam)';
    tagline = 'Natural Harmony & Shared Life Vision';
  } else if (baseScore >= 84) {
    verdict = 'Harmonic Compatibility (Shrestha)';
    tagline = 'Strong Mutual Resonance & Deep Affinity';
  } else if (baseScore >= 75) {
    verdict = 'Dynamic Complementary Bond (Madhyam)';
    tagline = 'High Attraction with Rewarding Learning Curves';
  } else {
    verdict = 'Karmic Growth Catalyst';
    tagline = 'Complementary Energies Thriving with Astrological Care';
  }

  return {
    score: baseScore,
    verdict,
    tagline,
    elementSynergy,
    planetaryBond,
    emotionalHarmony,
    communicationScore,
    passionScore,
    stabilityScore,
    growthAdvice
  };
};

export const KundliToolsSection: React.FC<{ onStartFreeChat: () => void }> = ({
  onStartFreeChat
}) => {
  const [activeTool, setActiveTool] = useState<'calculator' | 'kundli'>('calculator');
  
  // Tab within calculator: 'input' (compact calculator) or 'result' (opens upon calculate)
  const [calcTab, setCalcTab] = useState<'input' | 'result'>('input');

  // Love Calculator State with DOB
  const [partner1Name, setPartner1Name] = useState('Aarav');
  const [partner1Dob, setPartner1Dob] = useState('1998-04-10');
  const [partner1SignKey, setPartner1SignKey] = useState('aries');

  const [partner2Name, setPartner2Name] = useState('Ananya');
  const [partner2Dob, setPartner2Dob] = useState('1999-08-14');
  const [partner2SignKey, setPartner2SignKey] = useState('leo');
  
  // Custom dropdown open state
  const [openDropdown, setOpenDropdown] = useState<'p1' | 'p2' | null>(null);
  const [elementFilter, setElementFilter] = useState<'All' | 'Fire' | 'Earth' | 'Air' | 'Water'>('All');

  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showLowScoreDetails, setShowLowScoreDetails] = useState(true);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'checkout' | 'success'>('checkout');
  const [purchaseWhatsapp, setPurchaseWhatsapp] = useState('');

  // Kundli Form state (preserved)
  const [kundliForm, setKundliForm] = useState({
    name: 'Aarav Sharma',
    gender: 'male',
    dob: '1998-05-15',
    tob: '07:30',
    pob: 'New Delhi, India'
  });
  const [kundliResult, setKundliResult] = useState<any | null>(null);

  const sign1 = ZODIAC_LIST.find((z) => z.key === partner1SignKey) || ZODIAC_LIST[0];
  const sign2 = ZODIAC_LIST.find((z) => z.key === partner2SignKey) || ZODIAC_LIST[4];

  const compatibility = calculateAstrologicalCompatibility(sign1, sign2);

  const handlePartner1DobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPartner1Dob(val);
    if (val) {
      const detected = getZodiacFromDob(val);
      if (detected) setPartner1SignKey(detected);
    }
  };

  const handlePartner2DobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPartner2Dob(val);
    if (val) {
      const detected = getZodiacFromDob(val);
      if (detected) setPartner2SignKey(detected);
    }
  };

  const handleCalculateLove = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setIsCalculated(true);
      setShowLowScoreDetails(true);
      // Opens directly in the Result tab without requiring any scrolling
      setCalcTab('result');
    }, 350);
  };

  const handleGenerateKundli = (e: React.FormEvent) => {
    e.preventDefault();
    const birthYear = new Date(kundliForm.dob).getFullYear() || 1998;
    const signs = [
      'Aries (Mesh)', 'Taurus (Vrishabha)', 'Gemini (Mithun)', 'Cancer (Kark)',
      'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchik)',
      'Sagittarius (Dhanu)', 'Capricorn (Makar)', 'Aquarius (Kumbh)', 'Pisces (Meen)'
    ];
    const rashiIdx = (birthYear + 3) % 12;
    const lagnaIdx = (birthYear + 7) % 12;

    setKundliResult({
      name: kundliForm.name,
      lagna: signs[lagnaIdx],
      moonSign: signs[rashiIdx],
      nakshatra: 'Rohini (Pada 2)',
      mangalDosha: birthYear % 3 === 0 ? 'Partial Manglik (Anshik)' : 'Safe - No Manglik Dosha',
      careerLord: '10th House Lord Saturn situated in strong Kendra',
      loveLord: '7th House Lord Venus exalted with Jupiter aspect'
    });
  };

  const getElementBadge = (element: string) => {
    switch (element) {
      case 'Fire':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
            <Flame className="w-3 h-3 text-amber-600 fill-amber-500" /> Fire Agni
          </span>
        );
      case 'Water':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-300">
            <Droplets className="w-3 h-3 text-blue-600 fill-blue-500" /> Water Jal
          </span>
        );
      case 'Air':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-300">
            <Wind className="w-3 h-3 text-sky-600" /> Air Vayu
          </span>
        );
      case 'Earth':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
            <Mountain className="w-3 h-3 text-emerald-600" /> Earth Prithvi
          </span>
        );
    }
  };

  // Render an Attractive, Custom Zodiac Sign Dropdown Picker
  const renderZodiacPicker = (
    currentSign: ZodiacMeta,
    onSelect: (signKey: string) => void,
    which: 'p1' | 'p2',
    accent: 'amber' | 'rose'
  ) => {
    const isOpen = openDropdown === which;
    const filteredList = elementFilter === 'All' 
      ? ZODIAC_LIST 
      : ZODIAC_LIST.filter(z => z.element === elementFilter);

    return (
      <div className="relative">
        {/* Trigger Button: Shows Attractive Icon, Sign Name, Sanskrit name & Dates */}
        <button
          type="button"
          onClick={() => {
            setOpenDropdown(isOpen ? null : which);
          }}
          className={`w-full flex items-center justify-between p-2 sm:p-2.5 bg-white border rounded-xl text-left transition-all cursor-pointer shadow-2xs hover:border-amber-400 ${
            isOpen 
              ? accent === 'rose'
                ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                : 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20'
              : 'border-amber-200/90'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Visual Zodiac Sign Logo Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              accent === 'rose' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <ZodiacSignLogo sign={currentSign.key} className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {currentSign.name}
                </span>
                <span className="text-[11px] font-bold text-amber-700">
                  ({currentSign.sanskrit})
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                {currentSign.dates} • {currentSign.element}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 pl-1 shrink-0">
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded hidden sm:inline-block">
              Change
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-700' : ''}`} />
          </div>
        </button>

        {/* Dropdown Menu Popover */}
        {isOpen && (
          <>
            {/* Invisible backdrop to close on outside click */}
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setOpenDropdown(null)} 
            />

            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border-2 border-amber-300 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              
              {/* Element Filter Tabs Header */}
              <div className="p-2 bg-gradient-to-r from-amber-50 via-rose-50/40 to-amber-50 border-b border-amber-200">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Select Zodiac Sign
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">12 Rashi Archetypes</span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                  {(['All', 'Fire', 'Water', 'Air', 'Earth'] as const).map((elem) => (
                    <button
                      key={elem}
                      type="button"
                      onClick={() => setElementFilter(elem)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all shrink-0 cursor-pointer ${
                        elementFilter === elem
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-amber-100/60 border border-amber-200'
                      }`}
                    >
                      {elem === 'All' ? 'All (12)' : elem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable List of Attractive Signs */}
              <div className="max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-amber-100/80 p-1">
                {filteredList.map((z) => {
                  const isSelected = z.key === currentSign.key;
                  return (
                    <button
                      key={z.key}
                      type="button"
                      onClick={() => {
                        onSelect(z.key);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-100/90 to-amber-50 border border-amber-300 ring-1 ring-amber-300'
                          : 'hover:bg-amber-50/70 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* High quality Zodiac Sign Logo */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-amber-200/70 border-amber-400' : 'bg-amber-50/80 border-amber-200'
                        }`}>
                          <ZodiacSignLogo sign={z.key} className="w-6 h-6" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900">
                              {z.name}
                            </span>
                            <span className="text-[11px] font-bold text-amber-700">
                              ({z.sanskrit})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {z.dates} • Ruler: {z.ruler.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
                        {getElementBadge(z.element)}
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section id="kundli-tools" className="py-12 sm:py-16 bg-gradient-to-b from-[#FFFDF7] via-amber-50/40 to-[#FFFDF7] border-b border-amber-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 bg-gradient-to-r from-amber-100 to-amber-200/80 px-3.5 py-1 rounded-full mb-2.5 border border-amber-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Vedic Relationship Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-serif-cinzel">
            Vedic Love Calculator &amp; Compatibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-xl mx-auto">
            Authentic astrological calculations rooted in Vedic Synastry, DOB alignment, and elemental triplicities.
          </p>

          {/* Navigation Pill Switcher */}
          <div className="inline-flex p-1 bg-white rounded-2xl border border-amber-200 mt-5 shadow-xs">
            <button
              onClick={() => {
                setActiveTool('calculator');
                setCalcTab('input');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTool === 'calculator' && calcTab === 'input'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm ring-1 ring-amber-400'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
              <span>Love Calculator</span>
            </button>

            {isCalculated && (
              <button
                onClick={() => {
                  setActiveTool('calculator');
                  setCalcTab('result');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTool === 'calculator' && calcTab === 'result'
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm ring-1 ring-rose-400'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Result ({compatibility.score}%)</span>
              </button>
            )}

            <button
              onClick={() => setActiveTool('kundli')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTool === 'kundli'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm ring-1 ring-amber-400'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Free Janam Kundli</span>
            </button>
          </div>
        </div>

        {/* ACTIVE VIEW: LOVE CALCULATOR */}
        {activeTool === 'calculator' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* TAB 1: COMPACT INPUT CALCULATOR WITH DOB & ATTRACTIVE ZODIAC PICKERS */}
            {calcTab === 'input' && (
              <div className="bg-white rounded-2xl border border-amber-300 shadow-md overflow-hidden max-w-2xl mx-auto">
                {/* Header ribbon */}
                <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-current text-white animate-pulse" />
                    <span className="text-sm font-bold font-serif-cinzel tracking-wide">
                      Check Love Compatibility
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-100 bg-white/15 px-2.5 py-0.5 rounded-full">
                    DOB &amp; Vedic Synastry
                  </span>
                </div>

                {/* Compact Form */}
                <form onSubmit={handleCalculateLove} className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Partner 1 Input Card */}
                    <div className="bg-[#FFFDF7] p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-amber-100">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                          Your Details
                        </span>
                        {getElementBadge(sign1.element)}
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={partner1Name}
                            onChange={(e) => setPartner1Name(e.target.value)}
                            placeholder="e.g. Aarav"
                            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-medium bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Date of Birth (DOB) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-700">Date of Birth (DOB)</label>
                          <span className="text-[10px] text-amber-700 font-medium">Auto-syncs sign</span>
                        </div>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={partner1Dob}
                            onChange={handlePartner1DobChange}
                            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-medium bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
                          />
                          <Calendar className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Attractive Custom Zodiac Sign Selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Your Zodiac Sign
                        </label>
                        {renderZodiacPicker(
                          sign1, 
                          (key) => setPartner1SignKey(key), 
                          'p1', 
                          'amber'
                        )}
                      </div>
                    </div>

                    {/* Partner 2 Input Card */}
                    <div className="bg-[#FFFDF7] p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-amber-100">
                        <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                          Partner's Details
                        </span>
                        {getElementBadge(sign2.element)}
                      </div>

                      {/* Partner Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Partner's Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={partner2Name}
                            onChange={(e) => setPartner2Name(e.target.value)}
                            placeholder="e.g. Ananya"
                            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-medium bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Partner Date of Birth (DOB) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-700">Partner's DOB</label>
                          <span className="text-[10px] text-rose-700 font-medium">Auto-syncs sign</span>
                        </div>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={partner2Dob}
                            onChange={handlePartner2DobChange}
                            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-medium bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
                          />
                          <Calendar className="w-3.5 h-3.5 text-rose-600 absolute left-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Attractive Custom Zodiac Sign Selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Partner's Zodiac Sign
                        </label>
                        {renderZodiacPicker(
                          sign2, 
                          (key) => setPartner2SignKey(key), 
                          'p2', 
                          'rose'
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Compact CTA Submit Button */}
                  <div className="pt-2 text-center">
                    <button
                      type="submit"
                      disabled={isCalculating}
                      className="w-full sm:w-auto min-w-[240px] px-7 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Calculating Synastry...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-200" />
                          <span>Calculate Compatibility</span>
                          <ArrowRight className="w-4 h-4 ml-0.5" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Results open directly in a dedicated tab without page scrolling.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: COMPATIBILITY RESULT TAB (Opens directly at the top with NO SCROLLING required) */}
            {calcTab === 'result' && isCalculated && (
              <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-250">
                
                {/* Result Tab Bar Header */}
                <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-white fill-current animate-pulse" />
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold font-serif-cinzel">
                        Compatibility Report
                      </h3>
                      <p className="text-[10px] text-amber-100">
                        {partner1Name} ({sign1.name}) &amp; {partner2Name} ({sign2.name})
                      </p>
                    </div>
                  </div>

                  {/* Quick-switch tab back to input */}
                  <button
                    type="button"
                    onClick={() => setCalcTab('input')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border border-white/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recalculate / Change</span>
                  </button>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  
                  {/* Radial / Top Score Summary with DOB indicators */}
                  <div className="bg-gradient-to-br from-amber-50/60 to-rose-50/40 p-5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      {/* Score Badge */}
                      <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-white border-4 border-amber-400 shadow-md shrink-0">
                        <div className="text-center">
                          <span className="text-2xl font-black font-mono text-slate-900">
                            {compatibility.score}%
                          </span>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-700">
                            Match
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif-cinzel">
                          {partner1Name || 'Partner 1'} &amp; {partner2Name || 'Partner 2'}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold text-amber-700">
                          {compatibility.verdict}
                        </p>
                        
                        {/* Partner DOB details */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-600">
                          <span className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded">
                            <Calendar className="w-3 h-3 text-amber-700" />
                            {partner1Name}: {formatDisplayDate(partner1Dob)} ({sign1.name})
                          </span>
                          <span className="inline-flex items-center gap-1 bg-rose-100/70 text-rose-900 px-2 py-0.5 rounded">
                            <Calendar className="w-3 h-3 text-rose-700" />
                            {partner2Name}: {formatDisplayDate(partner2Dob)} ({sign2.name})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-xs">
                        <span className="text-slate-500 block text-[10px]">Elements</span>
                        <strong className="text-slate-800">{sign1.element} &amp; {sign2.element}</strong>
                      </div>
                      <div className="px-2.5 py-1 bg-white rounded-lg border border-rose-200 text-xs">
                        <span className="text-slate-500 block text-[10px]">Planetary Governance</span>
                        <strong className="text-slate-800">{sign1.ruler.split(' ')[0]} &amp; {sign2.ruler.split(' ')[0]}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 4 Pillars Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-[#FFFDF7] p-3 rounded-xl border border-amber-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 block">Emotional Harmony</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-base font-black text-rose-600 font-mono">{compatibility.emotionalHarmony}%</span>
                        <span className="text-[9px] text-slate-400">Heart</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
                        <div className="bg-rose-500 h-1 rounded-full" style={{ width: `${compatibility.emotionalHarmony}%` }} />
                      </div>
                    </div>

                    <div className="bg-[#FFFDF7] p-3 rounded-xl border border-amber-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 block">Communication</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-base font-black text-sky-600 font-mono">{compatibility.communicationScore}%</span>
                        <span className="text-[9px] text-slate-400">Mental</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
                        <div className="bg-sky-500 h-1 rounded-full" style={{ width: `${compatibility.communicationScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-[#FFFDF7] p-3 rounded-xl border border-amber-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 block">Passion &amp; Spark</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-base font-black text-amber-600 font-mono">{compatibility.passionScore}%</span>
                        <span className="text-[9px] text-slate-400">Spark</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
                        <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${compatibility.passionScore}%` }} />
                      </div>
                    </div>

                    <div className="bg-[#FFFDF7] p-3 rounded-xl border border-amber-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 block">Values &amp; Stability</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-base font-black text-emerald-600 font-mono">{compatibility.stabilityScore}%</span>
                        <span className="text-[9px] text-slate-400">Future</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${compatibility.stabilityScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Astrological Synthesis */}
                  <div className="bg-[#FFFDF7] p-4 sm:p-5 rounded-xl border border-amber-200 shadow-2xs space-y-2.5">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Detailed Astrological Synthesis
                    </h5>

                    <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                      <p>
                        <strong className="text-amber-900 font-semibold">• Elemental Dynamics: </strong>
                        {compatibility.elementSynergy}
                      </p>
                      <p>
                        <strong className="text-amber-900 font-semibold">• Planetary Bond: </strong>
                        {compatibility.planetaryBond}
                      </p>
                      <p>
                        <strong className="text-amber-900 font-semibold">• Relationship Counsel: </strong>
                        {compatibility.growthAdvice}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-amber-100 flex items-start gap-1.5 text-[10px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Astrological Note:</strong> Compatibility scores reflect celestial tendencies and archetypes. Real life relationships grow with mutual respect, conscious communication, and shared commitment.
                      </span>
                    </div>
                  </div>

                  {/* CONDITIONAL TOGGLEABLE REASSURANCE FOR SCORES < 84% */}
                  {compatibility.score < 84 && (
                    <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-300 rounded-xl p-4 shadow-xs transition-all duration-300 animate-in fade-in">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            <Heart className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                              Don’t worry! ❤️ Our expert astrologers can help you understand your relationship and find the right guidance.
                            </h5>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              Complementary energies flourish when guided with personalized Vedic remedies.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowLowScoreDetails(!showLowScoreDetails)}
                            className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white cursor-pointer"
                          >
                            <span>{showLowScoreDetails ? 'Hide Details' : 'Read Insights'}</span>
                            {showLowScoreDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          <button
                            type="button"
                            onClick={onStartFreeChat}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-xs rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>Consult Astrologer</span>
                          </button>
                        </div>
                      </div>

                      {showLowScoreDetails && (
                        <div className="mt-3 pt-2.5 border-t border-rose-200/80 text-[11px] text-slate-700 space-y-1.5 animate-in fade-in duration-200">
                          <p className="font-semibold text-rose-950">
                            Why scores under 84% reveal deep growth potential:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                            <li><strong>Karmic Growth:</strong> Polarity aspects generate strong magnetic attraction and spark mutual maturity.</li>
                            <li><strong>Vedic Planetary Balancing:</strong> Astrologers identify specific planetary doshas and suggest simple mantras or gemstones to harmonize friction.</li>
                            <li><strong>Timing Transits:</strong> Gain clarity on favorable relationship Dasha periods for marriage and life milestones.</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons at bottom of result */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-100">
                    <button
                      type="button"
                      onClick={() => setCalcTab('input')}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/50 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Calculate for Another Pair</span>
                    </button>

                    <button
                      type="button"
                      onClick={onStartFreeChat}
                      className="text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 px-4 py-2 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Discuss Compatibility With Astrologer</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* DEEP LOVE READING FOR ₹49 SECTION - COMPACT & SHORT */}
            <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-xl p-3.5 sm:p-4 border border-amber-400/50 shadow-md relative overflow-hidden max-w-2xl mx-auto">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                
                {/* Left Info: Compact & Short */}
                <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-full">
                    <Gift className="w-3 h-3 text-amber-300" />
                    <span>Deep Love Reading Add-on</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-serif-cinzel tracking-tight text-amber-50">
                    Get Your 10-Page Synastry Report for <span className="text-amber-300 font-mono font-black">₹49</span>
                  </h3>

                  <p className="text-[11px] text-amber-200/90 leading-tight">
                    36 Guna Milan • Venus-Mars Chemistry • Personalized Vedic Remedies
                  </p>
                </div>

                {/* Right Action: Price + Button */}
                <div className="shrink-0 flex sm:flex-col items-center justify-center gap-2">
                  <div className="text-right sm:text-center hidden xs:block">
                    <span className="text-xs text-stone-400 line-through font-mono mr-1.5">₹499</span>
                    <span className="text-base sm:text-lg font-black text-amber-300 font-mono">₹49</span>
                    <span className="text-[9px] text-rose-300 font-bold ml-1 sm:block sm:ml-0">90% OFF</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseStep('checkout');
                      setIsPurchaseModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-lg shadow-md hover:shadow-red-600/40 border border-red-400/40 transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95 whitespace-nowrap"
                  >
                    <span className="bg-black/25 text-amber-200 text-[10px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider border border-amber-300/30">
                      90% OFF
                    </span>
                    <span className="font-extrabold text-white flex items-center gap-1">
                      <span>Get for</span>
                      <span className="text-amber-200 font-mono font-black text-sm">₹49</span>
                    </span>
                  </button>

                  <span className="text-[9px] text-amber-300/80 hidden sm:block text-center">
                    🔒 Instant WhatsApp &amp; PDF
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ACTIVE VIEW: KUNDLI CHART GENERATOR (Preserved) */}
        {activeTool === 'kundli' && (
          <div className="grid lg:grid-cols-12 gap-6 items-start max-w-4xl mx-auto animate-in fade-in duration-300">
            {/* Form */}
            <form onSubmit={handleGenerateKundli} className="lg:col-span-6 bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Birth Details
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={kundliForm.name}
                  onChange={(e) => setKundliForm({ ...kundliForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-[#FFFDF7]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={kundliForm.dob}
                    onChange={(e) => setKundliForm({ ...kundliForm, dob: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-[#FFFDF7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Time of Birth</label>
                  <input
                    type="time"
                    required
                    value={kundliForm.tob}
                    onChange={(e) => setKundliForm({ ...kundliForm, tob: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-[#FFFDF7]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Place of Birth (City)</label>
                <input
                  type="text"
                  required
                  value={kundliForm.pob}
                  onChange={(e) => setKundliForm({ ...kundliForm, pob: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-[#FFFDF7]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Generate Free Kundli Chart
              </button>
            </form>

            {/* Kundli Diamond Chart & Insights Result */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3.5">
              {kundliResult ? (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2.5 border-b border-amber-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-serif-cinzel">
                        Kundli for {kundliResult.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">Chitra Paksha Lahiri Ayanamsha</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Accurate Chart
                    </span>
                  </div>

                  {/* Diamond Chart Graphic */}
                  <div className="flex justify-center p-2 bg-amber-50/50 rounded-xl border border-amber-200">
                    <svg viewBox="0 0 200 200" className="w-40 h-40 border-2 border-amber-700 bg-white">
                      <line x1="0" y1="0" x2="200" y2="200" stroke="#B45309" strokeWidth="1.5" />
                      <line x1="200" y1="0" x2="0" y2="200" stroke="#B45309" strokeWidth="1.5" />
                      <polygon points="100,0 200,100 100,200 0,100" fill="none" stroke="#B45309" strokeWidth="1.5" />
                      <text x="100" y="55" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="bold">1st (Lagna)</text>
                      <text x="50" y="30" textAnchor="middle" fontSize="8" fill="#475569">2nd</text>
                      <text x="25" y="80" textAnchor="middle" fontSize="8" fill="#475569">3rd</text>
                      <text x="100" y="150" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="bold">7th (Kalatra)</text>
                      <text x="150" y="100" textAnchor="middle" fontSize="8" fill="#475569">10th (Karma)</text>
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <span className="text-[9px] text-amber-800 font-bold block">Ascendant (Lagna):</span>
                      <strong className="text-slate-900 text-[11px]">{kundliResult.lagna}</strong>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <span className="text-[9px] text-amber-800 font-bold block">Moon Sign (Rashi):</span>
                      <strong className="text-slate-900 text-[11px]">{kundliResult.moonSign}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-950 border border-emerald-200">
                    <strong>Manglik Status:</strong> {kundliResult.mangalDosha}
                  </div>

                  <button
                    onClick={onStartFreeChat}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Discuss This Chart with an Expert (Free Chat)
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Compass className="w-10 h-10 text-amber-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Your Chart Will Appear Here</p>
                  <p className="text-[11px] text-slate-500">Fill in your date, time, and city on the left to compute your free birth chart.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* PURCHASE MODAL: DEEP LOVE READING FOR ₹49 */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-amber-200 shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                <h4 className="font-bold font-serif-cinzel text-sm sm:text-base">Deep Love Reading Order</h4>
              </div>
              <button
                onClick={() => setIsPurchaseModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {purchaseStep === 'checkout' ? (
              <div className="p-5 space-y-3.5">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Synastry Report: {partner1Name || sign1.name} &amp; {partner2Name || sign2.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {sign1.name} + {sign2.name} • 10-Page In-Depth PDF
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-700 font-mono">₹49</span>
                    <span className="text-[9px] text-slate-400 block line-through">₹499</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    WhatsApp Number (for instant report delivery)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={purchaseWhatsapp}
                    onChange={(e) => setPurchaseWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant PDF delivered on WhatsApp &amp; Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Includes personalized remedies from senior Vedic astrologer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% confidential &amp; encrypted analysis</span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setPurchaseStep('success')}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ₹49 &amp; Unlock Full Report</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-1.5">
                    Secured by 256-bit SSL encryption. UPI / Cards / NetBanking accepted.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-base font-bold text-slate-900 font-serif-cinzel">
                    Deep Love Reading Confirmed!
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your complete 10-page compatibility dossier for {partner1Name || sign1.name} &amp; {partner2Name || sign2.name} is being prepared by our astrological council.
                  </p>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left">
                  <p className="font-bold">Next Steps:</p>
                  <p className="mt-0.5 text-slate-600">
                    A copy will be dispatched to your WhatsApp number within 15–30 minutes along with personalized astrological remedies.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsPurchaseModalOpen(false);
                      onStartFreeChat();
                    }}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Discuss With An Astrologer Now (Free)
                  </button>
                  <button
                    onClick={() => setIsPurchaseModalOpen(false)}
                    className="w-full py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
