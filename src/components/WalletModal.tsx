import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  History 
} from 'lucide-react';
import { UserWallet } from '../types';

interface WalletModalProps {
  wallet: UserWallet;
  onClose: () => void;
  onAddMoney: (amount: number, bonus: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  wallet,
  onClose,
  onAddMoney
}) => {
  const [selectedPack, setSelectedPack] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');

  const rechargePacks = [
    { amount: 50, bonus: 0, tag: 'Starter' },
    { amount: 100, bonus: 10, tag: 'Popular' },
    { amount: 250, bonus: 35, tag: 'Best Value' },
    { amount: 500, bonus: 100, tag: '10% Extra' },
    { amount: 1000, bonus: 250, tag: '25% Extra' },
    { amount: 2000, bonus: 600, tag: 'VIP Pass' }
  ];

  const handleRecharge = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedPack;
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    const matchedPack = rechargePacks.find((p) => p.amount === finalAmount);
    const bonus = matchedPack ? matchedPack.bonus : 0;

    onAddMoney(finalAmount, bonus);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF7] w-full max-w-lg rounded-2xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-800/60 rounded-xl">
              <Wallet className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif-cinzel">My-Astro Wallet</h3>
              <p className="text-[11px] text-amber-100">Safe, Instant &amp; 100% Refundable balance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 bg-gradient-to-br from-amber-50 to-[#FFFDF7] border-b border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="text-3xl font-extrabold text-slate-900 font-mono mt-0.5">
              ₹{wallet.balance}
            </div>
          </div>

          <div className="flex bg-amber-100/70 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('recharge')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'recharge' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              Recharge
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'history' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {paymentSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Recharge Successful!</h4>
              <p className="text-xs text-slate-500">Your wallet balance has been updated immediately.</p>
            </div>
          ) : activeTab === 'recharge' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Recharge Pack
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {rechargePacks.map((pack) => {
                    const isSelected = selectedPack === pack.amount && !customAmount;
                    return (
                      <button
                        key={pack.amount}
                        type="button"
                        onClick={() => {
                          setSelectedPack(pack.amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                            : 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800'
                        }`}
                      >
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 mb-1">
                          {pack.tag}
                        </span>
                        <span className="text-base font-extrabold font-mono">₹{pack.amount}</span>
                        {pack.bonus > 0 && (
                          <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-amber-100' : 'text-emerald-700'}`}>
                            + ₹{pack.bonus} free
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Amount (₹)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  placeholder="e.g. 500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              <button
                type="button"
                onClick={handleRecharge}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Proceed to Pay ₹{customAmount || selectedPack}
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transaction History
              </h4>
              {wallet.transactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No transactions yet.</p>
              ) : (
                <div className="divide-y divide-amber-100 border border-amber-200 rounded-xl overflow-hidden bg-white">
                  {wallet.transactions.map((tx) => (
                    <div key={tx.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800 block">{tx.description}</span>
                        <span className="text-[10px] text-slate-400">{tx.timestamp}</span>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
