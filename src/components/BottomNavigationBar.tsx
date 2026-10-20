import React from 'react';
import { Home, MessageCircle, Sparkles, User, LogIn, Crown } from 'lucide-react';
import { UserProfile } from '../types';

export type BottomNavTab = 'home' | 'chat' | 'remedies' | 'profile';

interface BottomNavigationBarProps {
  activeTab: BottomNavTab;
  user?: UserProfile;
  onTabChange: (tab: BottomNavTab) => void;
  onNavigateHome: () => void;
  onNavigateChat: () => void;
  onOpenRemedies: () => void;
  onOpenProfile: () => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeTab,
  user,
  onTabChange,
  onNavigateHome,
  onNavigateChat,
  onOpenRemedies,
  onOpenProfile
}) => {
  const handleHomeClick = () => {
    onTabChange('home');
    onNavigateHome();
  };

  const handleChatClick = () => {
    onTabChange('chat');
    onNavigateChat();
  };

  const handleRemediesClick = () => {
    onTabChange('remedies');
    onOpenRemedies();
  };

  const handleProfileClick = () => {
    onTabChange('profile');
    onOpenProfile();
  };

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 border-t-2 border-orange-600 shadow-[0_-4px_20px_rgba(234,88,12,0.3)] transition-all"
    >
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-around px-3 sm:px-6 py-1.5">
        
        {/* 1. HOME */}
        <button
          onClick={handleHomeClick}
          className={`flex-1 max-w-[90px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-white text-orange-600 font-bold shadow-sm'
              : 'text-white/90 hover:text-white hover:bg-orange-600/30 font-medium'
          }`}
        >
          <div className="relative">
            <Home className={`w-4.5 h-4.5 transition-transform ${activeTab === 'home' ? 'scale-105 text-orange-600' : 'text-white'}`} />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">Home</span>
        </button>

        {/* 2. CHAT */}
        <button
          onClick={handleChatClick}
          className={`flex-1 max-w-[90px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer relative ${
            activeTab === 'chat'
              ? 'bg-white text-orange-600 font-bold shadow-sm'
              : 'text-white/90 hover:text-white hover:bg-orange-600/30 font-medium'
          }`}
        >
          <div className="relative">
            <MessageCircle className={`w-4.5 h-4.5 transition-transform ${activeTab === 'chat' ? 'scale-105 text-orange-600' : 'text-white'}`} />
            <span className="absolute -top-1.5 -right-3 bg-emerald-600 text-[8px] font-black text-white px-1.5 py-0.2 rounded-full uppercase leading-none shadow-xs border border-white/80">
              Free
            </span>
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">Chat</span>
        </button>

        {/* 3. REMEDIES (Replaced Live) */}
        <button
          onClick={handleRemediesClick}
          className={`flex-1 max-w-[90px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer relative ${
            activeTab === 'remedies'
              ? 'bg-white text-orange-600 font-bold shadow-sm'
              : 'text-white/90 hover:text-white hover:bg-orange-600/30 font-medium'
          }`}
          title="Vedic Remedies & Upay"
        >
          <div className="relative">
            <Sparkles className={`w-4.5 h-4.5 transition-transform ${activeTab === 'remedies' ? 'scale-105 text-orange-600' : 'text-white'}`} />
            <span className="absolute -top-1.5 -right-3.5 bg-amber-700 text-[7.5px] font-black text-amber-100 px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-xs border border-white/80">
              UPAY
            </span>
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">Remedies</span>
        </button>

        {/* 4. PROFILE / SIGN IN */}
        <button
          onClick={handleProfileClick}
          className={`flex-1 max-w-[90px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-orange-600 font-bold shadow-sm'
              : 'text-white/90 hover:text-white hover:bg-orange-600/30 font-medium'
          }`}
          title={user?.isLoggedIn ? 'Seeker Profile & Account' : 'Sign In / Account'}
        >
          <div className="relative">
            {user?.isLoggedIn && (user.isSuperAdmin || user.email === 'bankush014@gmail.com') ? (
              <Crown className={`w-4.5 h-4.5 transition-transform ${activeTab === 'profile' ? 'scale-105 text-amber-500' : 'text-amber-200'}`} />
            ) : user?.isLoggedIn ? (
              <User className={`w-4.5 h-4.5 transition-transform ${activeTab === 'profile' ? 'scale-105 text-orange-600' : 'text-white'}`} />
            ) : (
              <LogIn className={`w-4.5 h-4.5 transition-transform ${activeTab === 'profile' ? 'scale-105 text-orange-600' : 'text-white'}`} />
            )}
            {!user?.isLoggedIn && (
              <span className="absolute -top-1.5 -right-3.5 bg-amber-200 text-amber-950 text-[7.5px] font-black px-1 py-0.2 rounded-full uppercase leading-none shadow-xs border border-orange-600">
                Sign In
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">
            {user?.isLoggedIn ? (user.isSuperAdmin ? 'Admin' : (user.name ? user.name.split(' ')[0] : 'Profile')) : 'Sign In'}
          </span>
        </button>

      </div>
    </nav>
  );
};
