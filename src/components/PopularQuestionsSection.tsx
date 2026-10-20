import React, { useState } from 'react';
import { 
  HelpCircle,
  Heart,
  Briefcase,
  Sparkles,
  MessageSquare,
  Phone,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { QUESTION_PROMPTS } from '../data/mockData';
import { Expert, QuestionPrompt } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';

interface PopularQuestionsSectionProps {
  experts: Expert[];
  onStartChat: (expert: Expert, questionText?: string) => void;
  onStartCall: (expert: Expert) => void;
  onViewProfile: (expert: Expert) => void;
}

export const PopularQuestionsSection: React.FC<PopularQuestionsSectionProps> = ({
  experts,
  onStartChat,
  onStartCall,
  onViewProfile
}) => {
  const [activeTab, setActiveTab] = useState<'love' | 'career'>('love');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionPrompt>(
    QUESTION_PROMPTS.find((q) => q.domain === 'love') || QUESTION_PROMPTS[0]
  );

  const currentQuestions = QUESTION_PROMPTS.filter((q) => q.domain === activeTab);

  // Match experts based on the selected question's keywords
  const matchedExperts = experts
    .filter((e) => {
      if (e.id === 'exp-kuldeep') return true;
      if (activeTab === 'love') {
        return (
          e.primaryCategory === 'love' ||
          e.loveSpecialities.some((ls) =>
            selectedQuestion.matchingKeywords.some((kw) => ls.toLowerCase().includes(kw.toLowerCase()))
          )
        );
      } else {
        return (
          e.primaryCategory === 'career' ||
          e.careerSpecialities.some((cs) =>
            selectedQuestion.matchingKeywords.some((kw) => cs.toLowerCase().includes(kw.toLowerCase()))
          )
        );
      }
    })
    .sort((a, b) => {
      if (a.id === 'exp-kuldeep') return -1;
      if (b.id === 'exp-kuldeep') return 1;
      return 0;
    });

  return (
    <section id="popular-questions" className="py-16 bg-[#FFFDF7] border-b border-amber-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Clarity Finder</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-serif-cinzel">
            What&apos;s on Your Mind?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Select your exact question below to instantly connect with verified specialists equipped to answer it.
          </p>

          {/* Love vs Career Switcher */}
          <div className="inline-flex p-1 bg-amber-100/70 rounded-2xl border border-amber-200 mt-6">
            <button
              onClick={() => {
                setActiveTab('love');
                setSelectedQuestion(QUESTION_PROMPTS.find((q) => q.domain === 'love')!);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'love'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Love & Relationships ({QUESTION_PROMPTS.filter(q => q.domain === 'love').length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('career');
                setSelectedQuestion(QUESTION_PROMPTS.find((q) => q.domain === 'career')!);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'career'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Career & Business ({QUESTION_PROMPTS.filter(q => q.domain === 'career').length})</span>
            </button>
          </div>
        </div>

        {/* Two-Column Interactive Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Questions List */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Select Your Situation
            </span>
            {currentQuestions.map((q) => {
              const isSelected = selectedQuestion.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? activeTab === 'love'
                        ? 'bg-rose-50 border-rose-500 shadow-sm'
                        : 'bg-blue-50 border-blue-600 shadow-sm'
                      : 'bg-white hover:bg-amber-50/60 border-amber-200 text-slate-800'
                  }`}
                >
                  <div>
                    <h3 className={`text-sm font-bold ${
                      isSelected
                        ? activeTab === 'love' ? 'text-rose-900' : 'text-blue-900'
                        : 'text-slate-900'
                    }`}>
                      {q.question}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {q.subtext}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isSelected
                      ? activeTab === 'love' ? 'text-rose-600' : 'text-blue-600'
                      : 'text-slate-300'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Matched Experts for this Question */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-100 gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  Matched Experts For
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-serif-cinzel mt-0.5">
                  &ldquo;{selectedQuestion.question}&rdquo;
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                First Chat Free
              </span>
            </div>

            {/* List of Matched Experts */}
            <div className="space-y-3.5">
              {matchedExperts.slice(0, 3).map((expert) => (
                <div
                  key={expert.id}
                  className="p-4 rounded-xl border border-amber-200/80 hover:border-amber-400 bg-[#FFFDF7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <AstrologerAvatar expert={expert} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 
                          onClick={() => onViewProfile(expert)}
                          className="font-bold text-slate-900 text-sm hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          {expert.name}
                        </h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{expert.title}</p>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>{expert.experienceYears}+ yrs exp</span>
                        <span>•</span>
                        <span className="text-amber-700 font-bold">★ {expert.rating}</span>
                        <span>•</span>
                        <span>{expert.languages.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-100">
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        ₹{expert.discountedPrice || expert.pricePerMin}/min
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-semibold">Free First Chat</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onStartChat(expert, selectedQuestion.question)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => onStartCall(expert)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-amber-50 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
