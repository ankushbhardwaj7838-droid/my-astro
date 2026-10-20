export interface QAPair {
  id: string;
  question: string;
  answer: string;
  category?: 'love' | 'career' | 'marriage' | 'remedy' | 'general';
}

export interface ChatbotTrainingConfig {
  personaName: string;
  languageMode: 'hinglish' | 'hindi' | 'english' | 'auto';
  languageInstruction: string;
  politeness: 'high_respect_aap' | 'friendly' | 'traditional';
  responseLength: 'short' | 'medium' | 'detailed';
  welcomeMessage: string;
  systemPrompt: string;
  remedyTone: 'simple_home_remedies' | 'spiritual_mantras' | 'practical_advice';
  qaPairs: QAPair[];
  lastUpdated: string;
}

export const DEFAULT_TRAINING_CONFIG: ChatbotTrainingConfig = {
  personaName: 'Kuldeep',
  languageMode: 'hinglish',
  languageInstruction: `1. Always reply in natural, respectful Hinglish (Hindi written in English letters) or match the seeker's language.
2. Address the seeker respectfully as "aap" (never "tum" or "tu"). Use polite forms like "bataiye", "kijiye", "samajh sakta hoon".
3. Use Vedic astrology terms simply (kundli, 7th house/bhaav, Shukra, Guru, Shani, dasha, gochar).
4. Keep every message short: 1 or 2 lines maximum (under 25 words).
5. Never create fear, panic, or push for expensive rituals. Recommend simple positive daily remedies.
6. Use warm, natural emojis: 🙏 ✨ ❤️ 🔮 🌸.`,
  politeness: 'high_respect_aap',
  responseLength: 'short',
  welcomeMessage: 'Namaste 🙏 Main Kuldeep hoon. Love ya career, aap kis baare mein baat karna chahenge? ✨',
  systemPrompt: `ROLE: You are Kuldeep, an AI Vedic Astrologer & Tarot Master.
PERSONALITY: Warm, empathetic, respectful, insightful, trustworthy, calm.
LANGUAGE: Natural Hinglish (Hindi in English letters), or exact match to seeker language.
RESPONSE LENGTH: Strictly 1 or 2 short lines (under 25 words).
KEY KNOWLEDGE:
- Love & Marriage: 5th house (romance), 7th house (marriage), Venus (Shukra), Jupiter (Guru).
- Career & Job: 10th house (career), 6th house (daily job), Saturn (Shani), Sun (Surya).
- Guidance: Honest, grounded, giving hope and clarity without false promises.`,
  remedyTone: 'simple_home_remedies',
  qaPairs: [
    {
      id: 'qa-1',
      question: 'Will my ex come back? / Ex wapas aayega?',
      answer: 'Samajh sakta hoon, aapka dil pareshan hai 🙏 7vein bhaav aur Shukra ke gochar ke mutabik jald baazi na karein, thoda shant samvaad sab theek karega ✨',
      category: 'love'
    },
    {
      id: 'qa-2',
      question: 'Meri shaadi kab hogi? / When will I get married?',
      answer: 'Vivah ke yog 7vein bhaav aur Guru ke gochar se ban rahe hain 🙏 Agle 6-9 mahino mein achhe rishte ka prabal yog hai ✨',
      category: 'marriage'
    },
    {
      id: 'qa-3',
      question: 'Should I change my job? / Job switch karna chahiye?',
      answer: '10vaan bhaav naye awsar dikha raha hai 🙏 Aane wale 4 se 6 hafton mein achha vikalp mil sakta hai, interview ki taiyari shuru kijiye ✨',
      category: 'career'
    },
    {
      id: 'qa-4',
      question: 'Are we compatible? / Kya hamari kundli match karti hai?',
      answer: 'Compatibility ke liye Chandrama aur 7th house ki sthiti dekhi jaati hai 🙏 Kripya dono ki date of birth aur birth place share karein ✨',
      category: 'love'
    },
    {
      id: 'qa-5',
      question: 'Promotion kab milega? / When will I get a promotion?',
      answer: '10vein aur 11vein bhaav mein Surya aur Brihaspati ki drishti se 2-3 mahine mein aapke kaam ki recognition milne ke yog hain 🙏',
      category: 'career'
    },
    {
      id: 'qa-6',
      question: 'Breakup se kaise nikle? / How to heal from heartbreak?',
      answer: 'Karmic cycle poori hone par dukh hona swabhavik hai 🙏 Har subah Surya ko jal dein aur khud ko thoda waqt dein, nayi shuruaat karein ✨',
      category: 'remedy'
    }
  ],
  lastUpdated: new Date().toISOString()
};

const STORAGE_KEY = 'myastro_chatbot_training';

export function getChatbotTrainingConfig(): ChatbotTrainingConfig {
  if (typeof window === 'undefined') return DEFAULT_TRAINING_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TRAINING_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TRAINING_CONFIG,
      ...parsed,
      qaPairs: Array.isArray(parsed.qaPairs) && parsed.qaPairs.length > 0 ? parsed.qaPairs : DEFAULT_TRAINING_CONFIG.qaPairs
    };
  } catch (e) {
    console.warn('Error reading chatbot training config from localStorage:', e);
    return DEFAULT_TRAINING_CONFIG;
  }
}

export function saveChatbotTrainingConfig(config: ChatbotTrainingConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...config,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('myastro_chatbot_training_updated', { detail: payload }));
  } catch (e) {
    console.error('Error saving chatbot training config to localStorage:', e);
  }
}

export function resetChatbotTrainingConfig(): ChatbotTrainingConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('myastro_chatbot_training_updated', { detail: DEFAULT_TRAINING_CONFIG }));
  }
  return DEFAULT_TRAINING_CONFIG;
}

/**
 * Intelligent client-side reply generator honoring the trained language,
 * persona, custom Q&A pairs, and tone rules.
 */
export function generateTrainedReply(
  inputText: string,
  userName?: string,
  config?: ChatbotTrainingConfig
): { text: string; matchedQA?: boolean } {
  const cfg = config || getChatbotTrainingConfig();
  const lower = inputText.toLowerCase().trim();
  const seeker = userName ? userName.split(' ')[0] : 'Ji';

  // 1. Check Custom Q&A pairs first
  for (const pair of cfg.qaPairs) {
    const qKeywords = pair.question
      .toLowerCase()
      .split(/[\/\?,]/)
      .map((k) => k.trim())
      .filter(Boolean);

    for (const kw of qKeywords) {
      if (kw && (lower.includes(kw) || kw.includes(lower))) {
        let answer = pair.answer;
        if (cfg.languageMode === 'hindi' && !answer.includes('नमस्ते')) {
          // If pure Hindi is configured, prepend respectful greeting
          answer = answer.replace(/namaste/i, 'नमस्ते');
        } else if (cfg.languageMode === 'english') {
          // If English mode
          if (pair.category === 'love') {
            answer = `I understand your heart is feeling heavy, ${seeker} 🙏 Venus and the 7th house suggest patience and honest communication will bring clarity ✨`;
          } else if (pair.category === 'career') {
            answer = `The 10th house indicates favorable timing for career growth in the coming weeks, ${seeker} 🙏 Prepare confidently for new openings ✨`;
          } else if (pair.category === 'marriage') {
            answer = `Marriage prospects look promising with Jupiter's upcoming transit over your 7th house 🙏 Stay open to conversations ✨`;
          }
        }
        return { text: answer, matchedQA: true };
      }
    }
  }

  // 2. Keyword-based matching honoring Language Mode
  if (cfg.languageMode === 'english') {
    if (lower.includes('ex') || lower.includes('return') || lower.includes('breakup') || lower.includes('silent')) {
      return {
        text: `I understand your situation, ${seeker} 🙏 Venus and your 7th house indicate that giving some quiet time and honest communication will bring positive clarity ✨`
      };
    }
    if (lower.includes('marry') || lower.includes('marriage') || lower.includes('shaadi') || lower.includes('wedding')) {
      return {
        text: `Promising marriage timing is forming through Jupiter's beneficial transit over your partnership sector 🙏 Are you enquiring about someone specific? ✨`
      };
    }
    if (lower.includes('job') || lower.includes('career') || lower.includes('switch') || lower.includes('promotion') || lower.includes('business')) {
      return {
        text: `The 10th house shows strong potential for professional advancement within the next 4 to 6 weeks 🙏 A great opportunity is aligning ✨`
      };
    }
    return {
      text: `Namaste ${seeker} 🙏 To provide you with accurate astrological insights, kindly share your date, approximate time, and place of birth ✨`
    };
  }

  if (cfg.languageMode === 'hindi') {
    if (lower.includes('ex') || lower.includes('return') || lower.includes('breakup') || lower.includes('silent') || lower.includes('wapas')) {
      return {
        text: `मैं समझ सकता हूँ, आपका मन थोड़ा परेशान है 🙏 शुक्र और 7वें भाव के अनुसार जल्दबाजी न करें, शांत संवाद से सब ठीक होगा ✨`
      };
    }
    if (lower.includes('shaadi') || lower.includes('marriage') || lower.includes('marry') || lower.includes('vivah')) {
      return {
        text: `विवाह के शुभ योग 7वें भाव और देवगुरु बृहस्पति के गोचर से बन रहे हैं 🙏 क्या आप किसी विशेष रिश्ते के बारे में जानना चाहते हैं? ✨`
      };
    }
    if (lower.includes('job') || lower.includes('career') || lower.includes('switch') || lower.includes('promotion') || lower.includes('naukri')) {
      return {
        text: `10वां भाव नए अवसर दिखा रहा है 🙏 आने वाले 4 से 6 हफ्तों में अच्छे अवसर मिलने के प्रबल योग हैं ✨`
      };
    }
    return {
      text: `नमस्ते ${seeker} 🙏 आपकी कुंडली का सटीक विश्लेषण करने के लिए कृपया अपनी जन्म तिथि, समय और स्थान साझा करें ✨`
    };
  }

  // Default: Hinglish Mode (Respectful 'Aap' style)
  if (lower.includes('ex') || lower.includes('return') || lower.includes('breakup') || lower.includes('silent') || lower.includes('wapas')) {
    return {
      text: `Samajh sakta hoon, aapka dil thoda pareshan hai ${seeker} 🙏 Shukra aur 7vein bhaav ke anusaar jald baazi na karein, thoda shant samvaad sab theek karega ✨`
    };
  }
  if (lower.includes('shaadi') || lower.includes('marriage') || lower.includes('marry') || lower.includes('kab hogi') || lower.includes('vivah')) {
    return {
      text: `Vivah ke yog 7vein bhaav aur Guru ke gochar se ban rahe hain 🙏 Kya aap kisi specific rishte ke baare mein jaanna chahte hain? ✨`
    };
  }
  if (lower.includes('job') || lower.includes('career') || lower.includes('switch') || lower.includes('promotion') || lower.includes('salary') || lower.includes('business')) {
    return {
      text: `10vaan bhaav naye awsar dikha raha hai 🙏 Aane wale 4 se 6 hafton mein achha vikalp mil sakta hai, koshish jaari rakhein ✨`
    };
  }
  if (lower.includes('when') || lower.includes('compatible') || lower.includes('love') || lower.includes('pyar')) {
    return {
      text: `Love aur compatibility ke liye 5vaan aur 7vaan bhaav mahatvapurna hain 🙏 Kripya apna naam aur date of birth share kijiye ✨`
    };
  }

  return {
    text: `Aapki kundli ko sahi tarah samajhne ke liye kripya apna naam, date of birth, birth place aur birth time share kar dijiye ✨`
  };
}
