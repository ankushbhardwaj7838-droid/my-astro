import React from 'react';
import { Sun, Search, Wallet, X } from 'lucide-react';
import { UserProfile, UserWallet } from '../types';

interface HeaderProps {
  wallet: UserWallet;
  user?: UserProfile;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenWallet: () => void;
  onOpenAuth?: () => void;
  onOpenAdmin?: () => void;
  onStartFreeChat?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  searchQuery = '',
  onSearchChange,
  onOpenWallet,
  onNavigate
}) => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigate) {
      onNavigate('hero');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const el = document.getElementById('experts-directory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-6">
        
        {/* 1. MY-ASTRO BRAND NAME & EMBLEM */}
        <button 
          onClick={handleLogoClick} 
          className="flex items-center gap-2 group cursor-pointer shrink-0 text-left"
          title="My-Astro Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25 group-hover:rotate-12 transition-transform duration-300 shrink-0">
            <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold font-serif-cinzel tracking-tight text-slate-900 block leading-none">
              My-Astro
            </span>
            <span className="hidden sm:block text-[9px] tracking-wider text-amber-700 font-semibold uppercase mt-0.5">
              Astrology &amp; Tarot
            </span>
          </div>
        </button>

        {/* 2. SEARCH BAR (Center, properly aligned & responsive) */}
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg relative mx-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-amber-600/70 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search astrologers, skills, vedic..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-amber-300/80 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 shadow-2xs transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. WALLET (Right aligned, clean and prominent) */}
        <button
          onClick={onOpenWallet}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all text-xs font-bold shadow-xs cursor-pointer border border-amber-400/50 shrink-0"
          title="Open Wallet"
        >
          <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-100" />
          <span className="hidden sm:inline font-semibold">Wallet:</span>
          <span className="font-mono font-bold">₹{wallet.balance}</span>
        </button>
      </div>
    </header>
  );
};
