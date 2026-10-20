import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Settings, 
  Users, 
  Edit3, 
  Check, 
  Sparkles, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Plus, 
  RefreshCw,
  Crown,
  Database,
  Lock,
  Mail,
  UserCheck,
  Bot,
  Languages,
  MessageSquare,
  BookOpen,
  Trash2,
  Send,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  Camera,
  Upload,
  Image
} from 'lucide-react';
import { Expert, UserProfile } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';
import { getDatabaseUsers, StoredUser, SUPER_ADMIN_CREDENTIALS } from '../lib/authService';
import { 
  ChatbotTrainingConfig, 
  getChatbotTrainingConfig, 
  saveChatbotTrainingConfig, 
  resetChatbotTrainingConfig,
  generateTrainedReply,
  QAPair
} from '../lib/chatbotTrainingService';

interface AdminPanelModalProps {
  experts: Expert[];
  user?: UserProfile;
  onClose: () => void;
  onUpdateExpert: (updatedExpert: Expert) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  experts,
  user,
  onClose,
  onUpdateExpert
}) => {
  const [activeTab, setActiveTab] = useState<'experts' | 'training' | 'users' | 'rules' | 'logs'>('experts');
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [expertSaveSuccess, setExpertSaveSuccess] = useState<string | null>(null);

  // Chatbot Training State
  const [trainingConfig, setTrainingConfig] = useState<ChatbotTrainingConfig>(() => getChatbotTrainingConfig());
  const [trainingSaveSuccess, setTrainingSaveSuccess] = useState<boolean>(false);
  
  // Custom Q&A addition state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<'love' | 'career' | 'marriage' | 'remedy' | 'general'>('love');
  const [showAddQa, setShowAddQa] = useState(false);

  // Live Test Sandbox State
  const [testInput, setTestInput] = useState('');
  const [testChatMessages, setTestChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: 'Namaste 🙏 Main Kuldeep hoon. Love ya career, aap kis baare mein baat karna chahenge? ✨', time: 'Just now' }
  ]);

  // Free chat rules state
  const [freeChatMinutes, setFreeChatMinutes] = useState<number>(5);
  const [autoApproveReviews, setAutoApproveReviews] = useState<boolean>(true);
  const [rulesSaved, setRulesSaved] = useState<boolean>(false);

  // Database users
  const [dbUsers, setDbUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    setDbUsers(getDatabaseUsers());
  }, [activeTab]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);

  // Save edited astrologer profile
  const handleSaveExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpert) {
      onUpdateExpert(editingExpert);
      setExpertSaveSuccess(`✓ Profile and photo for "${editingExpert.name}" successfully updated & saved across the whole platform!`);
      setTimeout(() => {
        setExpertSaveSuccess(null);
        setEditingExpert(null);
      }, 1800);
    }
  };

  // Direct photo upload with canvas scaling for optimal storage
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingExpert) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setImageUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        setImageUploadLoading(false);
        return;
      }

      const img = new (window as any).Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            setEditingExpert((prev) => (prev ? { ...prev, avatarUrl: compressed } : null));
          }
        } catch (err) {
          console.error('Image compression error', err);
          setEditingExpert((prev) => (prev ? { ...prev, avatarUrl: src } : null));
        } finally {
          setImageUploadLoading(false);
        }
      };
      img.onerror = () => {
        setImageUploadLoading(false);
        alert('Could not process this image file. Please choose another image.');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Revert back to classic authentic portrait
  const handleRemoveCustomImage = () => {
    if (editingExpert) {
      setEditingExpert({
        ...editingExpert,
        avatarUrl: undefined
      });
    }
  };

  // Save Chatbot Training
  const handleSaveTraining = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveChatbotTrainingConfig(trainingConfig);
    setTrainingSaveSuccess(true);
    setTimeout(() => setTrainingSaveSuccess(false), 2500);
  };

  // Reset Training
  const handleResetTraining = () => {
    if (window.confirm('Reset all chatbot training and language settings to factory defaults?')) {
      const def = resetChatbotTrainingConfig();
      setTrainingConfig(def);
      setTrainingSaveSuccess(true);
      setTimeout(() => setTrainingSaveSuccess(false), 2500);
    }
  };

  // Add Q&A Pair
  const handleAddQaPair = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newPair: QAPair = {
      id: `qa-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory
    };
    const updatedPairs = [newPair, ...trainingConfig.qaPairs];
    const updatedConfig = { ...trainingConfig, qaPairs: updatedPairs };
    setTrainingConfig(updatedConfig);
    saveChatbotTrainingConfig(updatedConfig);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddQa(false);
  };

  // Delete Q&A Pair
  const handleDeleteQaPair = (id: string) => {
    const updatedPairs = trainingConfig.qaPairs.filter((p) => p.id !== id);
    const updatedConfig = { ...trainingConfig, qaPairs: updatedPairs };
    setTrainingConfig(updatedConfig);
    saveChatbotTrainingConfig(updatedConfig);
  };

  // Run Test Message in Sandbox
  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    const q = testInput.trim();
    setTestInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    setTestChatMessages((prev) => [...prev, { sender: 'user', text: q, time: now }]);

    // Generate response using trained language and rules
    setTimeout(() => {
      const reply = generateTrainedReply(q, user?.name || 'Seeker', trainingConfig);
      setTestChatMessages((prev) => [
        ...prev, 
        { sender: 'bot', text: reply.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 400);
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    setRulesSaved(true);
    setTimeout(() => setRulesSaved(false), 2000);
  };

  const isSuperAdmin = user?.isSuperAdmin || user?.email === SUPER_ADMIN_CREDENTIALS.email;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] w-full max-w-5xl max-h-[94vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-xl text-white shadow-md">
              <Crown className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-serif-cinzel text-white">
                  My-Astro Admin Console
                </h3>
                {isSuperAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                    Super Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/80">
                Manage Astrologers, Chatbot Language Training, Pricing &amp; Users
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="bg-white border-b border-amber-200 px-3 sm:px-6 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('experts');
              setEditingExpert(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'experts' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Astrologers &amp; Profiles ({experts.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'training' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chatbot Training &amp; Language</span>
            <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px] font-mono">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Accounts &amp; Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>System Status</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ASTROLOGERS PROFILE EDIT */}
          {activeTab === 'experts' ? (
            editingExpert ? (
              <form onSubmit={handleSaveExpert} className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-200 shadow-sm space-y-5 animate-in fade-in duration-150">
                
                {/* Header with status */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Edit Astrologer Profile: <span className="text-amber-800">{editingExpert.name}</span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingExpert(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>

                {expertSaveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{expertSaveSuccess}</span>
                  </div>
                )}

                {/* 1. Astrologer Profile Picture Update Section */}
                <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                    
                    {/* Live Preview Box */}
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 bg-slate-900 flex items-center justify-center relative">
                        {editingExpert.avatarUrl ? (
                          <img
                            src={editingExpert.avatarUrl}
                            alt={editingExpert.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <AstrologerAvatar expert={editingExpert} size="lg" className="w-full h-full border-none shadow-none" />
                        )}
                        
                        {/* Hover Overlay to change picture */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold p-1 cursor-pointer"
                        >
                          <Camera className="w-5 h-5 mb-1 text-amber-200" />
                          <span>Change Photo</span>
                        </button>
                      </div>

                      {editingExpert.avatarUrl && (
                        <span 
                          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-md"
                          title="Custom photo uploaded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Controls & Description */}
                    <div className="flex-1 w-full space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-amber-700" />
                            Astrologer Profile Picture
                          </h5>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Upload a photo from your computer/mobile or enter an image link.
                          </p>
                        </div>

                        {editingExpert.avatarUrl ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Custom Photo Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                            Using Authentic Vedic Portrait
                          </span>
                        )}
                      </div>

                      {/* Upload & Revert Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={imageUploadLoading}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{imageUploadLoading ? 'Processing Image...' : 'Upload Photo from Device'}</span>
                        </button>

                        {editingExpert.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveCustomImage}
                            className="px-3 py-2 bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 hover:border-red-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Remove Photo (Revert to Classic)</span>
                          </button>
                        )}
                      </div>

                      {/* Image URL Alternative */}
                      <div className="relative">
                        <input
                          type="text"
                          value={editingExpert.avatarUrl || ''}
                          onChange={(e) => setEditingExpert({ ...editingExpert, avatarUrl: e.target.value.trim() || undefined })}
                          placeholder="Or paste an image web link (https://... or data:image/...)"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-amber-300 rounded-xl bg-white focus:outline-amber-500 font-mono text-slate-700 placeholder:text-slate-400"
                        />
                        <Image className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>

                      {/* Reassurance Reminder Banner */}
                      <div className="p-2.5 bg-emerald-50/90 border border-emerald-300 rounded-xl flex items-start gap-2 text-[11px] text-emerald-950 leading-relaxed shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-emerald-950">Truly Uploaded &amp; Displayed in Profile:</strong> Any picture you upload here is instantly bound to {editingExpert.name}&apos;s profile and will truly appear across all astrologer cards, profile views, chat consultations, intake screens, and directories across the entire application.
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Main Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  
                  {/* Name */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editingExpert.name}
                      onChange={(e) => setEditingExpert({ ...editingExpert, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 focus:outline-amber-500 bg-amber-50/20"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Title / Designation</label>
                    <input
                      type="text"
                      required
                      value={editingExpert.title}
                      onChange={(e) => setEditingExpert({ ...editingExpert, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 focus:outline-amber-500"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={editingExpert.gender || 'male'}
                      onChange={(e) => setEditingExpert({ ...editingExpert, gender: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Price Per Minute */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Price / min (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingExpert.pricePerMin}
                      onChange={(e) => setEditingExpert({ ...editingExpert, pricePerMin: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 font-mono"
                    />
                  </div>

                  {/* Discounted Price */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Special Offer Price / min (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 10 (optional)"
                      value={editingExpert.discountedPrice !== undefined ? editingExpert.discountedPrice : ''}
                      onChange={(e) => setEditingExpert({ 
                        ...editingExpert, 
                        discountedPrice: e.target.value ? Number(e.target.value) : undefined 
                      })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Crosses out original price when set</span>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Availability Status</label>
                    <select
                      value={editingExpert.availability}
                      onChange={(e) => setEditingExpert({ ...editingExpert, availability: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 bg-white font-semibold"
                    >
                      <option value="online">🟢 Online &amp; Available Now</option>
                      <option value="busy">🟡 Busy in Consultation</option>
                      <option value="offline">⚪ Offline</option>
                    </select>
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={editingExpert.experienceYears}
                      onChange={(e) => setEditingExpert({ ...editingExpert, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rating (e.g. 5.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="5"
                      value={editingExpert.rating}
                      onChange={(e) => setEditingExpert({ ...editingExpert, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 font-mono"
                    />
                  </div>

                  {/* Review Count */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Reviews Count</label>
                    <input
                      type="number"
                      min="0"
                      value={editingExpert.reviewCount}
                      onChange={(e) => setEditingExpert({ ...editingExpert, reviewCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 font-mono"
                    />
                  </div>

                  {/* Primary Category */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Category</label>
                    <select
                      value={editingExpert.primaryCategory}
                      onChange={(e) => setEditingExpert({ ...editingExpert, primaryCategory: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200 bg-white"
                    >
                      <option value="vedic">Vedic Astrology</option>
                      <option value="tarot">Tarot Reading</option>
                      <option value="career">Career Astrology</option>
                      <option value="love">Love &amp; Relationships</option>
                      <option value="numerology">Numerology</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location / Holy City</label>
                    <input
                      type="text"
                      value={editingExpert.location}
                      onChange={(e) => setEditingExpert({ ...editingExpert, location: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200"
                    />
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Education &amp; Qualifications</label>
                    <input
                      type="text"
                      value={editingExpert.education}
                      onChange={(e) => setEditingExpert({ ...editingExpert, education: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl border-amber-200"
                    />
                  </div>

                </div>

                {/* Skills & Specialties (Comma separated) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Astrological Skills &amp; Methods <span className="font-normal text-slate-500">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={(editingExpert.skills || []).join(', ')}
                      onChange={(e) => setEditingExpert({ 
                        ...editingExpert, 
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) 
                      })}
                      placeholder="e.g. Vedic Astrology, Tarot Astrology, Kundli Reading"
                      className="w-full px-3 py-2 border rounded-xl border-amber-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Specialisations &amp; Topics <span className="font-normal text-slate-500">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={(editingExpert.specialisations || []).join(', ')}
                      onChange={(e) => setEditingExpert({ 
                        ...editingExpert, 
                        specialisations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) 
                      })}
                      placeholder="e.g. Love Expert, Relationship Expert, Career Expert"
                      className="w-full px-3 py-2 border rounded-xl border-amber-200"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">
                    Languages Spoken <span className="font-normal text-slate-500">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={(editingExpert.languages || []).join(', ')}
                    onChange={(e) => setEditingExpert({ 
                      ...editingExpert, 
                      languages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g. English, Hindi, Sanskrit"
                    className="w-full px-3 py-2 border rounded-xl border-amber-200"
                  />
                </div>

                {/* Biography / Description in Plain Human Language */}
                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">
                    About the Astrologer / Biography <span className="font-normal text-slate-500">(in clear, warm human language)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editingExpert.bio}
                    onChange={(e) => setEditingExpert({ ...editingExpert, bio: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-amber-200 leading-relaxed font-sans"
                    placeholder="Describe their experience, tone, and how they help seekers in simple, everyday words..."
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-amber-100 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingExpert.freeChatEligible}
                      onChange={(e) => setEditingExpert({ ...editingExpert, freeChatEligible: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-bold text-slate-800">Eligible for Complimentary First Free Chat</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingExpert.isAiAstrologer || editingExpert.id === 'exp-kuldeep')}
                      onChange={(e) => setEditingExpert({ ...editingExpert, isAiAstrologer: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="font-bold text-slate-800">
                      Show &ldquo;AI Astrologer&rdquo; Badge in Profile Header
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-amber-100">
                  <button
                    type="button"
                    onClick={() => setEditingExpert(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#167d47] hover:bg-[#126338] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Astrologer Profile</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-serif-cinzel">
                      Marketplace Astrologers Directory
                    </h4>
                    <p className="text-xs text-slate-500">
                      Click &ldquo;Edit Profile&rdquo; on any astrologer to update their details, pricing, bio, or skills.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                    {experts.length} Profiles
                  </span>
                </div>

                <div className="overflow-x-auto border border-amber-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-amber-50 text-amber-900 font-bold border-b border-amber-200">
                      <tr>
                        <th className="py-2.5 px-3">Astrologer</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Price / Rate</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Experience</th>
                        <th className="py-2.5 px-3">Rating &amp; Reviews</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {experts.map((exp) => (
                        <tr key={exp.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <AstrologerAvatar expert={exp} size="xs" className="w-8 h-8 rounded-lg shrink-0 border border-amber-300 shadow-2xs" />
                              <div>
                                <span className="font-bold flex items-center gap-1">
                                  {exp.name}
                                  {(exp.id === 'exp-kuldeep' || exp.isAiAstrologer) && (
                                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[9px] font-bold">
                                      AI
                                    </span>
                                  )}
                                </span>
                                <span className="text-[11px] text-slate-500 font-normal line-clamp-1">{exp.title}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 uppercase text-[11px] font-bold text-amber-800">
                            {exp.primaryCategory}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold">
                            <span className="text-[#c45500]">₹{exp.discountedPrice || exp.pricePerMin}/min</span>
                            {exp.discountedPrice && (
                              <span className="text-slate-400 line-through text-[11px] ml-1.5">
                                ₹{exp.pricePerMin}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              exp.availability === 'online' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : exp.availability === 'busy' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {exp.availability}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {exp.experienceYears} Years
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            ⭐ {exp.rating.toFixed(1)} ({exp.reviewCount.toLocaleString()})
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setEditingExpert(exp)}
                              className="px-3 py-1 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
                            >
                              Edit Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : activeTab === 'training' ? (
            /* TAB 2: CHATBOT TRAINING & LANGUAGE TRAINER */
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-200" />
                    <h4 className="font-bold text-base sm:text-lg font-serif-cinzel">
                      AI Astrologer Language &amp; Chatbot Training Studio
                    </h4>
                  </div>
                  <p className="text-xs text-amber-100 mt-1 max-w-2xl leading-relaxed">
                    Train how Guru Kuldeep and AI consultations respond: configure primary language dialect (Hinglish / Pure Hindi / English), adjust respect tone, customize astrological guidance, and test live responses.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={handleResetTraining}
                    className="px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset to factory settings"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => handleSaveTraining()}
                    className="px-4 py-1.5 bg-white text-slate-900 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save Training</span>
                  </button>
                </div>
              </div>

              {trainingSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chatbot language and consultation instructions saved successfully! Live consultations are now updated.</span>
                </div>
              )}

              {/* 2-Column Training Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left 7 Cols: Training Configuration Controls */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Language Mode Selector */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <Languages className="w-4 h-4 text-amber-600" />
                      <span>1. Primary Language Dialect</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'hinglish', label: 'Hinglish', desc: 'Hindi in English letters (Most popular)' },
                        { id: 'hindi', label: 'हिंदी (Devanagari)', desc: 'Pure traditional Hindi' },
                        { id: 'english', label: 'English', desc: 'Clear, international language' },
                        { id: 'auto', label: 'Auto Match', desc: 'Matches seeker dynamically' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setTrainingConfig({ ...trainingConfig, languageMode: lang.id as any })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            trainingConfig.languageMode === lang.id
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block font-bold text-xs">{lang.label}</span>
                          <span className={`block text-[10px] mt-0.5 line-clamp-2 ${trainingConfig.languageMode === lang.id ? 'text-amber-100' : 'text-slate-400'}`}>
                            {lang.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Persona & Tone */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <HeartHandshake className="w-4 h-4 text-amber-600" />
                      <span>2. Persona &amp; Politeness Tone</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Astrologer Persona Name</label>
                        <input
                          type="text"
                          value={trainingConfig.personaName}
                          onChange={(e) => setTrainingConfig({ ...trainingConfig, personaName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl border-amber-200 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Addressing &amp; Politeness</label>
                        <select
                          value={trainingConfig.politeness}
                          onChange={(e) => setTrainingConfig({ ...trainingConfig, politeness: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-xl border-amber-200 bg-white"
                        >
                          <option value="high_respect_aap">Always &ldquo;Aap&rdquo; (Utmost Respect &amp; Humility)</option>
                          <option value="friendly">Warm &amp; Conversational Guide</option>
                          <option value="traditional">Traditional Astrological Guru</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block font-bold text-slate-700 mb-1">Welcome / Opening Greeting Message</label>
                      <input
                        type="text"
                        value={trainingConfig.welcomeMessage}
                        onChange={(e) => setTrainingConfig({ ...trainingConfig, welcomeMessage: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl border-amber-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* Language Training Guidelines / Prompts */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span>3. Language Guidelines &amp; Vocabulary Rules</span>
                      </label>
                      <span className="text-[11px] text-slate-500">How the chatbot should speak</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Train the exact phrasing, forbidden words, astrological vocabulary (e.g. kundli, 7th house, dasha), and response lengths:
                    </p>
                    <textarea
                      rows={5}
                      value={trainingConfig.languageInstruction}
                      onChange={(e) => setTrainingConfig({ ...trainingConfig, languageInstruction: e.target.value })}
                      className="w-full p-3 border rounded-xl border-amber-200 text-xs font-mono bg-amber-50/15 leading-relaxed"
                      placeholder="e.g. Always address seeker as 'aap'. Keep replies strictly to 2 short lines..."
                    />
                  </div>

                  {/* Custom Q&A Training Pairs (Few-Shot Training) */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>4. Trained Question &amp; Answer Pairs ({trainingConfig.qaPairs.length})</span>
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Teach specific answers for common seeker questions (ex-breakup, marriage timing, job promotion).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddQa(!showAddQa)}
                        className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Q&amp;A</span>
                      </button>
                    </div>

                    {/* Add Q&A Form */}
                    {showAddQa && (
                      <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2.5 text-xs animate-in fade-in">
                        <div className="font-bold text-amber-900">Add New Training Pair</div>
                        <input
                          type="text"
                          placeholder="Seeker question (e.g. Meri shaadi kab hogi? / When will I get married?)"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg"
                        />
                        <textarea
                          rows={2}
                          placeholder="Trained response in preferred language (e.g. 7vein bhaav ke anusaar...)"
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                            className="px-2 py-1 bg-white border border-amber-300 rounded-lg text-[11px]"
                          >
                            <option value="love">Category: Love</option>
                            <option value="marriage">Category: Marriage</option>
                            <option value="career">Category: Career</option>
                            <option value="remedy">Category: Remedy</option>
                            <option value="general">Category: General</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddQa(false)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddQaPair}
                              className="px-3 py-1 bg-[#167d47] text-white font-bold rounded-lg hover:bg-[#126338]"
                            >
                              Add Training Pair
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* List of Q&A Pairs */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {trainingConfig.qaPairs.map((pair) => (
                        <div key={pair.id} className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/30 flex items-start justify-between gap-2 text-xs">
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-800">Q: {pair.question}</span>
                              {pair.category && (
                                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-bold uppercase">
                                  {pair.category}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              <span className="font-semibold text-emerald-800">Ans:</span> {pair.answer}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQaPair(pair.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete pair"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

                {/* Right 5 Cols: Live Interactive Language Testing Sandbox */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 shadow-md flex flex-col h-[560px]">
                    
                    {/* Sandbox Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h5 className="font-bold text-xs sm:text-sm font-serif-cinzel">
                          Live Trained Language Sandbox
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                        Mode: {trainingConfig.languageMode}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1 pb-2">
                      Test questions in Hinglish, Hindi, or English to verify how the chatbot speaks:
                    </p>

                    {/* Chat Log */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      {testChatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-amber-600 text-white rounded-br-none'
                                : 'bg-slate-800 text-amber-50 rounded-bl-none border border-amber-400/20'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-2">
                      {[
                        'Will my ex return?',
                        'Meri shaadi kab hogi?',
                        'Job switch karein?',
                        'Are we compatible?'
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setTestInput(chip);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 rounded-full text-[10px] whitespace-nowrap cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Test Form */}
                    <form onSubmit={handleRunTest} className="flex gap-2 pt-1 border-t border-slate-800">
                      <input
                        type="text"
                        placeholder="Type a test query in any language…"
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </form>

                  </div>

                  {/* Save Notification Card */}
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Instant Synchronization</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      All language adjustments, polite tone rules, and custom Q&amp;A training pairs are applied across both <strong>Guru Kuldeep Chat</strong> and <strong>Consultation Chat</strong> in real time.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSaveTraining()}
                      className="w-full py-2 bg-[#167d47] hover:bg-[#126338] text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Save All Language &amp; Chatbot Training
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ) : activeTab === 'users' ? (
            /* TAB 3: DATABASE ACCOUNTS & SUPER ADMIN OVERVIEW */
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 p-4 rounded-xl border border-amber-300">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900 font-serif-cinzel">
                    Database Super Admin Credentials &amp; RBAC
                  </h4>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Super Admin Email</span>
                    <span className="font-mono font-bold text-amber-900 text-xs">{SUPER_ADMIN_CREDENTIALS.email}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized Password</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{SUPER_ADMIN_CREDENTIALS.password}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Role</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white inline-block mt-0.5">
                      SUPER_ADMIN
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Database User Accounts</h4>
                  <p className="text-xs text-slate-500">Live synchronized records from database storage</p>
                </div>
                <button
                  onClick={() => setDbUsers(getDatabaseUsers())}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-amber-200 rounded-xl bg-white shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-amber-50 text-amber-900 font-bold border-b border-amber-200">
                    <tr>
                      <th className="py-2.5 px-3">Name &amp; Email</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Birth Coordinates</th>
                      <th className="py-2.5 px-3">Free Chat</th>
                      <th className="py-2.5 px-3">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {dbUsers.map((u) => (
                      <tr key={u.id} className={u.isSuperAdmin ? 'bg-amber-50/70 font-medium' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            {u.isSuperAdmin ? (
                              <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <div>
                              <span className="font-bold text-slate-900 block">{u.name}</span>
                              <span className="text-[11px] font-mono text-slate-500">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isSuperAdmin ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {u.phone}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {u.dob} ({u.pob})
                        </td>
                        <td className="py-2.5 px-3">
                          {u.freeChatUsed ? (
                            <span className="text-slate-400">Claimed</span>
                          ) : (
                            <span className="text-emerald-700 font-bold">Ready</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold ${u.isSuperAdmin ? 'text-amber-800' : 'text-slate-600'}`}>
                            {u.isSuperAdmin ? 'Full Access' : 'Standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'rules' ? (
            /* TAB 4: RULES */
            <form onSubmit={handleSaveRules} className="bg-white p-6 rounded-2xl border border-amber-200 space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-900 font-serif-cinzel">Free Consultation &amp; Business Rules</h4>
              
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block">🔒 Strict Login Enforcement Active:</span>
                No user can initiate a chat or call consultation (free or paid) without logging into their account.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complimentary Free Chat Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={freeChatMinutes}
                  onChange={(e) => setFreeChatMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg border-amber-200 text-sm"
                />
                <span className="text-[11px] text-slate-500">Default is 5 minutes for new seekers.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={autoApproveReviews}
                  onChange={(e) => setAutoApproveReviews(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="autoApprove" className="text-xs text-slate-700 cursor-pointer">
                  Auto-publish verified consultations feedback and ratings
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                {rulesSaved ? 'Rules Saved Successfully!' : 'Save Platform Rules'}
              </button>
            </form>
          ) : (
            /* TAB 5: SYSTEM LOGS */
            <div className="bg-white p-6 rounded-2xl border border-amber-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">System Health &amp; Live Gateway</h4>
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>PayU / UPI Webhooks: Active &amp; Operational (Latency: 120ms)</span>
              </div>
              <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 space-y-1">
                <p><strong>Database:</strong> PostgreSQL / Cloud SQL schema with local reactive synchronization.</p>
                <p><strong>Super Admin:</strong> <span className="font-mono text-amber-800 font-bold">{SUPER_ADMIN_CREDENTIALS.email}</span></p>
                <p><strong>Authentication Guard:</strong> Strict chat consultation gate enabled across all entry points.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
