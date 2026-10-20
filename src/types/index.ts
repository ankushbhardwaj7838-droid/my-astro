export type ExpertCategory = 'all' | 'love' | 'career' | 'tarot' | 'vedic' | 'numerology';

export type ExpertAvailability = 'online' | 'busy' | 'offline';

export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  avatarBg: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  ordersCount: number;
  experienceYears: number;
  languages: string[];
  specialisations: string[];
  primaryCategory: 'love' | 'career' | 'tarot' | 'vedic' | 'numerology';
  secondaryCategories: ('love' | 'career' | 'tarot' | 'vedic' | 'numerology')[];
  pricePerMin: number;
  discountedPrice?: number;
  freeChatEligible: boolean;
  availability: ExpertAvailability;
  bio: string;
  education: string;
  location: string;
  hasCall: boolean;
  hasChat: boolean;
  gender?: 'male' | 'female';
  careerSpecialities: string[];
  loveSpecialities: string[];
  skills?: string[];
  isAiAstrologer?: boolean;
}

export interface QuestionPrompt {
  id: string;
  domain: 'love' | 'career';
  question: string;
  subtext: string;
  matchingKeywords: string[];
}

export interface ZodiacDailyForecast {
  sign: string;
  sanskritName: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dateRange: string;
  loveScore: number;
  careerScore: number;
  loveForecast: string;
  careerForecast: string;
  luckyNumber: number;
  luckyColor: string;
}

export interface ClientReview {
  id: string;
  userName: string;
  userLocation: string;
  rating: number;
  timeAgo: string;
  expertName: string;
  consultationType: string;
  comment: string;
  language?: 'English' | 'Hinglish' | 'Hindi';
}

export interface ConsultationMessage {
  id: string;
  sender: 'user' | 'expert' | 'system';
  text: string;
  timestamp: string;
}

export interface UserWallet {
  balance: number;
  currency: string;
  transactions: {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    timestamp: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  knowsExactTime?: boolean;
  timePeriod?: 'AM' | 'PM';
  hour?: string;
  minute?: string;
  isLoggedIn: boolean;
  freeChatUsed: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  role?: 'super_admin' | 'admin' | 'user';
}
