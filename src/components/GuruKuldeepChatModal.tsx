import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Clock, Wallet, CheckCheck } from 'lucide-react';
import { Expert, UserProfile } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';
import { 
  getChatbotTrainingConfig, 
  generateTrainedReply, 
  ChatbotTrainingConfig 
} from '../lib/chatbotTrainingService';

interface GuruKuldeepChatModalProps {
  expert: Expert;
  user?: UserProfile;
  initialQuestion?: string;
  onClose: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
}

interface MessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStageOne?: boolean;
  timestamp?: string;
}

export const GuruKuldeepChatModal: React.FC<GuruKuldeepChatModalProps> = ({
  expert,
  user,
  initialQuestion,
  onClose,
  walletBalance,
  onOpenWallet
}) => {
  const [trainingConfig, setTrainingConfig] = useState<ChatbotTrainingConfig>(() => getChatbotTrainingConfig());
  const GREET = trainingConfig.welcomeMessage || 'Namaste 🙏 Main Guru Kuldeep hoon. Love ya career, aap kis baare mein baat karna chahenge? ✨';
  const SUGGESTION_CHIPS = [
    'Will my ex come back?',
    'Meri shaadi kab hogi?',
    'When will I get married?',
    'Should I change my job?',
    'Are we compatible?'
  ];

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState<MessageItem[]>([
    { id: 'msg-greet', role: 'assistant', content: GREET, timestamp: nowTime }
  ]);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [showChips, setShowChips] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [typingText, setTypingText] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if custom uploaded avatar exists for Kuldeep
  const getKuldeepAvatarUrl = () => {
    try {
      const stored = localStorage.getItem('myastro_experts_data');
      if (stored) {
        const list = JSON.parse(stored);
        const k = list.find((e: any) => e.id === 'exp-kuldeep');
        if (k?.avatarUrl) return k.avatarUrl;
      }
    } catch (_) {}
    return null;
  };
  const kuldeepPhoto = getKuldeepAvatarUrl();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText, isOver]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Timer countdown
  useEffect(() => {
    if (!timerStarted || isOver) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted, isOver]);

  const formatTimer = (s: number) => {
    const m = Math.floor(Math.max(s, 0) / 60);
    const sec = Math.max(s, 0) % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  // Clean message text according to user specification
  const cleanText = (s: string) => {
    return s
      .replace(/\[\[WAIT\]\]/g, '')
      .replace(/[*#_`\[\]"“”]/g, '')
      .replace(/^\s*[-•]\s+/gm, '')
      .replace(/\s[-–—]\s/g, ', ')
      .replace(/\s*\n\s*/g, ' ')
      .trim();
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isBusy || isOver) return;

    setShowChips(false);
    setInputText('');
    if (!timerStarted) setTimerStarted(true);

    const userMsgId = Date.now().toString();
    const currentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text, timestamp: currentTimestamp }]);

    const newHistory = [...history, { role: 'user' as const, content: text }];
    setHistory(newHistory);

    setIsBusy(true);
    setTypingText('typing');

    const t0 = Date.now();
    const waitDelay = 4000 + Math.random() * 2500;

    try {
      const currentTraining = getChatbotTrainingConfig();
      const res = await fetch('/api/kuldeep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ 
          messages: newHistory,
          trainingConfig: currentTraining
        })
      });

      if (res.status === 402) {
        setTypingText(null);
        setIsBusy(false);
        setIsOver(true);
        setSecondsLeft(0);
        return;
      }

      let rawText = '';
      if (res.ok) {
        try {
          const data = await res.json();
          if (typeof data.secondsLeft === 'number') {
            setSecondsLeft(Math.max(0, data.secondsLeft));
          }
          rawText = data.text || '';
        } catch (_) {
          rawText = '';
        }
      }

      if (!rawText) {
        const trainedResult = generateTrainedReply(text, user?.name, currentTraining);
        rawText = trainedResult.text;
      }

      const parts = rawText.split('[[WAIT]]');
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (parts.length > 1) {
        // Stage 1: Short immediate line (acknowledging details)
        const part1 = cleanText(parts[0]);
        const part2 = cleanText(parts.slice(1).join(' ').replace(/\[\[MSG\]\]/g, ' '));

        setTypingText(null);
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: part1, isStageOne: true, timestamp: replyTime }
        ]);

        // Stage 2: wait about 4 seconds with typing indicator
        setTypingText('typing');
        await new Promise((resolve) => setTimeout(resolve, 4200));
        setTypingText(null);

        const stage2Time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 2).toString(), role: 'assistant', content: part2, timestamp: stage2Time }
        ]);

        setHistory([...newHistory, { role: 'assistant', content: `${part1}\n\n${part2}` }]);
      } else {
        const cleanMsg = cleanText(rawText.replace(/\[\[MSG\]\]/g, ' '));
        const elapsed = Date.now() - t0;
        const remainingDelay = Math.max(0, waitDelay - elapsed);
        if (remainingDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }

        setTypingText(null);
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: cleanMsg || '🙏', timestamp: replyTime }
        ]);

        setHistory([...newHistory, { role: 'assistant', content: cleanMsg }]);
      }
    } catch (err) {
      console.warn('Kuldeep chat error, using client fallback:', err);
      // Seamless intelligent client fallback
      const elapsed = Date.now() - t0;
      if (elapsed < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
      }
      setTypingText(null);

      const currentTraining = getChatbotTrainingConfig();
      const trainedFallback = generateTrainedReply(text, user?.name, currentTraining);
      const fallback = trainedFallback.text;
      const fallbackTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: fallback, timestamp: fallbackTime }
      ]);
      setHistory([...newHistory, { role: 'assistant', content: fallback }]);
    } finally {
      setIsBusy(false);
      setTypingText(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Auto-send initial question if passed from intake or questions
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      handleSend(initialQuestion.trim());
    }
  }, []);

  // Expert with uploaded photo merged
  const expertWithPhoto = React.useMemo(() => {
    return {
      ...expert,
      avatarUrl: kuldeepPhoto || expert.avatarUrl
    };
  }, [expert, kuldeepPhoto]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#EFEAE2] w-full max-w-2xl h-[100dvh] sm:h-[88vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col border border-amber-200/60 overflow-hidden relative">
        {/* Top Consultation Header matching other astrologers & website theme */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-xs shrink-0 gap-2">
          {/* Left: Astrologer Avatar & Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <AstrologerAvatar expert={expertWithPhoto} size="sm" className="border border-white/70 shadow-xs shrink-0" />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm md:text-base text-white truncate leading-none">
                  {expertWithPhoto.name || 'Guru Kuldeep'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-amber-100/90 truncate leading-none mt-1 font-medium">
                Online • Active Session
              </span>
            </div>
          </div>

          {/* Right: Time Countdown, Wallet Quick Button, and Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Time Section with Clock icon & countdown */}
            <div className="bg-black/35 backdrop-blur-xs px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-white/30 flex items-center gap-1.5 text-xs sm:text-sm font-mono font-extrabold text-white shadow-xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 stroke-[2.5] shrink-0" />
              <span className="tracking-wide">{formatTimer(secondsLeft)}</span>
            </div>

            {/* Wallet Quick Button */}
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
              onClick={onClose}
              aria-label="Close chat"
              title="Close chat"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Alternating Hindi/English Trust Banner */}
        <div className="bg-[#FFFDF7] border-b border-amber-200/80 px-3 py-1.5 sm:py-2 text-center shrink-0 shadow-2xs overflow-hidden">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
              पहले जुड़ें, फिर फैसला करें • Connect First. Decide Later.
            </span>
            <span className="text-[11px] sm:text-xs text-amber-800 font-medium leading-tight mt-0.5">
              Chat first. Continue if you love the experience.
            </span>
          </div>
        </div>

        {/* Messages Body in WhatsApp Chat Format */}
        <div
          ref={logRef}
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

          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                    isUser
                      ? 'bg-[#D9FDD3] text-[#111B21] rounded-2xl rounded-tr-2xs border border-[#bceac0]/40'
                      : 'bg-white text-[#111B21] rounded-2xl rounded-tl-2xs border border-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <div className="text-[10px] mt-1.5 flex items-center justify-end gap-1 text-[#667781]">
                    <span>{m.timestamp || nowTime}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingText && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl rounded-tl-2xs bg-white border border-white w-20 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
              <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          {/* Chat Ended Note & Recharge Button */}
          {isOver && (
            <div className="self-center my-3 flex flex-col items-center gap-2.5 p-3.5 bg-[#FFF4E5] rounded-xl border border-amber-300 text-center max-w-sm shadow-xs animate-in fade-in">
              <p className="text-xs sm:text-sm text-amber-950 font-medium">
                Your free chat has ended. Recharge your wallet to continue consultation with Guru Kuldeep 💫
              </p>
              <button
                onClick={onOpenWallet}
                className="px-5 py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold text-xs sm:text-sm rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Recharge now (Wallet: ₹{walletBalance})
              </button>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        {showChips && !isOver && (
          <div className="flex gap-2 flex-wrap px-3 sm:px-4 py-2 bg-[#F0F2F5]/90 border-t border-[#E9EDEF] shrink-0">
            {SUGGESTION_CHIPS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-[#bceac0] hover:border-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Form matching WhatsApp & other astrologers */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2 sm:p-2.5 bg-[#F0F2F5] border-t border-[#E9EDEF] flex items-center gap-1.5 sm:gap-2 shrink-0"
        >
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 sm:py-2 border border-transparent focus-within:border-[#00A884] shadow-2xs">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isOver ? 'Free session ended' : 'Type a message...'}
              disabled={isBusy || isOver}
              autoComplete="off"
              className="w-full text-xs sm:text-sm text-[#111B21] placeholder:text-[#8696A0] focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || isBusy || isOver}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-[#00A884] hover:bg-[#008f6f] disabled:bg-[#8696A0]/40 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
            title="Send Message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};
