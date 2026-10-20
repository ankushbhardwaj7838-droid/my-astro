import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  Sparkles, 
  CheckCheck,
  Wallet,
  Mic,
  MicOff,
  Play,
  Pause,
  Trash2,
  Smile,
  FileText,
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import { Expert, ConsultationMessage, UserProfile } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';
import { getChatbotTrainingConfig, generateTrainedReply } from '../lib/chatbotTrainingService';

interface ChatMessageExtended extends ConsultationMessage {
  isFormSummary?: boolean;
  isVoiceNote?: boolean;
  audioDuration?: string;
  formData?: {
    name: string;
    gender: string;
    dob: string;
    tob: string;
    pob: string;
    question?: string;
  };
}

interface ConsultationChatModalProps {
  expert: Expert;
  user?: UserProfile;
  initialQuestion?: string;
  onClose: () => void;
  walletBalance: number;
  onDeductWallet: (amount: number, description: string) => void;
  onOpenWallet: () => void;
}

export const ConsultationChatModal: React.FC<ConsultationChatModalProps> = ({
  expert,
  user,
  initialQuestion,
  onClose,
  walletBalance,
  onDeductWallet,
  onOpenWallet
}) => {
  // Free chat duration is 5 minutes (300 seconds)
  const FREE_CHAT_SECONDS = 300;
  const [secondsRemaining, setSecondsRemaining] = useState(FREE_CHAT_SECONDS);
  const [isFreePhase, setIsFreePhase] = useState(true);
  const [paidConsentGiven, setPaidConsentGiven] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playback simulation
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Alternating Hindi/English trust message (4-5s cycle)
  const [trustLangIndex, setTrustLangIndex] = useState(0); // 0 = Hindi first, then 1 = English
  const [trustFading, setTrustFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrustFading(true);
      setTimeout(() => {
        setTrustLangIndex((prev) => (prev === 0 ? 1 : 0));
        setTrustFading(false);
      }, 350);
    }, 4500); // 4-5 seconds
    return () => clearInterval(timer);
  }, []);

  const pricePerMin = expert.discountedPrice || expert.pricePerMin;

  // Initialize messages: First message is User's Form Details, followed by Astrologer's welcome
  const [messages, setMessages] = useState<ChatMessageExtended[]>(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialList: ChatMessageExtended[] = [];

    // 1. Initial User Message containing the Form Type Details
    const seekerName = user?.name || 'Seeker';
    const seekerGender = user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
    const seekerDob = user?.dob || 'Not specified';
    const seekerTob = user?.tob || 'Not specified';
    const seekerPob = user?.pob || 'Not specified';

    initialList.push({
      id: 'msg-form-summary',
      sender: 'user',
      isFormSummary: true,
      text: `📋 Birth Details Form Submitted\n• Name: ${seekerName}\n• Gender: ${seekerGender}\n• DOB: ${seekerDob}\n• Time: ${seekerTob}\n• Place: ${seekerPob}${initialQuestion ? `\n• Question: "${initialQuestion}"` : ''}`,
      formData: {
        name: seekerName,
        gender: seekerGender,
        dob: seekerDob,
        tob: seekerTob,
        pob: seekerPob,
        question: initialQuestion
      },
      timestamp: now
    });

    // 2. Astrologer Response acknowledging the form
    const isKuldeep = expert.id === 'exp-kuldeep' || expert.name.toLowerCase() === 'kuldeep';
    const welcomeText = isKuldeep
      ? (user?.name
          ? `Namaste ${user.name}! I am Kuldeep, your Vedic Astrologer & Tarot Master. I have cast your natal horoscope for ${seekerPob} and attuned my Tarot spread to your planetary energy. Whether you are seeking truth in Love & Relationships or clarity for your Career breakthrough, I am here to guide you with complete honesty. What question is closest to your heart right now?`
          : `Namaste! I am Kuldeep, your Vedic Astrologer & Tarot Master. I have received your coordinates and am attuned to your planetary transits and tarot cards. Please ask what you need guidance on today.`)
      : (user?.name
          ? `Namaste ${user.name}! I am ${expert.name}. I have received your birth details and cast your natal horoscope for ${seekerPob}. I am tuned into your planetary chart. Please share what you would like guidance on today.`
          : `Namaste! I am ${expert.name}. I have received your coordinates and am reviewing your charts. Please share your questions.`);

    initialList.push({
      id: 'msg-expert-welcome',
      sender: 'expert',
      text: welcomeText,
      timestamp: now
    });

    return initialList;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isRecording]);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSessionEnded(true);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Timer: Countdown during free phase, count up/deduct during paid phase
  useEffect(() => {
    if (sessionEnded) return;

    const timer = setInterval(() => {
      if (isFreePhase) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsFreePhase(false);
            setMessages((m) => [
              ...m,
              {
                id: Date.now().toString(),
                sender: 'system',
                text: `Your complimentary first chat session has ended. To continue chatting with ${expert.name} at ₹${pricePerMin}/min, please confirm below.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            return 0;
          }
          return prev - 1;
        });
      } else if (paidConsentGiven) {
        // In paid phase: deduct wallet every 60 seconds
        setSecondsRemaining((prev) => {
          const next = prev + 1;
          if (next > 0 && next % 60 === 0) {
            if (walletBalance >= pricePerMin) {
              onDeductWallet(pricePerMin, `Consultation with ${expert.name} (1 min)`);
            } else {
              setSessionEnded(true);
              setMessages((m) => [
                ...m,
                {
                  id: Date.now().toString(),
                  sender: 'system',
                  text: 'Your wallet balance has run low. Please recharge to continue your consultation.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionEnded, isFreePhase, paidConsentGiven, walletBalance, pricePerMin, expert.name, onDeductWallet]);

  // Voice Note Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Send regular text message
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sessionEnded || !user?.isLoggedIn) return;

    const userMsg: ChatMessageExtended = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = '';
      const lower = text.toLowerCase();
      const seekerName = user?.name ? user.name.split(' ')[0] : 'dear seeker';
      const isKuldeep = expert.id === 'exp-kuldeep' || expert.name.toLowerCase() === 'kuldeep';

      if (isKuldeep) {
        const trained = generateTrainedReply(text, user?.name);
        if (trained.matchedQA) {
          reply = trained.text;
        } else if (
          lower.includes('ex') ||
          lower.includes('return') ||
          lower.includes('contact') ||
          lower.includes('silent') ||
          lower.includes('breakup') ||
          lower.includes('block') ||
          lower.includes('miss')
        ) {
          reply = `${user?.name ? `${seekerName}, ` : ''}looking into your 5th house (emotional romance) and 7th house (karmic relationships), I also pulled Tarot's "The Lovers" alongside "Two of Cups" in your spread. The silence you are currently navigating is not due to indifference, but emotional hesitation and unspoken pride.

Astrologically, the upcoming transit of Mercury and Venus over the next 21 to 28 days will soften these defensive walls, creating a genuine opening for reconciliation.
✨ Astrological Remedy: Refrain from impulsive messaging during evening Rahu Kaal. Light a ghee diya on Friday evening and focus on emotional self-worth. Have you noticed them checking your socials or subtle signals recently?`;
        } else if (
          lower.includes('job') ||
          lower.includes('career') ||
          lower.includes('switch') ||
          lower.includes('promotion') ||
          lower.includes('business') ||
          lower.includes('salary') ||
          lower.includes('money') ||
          lower.includes('work')
        ) {
          reply = `${user?.name ? `${seekerName}, ` : ''}examining your 10th House (Karma Bhava) and upcoming planetary Dasha, supported by Tarot's "The Wheel of Fortune" and "The Sun": you are on the cusp of an uplifting career breakthrough.

The planetary Gochar indicates high-impact professional recognition and favorable interview calls opening up within 4 to 6 weeks. Any current delay or stagnation is merely the universe re-aligning you for a superior role with financial advancement.
✨ Astrological Remedy: Offer Arghya (water) to Surya Dev in a copper vessel on Sunday mornings with a pinch of turmeric. Would you like me to analyze whether a job switch or internal promotion is more auspicious for you?`;
        } else if (
          lower.includes('love') ||
          lower.includes('partner') ||
          lower.includes('marriage') ||
          lower.includes('feelings') ||
          lower.includes('compatibility') ||
          lower.includes('marry') ||
          lower.includes('true love')
        ) {
          reply = `${user?.name ? `${seekerName}, ` : ''}analyzing your 7th house lord, Venus's placement, and the "Four of Wands" Tarot card: there is a powerful spiritual and emotional foundation here. While differing communication styles and external expectations have triggered momentary doubts, your planetary synastry indicates deep long-term compatibility.

A phase of mutual vulnerability and heart-to-heart conversation will restore confidence around next month.
✨ Astrological Remedy: Keep a rose quartz crystal or wear clean white clothing on Fridays to invoke Venusian harmony. Are you contemplating marriage timing, or addressing a specific misunderstanding?`;
        } else if (
          lower.includes('future') ||
          lower.includes('life') ||
          lower.includes('destiny') ||
          lower.includes('worry') ||
          lower.includes('anxious') ||
          lower.includes('when') ||
          lower.includes('remedy')
        ) {
          reply = `${user?.name ? `${seekerName}, ` : ''}in your birth chart, your Moon (Chandra) position reveals a sensitive mind burdened by overthinking, yet your Lagna lord is well-supported. The Tarot reveals "The Star", signifying that peace and renewed direction are entering your aura.

The planetary transits over the next 30 to 45 days are dispersing past stagnation.
✨ Daily Practice: Meditate for 5 minutes each evening while breathing deeply, and chant "Om Namah Shivaya" 9 times. What specific area—Love, Relationship, or Career—feels most urgent for you right now?`;
        } else {
          reply = `Namaste ${seekerName}! As your Vedic Astrologer & Tarot Master, I am tuned into your planetary coordinates. The cards and your natal chart indicate that you are standing at an important fork in the road where clarity will unlock your highest destiny.

Whether you need deep guidance on Love, Relationship healing, or Career acceleration, please share the specifics of your situation so I can cast precise charts for you.`;
        }
      } else {
        // Realistic responses based on Love or Career keywords for other astrologers
        if (lower.includes('ex') || lower.includes('return') || lower.includes('contact') || lower.includes('silent') || lower.includes('breakup')) {
          reply = `I am analyzing your 5th and 7th houses along with Venus transits. The silence you are experiencing is rooted in past misunderstandings and emotional exhaustion rather than lack of feeling. The astrological window around next month shows transit of Mercury and Jupiter easing communication blocks. Step into your self-worth and avoid anxious spamming.`;
        } else if (lower.includes('job') || lower.includes('career') || lower.includes('switch') || lower.includes('promotion') || lower.includes('business')) {
          reply = `Examining your 10th House (Karma) and current Dasha: you are entering a favorable planetary cycle for strategic advancement. If you are planning a job switch, the upcoming planetary transit indicates significant interviews and offers. Focus on upgrading your skillset and applying with confidence.`;
        } else if (lower.includes('love') || lower.includes('partner') || lower.includes('marriage') || lower.includes('feelings')) {
          reply = `Looking at your planetary synastry, the emotional connection has deep karmic potential. However, differing communication styles are causing hesitation. Transparent dialogue without assumptions will resolve this tension within the coming weeks.`;
        } else {
          reply = `Thank you for sharing. Looking closely at your natal Lagna and the current planetary Gochar (transit), your Moon position indicates mental restlessness, but favorable planetary combinations are forming to bring clarity. What specific aspect would you like me to examine deeper?`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'expert',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1400);
  };

  // Start or Stop Voice Note Recording
  const handleToggleVoiceRecording = () => {
    if (sessionEnded) return;
    if (!isRecording) {
      setIsRecording(true);
    } else {
      handleSendVoiceNote();
    }
  };

  const handleCancelVoiceRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleSendVoiceNote = () => {
    const durationSec = Math.max(1, recordingSeconds);
    const formattedDuration = `0:${String(durationSec).padStart(2, '0')}`;
    setIsRecording(false);
    setRecordingSeconds(0);

    const voiceMsg: ChatMessageExtended = {
      id: Date.now().toString(),
      sender: 'user',
      isVoiceNote: true,
      audioDuration: formattedDuration,
      text: `🎤 Voice Note (${formattedDuration})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, voiceMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const isKuldeep = expert.id === 'exp-kuldeep' || expert.name.toLowerCase() === 'kuldeep';
      const voiceReply = isKuldeep
        ? `Namaste ${user?.name ? user.name.split(' ')[0] : 'seeker'}. I have listened closely to your voice note. The resonance in your voice reflects genuine concern and emotional fatigue around this choice. Astrologically, your 7th and 10th house alignments alongside "The Star" tarot card confirm that the mist of uncertainty will clear within the next 3 to 5 weeks. A positive turning point is on its way. Maintain your inner calm and trust divine timing.`
        : `I have listened to your voice message carefully. Your vocal vibration conveys deep contemplation regarding this situation. Astrologically, your 7th and 10th house alignments show that an unexpected positive turning point will occur within the next 4 to 6 weeks. Stay centered and trust the timing.`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'expert',
          text: voiceReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1800);
  };

  const togglePlayAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 5000);
    }
  };

  const freeMinutes = Math.floor(secondsRemaining / 60);
  const freeSeconds = secondsRemaining % 60;
  const timerFormatted = `${String(freeMinutes).padStart(2, '0')}:${String(freeSeconds).padStart(2, '0')}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSessionEnded(true);
          onClose();
        }
      }}
    >
      <div className="bg-[#EFEAE2] w-full max-w-2xl h-[100dvh] sm:h-[88vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col border border-amber-200/60 overflow-hidden">
        
        {/* Top Consultation Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-xs shrink-0 gap-2">
          {/* Left: Astrologer Avatar & Name properly aligned */}
          <div className="flex items-center gap-2.5 min-w-0">
            <AstrologerAvatar expert={expert} size="sm" className="border border-white/70 shadow-xs" />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm md:text-base text-white truncate leading-none">
                  {expert.name}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online"></span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-amber-100/90 truncate leading-none mt-1 font-medium">
                Online • Active Session
              </span>
            </div>
          </div>

          {/* Right: Small Time Section (No "Free" line), Wallet, and Close Button properly aligned */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Time Section with Clock icon & countdown (slightly larger, bolder) */}
            <div className="bg-black/35 backdrop-blur-xs px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-white/30 flex items-center gap-1.5 text-xs sm:text-sm font-mono font-extrabold text-white shadow-xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 stroke-[2.5] shrink-0" />
              <span className="tracking-wide">{timerFormatted}</span>
            </div>

            {/* Wallet Quick Button (icon only, slightly larger, bolder) */}
            <button
              onClick={onOpenWallet}
              title={`Wallet Balance: ₹${walletBalance} - Click to Recharge`}
              aria-label="Wallet"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/25 hover:bg-black/40 text-amber-100 flex items-center justify-center transition-colors cursor-pointer border border-white/30 shrink-0"
            >
              <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200 stroke-[2.25] shrink-0" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                setSessionEnded(true);
                onClose();
              }}
              aria-label="Close consultation chat"
              title="Close chat"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Alternating Hindi/English Trust Banner (4.5s smooth transition, content only, no labels) */}
        <div className="bg-[#FFFDF7] border-b border-amber-200/80 px-3 py-1.5 sm:py-2 text-center shrink-0 shadow-2xs overflow-hidden">
          <div 
            className={`transition-all duration-350 ease-out transform ${
              trustFading ? 'opacity-0 -translate-y-1 scale-98' : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            {trustLangIndex === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  पहले जुड़ें, फिर फैसला करें।
                </span>
                <span className="text-[11px] sm:text-xs text-amber-800 font-medium leading-tight mt-0.5">
                  पहले बात करें, अच्छा लगे तो आगे बढ़ें।
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                  Connect First. Decide Later.
                </span>
                <span className="text-[11px] sm:text-xs text-amber-800 font-medium leading-tight mt-0.5">
                  Chat first. Continue if you love the experience.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages Body in WhatsApp Chat Format */}
        <div 
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#EFEAE2] relative scroll-smooth"
          style={{
            backgroundImage: `radial-gradient(#d5cebe 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        >
          {/* Centered WhatsApp Date Badge */}
          <div className="flex justify-center my-1 select-none">
            <span className="bg-white/90 backdrop-blur-xs shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-[11px] font-semibold text-[#54656F] uppercase tracking-wider px-3 py-1 rounded-lg">
              Today
            </span>
          </div>

          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block bg-[#FFEECD] text-[#54656F] text-[11px] px-3.5 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] max-w-md font-medium">
                    🔒 {msg.text}
                  </span>
                </div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                {/* 1. Form Type Details Message from User */}
                {msg.isFormSummary && msg.formData ? (
                  <div className="max-w-[88%] sm:max-w-[75%] bg-[#D9FDD3] text-[#111B21] rounded-2xl rounded-tr-2xs p-3.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] border border-[#bceac0]/50 space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#a7d9ab]/60">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#0F5132]">
                        <FileText className="w-4 h-4 text-[#00A884]" />
                        <span>Birth Details Form</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#00A884] bg-white/70 px-2 py-0.5 rounded-md">
                        ✓ Submitted
                      </span>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/60 p-2 rounded-xl">
                        <span className="text-[10px] text-[#667781] block">Name:</span>
                        <strong className="text-[#111B21]">{msg.formData.name}</strong>
                      </div>
                      <div className="bg-white/60 p-2 rounded-xl">
                        <span className="text-[10px] text-[#667781] block">Gender:</span>
                        <strong className="text-[#111B21]">{msg.formData.gender}</strong>
                      </div>
                      <div className="bg-white/60 p-2 rounded-xl">
                        <span className="text-[10px] text-[#667781] block">Date of Birth:</span>
                        <strong className="text-[#111B21]">{msg.formData.dob}</strong>
                      </div>
                      <div className="bg-white/60 p-2 rounded-xl">
                        <span className="text-[10px] text-[#667781] block">Time of Birth:</span>
                        <strong className="text-[#111B21]">{msg.formData.tob}</strong>
                      </div>
                      <div className="col-span-2 bg-white/60 p-2 rounded-xl">
                        <span className="text-[10px] text-[#667781] block">Birth Place:</span>
                        <strong className="text-[#111B21]">{msg.formData.pob}</strong>
                      </div>
                      {msg.formData.question && (
                        <div className="col-span-2 bg-emerald-100/70 p-2 rounded-xl border border-emerald-200">
                          <span className="text-[10px] text-emerald-800 font-bold block">Primary Concern:</span>
                          <span className="text-xs text-emerald-950 font-medium italic">&ldquo;{msg.formData.question}&rdquo;</span>
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Double Blue Ticks */}
                    <div className="text-[10px] flex items-center justify-end gap-1 text-[#667781] pt-0.5">
                      <span>{msg.timestamp}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                ) : msg.isVoiceNote ? (
                  /* 2. Voice Note Audio Message */
                  <div className="max-w-[85%] sm:max-w-[70%] bg-[#D9FDD3] text-[#111B21] rounded-2xl rounded-tr-2xs p-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] border border-[#bceac0]/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlayAudio(msg.id)}
                        className="w-10 h-10 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        )}
                      </button>

                      {/* Animated Soundwave Visualization */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1 h-6">
                          {[30, 60, 40, 85, 100, 70, 45, 90, 60, 40, 80, 50, 65, 30].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-colors ${
                                playingAudioId === msg.id
                                  ? 'bg-[#00A884] animate-pulse'
                                  : 'bg-[#8696A0]'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#667781]">
                          <span>{msg.audioDuration || '0:05'}</span>
                          <span className="flex items-center gap-0.5">
                            <Mic className="w-3 h-3 text-[#00A884]" /> Voice note
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] flex items-center justify-end gap-1 text-[#667781] mt-1.5">
                      <span>{msg.timestamp}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                ) : (
                  /* 3. Standard WhatsApp Bubble (User: Green, Expert: White) */
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                      isUser
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-2xl rounded-tr-2xs border border-[#bceac0]/40'
                        : 'bg-white text-[#111B21] rounded-2xl rounded-tl-2xs border border-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 text-[#667781]`}
                    >
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* WhatsApp Typing Bubble */}
          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl rounded-tl-2xs bg-white border border-white w-20 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
              <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Paid Continuation Consent Banner if Free Minutes Expired */}
        {!isFreePhase && !paidConsentGiven && (
          <div className="bg-[#FFF4E5] p-3.5 border-t border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 animate-in slide-in-from-bottom">
            <div className="text-xs text-amber-950 font-medium">
              <strong>Free 5-Minute Session Complete.</strong> Continue consultation with {expert.name} at ₹{pricePerMin}/min from wallet?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSessionEnded(true);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-amber-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                End Chat
              </button>
              <button
                onClick={() => setPaidConsentGiven(true)}
                className="px-4 py-1.5 text-xs font-bold bg-[#00A884] text-white rounded-lg hover:bg-[#008f6f] shadow-xs cursor-pointer"
              >
                Yes, Continue (₹{pricePerMin}/min)
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp-Style Bottom Bar with Voice Note & Send Option */}
        <div className="p-2 sm:p-2.5 bg-[#F0F2F5] border-t border-[#E9EDEF] flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Active Voice Recording Bar */}
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between bg-white rounded-full px-4 py-2 border border-rose-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="text-xs font-bold text-rose-600 font-mono">
                  Recording Voice Note 0:{String(recordingSeconds).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelVoiceRecording}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-full cursor-pointer transition-colors"
                  title="Cancel Recording"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSendVoiceNote}
                  className="bg-[#00A884] hover:bg-[#008f6f] text-white text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors"
                >
                  Send Audio
                </button>
              </div>
            </div>
          ) : (
            /* Regular Message Text Input */
            <div className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 border border-transparent focus-within:border-[#00A884] shadow-2xs">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={sessionEnded ? 'Session ended.' : 'Type a message...'}
                disabled={sessionEnded}
                className="w-full text-xs sm:text-sm text-[#111B21] placeholder:text-[#8696A0] focus:outline-none bg-transparent"
              />
            </div>
          )}

          {/* Voice Note Button (Positioned at the side of Send Icon) */}
          <button
            type="button"
            onClick={handleToggleVoiceRecording}
            disabled={sessionEnded}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-white hover:bg-emerald-50 text-[#00A884] border border-[#E9EDEF]'
            }`}
            title={isRecording ? "Stop & Send Voice Note" : "Hold or Click to Record Voice Note"}
            aria-label="Voice note"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Message Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={sessionEnded || (!inputMessage.trim() && !isRecording)}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-[#00A884] hover:bg-[#008f6f] disabled:bg-[#8696A0]/40 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
            title="Send Message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5 text-white" />
          </button>

        </div>

      </div>
    </div>
  );
};
