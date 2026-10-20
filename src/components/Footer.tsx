import React, { useState } from 'react';
import { 
  Sun, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Briefcase,
  Calculator,
  Sparkles,
  FileText,
  X
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="bg-gradient-to-b from-[#FFFDF7] via-amber-50/50 to-[#FFFDF7] text-slate-700 pt-10 pb-8 border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Main Grid in Website Color Scheme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold font-serif-cinzel text-slate-900 tracking-tight">
                My-Astro
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              India&apos;s trusted Vedic consultation platform for Love, Career, and authentic planetary remedies.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">support@myastro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>+91 (011) 4920-8000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Connaught Place, New Delhi</span>
              </div>
            </div>
          </div>

          {/* Col 2: Love Guidance & Love Calculator */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider font-serif-cinzel text-xs flex items-center gap-1.5 text-rose-700">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              Love Guidance
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button 
                  onClick={() => onNavigate('kundli-tools')} 
                  className="font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3 text-amber-600" />
                  <span>Love Calculator</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kundli-tools')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  ₹49 Deep Love Reading
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experts-directory')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Ex-Partner Reconciliation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experts-directory')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Breakups &amp; Emotional Clarity
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experts-directory')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Marriage &amp; Compatibility
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Career Guidance & Remedies */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider font-serif-cinzel text-xs flex items-center gap-1.5 text-blue-700">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              Career Guidance
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button onClick={() => onNavigate('experts-directory')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Job Switch &amp; New Offers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experts-directory')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Promotion &amp; Appraisal Timing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experts-directory')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Business &amp; Startup Muhurat
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vedic-services')} className="font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer text-left flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Vedic Remedies &amp; Solutions</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vedic-services')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Planetary Gemstone Advice
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Free Astrology Tools */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider font-serif-cinzel text-xs flex items-center gap-1.5 text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Free Astrology Tools
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button onClick={() => onNavigate('kundli-tools')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Free Janam Kundli
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kundli-tools')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Kundli Milan (36 Gunas)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kundli-tools')} className="hover:text-amber-700 transition-colors cursor-pointer text-left font-semibold text-amber-800">
                  Zodiac Love Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('horoscope')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Daily Horoscope (12 Signs)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-amber-700 transition-colors cursor-pointer text-left">
                  Free First Chat Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Terms, Privacy & Trust */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider font-serif-cinzel text-xs flex items-center gap-1.5 text-amber-900">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Terms &amp; Policies
            </h4>
            <ul className="space-y-1.5 text-slate-600 mb-3">
              <li>
                <button 
                  onClick={() => setModalType('terms')} 
                  className="font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer text-left underline underline-offset-2"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setModalType('privacy')} 
                  className="font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer text-left underline underline-offset-2"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setModalType('terms')} 
                  className="hover:text-amber-700 transition-colors cursor-pointer text-left"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('faq')} 
                  className="hover:text-amber-700 transition-colors cursor-pointer text-left"
                >
                  Help &amp; Support FAQs
                </button>
              </li>
            </ul>

            <div className="pt-2 border-t border-amber-200/80 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Verified Astrologers</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar in Website Theme */}
        <div className="pt-5 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <p>© 2026 My-Astro Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs">
            <button 
              onClick={() => setModalType('privacy')} 
              className="text-amber-800 hover:text-amber-950 font-semibold cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => setModalType('terms')} 
              className="text-amber-800 hover:text-amber-950 font-semibold cursor-pointer transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate('faq')} 
              className="hover:text-amber-800 cursor-pointer transition-colors"
            >
              Support
            </button>
          </div>
        </div>

      </div>

      {/* TERMS & CONDITIONS / PRIVACY POLICY MODAL */}
      {modalType && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setModalType(null)}
        >
          <div 
            className="bg-[#FFFDF7] w-full max-w-2xl max-h-[85vh] rounded-2xl border border-amber-300 shadow-2xl flex flex-col overflow-hidden text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-white to-orange-50 border-b border-amber-200/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-cinzel">
                  {modalType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="w-8 h-8 rounded-full bg-white border border-amber-200 hover:bg-amber-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {modalType === 'terms' ? (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">1. Acceptance of Terms</h4>
                    <p>By accessing or using My-Astro, you agree to comply with and be bound by these Terms &amp; Conditions. All consultation sessions are provided solely for personal insight, spiritual counsel, and entertainment purposes.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">2. Consultation &amp; Free Chat Offer</h4>
                    <p>First-time eligible users receive a free promotional consultation session. Continued sessions are billed transparently at stated per-minute rates with prior user consent.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">3. Love Calculator &amp; Deep Love Reading (₹49)</h4>
                    <p>The Love Calculator and ₹49 Deep Love Reading provide astrological and elemental compatibility insights based on traditional Vedic calculations. They do not constitute guaranteed psychological, legal, or relationship guarantees.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">4. Refund Policy</h4>
                    <p>If you experience technical disruption during a paid consultation, a full or partial credit wallet refund can be requested through our 24/7 support team within 48 hours.</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">1. Information We Collect</h4>
                    <p>We collect essential birth data (date, approximate time, and city of birth) solely to calculate your Vedic horoscope charts and provide relevant consultation answers.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">2. 100% Privacy &amp; Encryption</h4>
                    <p>All chat transcripts, question history, and personal birth details are protected using 256-bit SSL encryption. Consulting astrologers are bound by strict non-disclosure obligations.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">3. Zero Third-Party Data Sharing</h4>
                    <p>My-Astro strictly adheres to data privacy laws. We never sell, rent, or trade your personal information, phone numbers, or email addresses to advertisers or third-party brokers.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">4. Contact Our Data Protection Officer</h4>
                    <p>For any inquiries regarding your stored data or to request account data deletion, write to privacy@myastro.com.</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 px-5 bg-amber-50/70 border-t border-amber-200/80 flex items-center justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
