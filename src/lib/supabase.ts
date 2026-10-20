import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'my_astro_supabase_url';
const STORAGE_KEY_KEY = 'my_astro_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

// Get the current Supabase configuration
export const getSupabaseConfig = (): SupabaseConfig => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL?.trim() || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.trim() || '';

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY)?.trim() : '') || '';
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY)?.trim() : '') || '';

  const url = storedUrl || envUrl;
  const anonKey = storedKey || envKey;

  const isConfigured = Boolean(
    url && 
    anonKey && 
    (url.startsWith('https://') || url.startsWith('http://')) &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured };
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

// Get or initialize the Supabase client
export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (cachedClient && lastUsedUrl === config.url && lastUsedKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    lastUsedUrl = config.url;
    lastUsedKey = config.anonKey;
    return cachedClient;
  } catch (err) {
    console.warn('Supabase client initialization warning:', err);
    return null;
  }
};

// Save Supabase credentials to localStorage
export const saveSupabaseConfig = (url: string, anonKey: string): { success: boolean; error?: string } => {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (!cleanUrl || (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://'))) {
    return { success: false, error: 'Please enter a valid Supabase Project URL (e.g. https://your-id.supabase.co).' };
  }

  if (!cleanKey || cleanKey.length < 20) {
    return { success: false, error: 'Please enter a valid Supabase Anon Public Key (starts with eyJ...).' };
  }

  try {
    localStorage.setItem(STORAGE_URL_KEY, cleanUrl);
    localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
    // Reset cached client to force re-instantiation
    cachedClient = null;
    lastUsedUrl = '';
    lastUsedKey = '';
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save Supabase configuration.' };
  }
};

// Clear custom Supabase credentials
export const clearSupabaseConfig = () => {
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
    cachedClient = null;
  } catch (err) {
    // ignore
  }
};

/**
 * Send REAL 6-digit Email OTP via Supabase Auth
 * Dispatches an actual email containing the 6-digit confirmation code to the user's inbox
 */
export const sendSupabaseEmailOtp = async (
  email: string
): Promise<{ 
  success: boolean; 
  message: string; 
  error?: string; 
  needsConfig?: boolean;
  isSmtpIssue?: boolean;
}> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      success: false,
      message: '',
      error: 'Please enter a valid email address.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      needsConfig: true,
      message: '',
      error: 'Supabase project not connected. Please connect your Supabase Project URL and Anon Key to deliver real OTPs to your email.',
    };
  }

  try {
    const { data: _data, error } = await client.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.warn('Supabase signInWithOtp response warning:', error.message);

      const msg = error.message?.toLowerCase() || '';
      const isSmtpIssue = 
        msg.includes('error sending confirmation email') ||
        msg.includes('rate limit') ||
        msg.includes('email_address_not_authorized') ||
        error.name === 'AuthRetryableFetchError';

      return {
        success: false,
        isSmtpIssue,
        message: '',
        error: isSmtpIssue 
          ? 'Supabase email service limit reached (Error sending confirmation email). Supabase free tier limits built-in emails to 2-3/hr.'
          : (error.message || 'Failed to send OTP via Supabase.'),
      };
    }

    return {
      success: true,
      message: `Real verification OTP dispatched to ${cleanEmail} via Supabase! Please check your email inbox and spam folder.`,
    };
  } catch (err: any) {
    console.warn('Supabase OTP request catch warning:', err?.message || err);
    const msg = String(err?.message || '').toLowerCase();
    const isSmtpIssue = msg.includes('error sending confirmation email') || msg.includes('fetch');
    return {
      success: false,
      isSmtpIssue,
      message: '',
      error: 'Connection to Supabase mailer timed out or hit email quota.',
    };
  }
};

/**
 * Verify the 6-digit Email OTP via Supabase Auth
 */
export const verifySupabaseEmailOtp = async (
  email: string,
  token: string
): Promise<{ success: boolean; user?: any; session?: any; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim();

  if (!cleanToken || cleanToken.length < 6) {
    return { success: false, error: 'Please enter the 6-digit OTP code received in your email.' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase client is not connected. Please connect your Supabase credentials first.',
    };
  }

  try {
    const { data, error } = await client.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'email',
    });

    if (error) {
      console.warn('Supabase verifyOtp warning:', error.message);
      return {
        success: false,
        error: error.message || 'Invalid or expired OTP code. Please enter the valid code from your email.',
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (err: any) {
    console.warn('Supabase OTP verification catch warning:', err?.message || err);
    return {
      success: false,
      error: err.message || 'Verification failed. Please try again.',
    };
  }
};
