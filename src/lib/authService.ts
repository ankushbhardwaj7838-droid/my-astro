import { UserProfile } from '../types';

export const SUPER_ADMIN_CREDENTIALS = {
  email: 'bankush014@gmail.com',
  password: 'Ankush@1965',
  name: 'Ankush',
  role: 'super_admin' as const,
};

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  role: 'super_admin' | 'admin' | 'user';
  isSuperAdmin: boolean;
  isAdmin: boolean;
  freeChatUsed: boolean;
  registeredAt: string;
}

const STORAGE_USERS_KEY = 'my_astro_registered_users_v1';
const STORAGE_CURRENT_USER_KEY = 'my_astro_current_session_v1';

// Seed initial super admin and sample accounts in database storage
export const getDatabaseUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure super admin is always present and updated
      const hasSuperAdmin = parsed.some(
        (u: StoredUser) => u.email.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()
      );
      if (!hasSuperAdmin) {
        parsed.unshift({
          id: 'usr-super-admin',
          name: SUPER_ADMIN_CREDENTIALS.name,
          email: SUPER_ADMIN_CREDENTIALS.email,
          password: SUPER_ADMIN_CREDENTIALS.password,
          phone: '+91 98765 43210',
          gender: 'male',
          dob: '1990-01-01',
          tob: '06:00',
          pob: 'New Delhi, India',
          role: 'super_admin',
          isSuperAdmin: true,
          isAdmin: true,
          freeChatUsed: false,
          registeredAt: new Date().toISOString(),
        });
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading database users from localStorage', e);
  }

  // Initial seed
  const initialUsers: StoredUser[] = [
    {
      id: 'usr-super-admin',
      name: SUPER_ADMIN_CREDENTIALS.name,
      email: SUPER_ADMIN_CREDENTIALS.email,
      password: SUPER_ADMIN_CREDENTIALS.password,
      phone: '+91 98765 43210',
      gender: 'male',
      dob: '1990-01-01',
      tob: '06:00',
      pob: 'New Delhi, India',
      role: 'super_admin',
      isSuperAdmin: true,
      isAdmin: true,
      freeChatUsed: false,
      registeredAt: new Date().toISOString(),
    },
    {
      id: 'usr-seeker-1',
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      password: 'User@1234',
      phone: '+91 98765 43210',
      gender: 'female',
      dob: '1998-05-15',
      tob: '08:45',
      pob: 'New Delhi, India',
      role: 'user',
      isSuperAdmin: false,
      isAdmin: false,
      freeChatUsed: false,
      registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];

  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialUsers));
  } catch (e) {
    // ignore
  }

  return initialUsers;
};

// Authenticate user with credentials
export const loginUser = (
  email: string,
  password?: string
): { success: boolean; user?: UserProfile; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password?.trim() || '';

  // 1. Super Admin Check
  if (cleanEmail === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()) {
    if (cleanPass !== SUPER_ADMIN_CREDENTIALS.password) {
      return {
        success: false,
        error: `Incorrect password for Super Admin account. Please enter the authorized password (Ankush@1965).`,
      };
    }

    const superAdminProfile: UserProfile = {
      name: 'Ankush (Super Admin)',
      email: SUPER_ADMIN_CREDENTIALS.email,
      phone: '+91 98765 43210',
      gender: 'male',
      dob: '1990-01-01',
      tob: '06:00',
      pob: 'New Delhi, India',
      isLoggedIn: true,
      freeChatUsed: false,
      isAdmin: true,
      isSuperAdmin: true,
      role: 'super_admin',
    };

    saveSessionUser(superAdminProfile);
    return { success: true, user: superAdminProfile };
  }

  // 2. Regular user check from database
  const users = getDatabaseUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    if (existing.password && cleanPass && existing.password !== cleanPass) {
      return { success: false, error: 'Incorrect password for this account. Please try again.' };
    }

    const profile: UserProfile = {
      name: existing.name,
      email: existing.email,
      phone: existing.phone,
      gender: existing.gender,
      dob: existing.dob,
      tob: existing.tob,
      pob: existing.pob,
      isLoggedIn: true,
      freeChatUsed: existing.freeChatUsed,
      isAdmin: existing.isAdmin,
      isSuperAdmin: existing.isSuperAdmin,
      role: existing.role,
    };

    saveSessionUser(profile);
    return { success: true, user: profile };
  }

  return {
    success: false,
    error: 'Account not found. Please sign up with your birth details to claim your Free First Chat.',
  };
};

// OTP Cache for email verification
interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
}

const STORAGE_OTP_KEY = 'my_astro_active_otps_v1';
const STORAGE_VERIFIED_EMAILS_KEY = 'my_astro_verified_emails_v1';

// Helper to get active OTP records
const getStoredOtps = (): Record<string, OtpRecord> => {
  try {
    const raw = sessionStorage.getItem(STORAGE_OTP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveStoredOtps = (records: Record<string, OtpRecord>) => {
  try {
    sessionStorage.setItem(STORAGE_OTP_KEY, JSON.stringify(records));
  } catch (e) {
    // ignore
  }
};

// Check if an email is already verified via OTP
export const isEmailVerified = (email: string): boolean => {
  try {
    const raw = sessionStorage.getItem(STORAGE_VERIFIED_EMAILS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(email.trim().toLowerCase());
  } catch (e) {
    return false;
  }
};

// Mark an email as verified
export const markEmailVerified = (email: string) => {
  try {
    const clean = email.trim().toLowerCase();
    const raw = sessionStorage.getItem(STORAGE_VERIFIED_EMAILS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(clean)) {
      list.push(clean);
      sessionStorage.setItem(STORAGE_VERIFIED_EMAILS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    // ignore
  }
};

import { 
  getSupabaseConfig, 
  sendSupabaseEmailOtp, 
  verifySupabaseEmailOtp,
  saveSupabaseConfig,
  clearSupabaseConfig 
} from './supabase';

export { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig };

// Check if email is already registered
export const isEmailAlreadyRegistered = (email: string): boolean => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return false;
  const users = getDatabaseUsers();
  return users.some((u) => u.email.toLowerCase() === cleanEmail);
};

// Send REAL Email OTP via Supabase
export const sendEmailOtp = async (
  email: string
): Promise<{ 
  success: boolean; 
  message: string; 
  error?: string; 
  isAlreadyRegistered?: boolean;
  needsConfig?: boolean;
  viaSupabase?: boolean;
}> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      success: false,
      message: '',
      error: 'Please enter a valid email address to receive the verification OTP.',
    };
  }

  // Check if account is already registered
  if (isEmailAlreadyRegistered(cleanEmail)) {
    return {
      success: false,
      isAlreadyRegistered: true,
      message: '',
      error: 'This email address is already registered. Please sign in with your password or OTP.',
    };
  }

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    const supabaseResult = await sendSupabaseEmailOtp(cleanEmail);
    if (supabaseResult.success) {
      return {
        success: true,
        viaSupabase: true,
        message: `Real 6-digit OTP code sent to ${cleanEmail} via Supabase! Please check your inbox and spam folder.`,
      };
    } else if (supabaseResult.isSmtpIssue) {
      // Supabase free tier built-in email limit hit (2 emails/hr) or custom SMTP not setup
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;
      const otps = getStoredOtps();
      otps[cleanEmail] = { email: cleanEmail, otp: code, expiresAt };
      saveStoredOtps(otps);

      return {
        success: true,
        viaSupabase: false,
        isAlreadyRegistered: false,
        message: 'Supabase email service notice: Built-in free mailer rate limit reached (2-3 emails/hr). A session verification OTP was prepared so you can continue immediately.',
      };
    } else {
      return {
        success: false,
        message: '',
        error: supabaseResult.error || 'Failed to dispatch email OTP via Supabase.',
      };
    }
  }

  // Supabase is not configured yet, generate verification session
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const otps = getStoredOtps();
  otps[cleanEmail] = { email: cleanEmail, otp: code, expiresAt };
  saveStoredOtps(otps);

  return {
    success: true,
    needsConfig: true,
    message: 'Supabase is not connected yet. A session verification OTP was prepared so you can continue.',
  };
};

// Send OTP specifically for Sign In / Passwordless Login
export const sendSignInOtp = async (
  email: string
): Promise<{
  success: boolean;
  message: string;
  error?: string;
  needsConfig?: boolean;
}> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      success: false,
      message: '',
      error: 'Please enter a valid email address.',
    };
  }

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    const res = await sendSupabaseEmailOtp(cleanEmail);
    if (res.success) {
      return res;
    }
    if (res.isSmtpIssue) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;
      const otps = getStoredOtps();
      otps[cleanEmail] = { email: cleanEmail, otp: code, expiresAt };
      saveStoredOtps(otps);
      return {
        success: true,
        message: 'Supabase free mailer limit reached. A session OTP was prepared to sign in.',
      };
    }
    return res;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const otps = getStoredOtps();
  otps[cleanEmail] = { email: cleanEmail, otp: code, expiresAt };
  saveStoredOtps(otps);
  return {
    success: true,
    message: 'Session sign-in OTP prepared. Please enter the 6-digit code.',
  };
};

// Verify the entered OTP for an email
export const verifyEmailOtp = async (
  email: string,
  enteredOtp: string
): Promise<{ success: boolean; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim();

  if (!cleanOtp || cleanOtp.length !== 6) {
    return { success: false, error: 'Please enter the complete 6-digit OTP code.' };
  }

  const { isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    const res = await verifySupabaseEmailOtp(cleanEmail, cleanOtp);
    if (res.success) {
      markEmailVerified(cleanEmail);
      return { success: true };
    }
  }

  // Fallback to local OTP cache
  const otps = getStoredOtps();
  const record = otps[cleanEmail];
  if (record && record.otp === cleanOtp && Date.now() <= record.expiresAt) {
    markEmailVerified(cleanEmail);
    delete otps[cleanEmail];
    saveStoredOtps(otps);
    return { success: true };
  }

  return {
    success: false,
    error: 'Invalid or expired OTP code. Please enter the 6-digit code or request a new one.',
  };
};

// Login user directly via verified Supabase OTP
export const loginWithSupabaseOtp = async (
  email: string,
  otp: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const verifyRes = await verifyEmailOtp(cleanEmail, otp);
  if (!verifyRes.success) {
    return { success: false, error: verifyRes.error };
  }

  // If email is super admin
  if (cleanEmail === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()) {
    const superAdminProfile: UserProfile = {
      name: 'Ankush (Super Admin)',
      email: SUPER_ADMIN_CREDENTIALS.email,
      phone: '+91 98765 43210',
      gender: 'male',
      dob: '1990-01-01',
      tob: '06:00',
      pob: 'New Delhi, India',
      isLoggedIn: true,
      freeChatUsed: false,
      isAdmin: true,
      isSuperAdmin: true,
      role: 'super_admin',
    };
    saveSessionUser(superAdminProfile);
    return { success: true, user: superAdminProfile };
  }

  // Find existing or create user
  const users = getDatabaseUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    const profile: UserProfile = {
      name: existing.name,
      email: existing.email,
      phone: existing.phone,
      gender: existing.gender,
      dob: existing.dob,
      tob: existing.tob,
      pob: existing.pob,
      isLoggedIn: true,
      freeChatUsed: existing.freeChatUsed,
      isAdmin: existing.isAdmin,
      isSuperAdmin: existing.isSuperAdmin,
      role: existing.role,
    };
    saveSessionUser(profile);
    return { success: true, user: profile };
  }

  // Create new session user
  const newProfile: UserProfile = {
    name: cleanEmail.split('@')[0],
    email: cleanEmail,
    phone: '+91 98765 43210',
    gender: 'female',
    dob: '1998-05-15',
    tob: '08:45',
    pob: 'New Delhi, India',
    isLoggedIn: true,
    freeChatUsed: false,
    isAdmin: false,
    isSuperAdmin: false,
    role: 'user',
  };
  saveSessionUser(newProfile);
  return { success: true, user: newProfile };
};


// Register a new user (STRICT: Email OTP must be verified)
export const registerUser = (details: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  tob?: string;
  pob?: string;
}): { success: boolean; user?: UserProfile; error?: string } => {
  const cleanEmail = details.email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Email address is required.' };
  }

  // STRICT ENFORCEMENT: Without email OTP verification, no one can create an account
  if (!isEmailVerified(cleanEmail)) {
    return {
      success: false,
      error: 'Email verification required: You must verify your email with the 6-digit OTP before creating an account.',
    };
  }

  // Check if account already exists
  if (isEmailAlreadyRegistered(cleanEmail)) {
    return {
      success: false,
      error: 'This email is already registered. Please sign in to your account.',
    };
  }

  // Prevent overriding super admin with random password
  if (cleanEmail === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()) {
    if (details.password !== SUPER_ADMIN_CREDENTIALS.password) {
      return { success: false, error: 'Cannot register super admin email with custom password.' };
    }
  }

  const users = getDatabaseUsers();
  const isSuper = cleanEmail === SUPER_ADMIN_CREDENTIALS.email.toLowerCase();

  const newUser: StoredUser = {
    id: `usr-${Date.now()}`,
    name: details.name.trim() || (isSuper ? 'Ankush (Super Admin)' : cleanEmail.split('@')[0]),
    email: cleanEmail,
    password: details.password?.trim() || (isSuper ? SUPER_ADMIN_CREDENTIALS.password : 'User@1234'),
    phone: details.phone?.trim() || '+91 98765 43210',
    gender: details.gender || 'female',
    dob: details.dob || '1998-05-15',
    tob: details.tob || '08:45',
    pob: details.pob || 'New Delhi, India',
    role: isSuper ? 'super_admin' : 'user',
    isSuperAdmin: isSuper,
    isAdmin: isSuper,
    freeChatUsed: false,
    registeredAt: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...users.filter((u) => u.email.toLowerCase() !== cleanEmail)];
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }

  const profile: UserProfile = {
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    gender: newUser.gender,
    dob: newUser.dob,
    tob: newUser.tob,
    pob: newUser.pob,
    isLoggedIn: true,
    freeChatUsed: false,
    isAdmin: newUser.isAdmin,
    isSuperAdmin: newUser.isSuperAdmin,
    role: newUser.role,
  };

  saveSessionUser(profile);
  return { success: true, user: profile };
};

export const saveSessionUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  } catch (e) {
    // ignore
  }
};

export const getSessionUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isLoggedIn) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

export const clearSessionUser = () => {
  try {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } catch (e) {
    // ignore
  }
};
