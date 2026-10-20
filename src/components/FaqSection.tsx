import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageSquare } from 'lucide-react';
import { FAQS_DATA } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-6 sm:py-8 bg-[#FFFDF7] border-b border-amber-200/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Compact Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full mb-1.5 shadow-2xs">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <span>Common Inquiries &amp; Answers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif-cinzel tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-lg mx-auto">
            Clear, honest answers regarding Love Calculator, consultations, pricing, and 100% privacy.
          </p>
        </div>

        {/* Compact Accordion Items */}
        <div className="space-y-2">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-amber-200/90 overflow-hidden shadow-2xs transition-all hover:border-amber-400"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-2.5 px-3.5 sm:py-3 sm:px-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:text-amber-800 transition-colors cursor-pointer select-none"
                >
                  <span className="flex-1 pr-2">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-amber-100/70 bg-amber-50/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compact Customer Support Strip */}
        <div className="mt-5 p-3 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Have more questions or need consultation support?</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Our dedicated support team is available 24/7 to assist you.</p>
          </div>
          <a
            href="mailto:support@myastro.com"
            className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg font-bold text-xs hover:bg-amber-100/70 transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>Email Support</span>
          </a>
        </div>

      </div>
    </section>
  );
};
