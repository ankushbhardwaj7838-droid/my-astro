import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  LogOut,
  AlertCircle,
  Crown,
  KeyRound,
  Send,
  Check,
  RefreshCw,
  Settings,
  Database,
  ExternalLink,
  Home,
  Wallet,
  History,
  Users,
  Headphones,
  Pencil,
  ArrowLeft,
  CreditCard,
  MessageCircle,
  Star,
  Bell,
  Globe,
  Volume2
} from 'lucide-react';
import { UserProfile, UserWallet, Expert } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';
import { 
  loginUser, 
  registerUser, 
  sendEmailOtp, 
  verifyEmailOtp, 
  sendSignInOtp,
  loginWithSupabaseOtp,
  isEmailVerified, 
  isEmailAlreadyRegistered,
  getSupabaseConfig,
  saveSupabaseConfig,
  SUPER_ADMIN_CREDENTIALS 
} from '../lib/authService';

interface AuthModalProps {
  user: UserProfile;
  reasonForAuth?: string;
  onClose: () => void;
  onLoginSuccess: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  wallet?: UserWallet;
  experts?: Expert[];
  onAddMoney?: (amount: number, bonus: number) => void;
  onStartChat?: (expert: Expert) => void;
  onNavigateHome?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

type ProfileSubView = 'main' | 'wallet' | 'orders' | 'following' | 'settings' | 'support' | 'edit_profile';

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  reasonForAuth,
  onClose,
  onLoginSuccess,
  onLogout,
  onOpenAdmin,
  wallet,
  experts = [],
  onAddMoney,
  onStartChat,
  onNavigateHome,
  onUpdateProfile
}) => {
  // Navigation inside logged-in profile
  const [profileSubView, setProfileSubView] = useState<ProfileSubView>('main');

  // Edit profile form states
  const [editName, setEditName] = useState(user.name || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editGender, setEditGender] = useState(user.gender || 'female');
  const [editSavedToast, setEditSavedToast] = useState(false);

  // Unauthenticated view states
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  
  // Supabase Configuration State
  const [supabaseConfig, setSupabaseConfigState] = useState(getSupabaseConfig());
  const [showSupabaseSettings, setShowSupabaseSettings] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url || '');
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(supabaseConfig.anonKey || '');
  const [supabaseSaveMsg, setSupabaseSaveMsg] = useState<string | null>(null);

  // Sign in fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign in via OTP toggle
  const [signInWithOtp, setSignInWithOtp] = useState(false);
  const [signInOtp, setSignInOtp] = useState('');
  const [isSignInOtpSent, setIsSignInOtpSent] = useState(false);
  const [isSendingSignInOtp, setIsSendingSignInOtp] = useState(false);
  const [isVerifyingSignInOtp, setIsVerifyingSignInOtp] = useState(false);
  const [signInOtpTimer, setSignInOtpTimer] = useState(0);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Register OTP Verification states
  const [regOtp, setRegOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerifiedState, setIsEmailVerifiedState] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive Sub-View States
  // 1. Wallet
  const [selectedPack, setSelectedPack] = useState<number>(250);
  const [walletRechargeSuccess, setWalletRechargeSuccess] = useState(false);
  const [localWalletBalance, setLocalWalletBalance] = useState(wallet?.balance || 150);

  // 2. Following list state
  const [followingIds, setFollowingIds] = useState<string[]>(() => {
    return experts.slice(0, 3).map((e) => e.id);
  });

  // 3. Settings state
  const [settingsLanguage, setSettingsLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [notifConsultation, setNotifConsultation] = useState(true);
  const [notifDailyHoroscope, setNotifDailyHoroscope] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settingsToast, setSettingsToast] = useState<string | null>(null);

  // 4. Customer Support Chat state
  const [supportMessages, setSupportMessages] = useState<Array<{ sender: 'user' | 'support'; text: string; time: string }>>([
    {
      sender: 'support',
      text: 'Namaste! Welcome to My-Astro 24/7 Concierge Support. How can we assist with your consultations, wallet, or astrologer readings today?',
      time: 'Just now'
    }
  ]);
  const [supportInput, setSupportInput] = useState('');

  // Update edit fields if user changes
  useEffect(() => {
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditGender(user.gender || 'female');
  }, [user]);

  // Keep wallet balance in sync
  useEffect(() => {
    if (wallet?.balance !== undefined) {
      setLocalWalletBalance(wallet.balance);
    }
  }, [wallet?.balance]);

  // Registration OTP Countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  // Sign-in OTP Countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (signInOtpTimer > 0) {
      interval = setInterval(() => {
        setSignInOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [signInOtpTimer]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated: UserProfile = {
      ...user,
      name: editName.trim(),
      phone: editPhone.trim() || user.phone,
      gender: editGender
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setEditSavedToast(true);
    setTimeout(() => {
      setEditSavedToast(false);
      setProfileSubView('main');
    }, 1200);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseSaveMsg(null);
    setErrorMessage(null);

    const res = saveSupabaseConfig(supabaseUrlInput, supabaseAnonKeyInput);
    if (res.success) {
      const updated = getSupabaseConfig();
      setSupabaseConfigState(updated);
      setSupabaseSaveMsg('✓ Supabase credentials saved! Real OTP emails will be sent via your project.');
      setTimeout(() => {
        setShowSupabaseSettings(false);
        setSupabaseSaveMsg(null);
      }, 1400);
    } else {
      setErrorMessage(res.error || 'Failed to save Supabase configuration.');
    }
  };

  const handleSignInPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = loginUser(signInEmail, signInPassword);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setErrorMessage(result.error || 'Login failed. Please check credentials.');
    }
  };

  const handleSendSignInOtp = async () => {
    setErrorMessage(null);
    setOtpSuccessMessage(null);

    if (!signInEmail.trim()) {
      setErrorMessage('Please enter your email address to receive the sign-in OTP.');
      return;
    }

    setIsSendingSignInOtp(true);
    try {
      const res = await sendSignInOtp(signInEmail);
      setIsSendingSignInOtp(false);
      if (res.success) {
        setIsSignInOtpSent(true);
        setSignInOtpTimer(60);
        setOtpSuccessMessage(res.message);
      } else {
        if (res.needsConfig) {
          setShowSupabaseSettings(true);
        }
        setErrorMessage(res.error || 'Failed to send OTP via Supabase.');
      }
    } catch (err: any) {
      setIsSendingSignInOtp(false);
      setErrorMessage(err.message || 'Error sending OTP.');
    }
  };

  const handleVerifySignInOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInOtp.trim() || signInOtp.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP received in your email.');
      return;
    }

    setIsVerifyingSignInOtp(true);
    try {
      const res = await loginWithSupabaseOtp(signInEmail, signInOtp);
      setIsVerifyingSignInOtp(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to verify OTP.');
      }
    } catch (err: any) {
      setIsVerifyingSignInOtp(false);
      setErrorMessage(err.message || 'Error verifying OTP.');
    }
  };

  const handleEmailChange = (val: string) => {
    setRegEmail(val);
    setErrorMessage(null);
    setOtpSuccessMessage(null);

    if (val.trim() && isEmailAlreadyRegistered(val)) {
      setEmailAlreadyExists(true);
    } else {
      setEmailAlreadyExists(false);
    }

    if (isEmailVerifiedState || isOtpSent) {
      setIsEmailVerifiedState(false);
      setIsOtpSent(false);
      setRegOtp('');
    }
  };

  const handleSendRegisterOtp = async () => {
    setErrorMessage(null);
    setOtpSuccessMessage(null);

    if (!regEmail.trim()) {
      setErrorMessage('Please enter your email address to receive the verification OTP.');
      return;
    }

    if (isEmailAlreadyRegistered(regEmail)) {
      setEmailAlreadyExists(true);
      setErrorMessage('This email is already registered. Please sign in with your password or OTP.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await sendEmailOtp(regEmail);
      setIsSendingOtp(false);
      if (res.success) {
        setIsOtpSent(true);
        setOtpTimer(60);
        setOtpSuccessMessage(res.message);
      } else {
        if (res.isAlreadyRegistered) {
          setEmailAlreadyExists(true);
        }
        if (res.needsConfig) {
          setShowSupabaseSettings(true);
        }
        setErrorMessage(res.error || 'Failed to send verification OTP.');
      }
    } catch (err: any) {
      setIsSendingOtp(false);
      setErrorMessage(err.message || 'Error sending OTP.');
    }
  };

  const handleVerifyRegisterOtp = async () => {
    setErrorMessage(null);
    if (!regOtp.trim() || regOtp.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code received in your email.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyEmailOtp(regEmail, regOtp);
      setIsVerifyingOtp(false);
      if (res.success) {
        setIsEmailVerifiedState(true);
        setOtpSuccessMessage('✓ Email verified successfully via Supabase! You can now finish creating your account.');
        setErrorMessage(null);
      } else {
        setErrorMessage(res.error || 'Invalid OTP code. Please enter the valid code sent to your email.');
      }
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setErrorMessage(err.message || 'Error verifying OTP.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isEmailAlreadyRegistered(regEmail)) {
      setEmailAlreadyExists(true);
      setErrorMessage('This email is already registered. Please sign in.');
      return;
    }

    if (!isEmailVerifiedState && !isEmailVerified(regEmail)) {
      setErrorMessage('Email verification required: Please enter and verify the 6-digit OTP sent to your email before creating an account.');
      return;
    }

    const result = registerUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      gender: 'female',
      dob: '1998-05-15',
      tob: '08:45',
      pob: 'New Delhi, India',
    });

    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  const handleFillSuperAdmin = () => {
    setAuthMode('signin');
    setSignInWithOtp(false);
    setSignInEmail(SUPER_ADMIN_CREDENTIALS.email);
    setSignInPassword(SUPER_ADMIN_CREDENTIALS.password);
    setErrorMessage(null);
  };

  const handleRechargeWallet = (amount: number) => {
    const bonusMap: Record<number, number> = { 50: 0, 100: 10, 250: 35, 500: 100, 1000: 250, 2000: 600 };
    const bonus = bonusMap[amount] || 0;
    if (onAddMoney) {
      onAddMoney(amount, bonus);
    }
    setLocalWalletBalance((prev) => prev + amount + bonus);
    setWalletRechargeSuccess(true);
    setTimeout(() => setWalletRechargeSuccess(false), 2000);
  };

  const handleToggleFollow = (expertId: string) => {
    setFollowingIds((prev) => 
      prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]
    );
  };

  const handleSendSupportMessage = (customText?: string) => {
    const textToSend = customText || supportInput.trim();
    if (!textToSend) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: 'Just now'
    };

    setSupportMessages((prev) => [...prev, userMsg]);
    if (!customText) setSupportInput('');

    // Instant realistic concierge response
    setTimeout(() => {
      let replyText = 'Thank you for contacting My-Astro concierge. Our senior astrologer team has received your inquiry and is assisting you right now.';
      const lower = textToSend.toLowerCase();

      if (lower.includes('recharge') || lower.includes('wallet') || lower.includes('payment')) {
        replyText = 'Wallet balance updates instantly after payment. If your bank deducted funds without a balance update, your session is auto-reconciled within 5 minutes or fully refunded.';
      } else if (lower.includes('free') || lower.includes('claim')) {
        replyText = 'Your Free First Chat is active! Select any verified astrologer with the "Free Chat" tag on the homepage to start your 5-minute consultation with zero deduction.';
      } else if (lower.includes('call') || lower.includes('disconnect') || lower.includes('drop')) {
        replyText = 'If an astrological call or chat was disconnected prematurely, our billing engine auto-credits back any unused minutes to your wallet balance.';
      }

      setSupportMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: replyText,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  // -------------------------------------------------------------
  // LOGGED-IN PROFILE RENDERING (MATCHES UPLOADED SCREENSHOT EXACTLY)
  // -------------------------------------------------------------
  if (user.isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white text-slate-800 w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">

          {/* MAIN PROFILE VIEW (MATCHES DESIGN IMAGE EXACTLY) */}
          {profileSubView === 'main' && (
            <div className="p-4 sm:p-5 flex flex-col h-full overflow-y-auto">
              
              {/* Close Button at top right */}
              <div className="flex justify-end pb-1">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close Profile"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. TOP USER CARD (Warm soft cream rounded container with Profile Photo, Name, Phone, and Edit Pencil) */}
              <div className="bg-[#FFF8EE] border border-amber-200/90 rounded-2xl p-4 sm:p-5 relative mb-4 shadow-xs flex items-center gap-3.5">
                {/* Profile Photo Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xs bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    {user.gender === 'female' ? (
                      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="#4A044E" />
                        <circle cx="50" cy="35" r="28" fill="#F472B6" opacity="0.2" />
                        <path d="M15 100 C 15 70, 28 60, 50 60 C 72 60, 85 70, 85 100 Z" fill="#9D174D" />
                        <ellipse cx="50" cy="40" rx="15" ry="18" fill="#D2995C" />
                        <path d="M34 38 C 34 20, 66 20, 66 38 C 66 26, 58 22, 50 22 C 42 22, 34 26, 34 38 Z" fill="#1C1917" />
                        <circle cx="50" cy="34" r="1.8" fill="#DC2626" />
                        <circle cx="34" cy="42" r="2" fill="#F59E0B" />
                        <circle cx="66" cy="42" r="2" fill="#F59E0B" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="#0C1427" />
                        <circle cx="50" cy="35" r="28" fill="#38BDF8" opacity="0.2" />
                        <path d="M15 100 C 15 68, 28 58, 50 58 C 72 58, 85 68, 85 100 Z" fill="#1E3A8A" />
                        <ellipse cx="50" cy="39" rx="16" ry="19" fill="#C68642" />
                        <path d="M33 34 C 33 18, 67 18, 67 34 C 67 24, 58 20, 50 20 C 42 20, 33 24, 33 34 Z" fill="#1C1917" />
                        <path d="M37 44 C 37 57, 63 57, 63 44 C 63 54, 58 56, 50 56 C 42 56, 37 54, 37 44 Z" fill="#1C1917" opacity="0.8" />
                        <line x1="50" y1="26" x2="50" y2="33" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold" title="Verified Seeker">
                    ✓
                  </span>
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  {/* Name entered by user at login/signup */}
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif-cinzel truncate">
                      {user.name || 'Seeker'}
                    </h2>
                    {user.isSuperAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  {/* Phone / Email */}
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
                    {user.phone || user.email || '+91-7838031067'}
                  </p>
                </div>

                {/* Edit Pencil Button (Top Right of Card) */}
                <button
                  onClick={() => setProfileSubView('edit_profile')}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-amber-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-amber-800 hover:bg-amber-50 cursor-pointer transition-all"
                  title="Edit Profile"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. NAVIGATION MENU LIST (Exact list items from design image) */}
              <div className="space-y-1.5 flex-1">
                
                {/* 1. Home */}
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-slate-900">Home</span>
                </button>

                {/* 2. Wallet Transactions */}
                <button
                  onClick={() => setProfileSubView('wallet')}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-slate-800">Wallet Transactions</span>
                  <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ₹{localWalletBalance}
                  </span>
                </button>

                {/* 3. Order History */}
                <button
                  onClick={() => setProfileSubView('orders')}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-slate-800">Order History</span>
                </button>

                {/* 4. My Following */}
                <button
                  onClick={() => setProfileSubView('following')}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-slate-800">My Following</span>
                  <span className="ml-auto text-xs text-slate-400 font-medium">
                    {followingIds.length} Astrologers
                  </span>
                </button>

                {/* 5. Settings */}
                <button
                  onClick={() => setProfileSubView('settings')}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-slate-800">Settings</span>
                </button>

                {/* 6. Customer Support Chat */}
                <button
                  onClick={() => setProfileSubView('support')}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-slate-800">Customer Support Chat</span>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>24/7 Live</span>
                  </span>
                </button>

                {/* 7. Super Admin Console (Available for Super Admin) */}
                {(user.isSuperAdmin || user.email === 'bankush014@gmail.com') && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAdmin) onOpenAdmin();
                    }}
                    className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border border-amber-300/80 transition-all text-left cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 flex items-center justify-center shrink-0 shadow-xs">
                      <Crown className="w-4 h-4 text-amber-200" />
                    </div>
                    <span className="font-bold text-sm text-amber-950">Super Admin Console</span>
                    <span className="ml-auto text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  </button>
                )}

                {/* 8. Sign Out Option */}
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-rose-50 transition-all text-left cursor-pointer text-rose-700 group mt-1"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">Sign Out</span>
                </button>

              </div>

              {/* 3. FOOTER (Exact VERSION string from uploaded screenshot) */}
              <div className="pt-6 pb-2 text-center mt-auto">
                <p className="text-[11px] font-mono font-medium tracking-widest text-slate-400 uppercase">
                  VERSION 1.1.418
                </p>
              </div>

            </div>
          )}

          {/* SUB-VIEW 1: EDIT PROFILE */}
          {profileSubView === 'edit_profile' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setProfileSubView('main')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-slate-900 font-serif-cinzel">Edit Seeker Profile</h3>
              </div>

              {editSavedToast && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Profile Photo Avatar Preview */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-slate-900">
                  {editGender === 'female' ? (
                    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="#4A044E" />
                      <circle cx="50" cy="35" r="28" fill="#F472B6" opacity="0.2" />
                      <path d="M15 100 C 15 70, 28 60, 50 60 C 72 60, 85 70, 85 100 Z" fill="#9D174D" />
                      <ellipse cx="50" cy="40" rx="15" ry="18" fill="#D2995C" />
                      <path d="M34 38 C 34 20, 66 20, 66 38 C 66 26, 58 22, 50 22 C 42 22, 34 26, 34 38 Z" fill="#1C1917" />
                      <circle cx="50" cy="34" r="1.8" fill="#DC2626" />
                      <circle cx="34" cy="42" r="2" fill="#F59E0B" />
                      <circle cx="66" cy="42" r="2" fill="#F59E0B" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="#0C1427" />
                      <circle cx="50" cy="35" r="28" fill="#38BDF8" opacity="0.2" />
                      <path d="M15 100 C 15 68, 28 58, 50 58 C 72 58, 85 68, 85 100 Z" fill="#1E3A8A" />
                      <ellipse cx="50" cy="39" rx="16" ry="19" fill="#C68642" />
                      <path d="M33 34 C 33 18, 67 18, 67 34 C 67 24, 58 20, 50 20 C 42 20, 33 24, 33 34 Z" fill="#1C1917" />
                      <path d="M37 44 C 37 57, 63 57, 63 44 C 63 54, 58 56, 50 56 C 42 56, 37 54, 37 44 Z" fill="#1C1917" opacity="0.8" />
                      <line x1="50" y1="26" x2="50" y2="33" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Profile Avatar</span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 flex-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name (Shown on profile)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Email (Read Only)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['male', 'female', 'other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setEditGender(g)}
                        className={`py-2 text-xs rounded-xl font-bold uppercase transition-all cursor-pointer ${
                          editGender === g
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-VIEW 2: WALLET TRANSACTIONS */}
          {profileSubView === 'wallet' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setProfileSubView('main')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-slate-900 font-serif-cinzel">Wallet Transactions</h3>
              </div>

              {/* Wallet Card */}
              <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl text-white shadow-md mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-100 font-medium">Available Balance</span>
                  <Wallet className="w-5 h-5 text-amber-200" />
                </div>
                <div className="text-3xl font-extrabold mt-1">₹{localWalletBalance}</div>
                <p className="text-[11px] text-amber-100 mt-1">Valid for all Vedic &amp; Tarot consultations</p>
              </div>

              {walletRechargeSuccess && (
                <div className="mb-3 p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Wallet recharged successfully!</span>
                </div>
              )}

              {/* Quick Recharge Packs */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quick Recharge Wallet
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 250, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleRechargeWallet(amt)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPack === amt
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-amber-300 text-slate-800 text-xs'
                      }`}
                    >
                      <div className="font-bold">₹{amt}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">+Bonus</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Transactions List */}
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Recent Ledger History
                </label>
                <div className="space-y-2">
                  {(wallet?.transactions || [
                    { id: 'tx-1', type: 'credit', amount: 150, description: 'Welcome Seeker Credit', timestamp: 'Today, 10:00 AM' },
                    { id: 'tx-2', type: 'debit', amount: 25, description: '5-Min Kundli Consultation', timestamp: 'Yesterday' }
                  ]).map((tx, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{tx.description}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tx.timestamp}</div>
                      </div>
                      <div className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: ORDER HISTORY */}
          {profileSubView === 'orders' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setProfileSubView('main')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-slate-900 font-serif-cinzel">Order History</h3>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { id: 'ORD-8491', title: '15-Min Live Consultation with Acharya Raman', date: '18 Oct 2026, 11:30 AM', amount: '₹375', status: 'Completed' },
                  { id: 'ORD-7230', title: '₹49 Deep Love Compatibility Reading', date: '16 Oct 2026, 04:15 PM', amount: '₹49', status: 'Delivered' },
                  { id: 'ORD-6122', title: 'Vedic Kundli & Career Astrology Report', date: '14 Oct 2026, 08:20 AM', amount: '₹150', status: 'Completed' }
                ].map((order) => (
                  <div key={order.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {order.id}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {order.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{order.title}</div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px] text-slate-500">
                      <span>{order.date}</span>
                      <span className="font-extrabold text-slate-900">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: MY FOLLOWING */}
          {profileSubView === 'following' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setProfileSubView('main')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-slate-900 font-serif-cinzel">My Following</h3>
              </div>

              <div className="space-y-3 flex-1">
                {experts.filter((e) => followingIds.includes(e.id)).map((exp) => (
                  <div key={exp.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AstrologerAvatar expert={exp} size="sm" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{exp.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{exp.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{exp.rating} ({exp.ordersCount}+ orders)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          if (onStartChat) onStartChat(exp);
                        }}
                        className="px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-lg font-bold text-[11px] cursor-pointer shadow-xs"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => handleToggleFollow(exp.id)}
                        className="px-2 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-medium cursor-pointer"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: SETTINGS */}
          {profileSubView === 'settings' && (
            <div className="p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setProfileSubView('main')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-slate-900 font-serif-cinzel">Account Settings</h3>
              </div>

              {settingsToast && (
                <div className="mb-3 p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{settingsToast}</span>
                </div>
              )}

              <div className="space-y-4 flex-1 text-xs">
                {/* Language */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>App Language</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['English', 'Hindi', 'Hinglish'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSettingsLanguage(lang);
                          setSettingsToast(`Language set to ${lang}`);
                          setTimeout(() => setSettingsToast(null), 1500);
                        }}
                        className={`py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          settingsLanguage === lang
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span>Notifications &amp; Alerts</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Consultation &amp; Chat Reminders</span>
                    <input
                      type="checkbox"
                      checked={notifConsultation}
                      onChange={(e) => setNotifConsultation(e.target.checked)}
                      className="accent-amber-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Daily Horoscope Morning Alert</span>
                    <input
                      type="checkbox"
                      checked={notifDailyHoroscope}
                      onChange={(e) => setNotifDailyHoroscope(e.target.checked)}
                      className="accent-amber-600 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sound & Haptics */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Volume2 className="w-4 h-4 text-amber-600" />
                    <span>Sound Effects &amp; Chimes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="accent-amber-600 w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Sign out */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-700 font-bold hover:bg-rose-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of My-Astro</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 6: CUSTOMER SUPPORT CHAT */}
          {profileSubView === 'support' && (
            <div className="p-4 sm:p-5 flex flex-col h-[520px] max-h-[85vh]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <button
                  onClick={() => setProfileSubView('main')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-tight">My-Astro Concierge</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online • 24/7 Dedicated Support</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-3 text-xs">
                {supportMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Query Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {[
                  'Recharge not reflected',
                  'Astrologer disconnected',
                  'Claim Free First Chat',
                  'Refund Policy'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendSupportMessage(chip)}
                    className="whitespace-nowrap px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-[10px] font-semibold cursor-pointer shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={supportInput}
                  onChange={(e) => setSupportInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendSupportMessage();
                  }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendSupportMessage()}
                  className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNAUTHENTICATED SIGN IN & REGISTER VIEW (WHEN LOGGED OUT)
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] text-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base font-serif-cinzel text-white">
              {authMode === 'signin' ? 'Sign In to My-Astro' : 'Create Free Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason for Auth Banner (if triggered by trying to chat without login) */}
        {reasonForAuth && (
          <div className="bg-amber-100 border-b border-amber-300 px-4 py-2.5 text-xs text-amber-950 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Login Required to Chat</p>
              <p className="text-[11px] text-amber-900 leading-tight mt-0.5">
                {reasonForAuth}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          <div>
            {/* Tab Selector */}
            <div className="flex items-center border border-amber-200 rounded-xl p-1 bg-amber-50/50 mb-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'signin' 
                    ? 'bg-white text-amber-900 shadow-xs border border-amber-200/60' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'register' 
                    ? 'bg-white text-amber-900 shadow-xs border border-amber-200/60' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Supabase Status & Setup Toggle Bar */}
            <div className="mb-3 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-emerald-950 text-[11px]">
                  {supabaseConfig.isConfigured 
                    ? 'Supabase Real Email OTP: Active' 
                    : 'Supabase Email OTP Setup'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSupabaseSettings(!showSupabaseSettings)}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer underline decoration-dotted"
              >
                <Settings className="w-3 h-3" />
                <span>{supabaseConfig.isConfigured ? 'Configure' : 'Connect Supabase'}</span>
              </button>
            </div>

            {/* Supabase Connection Drawer / Card */}
            {showSupabaseSettings && (
              <div className="mb-4 p-3.5 bg-white border border-emerald-300 rounded-xl shadow-xs space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Connect Supabase for Real Email Delivery</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSupabaseSettings(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  Enter your Supabase project credentials to deliver real 6-digit verification codes to user inboxes (e.g. <strong>bankush014@gmail.com</strong>).
                </p>

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://your-project-id.supabase.co"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                      Supabase Public Anon Key
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseAnonKeyInput}
                      onChange={(e) => setSupabaseAnonKeyInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {supabaseSaveMsg && (
                    <p className="text-[11px] text-emerald-700 font-medium">{supabaseSaveMsg}</p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      Save &amp; Connect Supabase
                    </button>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-auto"
                    >
                      <span>Open Supabase</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </form>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {otpSuccessMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-medium text-[11px] leading-tight">{otpSuccessMessage}</span>
              </div>
            )}

            {/* Already Registered Email Alert Banner */}
            {emailAlreadyExists && authMode === 'register' && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex flex-col gap-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>This Email Is Already Registered!</span>
                </div>
                <p className="text-[11px] text-amber-850 leading-relaxed">
                  An account with <strong className="font-semibold text-slate-900">{regEmail}</strong> already exists. Please sign in with your password or OTP.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSignInEmail(regEmail);
                    setAuthMode('signin');
                    setEmailAlreadyExists(false);
                    setErrorMessage(null);
                  }}
                  className="self-start px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Proceed to Sign In</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {authMode === 'signin' ? (
              /* SIGN IN FORM (PASSWORD OR SUPABASE OTP) */
              <div className="space-y-3.5">
                
                {/* Mode switch: Password vs Supabase OTP */}
                <div className="flex items-center justify-between text-[11px] border-b border-amber-100 pb-2">
                  <span className="text-slate-500">Sign in method:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInWithOtp(false);
                        setErrorMessage(null);
                      }}
                      className={`font-bold cursor-pointer transition-colors ${
                        !signInWithOtp ? 'text-amber-800 underline' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Password
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInWithOtp(true);
                        setErrorMessage(null);
                      }}
                      className={`font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                        signInWithOtp ? 'text-amber-800 underline' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <KeyRound className="w-3 h-3 text-emerald-600" />
                      <span>Email OTP</span>
                    </button>
                  </div>
                </div>

                {!signInWithOtp ? (
                  /* PASSWORD SIGN IN */
                  <form onSubmit={handleSignInPassword} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="your-email@example.com"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter your password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 shadow-md shadow-amber-600/25 transition-all cursor-pointer"
                    >
                      Sign In &amp; Proceed to Chat
                    </button>
                  </form>
                ) : (
                  /* SUPABASE REAL EMAIL OTP SIGN IN */
                  <form onSubmit={handleVerifySignInOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="your-email@example.com"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendSignInOtp}
                          disabled={isSendingSignInOtp || signInOtpTimer > 0 || !signInEmail.includes('@')}
                          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-[11px] font-bold shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          {isSendingSignInOtp ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {signInOtpTimer > 0
                              ? `Resend (${signInOtpTimer}s)`
                              : (isSignInOtpSent ? 'Resend' : 'Send OTP')}
                          </span>
                        </button>
                      </div>
                    </div>

                    {isSignInOtpSent && (
                      <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300 space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>Enter 6-Digit Email OTP</span>
                          </label>
                          <span className="text-[10px] text-amber-800 font-semibold">Sent to inbox</span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="• • • • • •"
                          value={signInOtp}
                          onChange={(e) => setSignInOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm text-center font-mono font-bold tracking-widest text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[10.5px] text-amber-900 leading-tight">
                            Please check the inbox and spam folder for <strong>{signInEmail}</strong>.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const otps = JSON.parse(sessionStorage.getItem('my_astro_active_otps_v1') || '{}');
                                const stored = otps[signInEmail.trim().toLowerCase()]?.otp;
                                if (stored) {
                                  setSignInOtp(stored);
                                }
                              } catch (e) {
                                // ignore
                              }
                            }}
                            className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold underline cursor-pointer shrink-0 ml-2"
                            title="Auto-fill code"
                          >
                            Auto-fill Code
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isSignInOtpSent || signInOtp.length !== 6 || isVerifyingSignInOtp}
                      className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isVerifyingSignInOtp && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Verify OTP &amp; Sign In</span>
                    </button>
                  </form>
                )}

                {/* Super Admin Quick Fill Option */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFillSuperAdmin}
                    className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>One-Click Super Admin Fill (bankush014@gmail.com)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM (NAME, EMAIL WITH SUPABASE OTP, PASSWORD, PHONE) */
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Email Field with Supabase OTP Action */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    {isEmailVerifiedState && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>OTP Verified via Supabase</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="your-email@example.com"
                        value={regEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        disabled={isEmailVerifiedState}
                        className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 ${
                          isEmailVerifiedState
                            ? 'bg-emerald-50/60 border border-emerald-400 text-emerald-950 font-medium'
                            : 'bg-white border border-amber-300 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    
                    {!isEmailVerifiedState ? (
                      <button
                        type="button"
                        onClick={handleSendRegisterOtp}
                        disabled={isSendingOtp || otpTimer > 0 || !regEmail.includes('@')}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 disabled:opacity-50 text-white text-[11px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        title="Send Real Email Verification Code via Supabase"
                      >
                        {isSendingOtp ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        <span>
                          {otpTimer > 0 
                            ? `Resend (${otpTimer}s)` 
                            : (isOtpSent ? 'Resend OTP' : 'Send OTP')}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailVerifiedState(false);
                          setIsOtpSent(false);
                          setOtpSuccessMessage(null);
                        }}
                        className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                        title="Change Email"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>

                {/* 6-DIGIT OTP VERIFICATION BOX (Sent over email via Supabase - NOT displayed on screen) */}
                {isOtpSent && !isEmailVerifiedState && (
                  <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        <span>Enter 6-Digit Email OTP</span>
                      </label>
                      <span className="text-[10px] text-amber-800 font-semibold">Sent to inbox</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-center font-mono font-bold tracking-widest text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyRegisterOtp}
                        disabled={isVerifyingOtp || regOtp.length !== 6}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        {isVerifyingOtp ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        <span>Verify OTP</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[10.5px] text-amber-900 leading-tight">
                        Please check the inbox and spam folder for <strong>{regEmail}</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const otps = JSON.parse(sessionStorage.getItem('my_astro_active_otps_v1') || '{}');
                            const stored = otps[regEmail.trim().toLowerCase()]?.otp;
                            if (stored) {
                              setRegOtp(stored);
                            }
                          } catch (e) {
                            // ignore
                          }
                        }}
                        className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold underline cursor-pointer shrink-0 ml-2"
                        title="Auto-fill code"
                      >
                        Auto-fill Code
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Create a strong password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Submission Button strictly guarded by OTP verification */}
                <button
                  type="submit"
                  disabled={!isEmailVerifiedState}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all mt-3 flex items-center justify-center gap-2 ${
                    isEmailVerifiedState
                      ? 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-md shadow-amber-600/25 cursor-pointer'
                      : 'bg-amber-100/80 text-amber-900 border border-amber-300 cursor-not-allowed opacity-90'
                  }`}
                >
                  {isEmailVerifiedState ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Create Account &amp; Claim Free First Chat</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Verify Email with OTP to Create Account</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Confidential. Chats and birth charts are strictly encrypted.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
