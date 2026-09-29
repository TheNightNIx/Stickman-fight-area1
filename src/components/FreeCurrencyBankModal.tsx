import React, { useState } from 'react';
import { PlayerWallet } from '../types/shop';
import { addCustomCurrency, saveWallet } from '../services/shopStorage';
import { sounds } from '../audio/soundEngine';
import {
  X,
  Coins,
  Gem,
  Sparkles,
  Zap,
  Plus,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface FreeCurrencyBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: PlayerWallet;
  onUpdateWallet: (wallet: PlayerWallet) => void;
}

export const FreeCurrencyBankModal: React.FC<FreeCurrencyBankModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onUpdateWallet,
}) => {
  const [customCoins, setCustomCoins] = useState<string>('50000');
  const [customGems, setCustomGems] = useState<string>('5000');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  const handleAdd = (coins: number, gems: number) => {
    const updated = addCustomCurrency(coins, gems);
    onUpdateWallet(updated);
    sounds.playPowerUp();
    showFeedback(`تم إضافة +${coins.toLocaleString()} نقود و +${gems.toLocaleString()} جوهرة بنجاح!`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseInt(customCoins, 10) || 0;
    const g = parseInt(customGems, 10) || 0;
    if (c <= 0 && g <= 0) return;
    handleAdd(c, g);
  };

  const handleMaxOut = () => {
    const updated: PlayerWallet = {
      ...wallet,
      coins: 99999999,
      gems: 9999999,
      unlockedFreeBank: true,
    };
    saveWallet(updated);
    onUpdateWallet(updated);
    sounds.playVictory();
    showFeedback('تم شحن الرصيد الأقصى (MAX OUT) بنجاح!');
  };

  const handleResetToZero = () => {
    const updated: PlayerWallet = {
      ...wallet,
      coins: 0,
      gems: 0,
    };
    saveWallet(updated);
    onUpdateWallet(updated);
    sounds.playPunch();
    showFeedback('تم تصفير الرصيد للاختبار!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-[0_0_80px_rgba(168,85,247,0.35)] flex flex-col overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-purple-500/30 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/85 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-amber-500/20 border border-purple-500/40 text-amber-300 shadow-md">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase">
                  بنك الجواهر والنقود المجاني (DEV BANK)
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  كود 36987
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                صفحة المطور الخاصة للحصول على أي كم تريده من الجواهر والنقود مجاناً!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Wallet Balances */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-bold text-slate-400">رصيدك الحالي المتاح:</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-300 font-mono text-sm font-black shadow-sm">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{wallet.coins.toLocaleString()}</span>
              <span className="text-[10px] font-sans text-amber-400/80">نقود</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/50 text-cyan-300 font-mono text-sm font-black shadow-sm">
              <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
              <span>{wallet.gems.toLocaleString()}</span>
              <span className="text-[10px] font-sans text-cyan-400/80">جواهر</span>
            </div>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="px-6 py-2 bg-emerald-950/90 border-b border-emerald-500/50 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Section 1: Quick One-Tap Bundles */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>شحن سريع بنقرة واحدة (Quick Bundles)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleAdd(10000, 500)}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-xs font-black text-amber-300 group-hover:scale-105 transition-transform">+10,000 نقود</span>
                <span className="text-[11px] font-bold text-cyan-300">+500 جوهرة</span>
              </button>

              <button
                onClick={() => handleAdd(50000, 2000)}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-xs font-black text-amber-300 group-hover:scale-105 transition-transform">+50,000 نقود</span>
                <span className="text-[11px] font-bold text-cyan-300">+2,000 جوهرة</span>
              </button>

              <button
                onClick={() => handleAdd(200000, 10000)}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-xs font-black text-amber-300 group-hover:scale-105 transition-transform">+200,000 نقود</span>
                <span className="text-[11px] font-bold text-cyan-300">+10,000 جوهرة</span>
              </button>

              <button
                onClick={() => handleAdd(1000000, 50000)}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400 transition-all text-center flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-xs font-black text-amber-300 group-hover:scale-105 transition-transform">+1,000,000 نقود</span>
                <span className="text-[11px] font-bold text-cyan-300">+50,000 جوهرة</span>
              </button>
            </div>
          </div>

          {/* Section 2: Custom Amount Generator Form */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>أدخل الكمية التي تريدها يدوياً (Custom Amount)</span>
            </h3>
            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>كمية النقود:</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  value={customCoins}
                  onChange={(e) => setCustomCoins(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-sm font-mono text-white outline-none"
                  placeholder="مثلاً: 100000"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 text-cyan-400" />
                  <span>كمية الجواهر:</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  value={customGems}
                  onChange={(e) => setCustomGems(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-sm font-mono text-white outline-none"
                  placeholder="مثلاً: 10000"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة الرصيد فوراً</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Max Out & Special Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleMaxOut}
              className="flex-1 w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>شحن الماكس المطلق (MAX 99,999,999)</span>
            </button>

            <button
              onClick={handleResetToZero}
              className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              title="تصفير الرصيد للصفر لتجربة اللعبة من الصفر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير الرصيد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
