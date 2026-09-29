import React, { useEffect, useState } from 'react';
import { PlayerConfig, PlayerId, GameMode, RoundPlacement } from '../types/game';
import {
  Trophy,
  RotateCcw,
  ArrowRight,
  Home,
  Coins,
  Gem,
  Crown,
  Medal,
  Award,
  Flame,
  Zap,
  Shirt,
  Footprints,
  Swords,
} from 'lucide-react';
import { HATS, SKINS, SHOES, WEAPON_SKINS } from '../types/shop';

interface RoundSummaryModalProps {
  winnerId: PlayerId | null;
  matchChampionId: PlayerId | null;
  playerConfigs: PlayerConfig[];
  placements?: RoundPlacement[];
  currentRound: number;
  maxRounds: number;
  gameMode?: GameMode;
  winningTeam?: 'red' | 'blue' | null;
  infectionOutcome?: 'zombies' | 'survivors' | null;
  onNextRound: () => void;
  onRestartMatch: () => void;
  onBackToLobby: () => void;
  roundReward?: { coins: number; gems: number };
}

/* Vector Stickman Avatar for the Summary Screen */
const StickmanSummaryAvatar: React.FC<{
  color: string;
  glowColor: string;
  hatId?: string | null;
  skinId?: string | null;
  isWinner?: boolean;
}> = ({ color, glowColor, hatId, skinId, isWinner }) => {
  const hat = hatId ? HATS.find((h) => h.id === hatId) : null;
  const skin = skinId ? SKINS.find((s) => s.id === skinId) : null;
  const bodyColor = skin ? skin.primaryColor : color;

  return (
    <div className="relative w-16 h-20 flex items-center justify-center shrink-0">
      {/* Ambient Backlight Aura */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-50"
        style={{ backgroundColor: glowColor }}
      />

      <svg viewBox="0 0 60 76" fill="none" className="w-full h-full relative z-10 drop-shadow-md">
        {/* Head */}
        <circle
          cx="30"
          cy="20"
          r="9"
          stroke={bodyColor}
          strokeWidth="3.5"
          fill="#0f172a"
        />

        {/* Eyes (Glowing Dots) */}
        <circle cx="27" cy="19" r="1.5" fill={glowColor} />
        <circle cx="33" cy="19" r="1.5" fill={glowColor} />

        {/* Hat graphic if equipped */}
        {hat && (
          <g transform="translate(14, 2) scale(0.32)">
            {hat.id === 'royal_crown' || hat.isSpecial ? (
              <polygon
                points="20,40 25,12 35,28 50,8 65,28 75,12 80,40"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="3"
              />
            ) : hat.id === 'cowboy_hat' ? (
              <path
                d="M 5 50 Q 50 68 95 50 Q 50 42 5 50 Z"
                fill="#78350f"
                stroke="#451a03"
                strokeWidth="4"
              />
            ) : hat.id === 'ninja_bandana' ? (
              <rect x="18" y="24" width="64" height="14" rx="4" fill="#dc2626" />
            ) : (
              <path d="M 28 46 Q 50 16 72 46 Z" fill="#64748b" stroke="#334155" strokeWidth="4" />
            )}
          </g>
        )}

        {/* Torso / Spine */}
        <line
          x1="30"
          y1="29"
          x2="30"
          y2="49"
          stroke={bodyColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Arms (Victory cheer pose if winner) */}
        {isWinner ? (
          <path
            d="M 16 32 L 30 36 L 44 32"
            stroke={bodyColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 18 42 L 30 36 L 42 42"
            stroke={bodyColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Legs */}
        <path
          d="M 18 70 L 30 49 L 42 70"
          stroke={bodyColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  winnerId,
  matchChampionId,
  playerConfigs,
  placements = [],
  currentRound,
  maxRounds,
  gameMode,
  winningTeam,
  infectionOutcome,
  onNextRound,
  onRestartMatch,
  onBackToLobby,
  roundReward = { coins: 50, gems: 1 },
}) => {
  const winner = playerConfigs.find((p) => p.id === winnerId);
  const champion = playerConfigs.find((p) => p.id === matchChampionId);
  const isMatchOver = matchChampionId !== null;

  // Countdown timer decrement: 10 seconds for reviewing standings and cosmetics
  const [countdown, setCountdown] = useState<number>(10);

  useEffect(() => {
    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMatchOver, currentRound]);

  // When countdown hits 0, trigger next step
  useEffect(() => {
    if (countdown === 0) {
      if (isMatchOver) {
        onBackToLobby();
      } else {
        onNextRound();
      }
    }
  }, [countdown, isMatchOver, onBackToLobby, onNextRound]);

  // Determine round title & subtitle
  let roundTitle = `الجولة ${currentRound} انتهت! (ROUND FINISHED)`;
  let roundSubtitle = winner ? `الفائز بالجولة: ${winner.name}` : 'تعادل في هذه الجولة!';
  let titleColor = winner?.color || '#38bdf8';

  if (gameMode === 'team_deathmatch' && winningTeam) {
    titleColor = winningTeam === 'red' ? '#ef4444' : '#3b82f6';
    roundSubtitle = `${winningTeam === 'red' ? 'الفريق الأحمر' : 'الفريق الأزرق'} فاز بالجولة!`;
  } else if (gameMode === 'infection') {
    titleColor = '#38bdf8';
    if (winner) {
      roundTitle = `${winner.name} يفوز بالجولة!`;
      roundSubtitle = 'صمد حتى النهاية كناجٍ أخير! (Last Survivor Standing)';
    } else {
      roundSubtitle = 'انتهت جولة العدوى!';
    }
  }

  // Champion match text
  let champTitle = 'بطل البطولة! (MATCH CHAMPION)';
  let champSubtitle = `${champion?.name || 'Player'} فاز بالبطولة الكاملة!`;
  let champColor = champion?.color || '#fbbf24';

  if (gameMode === 'team_deathmatch' && winningTeam) {
    champColor = winningTeam === 'red' ? '#ef4444' : '#3b82f6';
    champSubtitle = `${winningTeam === 'red' ? 'الفريق الأحمر' : 'الفريق الأزرق'} أبطال البطولة!`;
  }

  // Compute or align players with placements
  const enabledPlayers = playerConfigs.filter((p) => p.enabled);

  // Sort players by their placement rank or points/score
  const sortedPlayers = [...enabledPlayers].sort((a, b) => {
    const plA = placements.find((p) => p.playerId === a.id);
    const plB = placements.find((p) => p.playerId === b.id);
    if (plA && plB) return plA.rank - plB.rank;
    if (a.id === winnerId) return -1;
    if (b.id === winnerId) return 1;
    return b.score - a.score || (b.points || 0) - (a.points || 0);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-3 sm:p-5 select-none animate-in fade-in duration-200 overflow-y-auto">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-3xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col my-auto max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Header Victory Banner */}
        <div className="text-center shrink-0 mb-4">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-2 shadow-inner animate-bounce">
            {isMatchOver ? (
              <Crown className="w-8 h-8 text-amber-400" />
            ) : (
              <Trophy className="w-8 h-8 text-amber-400" />
            )}
          </div>

          {isMatchOver ? (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                {champTitle}
              </h2>
              <div
                className="text-lg sm:text-xl font-black mt-1 tracking-wide"
                style={{ color: champColor }}
              >
                {champSubtitle}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                {roundTitle}
              </h2>
              <div
                className="text-base sm:text-lg font-bold mt-1"
                style={{ color: titleColor }}
              >
                {roundSubtitle}
              </div>
            </div>
          )}

          {/* Points Distribution Announcement Banner */}
          <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Medal className="w-3.5 h-3.5" /> الأول: +3 نقاط
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> الثاني: +2 نقاط
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-amber-600 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" /> الثالث: +1 نقطة
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">البقية: 0 نقاط</span>
          </div>
        </div>

        {/* Currency Reward Banner */}
        <div className="shrink-0 mb-4 py-2 px-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-800/90 to-cyan-950/40 border border-amber-500/30 flex items-center justify-between shadow-inner">
          <span className="text-xs font-bold text-slate-300">مكافأة المشاركة بالجولة:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono font-black text-amber-300 text-xs">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              +{roundReward?.coins ?? 50} نقود
            </span>
            <span className="flex items-center gap-1 font-mono font-black text-cyan-300 text-xs">
              <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
              +{roundReward?.gems ?? 1} جوهرة
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ALL PARTICIPATING CHARACTERS WITH RICH BACKDROP & POINTS        */}
        {/* ============================================================== */}
        <div className="flex-1 space-y-2.5 mb-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span>ترتيب المقاتلين والنقاط (FIGHTERS STANDINGS)</span>
            <span className="text-slate-500 font-mono">الهدف: {maxRounds} جولات فوز</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedPlayers.map((cfg, index) => {
              const placement = placements.find((p) => p.playerId === cfg.id);
              const rank = placement ? placement.rank : index + 1;
              const pointsEarned = placement
                ? placement.pointsEarned
                : rank === 1
                ? 3
                : rank === 2
                ? 2
                : rank === 3
                ? 1
                : 0;

              const isRoundWinner = cfg.id === winnerId;
              const isChamp = cfg.id === matchChampionId;

              // Rank styling & badges
              let rankBadge = (
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold">
                  #{rank}
                </span>
              );
              let cardBg =
                'bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-slate-800 hover:border-slate-700';

              if (rank === 1) {
                rankBadge = (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-black flex items-center gap-1 shadow-sm">
                    🥇 المركز الأول
                  </span>
                );
                cardBg =
                  'bg-gradient-to-br from-amber-950/40 via-slate-900/95 to-amber-950/20 border-amber-500/60 ring-1 ring-amber-400/40 shadow-lg shadow-amber-950/40';
              } else if (rank === 2) {
                rankBadge = (
                  <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1">
                    🥈 المركز الثاني
                  </span>
                );
                cardBg =
                  'bg-gradient-to-br from-cyan-950/30 via-slate-900/90 to-slate-950/90 border-cyan-500/40 shadow-md';
              } else if (rank === 3) {
                rankBadge = (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-700/20 text-amber-400 border border-amber-600/40 text-[10px] font-bold flex items-center gap-1">
                    🥉 المركز الثالث
                  </span>
                );
                cardBg =
                  'bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-slate-950/90 border-amber-600/40 shadow-sm';
              }

              return (
                <div
                  key={cfg.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${cardBg}`}
                >
                  {/* Left: Avatar with rich background & glow */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <StickmanSummaryAvatar
                        color={cfg.color}
                        glowColor={cfg.glowColor}
                        hatId={cfg.equippedHat}
                        skinId={cfg.equippedSkin}
                        isWinner={isRoundWinner}
                      />
                      {/* Status indicator */}
                      {placement && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-slate-950/90 border border-slate-700 text-slate-300">
                          {placement.isAlive ? `${placement.hpLeft} HP` : 'تمت تصفيته'}
                        </div>
                      )}
                    </div>

                    {/* Name & Player Type Details */}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {rankBadge}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            cfg.type === 'human'
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {cfg.type === 'human' ? 'لاعب' : 'بوت'}
                        </span>
                        {gameMode === 'team_deathmatch' && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              cfg.team === 'red'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {cfg.team === 'red' ? 'فريق أحمر' : 'فريق أزرق'}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-black text-white mt-1 tracking-wide flex items-center gap-1.5">
                        <span>{cfg.name}</span>
                        {(isChamp || isRoundWinner) && (
                          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        فوز بالجولات: <span className="text-white font-bold">{cfg.score}</span>
                      </div>

                      {/* Equipped Cosmetics / Skins Display */}
                      {(() => {
                        const hatObj = cfg.equippedHat ? HATS.find((h) => h.id === cfg.equippedHat) : null;
                        const skinObj = cfg.equippedSkin ? SKINS.find((s) => s.id === cfg.equippedSkin) : null;
                        const shoeObj = cfg.equippedShoes ? SHOES.find((s) => s.id === cfg.equippedShoes) : null;
                        const weaponSkinObj = cfg.equippedWeaponSkin ? WEAPON_SKINS.find((w) => w.id === cfg.equippedWeaponSkin) : null;

                        const hasAnyCosmetic = hatObj || skinObj || shoeObj || weaponSkinObj;

                        return (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap text-[10px]">
                            {skinObj && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold" title="سكين الشخصية">
                                <Shirt className="w-2.5 h-2.5 text-sky-400" />
                                <span>{skinObj.nameAr}</span>
                              </span>
                            )}
                            {hatObj && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold" title="القبعة">
                                <Crown className="w-2.5 h-2.5 text-amber-400" />
                                <span>{hatObj.nameAr}</span>
                              </span>
                            )}
                            {shoeObj && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 font-bold" title="الحذاء">
                                <Footprints className="w-2.5 h-2.5 text-fuchsia-400" />
                                <span>{shoeObj.nameAr}</span>
                              </span>
                            )}
                            {weaponSkinObj && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold" title="سلاح النيون">
                                <Swords className="w-2.5 h-2.5 text-rose-400" />
                                <span>{weaponSkinObj.nameAr}</span>
                              </span>
                            )}
                            {!hasAnyCosmetic && (
                              <span className="text-[10px] text-slate-500 font-medium">
                                المظهر الافتراضي
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right: Round Points Earned & Total Accumulated Points */}
                  <div className="text-right flex flex-col items-end shrink-0">
                    {/* Points Earned This Round */}
                    <div
                      className={`px-2.5 py-1 rounded-xl font-mono text-xs font-black shadow-inner flex items-center gap-1 ${
                        pointsEarned === 3
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : pointsEarned === 2
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : pointsEarned === 1
                          ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>+{pointsEarned} نقاط</span>
                    </div>

                    {/* Total Match Points */}
                    <div className="text-[10px] text-slate-400 mt-1.5 font-medium">
                      المجموع:{' '}
                      <span className="font-mono font-bold text-white text-xs">
                        {cfg.points || 0}
                      </span>{' '}
                      نقطة
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80 shrink-0 flex-wrap">
          <button
            onClick={onBackToLobby}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-sky-400" />
            <span>القائمة الرئيسية</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestartMatch}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>إعادة المباراة</span>
            </button>

            {isMatchOver ? (
              <button
                onClick={onBackToLobby}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-lg shadow-amber-400/25 transition-all cursor-pointer"
              >
                <span>العودة للوبي ({countdown}s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onNextRound}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-lg shadow-amber-400/25 transition-all cursor-pointer"
              >
                <span>الجولة التالية ({countdown}s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
