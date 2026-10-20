import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Expert, UserProfile } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';

interface BirthDetailsIntakeModalProps {
  expert: Expert;
  initialUser: UserProfile;
  initialQuestion?: string;
  onClose: () => void;
  onSubmit: (details: {
    name: string;
    gender: string;
    dob: string;
    tob: string;
    pob: string;
    knowsExactTime: boolean;
    timePeriod: 'AM' | 'PM';
    hour: string;
    minute: string;
  }) => void;
}

const POPULAR_CITIES = [
  'New Delhi, Delhi',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Kolkata, West Bengal',
  'Chennai, Tamil Nadu',
  'Jaipur, Rajasthan',
  'Ahmedabad, Gujarat',
  'Pune, Maharashtra',
  'Hyderabad, Telangana',
  'Lucknow, Uttar Pradesh',
  'Chandigarh, Punjab',
  'Indore, Madhya Pradesh'
];

export const BirthDetailsIntakeModal: React.FC<BirthDetailsIntakeModalProps> = ({
  expert,
  initialUser,
  initialQuestion,
  onClose,
  onSubmit
}) => {
  // 4 Steps: 1 = Name & Gender, 2 = DOB, 3 = Time of Birth, 4 = Birth Place
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [name, setName] = useState<string>(initialUser.name || '');
  const [gender, setGender] = useState<string>(initialUser.gender || 'female');

  // DOB state
  const [dob, setDob] = useState<string>(initialUser.dob || '1998-05-15');

  // Time of Birth state
  const [knowsExactTime, setKnowsExactTime] = useState<boolean>(
    initialUser.knowsExactTime !== undefined ? initialUser.knowsExactTime : true
  );
  const [hour, setHour] = useState<string>(initialUser.hour || '08');
  const [minute, setMinute] = useState<string>(initialUser.minute || '45');
  const [timePeriod, setTimePeriod] = useState<'AM' | 'PM'>(initialUser.timePeriod || 'AM');

  // Birth Place state
  const [pob, setPob] = useState<string>(initialUser.pob || 'New Delhi, India');

  // Validation errors
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleNextStep = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!dob) {
        setErrorMsg('Please select your date of birth');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!pob.trim()) {
        setErrorMsg('Please enter your birth city');
        return;
      }

      // Calculate final TOB formatted
      const formattedTob = knowsExactTime 
        ? `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${timePeriod}` 
        : 'Time Unknown (Prashna Kundli)';

      onSubmit({
        name: name.trim(),
        gender,
        dob,
        tob: formattedTob,
        pob: pob.trim(),
        knowsExactTime,
        timePeriod,
        hour,
        minute
      });
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper to format date display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF7] w-full max-w-lg rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-150">
        
        {/* Astrologer Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AstrologerAvatar expert={expert} size="sm" className="border-2 border-white/70 shadow-sm" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-amber-600 z-20" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">{expert.name}</h3>
                <span className="text-[10px] bg-emerald-700/80 text-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-amber-100 truncate">
                {expert.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* ================= PAGE 1: NAME AND GENDER ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-slate-900">
                  Name and Gender
                </h2>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-700/60 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-amber-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Gender Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Select Gender <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'female', label: 'Female', symbol: '♀' },
                    { key: 'male', label: 'Male', symbol: '♂' },
                    { key: 'other', label: 'Other', symbol: '⚧' }
                  ].map((g) => {
                    const isSelected = gender === g.key;
                    return (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => setGender(g.key)}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                            : 'bg-white hover:bg-amber-50/60 border-amber-200 text-slate-700 shadow-2xs'
                        }`}
                      >
                        <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-amber-700'}`}>
                          {g.symbol}
                        </span>
                        <span className="text-xs font-bold">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 2: DATE OF BIRTH (DOB) ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-slate-900">
                  Date of Birth
                </h2>
              </div>

              {/* Direct Native Date Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Date of Birth (DOB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-700/60 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={dob}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full bg-white border border-amber-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs font-medium cursor-pointer"
                  />
                </div>
              </div>

              {/* Formatted Date Showcase */}
              {dob && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      📅
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-amber-800 uppercase block">Selected Date</span>
                      <strong className="text-slate-900 text-base">{formatDateDisplay(dob)}</strong>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Verified
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ================= PAGE 3: TIME OF BIRTH (AM/PM & EXACT TIME KNOWN OR NOT) ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-slate-900">
                  Time of Birth
                </h2>
              </div>

              {/* Exact Time Known or Not Toggle Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Exact Time Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setKnowsExactTime(true)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      knowsExactTime
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                        : 'bg-white hover:bg-amber-50/60 border-amber-200 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">Yes, I know</span>
                      <CheckCircle2 className={`w-4 h-4 ${knowsExactTime ? 'text-white' : 'text-slate-300'}`} />
                    </div>
                    <span className={`text-[11px] leading-tight ${knowsExactTime ? 'text-amber-100' : 'text-slate-400'}`}>
                      I know my birth time
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKnowsExactTime(false)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      !knowsExactTime
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                        : 'bg-white hover:bg-amber-50/60 border-amber-200 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">Don&apos;t know</span>
                      <HelpCircle className={`w-4 h-4 ${!knowsExactTime ? 'text-white' : 'text-slate-300'}`} />
                    </div>
                    <span className={`text-[11px] leading-tight ${!knowsExactTime ? 'text-amber-100' : 'text-slate-400'}`}>
                      Use Prashna Kundli
                    </span>
                  </button>
                </div>
              </div>

              {/* If Exact Time is Known: Hour, Minute and AM / PM Selector */}
              {knowsExactTime && (
                <div className="space-y-3 bg-white p-4.5 rounded-2xl border border-amber-200/90 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Birth Time &amp; AM / PM
                    </label>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono">
                      {hour.padStart(2, '0')}:{minute.padStart(2, '0')} {timePeriod}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                    
                    {/* Hours (1-12) */}
                    <div className="col-span-4">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-1">Hour (1-12)</span>
                      <select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="w-full bg-[#FFFDF7] border border-amber-300 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((h) => (
                          <option key={h} value={h}>{h} hr</option>
                        ))}
                      </select>
                    </div>

                    <span className="col-span-1 text-center font-bold text-slate-400 text-lg">:</span>

                    {/* Minutes (00-59) */}
                    <div className="col-span-4">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-1">Minute (00-59)</span>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(e.target.value)}
                        className="w-full bg-[#FFFDF7] border border-amber-300 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                          <option key={m} value={m}>{m} min</option>
                        ))}
                      </select>
                    </div>

                    {/* AM / PM Segmented Control */}
                    <div className="col-span-3">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-1">Period</span>
                      <div className="flex bg-amber-100/70 p-1 rounded-xl border border-amber-200">
                        <button
                          type="button"
                          onClick={() => setTimePeriod('AM')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            timePeriod === 'AM'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimePeriod('PM')}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            timePeriod === 'PM'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= PAGE 4: BIRTH PLACE (PLACE OF BIRTH) ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-slate-900">
                  Birth Place
                </h2>
              </div>

              {/* City Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Birth City / State / Country <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-700/60 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={pob}
                    onChange={(e) => {
                      setPob(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. New Delhi, Delhi or Mumbai"
                    className="w-full bg-white border border-amber-300 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Popular City Suggestions Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Popular Cities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setPob(city)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        pob === city
                          ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                          : 'bg-white hover:bg-amber-50 border-amber-200/90 text-slate-700'
                      }`}
                    >
                      {city.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean Summary Preview Card Before Submitting */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-200/90 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                  <span className="font-bold text-amber-900 font-serif-cinzel flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Kundli Profile Summary
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium">Ready for {expert.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Name:</span>
                    <strong className="text-slate-900">{name} ({gender})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date of Birth:</span>
                    <strong className="text-slate-900">{formatDateDisplay(dob)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Time of Birth:</span>
                    <strong className="text-slate-900">
                      {knowsExactTime ? `${hour}:${minute} ${timePeriod}` : 'Unknown (Prashna)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Place of Birth:</span>
                    <strong className="text-slate-900 truncate block">{pob}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Controls: Back & Next / Start Chat */}
        <div className="p-4 sm:p-5 bg-white border-t border-amber-200 flex items-center justify-between gap-3 shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-amber-300 text-slate-700 hover:bg-amber-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 saffron-glow"
            >
              {currentStep < 4 ? (
                <>
                  <span>
                    {currentStep === 1 ? 'Next: Date of Birth' :
                     currentStep === 2 ? 'Next: Birth Time' :
                     'Next: Birth Place'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 text-amber-100" />
                  <span>Start Chat with {expert.name.split(' ')[0]}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
