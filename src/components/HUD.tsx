import React, { useState, useEffect } from 'react';
import {
  PlayerState,
  PlayerConfig,
  GameMode,
  ActiveEvent,
} from '../types/game';
import { PlayerWallet } from '../types/shop';
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Home,
  Settings,
  Zap,
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';

/* Stickman Silhouette Vector Weapons (Zero Emojis!) */
const StickmanWeaponIcon: React.FC<{ weapon: string; className?: string }> = ({
  weapon,
  className = 'w-3.5 h-3.5 inline-block shrink-0',
}) => {
  switch (weapon) {
    case 'sword':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <line x1="6" y1="11" x2="14" y2="7" />
          <line x1="14" y1="7" x2="22" y2="3" strokeWidth="2.5" stroke="#f8fafc" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'axe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="7" cy="6" r="2.5" />
          <line x1="7" y1="8.5" x2="7" y2="15" />
          <line x1="7" y1="11" x2="15" y2="8" />
          <line x1="13" y1="13" x2="19" y2="3" strokeWidth="2.5" stroke="#fbbf24" />
          <path d="M 17 4 Q 23 2 21 8 Q 18 10 16 7 Z" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1" />
          <polyline points="4,21 7,15 10,21" />
        </svg>
      );
    case 'gun':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <line x1="6" y1="10" x2="15" y2="10" />
          <rect x="14" y="8" width="7" height="4" rx="1" fill="#38bdf8" stroke="none" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <line x1="6" y1="10" x2="13" y2="9" />
          <rect x="11" y="7" width="10" height="5" rx="2" fill="#ef4444" stroke="none" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'rope':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <path d="M 6 11 Q 12 6 18 11" stroke="#a855f7" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'magnet':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <path d="M 14 8 A 4 4 0 0 1 14 16" stroke="#06b6d4" strokeWidth="2.5" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'fists':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="8" cy="6" r="2.5" />
          <line x1="8" y1="8.5" x2="8" y2="15" />
          <line x1="8" y1="10" x2="16" y2="10" strokeWidth="2.5" stroke="#f59e0b" />
          <polyline points="5,21 8,15 11,21" />
        </svg>
      );
  }
};

interface HUDProps {
  players: PlayerState[];
  playerConfigs: PlayerConfig[];
  gameMode: GameMode;
  currentRound: number;
  maxRounds: number;
  roundTimer: number;
  activeEvent: ActiveEvent | null;
  nextEventTimer: number;
  rouletteTimer: number;
  isPaused: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenControls: () => void;
  onRestartMatch: () => void;
  onBackToLobby: () => void;
  onOpenSettings?: () => void;
  wallet?: PlayerWallet;
}

export const HUD: React.FC<HUDProps> = ({
  players,
  playerConfigs,
  gameMode,
  currentRound,
  maxRounds,
  roundTimer,
  activeEvent,
  nextEventTimer,
  rouletteTimer,
  isPaused,
  soundEnabled,
  onToggleSound,
  onTogglePause,
  onOpenControls,
  onRestartMatch,
  onBackToLobby,
  onOpenSettings,
  wallet,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [musicOn, setMusicOn] = useState<boolean>(sounds.musicEnabled);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleToggleMusic = () => {
    const next = sounds.toggleBGM();
    setMusicOn(next);
  };
  const modeNames: Record<GameMode, string> = {
    battle_royale: 'Battle Royale',
    king_of_the_hill: 'King of the Hill',
    weapon_roulette: 'Weapon Roulette',
    chaos: 'Chaos Mode',
    team_deathmatch: 'Team Deathmatch',
    infection: 'Infection Mode',
    the_hero: 'The Hero (300 HP · Axes Only)',
  };

  // Team Deathmatch calculations
  const redPlayers = playerConfigs.filter((p) => p.enabled && p.team === 'red');
  const bluePlayers = playerConfigs.filter((p) => p.enabled && p.team === 'blue');
  const redWins = redPlayers[0]?.score ?? 0;
  const blueWins = bluePlayers[0]?.score ?? 0;
  const aliveRed = players.filter((p) => p.isAlive && p.team === 'red').length;
  const aliveBlue = players.filter((p) => p.isAlive && p.team === 'blue').length;

  // Infection calculations
  const aliveSurvivors = players.filter((p) => p.isAlive && !p.isInfected).length;
  const aliveInfected = players.filter((p) => p.isAlive && p.isInfected).length;
  const survivalTimeRemaining = Math.max(0, 45 - Math.floor(roundTimer));

  // 60-second round countdown (max 1:00 min per round; highest HP wins at timeout)
  const remainingSeconds = Math.max(0, 60 - Math.floor(roundTimer));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-20">
      {/* Top Header Bar - Slim, compact, contains strictly user-requested telemetry & controls */}
      <header className="flex items-center justify-between pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-slate-800 shadow-xl gap-2 sm:gap-3">
        {/* 1. Round Count Telemetry */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-slate-300">الجولة</span>
            <span className="font-mono tabular-nums text-xs font-black text-amber-300">
              {currentRound} / {maxRounds}
            </span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50 hidden md:inline-block">
            {modeNames[gameMode]}
          </span>
        </div>

        {/* 2. Match Timer (Max 1:00 min & Highest HP Rule) & Next Event Timer */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Match Countdown Timer (Max 1:00 min) */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all ${
              remainingSeconds <= 12
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse shadow-md shadow-rose-900/40'
                : 'bg-slate-950/80 border-slate-700/80 text-slate-200'
            }`}
            title="مدة الجولة 1:00 دقيقة كحد أقصى - عند انتهاء الوقت يفوز صاحب أكبر HP دم"
          >
            <span className="text-[11px] font-bold text-slate-400">الوقت:</span>
            <span className="font-mono font-black tabular-nums text-xs">
              00:{remainingSeconds.toString().padStart(2, '0')}
            </span>
            {remainingSeconds <= 15 && (
              <span className="text-[9px] font-bold text-amber-400 hidden lg:inline">
                (أعلى HP يفوز)
              </span>
            )}
          </div>

          {/* Next Event Countdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-sky-500/30 text-sky-300">
            <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">الحدث القادم:</span>
            <span className="font-mono font-black tabular-nums text-xs text-sky-300">
              {Math.ceil(nextEventTimer)}s
            </span>
          </div>
        </div>

        {/* 3. Action Controls: Main Menu, Sound FX, Settings, Pause, Game Size, Restart Match */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Main Menu */}
          <button
            onClick={onBackToLobby}
            title="القائمة الرئيسية (Main Menu)"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] hidden lg:inline">الرئيسية</span>
          </button>

          {/* Sound FX Toggle (المؤثرات الصوتية) */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-rose-400 hover:text-rose-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden xl:inline">{soundEnabled ? 'صوت' : 'مكتوم'}</span>
          </button>

          {/* Settings Modal Toggle (الإعدادات) */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="الإعدادات (Settings)"
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* Pause / Resume Match (إيقاف) */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'استئناف المباراة' : 'إيقاف مؤقت'}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isPaused
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Game Size / Fullscreen (حجم اللعبة) */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'تصغير حجم اللعبة' : 'تكبير حجم اللعبة كاملة'}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Restart Match (إعادة المباراة) */}
          <button
            onClick={onRestartMatch}
            title="إعادة المباراة من البداية"
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400 hover:rotate-180 transition-transform" />
          </button>
        </div>
      </header>

      {/* Center Event Banner Notification */}
      {activeEvent && (
        <div className="self-center pointer-events-none mt-2">
          <div className="bg-slate-950/90 border border-amber-500/50 text-amber-300 px-5 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
            <span className="text-base font-black tracking-wide uppercase text-white">
              {activeEvent.name}
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs text-amber-200">
              {activeEvent.description}
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-xs font-bold text-amber-400">
              {Math.ceil(activeEvent.timeRemaining)}s
            </span>
          </div>
        </div>
      )}

      {/* Bottom Player Status HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 pointer-events-none mt-auto">
        {playerConfigs.map((cfg) => {
          const st = players.find((p) => p.id === cfg.id);
          const isAlive = st?.isAlive ?? false;
          const hp = Math.max(0, Math.round(st?.hp ?? 0));
          const maxHp = st?.maxHp ?? (gameMode === 'the_hero' ? 300 : 200);
          const hpPercent = (hp / maxHp) * 100;

          const weaponLabels: Record<string, string> = {
            fists: 'Fists',
            sword: 'Sword',
            axe: 'Battleaxe',
            gun: 'Blaster',
            rocket: 'Rocket',
            rope: 'Grapple',
            magnet: 'Magnet',
          };

          return (
            <div
              key={cfg.id}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
                isAlive
                  ? gameMode === 'the_hero'
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/30'
                    : gameMode === 'team_deathmatch'
                    ? cfg.team === 'red'
                      ? 'bg-slate-900/90 border-red-500/40 shadow-lg shadow-red-950/30'
                      : 'bg-slate-900/90 border-blue-500/40 shadow-lg shadow-blue-950/30'
                    : gameMode === 'infection' && st?.isInfected
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-900/85 border-slate-800 shadow-lg'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="font-bold text-xs text-white">
                    {cfg.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {cfg.type === 'cpu'
                      ? `CPU (${(cfg.aiDifficulty || 'normal').toUpperCase()})`
                      : 'P' + cfg.id}
                  </span>
                  {gameMode === 'the_hero' && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase bg-rose-500/20 text-rose-300">
                      HERO
                    </span>
                  )}
                  {gameMode === 'team_deathmatch' && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        cfg.team === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {cfg.team === 'red' ? 'RED' : 'BLUE'}
                    </span>
                  )}
                  {gameMode === 'infection' && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        st?.isInfected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
                      }`}
                    >
                      {st?.isInfected ? 'INFECTED' : 'SURVIVOR'}
                    </span>
                  )}
                </div>

                {/* Score wins / KOTH points */}
                <div className="text-right">
                  <span className="text-xs font-mono tabular-nums font-bold text-amber-400">
                    {gameMode === 'king_of_the_hill' ? `${Math.floor(cfg.points)} pts` : `${cfg.score} W`}
                  </span>
                </div>
              </div>

              {/* Health Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">HP</span>
                <span className={`font-bold ${hpPercent > 50 ? 'text-emerald-400' : hpPercent > 25 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {hp}/{maxHp}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-1.5 border border-slate-800">
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${hpPercent}%`,
                    backgroundColor:
                      hpPercent > 50
                        ? '#10b981'
                        : hpPercent > 25
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                />
              </div>

              {/* Status Info (Clean Unboxed Text with Stickman Icons) */}
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  {isAlive ? (
                    gameMode === 'infection' ? (
                      st?.isInfected ? (
                        <span className="text-emerald-400 text-[10px]">
                          ضربة التحويل: {(st?.attackCooldown || 0) > 0 ? (st?.attackCooldown || 0).toFixed(1) + 's' : 'جاهزة ✦'}
                        </span>
                      ) : (
                        <span className="text-sky-400 text-[10px]">
                          مراوغة وقفز (بدون أسلحة)
                        </span>
                      )
                    ) : (
                      <>
                        <StickmanWeaponIcon weapon={st?.weapon || 'fists'} className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {weaponLabels[st?.weapon || 'fists']}
                          {st?.weapon !== 'fists' ? ` (${st?.ammo})` : ''}
                        </span>
                      </>
                    )
                  ) : (
                    <span className="text-rose-400">ELIMINATED</span>
                  )}
                </div>

                <span className="font-mono tabular-nums text-slate-400 text-xs">
                  {isAlive ? `${hp} HP` : 'K.O.'}
                </span>
              </div>

              {/* Active Power-up line */}
              {st?.activePowerUp && isAlive && (
                <div className="mt-1 text-[10px] font-semibold text-sky-400 flex items-center justify-between">
                  <span>
                    {st.activePowerUp === 'giant' && '✦ GIANT'}
                    {st.activePowerUp === 'speed' && '✦ SPEED'}
                    {st.activePowerUp === 'shield' && `✦ SHIELD (${Math.round(st.shieldHp)})`}
                    {st.activePowerUp === 'combo' && '✦ 2X COMBO'}
                    {st.activePowerUp === 'jetpack' && '✦ JETPACK'}
                  </span>
                  <span className="font-mono tabular-nums">
                    {Math.ceil(st.powerUpTimeRemaining)}s
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
