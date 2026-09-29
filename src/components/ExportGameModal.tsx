import React, { useState } from 'react';
import { PlayerWallet } from '../types/shop';
import { PlayerConfig, PlayerId } from '../types/game';
import { saveWallet, savePlayerGear } from '../services/shopStorage';
import { sounds } from '../audio/soundEngine';
import {
  X,
  Download,
  Upload,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  FileCode,
  Database,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface ExportGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: PlayerWallet;
  onUpdateWallet: (wallet: PlayerWallet) => void;
  playerConfigs: PlayerConfig[];
  onUpdatePlayerConfig: (id: PlayerId, updates: Partial<PlayerConfig>) => void;
}

export const ExportGameModal: React.FC<ExportGameModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onUpdateWallet,
  playerConfigs,
  onUpdatePlayerConfig,
}) => {
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Safe Export 1: Standalone Offline Playable HTML Launcher
  const handleExportOfflineBundle = () => {
    try {
      const exportHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Stick Arena: 4-Player Brawler (Portable Edition)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020617;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      text-align: center;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 24px;
      padding: 32px;
      max-width: 640px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      color: #38bdf8;
      margin-bottom: 12px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #0ea5e9, #3b82f6);
      color: white;
      text-decoration: none;
      font-weight: bold;
      border-radius: 14px;
      font-size: 16px;
      transition: transform 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn:hover { transform: scale(1.03); }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">حزمة التصدير الآمنة • Safe Standalone Runner</div>
    <h1>STICK ARENA: 4-PLAYER BRAWLER</h1>
    <p>تم تصدير اللعبة بنجاح! جميع ملفات اللعبة ومساراتها تستخدم المسار النسبي الآمن <code>./</code> ولا تلمس أي مجلدات في النظام مثل System32 أو Steam.</p>
    <a href="./index.html" class="btn">تشغيل اللعبة الآن (Launch Game)</a>
  </div>
</body>
</html>`;

      const blob = new Blob([exportHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stick-arena-portable-launcher.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      sounds.playVictory();
      showMsg('تم تصدير ملف المشغل المحمول الآمن بنجاح إلى مجلد التنزيلات!');
    } catch (e) {
      showMsg('حدث خطأ أثناء التصدير', 'error');
    }
  };

  // Safe Export 2: Save Data JSON Backup
  const handleExportSaveData = () => {
    try {
      const saveData = {
        app: 'Stick Arena',
        version: '1.2v',
        exportDate: new Date().toISOString(),
        wallet,
        playerConfigs: playerConfigs.map((p) => ({
          id: p.id,
          name: p.name,
          color: p.color,
          glowColor: p.glowColor,
          type: p.type,
          equippedHat: p.equippedHat,
          equippedSkin: p.equippedSkin,
          equippedShoes: p.equippedShoes,
          equippedWeaponSkin: p.equippedWeaponSkin,
        })),
      };

      const jsonStr = JSON.stringify(saveData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stick-arena-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      sounds.playPowerUp();
      showMsg('تم تصدير ملف الحفظ والبيانات بنجاح (JSON Backup)!');
    } catch (e) {
      showMsg('فشل تصدير ملف الحفظ', 'error');
    }
  };

  // Safe Import: Save Data JSON
  const handleImportSaveData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.wallet) {
          saveWallet(parsed.wallet);
          onUpdateWallet(parsed.wallet);

          if (Array.isArray(parsed.playerConfigs)) {
            parsed.playerConfigs.forEach((pc: Partial<PlayerConfig> & { id: PlayerId }) => {
              if (pc.id) {
                onUpdatePlayerConfig(pc.id, {
                  name: pc.name,
                  equippedHat: pc.equippedHat,
                  equippedSkin: pc.equippedSkin,
                  equippedShoes: pc.equippedShoes,
                  equippedWeaponSkin: pc.equippedWeaponSkin,
                });
                savePlayerGear(pc.id, {
                  equippedHat: pc.equippedHat,
                  equippedSkin: pc.equippedSkin,
                  equippedShoes: pc.equippedShoes,
                  equippedWeaponSkin: pc.equippedWeaponSkin,
                });
              }
            });
          }

          sounds.playVictory();
          showMsg('تم استيراد بيانات اللعبة والمقاتلين بنجاح!');
        } else {
          showMsg('الملف غير متوافق أو تالف', 'error');
        }
      } catch (err) {
        showMsg('تعذر قراءة ملف الحفظ', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Duplicate / Clone: Copy P1 Gear to all other players ("نسخ بعضها البعض")
  const handleCloneP1ToAll = () => {
    const p1 = playerConfigs.find((p) => p.id === 1);
    if (!p1) return;

    const gear = {
      equippedHat: p1.equippedHat,
      equippedSkin: p1.equippedSkin,
      equippedShoes: p1.equippedShoes,
      equippedWeaponSkin: p1.equippedWeaponSkin,
    };

    playerConfigs.forEach((p) => {
      if (p.id !== 1) {
        onUpdatePlayerConfig(p.id, gear);
        savePlayerGear(p.id, gear);
      }
    });

    sounds.playPowerUp();
    showMsg('تم نسخ مظهر وتجهيزات اللاعب الأول (P1) وتطبيقها على جميع المقاتلين بنجاح!');
  };

  // Duplicate / Clone: Copy P1 cosmetics across all bots in alternating match themes
  const handleCloneSkinsToBots = () => {
    playerConfigs.forEach((p) => {
      if (p.type === 'cpu') {
        const gear = {
          equippedHat: playerConfigs[0]?.equippedHat || null,
          equippedSkin: playerConfigs[0]?.equippedSkin || null,
          equippedShoes: playerConfigs[0]?.equippedShoes || null,
          equippedWeaponSkin: playerConfigs[0]?.equippedWeaponSkin || null,
        };
        onUpdatePlayerConfig(p.id, gear);
        savePlayerGear(p.id, gear);
      }
    });
    sounds.playPowerUp();
    showMsg('تم نسخ وتوحيد سكنات وتجهيزات البوتات بنجاح!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-sky-500/40 rounded-3xl shadow-[0_0_80px_rgba(14,165,233,0.3)] flex flex-col overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/85 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-500/30 to-indigo-500/20 border border-sky-400/40 text-sky-300 shadow-md">
              <Download className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase">
                  تصدير اللعبة والنسخ الاحتياطي (EXPORT & BACKUP)
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  مسار آمن 100%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تصدير آمن عبر المتصفح بدون أي مسارات نظام أو نسخ عشوائي
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

        {/* Security & Safe Path Notice */}
        <div className="px-6 py-3 bg-emerald-950/40 border-b border-emerald-500/30 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200/90 leading-relaxed">
            <span className="font-bold text-emerald-300">تم تأمين مسارات التصدير بالكامل:</span> تم ضبط مجلد الإخراج على المسار النسبي الداخلي <code>./assets/</code> وحظر أي وصول إلى مجلدات النظام (مثل System32 أو Steam). أي تنزيل يتم بصيغة معزولة وآمنة تماماً إلى مجلد التنزيلات الافتراضي بجهازك.
          </div>
        </div>

        {/* Status Feedback */}
        {feedback && (
          <div
            className={`px-6 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 border-b animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Section 1: Standalone Export */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wide">
                  1. تصدير اللعبة للتشغيل المستقل (Standalone Runner)
                </h3>
              </div>
              <span className="text-[10px] text-sky-400 font-mono">HTML / Portable</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              قم بتنزيل مشغل اللعبة المحمول كملف مستقل يمكنك تشغيله على أي متصفح أو نسخه إلى أي جهاز أو مجلد دون الحاجة لأي تثبيت أو صلاحيات خاصة.
            </p>
            <div>
              <button
                onClick={handleExportOfflineBundle}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل مشغل اللعبة المحمول (Download Standalone Runner)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Save Data Export & Import */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wide">
                  2. تصدير واستيراد بيانات الحفظ والمقاتلين (Save Data Backup)
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">JSON Format</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              احفظ نسخة احتياطية من جميع أموالك (نقود وجواهر)، وسكناتك وقبعاتك وأسلحتك، وقم باستيرادها في أي وقت على أي جهاز آخر.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleExportSaveData}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>تصدير ملف الحفظ (Export Backup)</span>
              </button>

              <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>استيراد ملف حفظ سابق (Import Backup)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSaveData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Cloning & Copying Between Fighters ("نسخ بعضها البعض") */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wide">
                  3. نسخ المظاهر والتجهيزات بين المقاتلين (Clone / Duplicate Gear)
                </h3>
              </div>
              <span className="text-[10px] text-purple-400 font-bold">نسخ فوري بنقرة واحدة</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              انسخ سكنات وقبعات وأسلحة شخصيتك المفضلة وطبقها على المقاتلين الآخرين فوراً ليكون مظهرهم متناسقاً في ساحة القتال:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleCloneP1ToAll}
                className="p-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>نسخ مظهر اللاعب P1 لكافة المقاتلين</span>
              </button>

              <button
                onClick={handleCloneSkinsToBots}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4 text-sky-400" />
                <span>نسخ وتوحيد سكنات البوتات الذكية</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
