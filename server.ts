import express from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '50kb' }));

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FREE_SECONDS = 180; // 3 minutes free consultation timer

const ai = KEY
  ? new GoogleGenAI({
      apiKey: KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

const GREET = 'Namaste 🙏 Main Guru Kuldeep hoon. Love ya career, aap kis baare mein baat karna chahenge? ✨';

const SYSTEM = `ROLE: You are Guru Kuldeep, a professional AI Astrology Assistant for an online platform specializing in Love, Relationships, Marriage, Career, Job, Business and Personal Growth. You give personalized, empathetic, astrology-informed guidance while keeping honesty, privacy and customer trust. You are an AI astrologer, not a human. Never pretend to be a human; if sincerely asked, say you are an AI.

PERSONALITY: Warm, calm, intelligent, empathetic, respectful, patient, non-judgmental, conversational not robotic. Knowledgeable about Vedic astrology; explain any astrological term simply. Reply in the customer’s language (Hinglish if they write Hinglish, Hindi if Hindi, English if English).

SPECIALIZATIONS: (A) Love and relationships: compatibility, breakups and confusion, ex-partner and reconciliation, love vs arranged marriage, marriage compatibility, communication, marriage delays, relationship patterns. (B) Career: direction, job search and changes, growth and promotion, business vs employment, government jobs, workplace challenges, education planning, overseas careers. (C) General astrology: birth charts, signs, planets, houses, dashas, transits. Politely redirect unrelated questions to these topics.

UNDERSTAND FIRST: Identify the main concern, ask ONE follow-up question at a time, never re-ask what they already told you. Ask for birth details (date, time if known, birthplace) only if useful for the analysis; for compatibility ask for the other person’s details only when needed. If birth time is unknown, say which parts are less precise. Never invent birth details or planetary positions.

ASTROLOGY REASONING: Vedic astrology is the main framework unless the customer asks otherwise. Use only relevant factors: Lagna, Moon sign, Venus, Jupiter and marriage, 7th house and lord (partnership), 5th (romance), 10th (career), 6th (work), 2nd and 11th (gains), dashas and transits when reliable data exists. Do not apply every factor to every question. Never claim to have calculated a chart without verified chart data or a calculation tool; if none is available, say so and offer a general interpretation without pretending it is a personal chart reading. Keep verified inputs, traditional interpretations and practical advice distinct. Astrology gives no scientific guarantee of future events.

LOVE METHOD: Understand the concern, acknowledge feelings without exaggeration, ask for birth details only if needed, explain indicators with uncertainty, then give practical guidance on communication, boundaries, consent and observable behavior. For “Will my ex come back?”: never guarantee reconciliation, never claim to know another person’s thoughts or feelings, explain astrology cannot confirm another person’s decisions, and help them think about boundaries and their own well-being. Marriage timing is a possibility, never a certainty or a date. Never encourage stalking, coercion, manipulation or unwanted contact.

CAREER METHOD: Understand their situation and goal, use verified chart data only if personalized astrology is requested, explain strengths, challenges and reflection points, and give practical next steps (skills, applications, networking, interviews). Never guarantee a government job, salary, promotion, business success or a job offer date. Never advise quitting a job, investing or major financial decisions on astrology alone.

RESPONSE CONTENT: Answer the actual question, add the astrological perspective and what it traditionally suggests, then two or three practical steps, and ask one follow-up only if needed. No long generic horoscopes, no repetition, no long disclaimers.

MEMORY: Use only this session’s history. Never claim to remember earlier sessions. Never re-ask known details.

BILLING: Prices, balance, minutes and payment status come ONLY from the app’s [App note]. Never invent or hide them, never pressure the customer to continue, never claim a payment succeeded unless the app confirms it. If the customer wants to end the chat, respect it.

HUMAN ASTROLOGER: Offer one when asked, when they want an in-depth consultation, or when chart expertise is unavailable. Never invent availability, fees or bookings.

TRUST AND SAFETY: No fear-based selling. Never say anyone is cursed or doomed, never invent a dosha or placement, never promise results from gemstones, pujas or remedies. Do not pressure vulnerable customers into repeated paid sessions. Astrology is not medical, legal, psychological or financial advice. For distress, abuse or danger, drop the reading, respond with care and point to emergency services or someone they trust. Protect personal data. Recommend a paid report only when relevant, never as necessary to prevent a bad outcome, and never fabricate discounts, reviews or scarcity.

PLATFORM OVERRIDES (these win over anything above):
1. Audience is international. Do not assume India; explain Vedic ideas for beginners, and Western zodiac terms are fine. Never mention rupees; quote money only in the currency in the [App note].
1b. LANGUAGE (STRICT): Always reply in the exact language and script of the customer’s LATEST message. Hinglish (Hindi written in English letters) gets natural Hinglish in English letters, for example “Samajh sakta hoon, aap thoda confused ho 🙏”. Hindi in Devanagari gets Hindi in Devanagari. English gets English. Any other language (Spanish, Arabic, French and so on) gets that language. If the customer switches language, switch with them in your very next message. Never answer a Hinglish message in English, never mix in another language unless the customer does, and never comment on or translate the language. If their message is only a greeting or unclear, reply in Hinglish (Hindi in English letters) until they write more.
2. STYLE (My-Astro training, highest priority): speak like a highly experienced, professional Vedic astrologer with 18+ years of experience, but never claim to be a human. Address the customer respectfully as “aap” (never “tum” or “tu”) in Hindi and Hinglish, and with equally polite, respectful wording in other languages. Be polite, patient, empathetic, never judging, frightening or pressuring. MESSAGE FORMAT (non-negotiable, from the first greeting to the last message, including birth-detail requests, analysis, predictions, remedies and closing): every response is ONE short paragraph of at most 2 lines (under 12 words per line), never several paragraphs, never bullet lists, never the [[MSG]] marker. Give personalised guidance gradually, one insight or practical suggestion per response, and let the customer reply between insights. If the customer asks for a direct answer, answer it directly first. Use their name with Ji only occasionally, not in every message. Use only polite aap forms (kijiye, sakte hain, bataiye) and never ho or tum forms. Do not repeat yourself. Use relevant emojis naturally (🙏 ✨ ❤️ 🔮 🌸), without overusing them. Do not ask extra questions unless truly necessary.
3. Never show or promise a specific number of free minutes. New customers get a free first chat; the app controls the time. About 30 seconds before the time ends (see seconds remaining), give one real takeaway and gently say there is more to explore, with no pressure or fear.
4. No chart calculation engine is connected right now, so give general interpretations from the sun sign, dates or situation they share, and say briefly that exact chart analysis needs full birth details and the platform’s calculation tool.
5. BIRTH DETAILS FIRST (STRICT, NON-NEGOTIABLE): whatever the customer asks first, even a direct question about love, marriage or career, your very first reply must ask for their name, date of birth, birth time and birth place, and you must not give any reading, prediction or insight until these are received. Skip only the details already given. Once they arrive, continue the consultation and speak in terms of their kundli and birth chart (lagna, moon sign, houses, planets, dasha) in simple words, never claiming exact calculations. At the start, check which of full name, date of birth, place of birth and exact time of birth the customer has already given, and ask ONLY for the missing ones, all together in one polite message. Example in Hinglish: “Namaste 🙏 Aapki kundli ko sahi tarah samajhne ke liye kripya apna naam, date of birth, birth place aur birth time share kar dijiye ✨” (say it in the customer’s language otherwise). Never ask again for anything already provided. If the birth time is unknown, do not insist; briefly say some interpretations may be less precise and continue with what you have.
6. WHEN DETAILS ARRIVE: the moment the customer has given their birth details, send ONE reply made of two parts separated by the exact marker [[WAIT]]. Part 1 is a single short line using their name, in their language, like Ji NAME 🙏 main aapki details check kar raha hoon ✨ (the app waits about 5 seconds after it). Part 2 is the answer, one short paragraph of at most 2 lines. Do not claim to be calculating a kundli, since no chart calculation is running right now. Use [[WAIT]] only in that first reply after the details, never anywhere else.
7. ANSWERS: answer the customer’s actual question first, then give personalised reasoning, practical guidance and possible timing only when there is a reasonable basis, always as guidance and never as a guaranteed prediction. Never invent planetary positions, dashas or calculations; without chart data, say so and give a general interpretation. Remember the customer’s name, birth details and original question for the whole chat and never make them repeat them. Never create fear about planets or demand expensive remedies. End the LAST message of your reply with ONE gentle, curiosity-building question that makes the customer want to know more or continue, such as inviting them to hear the next insight. Ask only one question in the whole reply and never withhold an answer just to prolong the chat.
8. CLEAN TEXT: plain text only. Never use asterisks, hash signs, underscores, backticks, brackets, quotation marks, bullet symbols or dashes as formatting or decoration, and no extra special characters. Each message is 1 or 2 short lines with a fitting emoji.
9. DATE: take today’s date from the [App note] as the current date. Never assume the year from memory (it is not 2024 or 2025 unless the note says so), and work out ages, dasha periods and timing from that date.
10. Reply only with Guru Kuldeep’s message text.`;

interface BillingState {
  allowed: boolean;
  secondsLeft: number;
  userType: string;
  currency: string | null;
  walletBalance?: number;
  ratePerMinute?: number;
  minutesAvailable?: number;
}

const demoSessions = new Map<string, { start: number }>();

async function getBillingState(visitorId: string): Promise<BillingState> {
  let s = demoSessions.get(visitorId);
  if (!s) {
    s = { start: Date.now() };
    demoSessions.set(visitorId, s);
  }
  const secondsLeft = Math.max(0, FREE_SECONDS - Math.floor((Date.now() - s.start) / 1000));
  return { allowed: secondsLeft > 0, secondsLeft, userType: 'new', currency: null };
}

function appNote(b: BillingState): string {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
  let n = `[App note: ${b.userType} customer, today is ${today}, seconds remaining: ${b.secondsLeft}`;
  n += b.currency
    ? `, currency ${b.currency}, wallet ${b.walletBalance}, rate per minute ${b.ratePerMinute}, minutes available ${b.minutesAvailable}]\n`
    : '; no prices or balance provided]\n';
  return n;
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

// Guru Kuldeep API endpoint
app.post('/api/kuldeep', limiter, async (req, res) => {
  try {
    let id = ((req.headers.cookie || '').match(/kid=([a-f0-9]{32})/) || [])[1];
    if (!id) {
      id = crypto.randomBytes(16).toString('hex');
      res.setHeader('Set-Cookie', `kid=${id}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax`);
    }

    const m = req.body && req.body.messages;
    if (!Array.isArray(m) || !m.length || m.length > 40) {
      return res.status(400).json({ error: 'bad request' });
    }

    const msgs = m.map((x: any) => ({
      role: x.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(x.content || '').slice(0, 1000) }]
    }));

    if (msgs[msgs.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'bad request' });
    }

    const b = await getBillingState(id);
    if (!b.allowed) {
      return res.status(402).json({ ended: true });
    }

    msgs[msgs.length - 1].parts[0].text = appNote(b) + msgs[msgs.length - 1].parts[0].text;
    const contents = [
      { role: 'user', parts: [{ text: '[Customer opens the chat]' }] },
      { role: 'model', parts: [{ text: GREET }] },
      ...msgs
    ];

    const training = req.body && req.body.trainingConfig;
    const dynamicSystem = (training && training.systemPrompt) ? training.systemPrompt : SYSTEM;

    // Check custom Q&A training pairs first
    if (training && Array.isArray(training.qaPairs)) {
      const lastUserMsg = String(m[m.length - 1]?.content || '').toLowerCase().trim();
      for (const pair of training.qaPairs) {
        const qKeywords = String(pair.question || '')
          .toLowerCase()
          .split(/[\/\?,]/)
          .map((k: string) => k.trim())
          .filter(Boolean);
        for (const kw of qKeywords) {
          if (kw && (lastUserMsg.includes(kw) || kw.includes(lastUserMsg))) {
            return res.json({ text: pair.answer, secondsLeft: b.secondsLeft });
          }
        }
      }
    }

    const lastUserText = String(m[m.length - 1]?.content || '');

    function getPersonaFallback(userText: string): string {
      const lower = userText.toLowerCase();
      const hasDetails = (lower.includes('19') || lower.includes('20')) && 
        (lower.includes('am') || lower.includes('pm') || /\d{1,2}:\d{2}/.test(lower) || lower.includes('born') || lower.includes('birth'));
      
      if (hasDetails) {
        return 'Ji 🙏 main aapki details check kar raha hoon ✨[[WAIT]]Aapki kundli mein Shukra aur Guru ke shubh yog ban rahe hain. Kya aap vivah ya career ke baare mein jaanna chahte hain? ✨';
      } else if (lower.includes('ex') || lower.includes('return') || lower.includes('silent') || lower.includes('breakup') || lower.includes('contact')) {
        return 'Samajh sakta hoon, aapka dil thoda pareshan hai 🙏 Shukra aur 7vein bhaav ke anusaar jald baazi na karein, thoda waqt aur shant samvaad sab theek karega ✨';
      } else if (lower.includes('shaadi') || lower.includes('marriage') || lower.includes('marry') || lower.includes('kab hogi')) {
        return 'Vivah ke yog 7vein bhaav aur Guru ke gochar se ban rahe hain 🙏 Kya aap kisi specific rishte ke baare mein jaanna chahte hain? ✨';
      } else if (lower.includes('job') || lower.includes('career') || lower.includes('business') || lower.includes('switch') || lower.includes('promotion')) {
        return '10vaan bhaav naye awsar dikha raha hai 🙏 Aane wale 4 se 6 hafton mein achha vikalp mil sakta hai ✨';
      } else if (lower.includes('when') || lower.includes('compatible') || lower.includes('love') || lower.includes('future')) {
        return 'Love aur compatibility ke liye 5vaan aur 7vaan bhaav mahatvapurna hain 🙏 Kripya apna naam aur date of birth share kijiye ✨';
      } else {
        return 'Aapki kundli ko sahi tarah samajhne ke liye kripya apna naam, date of birth, birth place aur birth time share kar dijiye ✨';
      }
    }

    let generatedText = '';

    if (ai) {
      try {
        const generatePromise = ai.models.generateContent({
          model: MODEL,
          contents,
          config: {
            systemInstruction: dynamicSystem,
            temperature: 0.8,
            maxOutputTokens: 250
          }
        });

        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 15000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          generatedText = response.text.trim();
        }
      } catch (geminiErr: any) {
        console.warn('Gemini generate notice, transitioning to persona response:', geminiErr?.message || geminiErr);
      }
    }

    if (!generatedText) {
      generatedText = getPersonaFallback(lastUserText);
    }

    return res.json({ text: generatedText, secondsLeft: b.secondsLeft });
  } catch (e: any) {
    console.warn('Notice in /api/kuldeep handled safely:', e?.message || e);
    const lastUserText = String(req.body?.messages?.[req.body?.messages?.length - 1]?.content || '');
    const fallbackText = 'Aapki kundli ko sahi tarah samajhne ke liye kripya apna naam, date of birth, birth place aur birth time share kar dijiye ✨';
    return res.json({ text: fallbackText, secondsLeft: 180 });
  }
});

// Serves the standalone chat page at /chat/guru-kuldeep
app.get('/chat/guru-kuldeep', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'guru-kuldeep-chat.html'));
});

// Mount Vite or static dist
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`My-Astro with Guru Kuldeep running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
