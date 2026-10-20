import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Gem, 
  BookOpen, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Heart, 
  Briefcase, 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2,
  ArrowRight,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Expert } from '../types';

export interface RemedyItem {
  id: string;
  title: string;
  hindiTitle?: string;
  category: 'mantra' | 'gemstone' | 'daily' | 'puja' | 'rudraksha' | 'dosh';
  concern: 'love' | 'career' | 'marriage' | 'health' | 'wealth' | 'general';
  description: string;
  procedure: string;
  idealTime?: string;
  mantraText?: string;
  planetOrDeity?: string;
  isCustom?: boolean;
}

const INITIAL_REMEDIES: RemedyItem[] = [
  {
    id: 'rem-1',
    title: 'Surya Arghya for Career Stagnation & Confidence',
    hindiTitle: 'करियर और आत्मविश्वास के लिए सूर्य अर्घ्य',
    category: 'daily',
    concern: 'career',
    description: 'Offering copper vessel water to the rising Sun clears solar blockages, enhances leadership presence, and removes workplace hurdles.',
    procedure: 'Wake up before 8:00 AM. Take fresh water in a copper lota (vessel), add a pinch of red kumkum and few grains of unbroken rice (akshat). Offer water facing East while chanting the Surya mantra.',
    idealTime: 'Sunday morning during Brahma Muhurta / Sunrise',
    mantraText: 'ॐ सूर्याय नमः || Om Suryaya Namaha',
    planetOrDeity: 'Surya Dev (Sun)'
  },
  {
    id: 'rem-2',
    title: 'Shukra Beej Mantra for Love Harmony & Attraction',
    hindiTitle: 'प्रेम और दांपत्य सुख हेतु शुक्र बीज मंत्र',
    category: 'mantra',
    concern: 'love',
    description: 'Strengthens Venus energy, dissolves bitterness between romantic partners, and promotes mutual tenderness.',
    procedure: 'Sit facing East or North on a white asana. Light a pure cow ghee lamp. Chant 108 times using a Sphatik (quartz) or Lotus seed mala.',
    idealTime: 'Friday evenings after sunset',
    mantraText: 'ॐ शुं शुक्राय नमः || Om Shum Shukraya Namaha',
    planetOrDeity: 'Shukra Dev (Venus)'
  },
  {
    id: 'rem-3',
    title: 'Natural Yellow Sapphire (Pukhraj) Guidance',
    hindiTitle: 'बृहस्पति बल हेतु पीला पुखराज',
    category: 'gemstone',
    concern: 'wealth',
    description: 'Promotes divine wisdom, wealth retention, marriage prospects, and academic/career advancement under Jupiter.',
    procedure: 'Wear in Gold or Panchdhatu on the index finger (Tarjani) after purifying in raw milk and gangajal on a bright Thursday morning.',
    idealTime: 'Thursday morning during Shukla Paksha',
    mantraText: 'ॐ बृं बृहस्पतये नमः || Om Brim Brihaspataye Namaha',
    planetOrDeity: 'Guru Dev (Jupiter)'
  },
  {
    id: 'rem-4',
    title: 'Mahamrityunjaya Mantra for Anxiety & Health',
    hindiTitle: 'मानसिक शांति व रक्षा हेतु महामृत्युंजय मंत्र',
    category: 'mantra',
    concern: 'health',
    description: 'The supreme life-protecting Vedic hymn that eradicates negative planetary transits (Rahu/Ketu/Saturn afflictions) and mental unrest.',
    procedure: 'Sit peacefully with spine straight. Light a fragrance of sandalwood or camphor. Chant 11 or 108 times daily before bedtime or at dawn.',
    idealTime: 'Daily at Brahma Muhurta (5:00 AM - 6:30 AM)',
    mantraText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् | उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ||',
    planetOrDeity: 'Lord Shiva'
  },
  {
    id: 'rem-5',
    title: 'Manglik Dosh Pacification Ritual',
    hindiTitle: 'मांगलिक दोष शांति उपाय',
    category: 'dosh',
    concern: 'marriage',
    description: 'Calms excess Mars heat that causes delay, misunderstandings, or temper clashes in matrimonial alliances.',
    procedure: 'Chant Hanuman Chalisa every Tuesday. Offer red vermillion (sindoor) and betel leaves (paan) to Lord Hanuman. Donate red lentils (masoor dal) on Tuesdays.',
    idealTime: 'Tuesday at noon or evening',
    mantraText: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः || Om Kram Kreem Kroum Sah Bhaumaya Namah',
    planetOrDeity: 'Mangal Dev (Mars) & Lord Hanuman'
  },
  {
    id: 'rem-6',
    title: '7 Mukhi Rudraksha for Financial Stability',
    hindiTitle: 'आर्थिक स्थिरता हेतु ७ मुखी रुद्राक्ष',
    category: 'rudraksha',
    concern: 'wealth',
    description: 'Blessed by Goddess Mahalakshmi and ruled by Planet Venus; attracts abundance, removes unexpected debts, and balances Saturn.',
    procedure: 'Wear around the neck in red silk thread or silver capping after chanting Om Hreem Namah 108 times.',
    idealTime: 'Monday or Friday morning',
    mantraText: 'ॐ हुं नमः || Om Hoom Namah',
    planetOrDeity: 'Maa Lakshmi'
  },
  {
    id: 'rem-7',
    title: 'Kaal Sarp Yog & Rahu-Ketu Shanti Puja',
    hindiTitle: 'काल सर्प योग व राहु-केतु निवारण',
    category: 'dosh',
    concern: 'general',
    description: 'Relieves chronic delays, erratic setbacks, and sudden obstacles caused by planets caught between Rahu and Ketu.',
    procedure: 'Perform silver Nag-Nagin prathistha or offer milk and bilva leaves at a Shiva temple on Nag Panchami or Amavasya days.',
    idealTime: 'Amavasya (New Moon) or Nag Panchami',
    mantraText: 'ॐ रां राहवे नमः | ॐ कें केतवे नमः ||',
    planetOrDeity: 'Rahu & Ketu'
  },
  {
    id: 'rem-8',
    title: 'Feeding Green Fodder for Mercury (Budh) & Mind Clarity',
    hindiTitle: 'बुध ग्रह शांति हेतु गौ माता को हरा चारा',
    category: 'daily',
    concern: 'career',
    description: 'Simple and effective charity remedy to enhance speech eloquence, business intellect, and clear communication.',
    procedure: 'Feed fresh green grass, spinach (palak), or green fodder to cows at a nearby gaushala with devotion.',
    idealTime: 'Wednesday morning before 11:00 AM',
    mantraText: 'ॐ बुं बुधाय नमः || Om Bum Budhaya Namaha',
    planetOrDeity: 'Budh Dev (Mercury)'
  }
];

interface RemediesModalProps {
  onClose: () => void;
  onStartChatWithExpert?: (expert?: Expert, topic?: string) => void;
  experts: Expert[];
}

export const RemediesModal: React.FC<RemediesModalProps> = ({
  onClose,
  onStartChatWithExpert,
  experts
}) => {
  // Load remedies from local storage or default
  const [remedies, setRemedies] = useState<RemedyItem[]>(() => {
    try {
      const saved = localStorage.getItem('my_astro_custom_remedies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_REMEDIES;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeConcern, setActiveConcern] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedMantraId, setCopiedMantraId] = useState<string | null>(null);

  // Add Remedy Form State
  const [isAddingRemedy, setIsAddingRemedy] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHindiTitle, setNewHindiTitle] = useState('');
  const [newCategory, setNewCategory] = useState<RemedyItem['category']>('daily');
  const [newConcern, setNewConcern] = useState<RemedyItem['concern']>('general');
  const [newDescription, setNewDescription] = useState('');
  const [newProcedure, setNewProcedure] = useState('');
  const [newIdealTime, setNewIdealTime] = useState('');
  const [newMantra, setNewMantra] = useState('');
  const [newDeity, setNewDeity] = useState('');

  // Persist remedies whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('my_astro_custom_remedies', JSON.stringify(remedies));
    } catch {
      // ignore
    }
  }, [remedies]);

  // Copy mantra text helper
  const handleCopyMantra = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMantraId(id);
    setTimeout(() => {
      setCopiedMantraId(null);
    }, 2000);
  };

  // Add new custom remedy
  const handleSaveNewRemedy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProcedure.trim()) return;

    const newRemedy: RemedyItem = {
      id: `custom-rem-${Date.now()}`,
      title: newTitle.trim(),
      hindiTitle: newHindiTitle.trim() || undefined,
      category: newCategory,
      concern: newConcern,
      description: newDescription.trim() || 'Custom personal remedy recorded by user.',
      procedure: newProcedure.trim(),
      idealTime: newIdealTime.trim() || undefined,
      mantraText: newMantra.trim() || undefined,
      planetOrDeity: newDeity.trim() || undefined,
      isCustom: true
    };

    setRemedies((prev) => [newRemedy, ...prev]);

    // Reset form
    setNewTitle('');
    setNewHindiTitle('');
    setNewCategory('daily');
    setNewConcern('general');
    setNewDescription('');
    setNewProcedure('');
    setNewIdealTime('');
    setNewMantra('');
    setNewDeity('');
    setIsAddingRemedy(false);
  };

  // Delete remedy if custom
  const handleDeleteRemedy = (id: string) => {
    setRemedies((prev) => prev.filter((r) => r.id !== id));
  };

  // Filter remedies
  const filteredRemedies = remedies.filter((rem) => {
    if (activeCategory !== 'all' && rem.category !== activeCategory) return false;
    if (activeConcern !== 'all' && rem.concern !== activeConcern) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = rem.title.toLowerCase().includes(q);
      const matchHindi = rem.hindiTitle?.toLowerCase().includes(q);
      const matchDesc = rem.description.toLowerCase().includes(q);
      const matchProc = rem.procedure.toLowerCase().includes(q);
      const matchMantra = rem.mantraText?.toLowerCase().includes(q);
      if (!matchTitle && !matchHindi && !matchDesc && !matchProc && !matchMantra) {
        return false;
      }
    }
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF9] text-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border border-amber-300 flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner text-amber-100">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-cinzel tracking-tight text-white leading-none">
                  Vedic Remedies &amp; Upay
                </h2>
                <span className="bg-white/25 text-amber-50 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-white/30">
                  ज्योतिषीय उपाय
                </span>
              </div>
              <p className="text-xs text-amber-100/90 font-medium mt-1">
                Authentic remedies for planetary peace, relationships, and career growth
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingRemedy(!isAddingRemedy)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-orange-600 font-bold text-xs hover:bg-amber-50 transition-all shadow-xs cursor-pointer border border-amber-200"
              title="Add a custom remedy"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">Add Remedy</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Remedies"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Sub-Header: Search & Quick Filters */}
        <div className="p-3 sm:p-4 bg-amber-50/70 border-b border-amber-200 space-y-3 shrink-0">
          
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search remedies, mantras, gems, dosh..."
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-white border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Concern Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">Life Area:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'love', label: 'Love', icon: Heart },
                { id: 'career', label: 'Career', icon: Briefcase },
                { id: 'marriage', label: 'Marriage' },
                { id: 'wealth', label: 'Wealth' },
                { id: 'health', label: 'Health' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveConcern(item.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeConcern === item.id
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'daily', label: 'Daily Upay (सरल उपाय)', icon: Flame },
              { id: 'mantra', label: 'Vedic Mantras (मंत्र)', icon: BookOpen },
              { id: 'gemstone', label: 'Gemstones (रत्न)', icon: Gem },
              { id: 'dosh', label: 'Dosh Nivaran (दोष शांति)', icon: ShieldCheck },
              { id: 'rudraksha', label: 'Rudraksha (रुद्राक्ष)', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white/80 text-amber-900 hover:bg-amber-100/80 border border-amber-200'
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Add New Remedy Form (Expands when user clicks "Add Remedy") */}
          {isAddingRemedy && (
            <form 
              onSubmit={handleSaveNewRemedy}
              className="bg-white rounded-2xl border-2 border-dashed border-amber-400 p-4 sm:p-5 space-y-3.5 shadow-sm animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 font-serif-cinzel">
                      Add Your Custom Astrological Remedy
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Add any specific Upay, Mantra, or ritual. You can review or edit anytime.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingRemedy(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Remedy Title (English)*</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Daily Gayatri Mantra for Peace"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hindi Title (Optional)</label>
                  <input
                    type="text"
                    value={newHindiTitle}
                    onChange={(e) => setNewHindiTitle(e.target.value)}
                    placeholder="e.g. मानसिक शांति हेतु गायत्री मंत्र"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="daily">Daily Upay (सरल उपाय)</option>
                    <option value="mantra">Vedic Mantra (मंत्र)</option>
                    <option value="gemstone">Gemstone (रत्न)</option>
                    <option value="dosh">Dosh Nivaran (दोष शांति)</option>
                    <option value="rudraksha">Rudraksha (रुद्राक्ष)</option>
                    <option value="puja">Puja &amp; Ritual (पूजा)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Life Concern</label>
                  <select
                    value={newConcern}
                    onChange={(e) => setNewConcern(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="general">General Well-being</option>
                    <option value="love">Love &amp; Relationship</option>
                    <option value="career">Career &amp; Business</option>
                    <option value="marriage">Marriage &amp; Compatibility</option>
                    <option value="wealth">Wealth &amp; Prosperity</option>
                    <option value="health">Health &amp; Vitality</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Procedure / How to Perform (विधि)*</label>
                  <textarea
                    required
                    rows={2}
                    value={newProcedure}
                    onChange={(e) => setNewProcedure(e.target.value)}
                    placeholder="Step-by-step method to perform this remedy, e.g. Light a ghee lamp facing East, chant 108 times..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mantra (If applicable)</label>
                  <input
                    type="text"
                    value={newMantra}
                    onChange={(e) => setNewMantra(e.target.value)}
                    placeholder="e.g. ॐ नमः शिवाय || Om Namah Shivaya"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ideal Day / Time</label>
                  <input
                    type="text"
                    value={newIdealTime}
                    onChange={(e) => setNewIdealTime(e.target.value)}
                    placeholder="e.g. Monday morning at sunrise"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingRemedy(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs hover:from-amber-700 hover:to-orange-700 transition-all shadow-xs cursor-pointer"
                >
                  Save Remedy
                </button>
              </div>
            </form>
          )}

          {/* Remedies Grid */}
          {filteredRemedies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-amber-200 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-amber-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No remedies match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting &lsquo;All Categories&rsquo;. You can also click &lsquo;Add Remedy&rsquo; to add custom remedies anytime.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActiveConcern('all');
                }}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-white rounded-full hover:bg-amber-600 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRemedies.map((remedy) => {
                const isCopied = copiedMantraId === remedy.id;
                return (
                  <div 
                    key={remedy.id}
                    className="bg-white rounded-2xl border border-amber-200/90 hover:border-amber-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      {/* Badge row */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                            {remedy.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                            {remedy.concern}
                          </span>
                          {remedy.isCustom && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              Custom
                            </span>
                          )}
                        </div>

                        {remedy.isCustom && (
                          <button
                            onClick={() => handleDeleteRemedy(remedy.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-full cursor-pointer transition-colors"
                            title="Delete custom remedy"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      <div className="pt-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                          {remedy.title}
                        </h4>
                        {remedy.hindiTitle && (
                          <span className="text-xs text-amber-700 font-semibold block mt-0.5 font-sans">
                            {remedy.hindiTitle}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mt-2">
                        {remedy.description}
                      </p>

                      {/* Procedure Block */}
                      <div className="mt-3 bg-[#FFFDF7] p-2.5 rounded-xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Method / विधि:</span>
                        </span>
                        <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                          {remedy.procedure}
                        </p>
                      </div>

                      {/* Mantra Box if available */}
                      {remedy.mantraText && (
                        <div className="mt-2.5 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-extrabold text-amber-800 uppercase block">
                              Mantra:
                            </span>
                            <span className="text-xs font-serif-cinzel font-bold text-amber-950 block truncate">
                              {remedy.mantraText}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyMantra(remedy.id, remedy.mantraText!)}
                            className="p-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                            title="Copy Mantra"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Ideal timing */}
                      {remedy.idealTime && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Ideal Timing: <strong>{remedy.idealTime}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Footer consultation CTA */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {remedy.planetOrDeity ? `Deity: ${remedy.planetOrDeity}` : 'Vedic Guidance'}
                      </span>
                      {onStartChatWithExpert && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onStartChatWithExpert(experts[0], `I need personalized consultation for remedy: "${remedy.title}"`);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-orange-600 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Ask Astrologer</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Bottom Information Note */}
        <div className="p-3 bg-amber-50/90 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0 px-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Remedies work best when performed with faith, clean intentions, and consistency.</span>
          </div>
          <button
            onClick={() => setIsAddingRemedy(true)}
            className="text-amber-700 font-bold hover:underline cursor-pointer"
          >
            + Add more remedies later
          </button>
        </div>

      </div>
    </div>
  );
};
