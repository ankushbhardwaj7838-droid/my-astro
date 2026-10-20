import React, { useState } from 'react';

// Core Navigation & Layout Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ExpertsDirectorySection } from './components/ExpertsDirectorySection';
import { KundliToolsSection } from './components/KundliToolsSection';
import { TarotVedicServicesSection } from './components/TarotVedicServicesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DailyHoroscopeSection } from './components/DailyHoroscopeSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { BottomNavigationBar, BottomNavTab } from './components/BottomNavigationBar';
import { RemediesModal } from './components/RemediesModal';
import { LiveAstrologersModal } from './components/LiveAstrologersModal';
import { BirthDetailsIntakeModal } from './components/BirthDetailsIntakeModal';
import { AstrologerListModal } from './components/AstrologerListModal';

// Interactive Consultation & Utility Modals
import { ConsultationChatModal } from './components/ConsultationChatModal';
import { GuruKuldeepChatModal } from './components/GuruKuldeepChatModal';
import { ExpertProfileModal } from './components/ExpertProfileModal';
import { WalletModal } from './components/WalletModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';

// Types, Mock Data & Auth Service
import { Expert, UserProfile, UserWallet } from './types';
import { EXPERTS_DATA } from './data/mockData';
import { getSessionUser, saveSessionUser, clearSessionUser } from './lib/authService';

export default function App() {
  // Astrologer / Expert directory state with persistence
  const [experts, setExperts] = useState<Expert[]>(() => {
    try {
      const stored = localStorage.getItem('myastro_experts_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return EXPERTS_DATA;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User state initialized from persistent session or guest
  const [user, setUser] = useState<UserProfile>(() => {
    const session = getSessionUser();
    if (session) return session;
    return {
      name: '',
      email: '',
      phone: '',
      gender: 'female',
      dob: '1998-05-15',
      tob: '08:45',
      pob: 'New Delhi, India',
      isLoggedIn: false,
      freeChatUsed: false,
      isAdmin: false,
      isSuperAdmin: false,
      role: 'user'
    };
  });

  // Prompt reason shown in AuthModal when user tries to chat without login
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState<
    | { type: 'free_chat' }
    | { type: 'expert_chat'; expert: Expert; question?: string }
    | { type: 'expert_call'; expert: Expert }
    | null
  >(null);

  // Wallet state
  const [wallet, setWallet] = useState<UserWallet>({
    balance: 150,
    currency: 'INR',
    transactions: [
      {
        id: 'tx-welcome',
        type: 'credit',
        amount: 150,
        description: 'Welcome Seeker Credit',
        timestamp: '17 Oct 2026, 10:00 AM'
      }
    ]
  });

  // Modal active states
  const [activeChatExpert, setActiveChatExpert] = useState<Expert | null>(null);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);
  const [pendingChatExpert, setPendingChatExpert] = useState<Expert | null>(null);
  const [pendingChatQuestion, setPendingChatQuestion] = useState<string | undefined>(undefined);
  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(false);
  const [activeProfileExpert, setActiveProfileExpert] = useState<Expert | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isRemediesOpen, setIsRemediesOpen] = useState<boolean>(false);
  const [isLiveOpen, setIsLiveOpen] = useState<boolean>(false);
  const [isAstrologerListOpen, setIsAstrologerListOpen] = useState<boolean>(false);
  const [bottomNavTab, setBottomNavTab] = useState<BottomNavTab>('home');

  // Smooth scroll navigation
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // STRICT LOGIN REQUIREMENT: Instant Free Chat Trigger
  const handleStartFreeChat = () => {
    if (!user.isLoggedIn) {
      setAuthReason('Please sign in or create an account to start your Free First Chat consultation.');
      setPendingActionAfterLogin({ type: 'free_chat' });
      setIsAuthOpen(true);
      return;
    }
    setIsAstrologerListOpen(true);
  };

  // STRICT LOGIN REQUIREMENT: Direct Expert Chat Trigger
  const handleStartChatWithExpert = (expert: Expert, question?: string) => {
    if (!user.isLoggedIn) {
      setAuthReason(`Please sign in or create an account to chat with ${expert.name} (Free First Chat or Paid).`);
      setPendingActionAfterLogin({ type: 'expert_chat', expert, question });
      setIsAuthOpen(true);
      return;
    }
    setPendingChatExpert(expert);
    setPendingChatQuestion(question);
    setIsIntakeOpen(true);
  };

  // Callback when user finishes the 4-step intake form
  const handleIntakeSubmit = (details: {
    name: string;
    gender: string;
    dob: string;
    tob: string;
    pob: string;
    knowsExactTime: boolean;
    timePeriod: 'AM' | 'PM';
    hour: string;
    minute: string;
  }) => {
    const updatedUser: UserProfile = {
      ...user,
      name: details.name,
      gender: details.gender,
      dob: details.dob,
      tob: details.tob,
      pob: details.pob,
      knowsExactTime: details.knowsExactTime,
      timePeriod: details.timePeriod,
      hour: details.hour,
      minute: details.minute,
      isLoggedIn: true
    };
    setUser(updatedUser);
    saveSessionUser(updatedUser);
    setIsIntakeOpen(false);
    setActiveChatExpert(pendingChatExpert);
    setChatInitialQuestion(pendingChatQuestion);
  };

  // STRICT LOGIN REQUIREMENT: Direct Expert Call Trigger
  const handleStartCallWithExpert = (expert: Expert) => {
    if (!user.isLoggedIn) {
      setAuthReason(`Please sign in or create an account to consult via call with ${expert.name}.`);
      setPendingActionAfterLogin({ type: 'expert_call', expert });
      setIsAuthOpen(true);
      return;
    }
    setPendingChatExpert(expert);
    setPendingChatQuestion(undefined);
    setIsIntakeOpen(true);
  };

  // Successful login callback: automatically resumes user's pending chat intent
  const handleLoginSuccess = (updated: UserProfile) => {
    setUser(updated);
    saveSessionUser(updated);

    if (pendingActionAfterLogin) {
      const action = pendingActionAfterLogin;
      setPendingActionAfterLogin(null);
      setAuthReason(undefined);
      setTimeout(() => {
        if (action.type === 'free_chat') {
          setIsAstrologerListOpen(true);
        } else if (action.type === 'expert_chat') {
          setPendingChatExpert(action.expert);
          setPendingChatQuestion(action.question);
          setIsIntakeOpen(true);
        } else if (action.type === 'expert_call') {
          setPendingChatExpert(action.expert);
          setPendingChatQuestion(undefined);
          setIsIntakeOpen(true);
        }
      }, 250);
    }
  };

  // Sign out callback
  const handleLogout = () => {
    clearSessionUser();
    setUser({
      name: '',
      email: '',
      phone: '',
      gender: 'female',
      dob: '1998-05-15',
      tob: '08:45',
      pob: 'New Delhi, India',
      isLoggedIn: false,
      freeChatUsed: false,
      isAdmin: false,
      isSuperAdmin: false,
      role: 'user'
    });
  };

  // Search handler from Hero or directory
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleNavigate('experts-directory');
  };

  // Wallet deduction from consultation
  const handleDeductWallet = (amount: number, description: string) => {
    setWallet((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'debit',
          amount,
          description,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.transactions
      ]
    }));
  };

  // Wallet recharge
  const handleAddMoney = (amount: number, bonus: number) => {
    const totalAdded = amount + bonus;
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + totalAdded,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'credit',
          amount: totalAdded,
          description: bonus > 0 ? `Wallet Recharge ₹${amount} (+ ₹${bonus} Bonus)` : `Wallet Recharge ₹${amount}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.transactions
      ]
    }));
  };

  // Update expert from Admin Panel with persistent sync
  const handleUpdateExpert = (updatedExpert: Expert) => {
    setExperts((prev) => {
      const updated = prev.map((e) => (e.id === updatedExpert.id ? updatedExpert : e));
      try {
        localStorage.setItem('myastro_experts_data', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    // Instant sync with any currently open profile or chat modal
    setActiveProfileExpert((prev) => (prev && prev.id === updatedExpert.id ? updatedExpert : prev));
    setActiveChatExpert((prev) => (prev && prev.id === updatedExpert.id ? updatedExpert : prev));
    setPendingChatExpert((prev) => (prev && prev.id === updatedExpert.id ? updatedExpert : prev));
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 font-sans-body flex flex-col selection:bg-amber-200 selection:text-amber-950">
      
      {/* 1. Header with My-Astro Branding, Search Bar, and Wallet */}
      <Header
        wallet={wallet}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
        }}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onStartFreeChat={handleStartFreeChat}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 pb-16 sm:pb-20">
        
        {/* HOMEPAGE SECTION 1: Hero Section with Rotating Questions & Animated Promo Button */}
        <HeroSection
          onStartFreeChat={handleStartFreeChat}
          onExploreExperts={() => handleNavigate('experts-directory')}
          onSearch={handleSearch}
          onSelectCategory={(cat) => handleNavigate(cat === 'love' ? 'love-guidance' : 'career-guidance')}
        />

        {/* HOMEPAGE SECTION 2: Verified Astrologers Directory */}
        <ExpertsDirectorySection
          experts={experts}
          onStartChat={handleStartChatWithExpert}
          onStartCall={handleStartCallWithExpert}
          onViewProfile={setActiveProfileExpert}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* HOMEPAGE SECTION 3: Daily Horoscope (2 Zodiac Signs per Line) */}
        <DailyHoroscopeSection
          onStartFreeChat={handleStartFreeChat}
          onStartChatWithExpert={handleStartChatWithExpert}
          experts={experts}
        />



        {/* HOMEPAGE SECTION 6: Free Kundli Birth Chart & Marriage Matching Tools */}
        <KundliToolsSection
          onStartFreeChat={handleStartFreeChat}
        />

        {/* HOMEPAGE SECTION 7: Divination Disciplines: Vedic, Tarot & Numerology */}
        <TarotVedicServicesSection
          onSelectMethod={(method) => {
            setSearchQuery(method);
            handleNavigate('experts-directory');
          }}
        />

        {/* HOMEPAGE SECTION 8: How My-Astro Works (3 Simple Steps) */}
        <HowItWorksSection
          onStartFreeChat={handleStartFreeChat}
        />

        {/* HOMEPAGE SECTION 11: Customer Reviews & Verified Testimonials */}
        <CustomerReviewsSection />

        {/* HOMEPAGE SECTION 12: Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* HOMEPAGE SECTION 13: Final Consultation Call to Action */}
        <FinalCtaSection
          onStartFreeChat={handleStartFreeChat}
        />

      </main>

      {/* Footer with Directory Links, Contacts, and Disclaimers */}
      <Footer
        onNavigate={handleNavigate}
      />

      {/* Lower Section Bottom Navigation: Home, Chat, Remedies, Profile */}
      <BottomNavigationBar
        activeTab={bottomNavTab}
        user={user}
        onTabChange={setBottomNavTab}
        onNavigateHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateChat={() => {
          setIsAstrologerListOpen(true);
        }}
        onOpenRemedies={() => setIsRemediesOpen(true)}
        onOpenProfile={() => setIsAuthOpen(true)}
      />

      {/* Complete Astrologer List Modal - Opens directly when tapping Chat */}
      {isAstrologerListOpen && (
        <AstrologerListModal
          experts={experts}
          onClose={() => {
            setIsAstrologerListOpen(false);
            setBottomNavTab('home');
          }}
          onStartChat={(exp) => {
            setIsAstrologerListOpen(false);
            handleStartChatWithExpert(exp);
          }}
          onViewProfile={(exp) => {
            setIsAstrologerListOpen(false);
            setActiveProfileExpert(exp);
          }}
        />
      )}

      {/* Vedic Remedies & Upay Modal */}
      {isRemediesOpen && (
        <RemediesModal
          experts={experts}
          onClose={() => {
            setIsRemediesOpen(false);
            setBottomNavTab('home');
          }}
          onStartChatWithExpert={(exp, topic) => {
            setIsRemediesOpen(false);
            handleStartChatWithExpert(exp || experts[0], topic);
          }}
        />
      )}

      {/* Live Astrologer Sessions Modal */}
      {isLiveOpen && (
        <LiveAstrologersModal
          experts={experts}
          onClose={() => {
            setIsLiveOpen(false);
            setBottomNavTab('home');
          }}
          onStartChat={(exp) => {
            setIsLiveOpen(false);
            handleStartChatWithExpert(exp);
          }}
        />
      )}

      {/* 4-Page Birth Details Intake Modal Before Chat */}
      {isIntakeOpen && pendingChatExpert && (
        <BirthDetailsIntakeModal
          expert={pendingChatExpert}
          initialUser={user}
          initialQuestion={pendingChatQuestion}
          onClose={() => {
            setIsIntakeOpen(false);
            setPendingChatExpert(null);
            setPendingChatQuestion(undefined);
          }}
          onSubmit={handleIntakeSubmit}
        />
      )}

      {/* Interactive Consultation Chat Modal */}
      {activeChatExpert && (
        (activeChatExpert.id === 'exp-kuldeep' || activeChatExpert.name.toLowerCase().includes('kuldeep')) ? (
          <GuruKuldeepChatModal
            expert={activeChatExpert}
            user={user}
            initialQuestion={chatInitialQuestion}
            onClose={() => {
              setActiveChatExpert(null);
              setChatInitialQuestion(undefined);
            }}
            walletBalance={wallet.balance}
            onOpenWallet={() => setIsWalletOpen(true)}
          />
        ) : (
          <ConsultationChatModal
            expert={activeChatExpert}
            user={user}
            initialQuestion={chatInitialQuestion}
            onClose={() => {
              setActiveChatExpert(null);
              setChatInitialQuestion(undefined);
            }}
            walletBalance={wallet.balance}
            onDeductWallet={handleDeductWallet}
            onOpenWallet={() => setIsWalletOpen(true)}
          />
        )
      )}

      {/* Astrologer Full Profile & Reviews Modal */}
      {activeProfileExpert && (
        <ExpertProfileModal
          expert={activeProfileExpert}
          onClose={() => setActiveProfileExpert(null)}
          onStartChat={(exp) => {
            setActiveProfileExpert(null);
            handleStartChatWithExpert(exp);
          }}
          onStartCall={(exp) => {
            setActiveProfileExpert(null);
            handleStartCallWithExpert(exp);
          }}
        />
      )}

      {/* Wallet Recharge & Transaction History Modal */}
      {isWalletOpen && (
        <WalletModal
          wallet={wallet}
          onClose={() => setIsWalletOpen(false)}
          onAddMoney={handleAddMoney}
        />
      )}

      {/* Seeker Sign In & Profile Coordinates Modal */}
      {isAuthOpen && (
        <AuthModal
          user={user}
          reasonForAuth={authReason}
          wallet={wallet}
          experts={experts}
          onClose={() => {
            setIsAuthOpen(false);
            setAuthReason(undefined);
          }}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onAddMoney={handleAddMoney}
          onStartChat={(exp) => {
            setIsAuthOpen(false);
            handleStartChatWithExpert(exp);
          }}
          onNavigateHome={() => {
            setIsAuthOpen(false);
            setBottomNavTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onUpdateProfile={(updated) => {
            setUser(updated);
            saveSessionUser(updated);
          }}
        />
      )}

      {/* Admin Panel Modal to Manage Experts, Rates & Settings */}
      {isAdminOpen && (
        <AdminPanelModal
          experts={experts}
          user={user}
          onClose={() => setIsAdminOpen(false)}
          onUpdateExpert={handleUpdateExpert}
        />
      )}

    </div>
  );
}
