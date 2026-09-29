import { PlayerWallet, HATS, SKINS, SHOES, WEAPON_SKINS } from '../types/shop';
import { PlayerId, PlayerConfig } from '../types/game';

const WALLET_KEY = 'stick_arena_player_wallet_v1';
const PLAYERS_GEAR_KEY = 'stick_arena_players_gear_v1';

export const DEFAULT_WALLET: PlayerWallet = {
  coins: 200, // starting balance for testing
  gems: 10,  // starting balance for testing
  purchasedHats: [],
  purchasedSkins: [],
  purchasedShoes: [],
  purchasedWeaponSkins: [],
  equippedHat: null,
  equippedSkin: null,
  equippedShoes: null,
  equippedWeaponSkin: null,
  redeemedCodes: [],
};

/**
 * Returns a randomized set of cosmetic gear from the shop for CPU bots
 * (Random skin and random hat from shop items, plus optional weapon skin / shoes)
 */
export function getRandomBotCosmetics(): {
  equippedHat: string;
  equippedSkin: string;
  equippedShoes: string | null;
  equippedWeaponSkin: string | null;
} {
  const randomHat = HATS[Math.floor(Math.random() * HATS.length)].id;
  const randomSkin = SKINS[Math.floor(Math.random() * SKINS.length)].id;
  const randomWeapon = Math.random() > 0.35 ? WEAPON_SKINS[Math.floor(Math.random() * WEAPON_SKINS.length)].id : null;
  const randomShoes = Math.random() > 0.7 ? SHOES[0].id : null;

  return {
    equippedHat: randomHat,
    equippedSkin: randomSkin,
    equippedShoes: randomShoes,
    equippedWeaponSkin: randomWeapon,
  };
}

export function loadWallet(): PlayerWallet {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) return { ...DEFAULT_WALLET };
    const parsed = JSON.parse(raw);
    return {
      coins: typeof parsed.coins === 'number' ? parsed.coins : DEFAULT_WALLET.coins,
      gems: typeof parsed.gems === 'number' ? parsed.gems : DEFAULT_WALLET.gems,
      purchasedHats: Array.isArray(parsed.purchasedHats) ? parsed.purchasedHats : [],
      purchasedSkins: Array.isArray(parsed.purchasedSkins) ? parsed.purchasedSkins : [],
      purchasedShoes: Array.isArray(parsed.purchasedShoes) ? parsed.purchasedShoes : [],
      purchasedWeaponSkins: Array.isArray(parsed.purchasedWeaponSkins) ? parsed.purchasedWeaponSkins : [],
      equippedHat: parsed.equippedHat || null,
      equippedSkin: parsed.equippedSkin || null,
      equippedShoes: parsed.equippedShoes || null,
      equippedWeaponSkin: parsed.equippedWeaponSkin || null,
      redeemedCodes: Array.isArray(parsed.redeemedCodes) ? parsed.redeemedCodes : [],
    };
  } catch (err) {
    console.error('Failed to load wallet', err);
    return { ...DEFAULT_WALLET };
  }
}

export function saveWallet(wallet: PlayerWallet) {
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  } catch (err) {
    console.error('Failed to save wallet', err);
  }
}

export interface PlayerSavedGear {
  equippedHat?: string | null;
  equippedSkin?: string | null;
  equippedShoes?: string | null;
  equippedWeaponSkin?: string | null;
}

export function loadPlayersGear(): Record<PlayerId, PlayerSavedGear> {
  try {
    const raw = localStorage.getItem(PLAYERS_GEAR_KEY);
    if (!raw) return {} as Record<PlayerId, PlayerSavedGear>;
    return JSON.parse(raw);
  } catch (e) {
    return {} as Record<PlayerId, PlayerSavedGear>;
  }
}

export function savePlayerGear(playerId: PlayerId, gear: PlayerSavedGear) {
  try {
    const all = loadPlayersGear();
    all[playerId] = {
      ...all[playerId],
      ...gear,
    };
    localStorage.setItem(PLAYERS_GEAR_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save player gear', e);
  }
}

export interface PromoCodeConfig {
  coins: number;
  gems: number;
  message: string;
}

export const PROMO_CODES: Record<string, PromoCodeConfig> = {
  yoru: {
    coins: 200,
    gems: 100,
    message: 'مبروك! تم تفعيل كود Yoru وحصلت على 100 جوهرة و 200 نقود بنجاح!',
  },
  nightnix: {
    coins: 500,
    gems: 500,
    message: 'مبروك! تم تفعيل كود nightnix وحصلت على 500 جوهرة و 500 نقود بنجاح!',
  },
  '0000': {
    coins: 0,
    gems: 100000,
    message: 'مبروك! تم تفعيل كود 0000 وحصلت على 100,000 جوهرة بنجاح!',
  },
  '14789': {
    coins: 0,
    gems: 500,
    message: 'مبروك! تم تفعيل كود 14789 وحصلت على 500 جوهرة بنجاح!',
  },
  '36987': {
    coins: 10000,
    gems: 5000,
    message: 'مبروك! تم تفعيل كود 36987 بنجاح! تم فتح تبويبة (بنك الجواهر والنقود المجاني) في صفحة البداية!',
  },
  niiro: {
    coins: 2000,
    gems: 100,
    message: 'مبروك! تم تفعيل كود niiro وحصلت على 100 جوهرة و 2000 نقود بنجاح!',
  },
  zero: {
    coins: 0,
    gems: 1000,
    message: 'مبروك! تم تفعيل كود zero وحصلت على 1000 جوهرة بنجاح!',
  },
  mr001: {
    coins: 3000,
    gems: 500,
    message: 'مبروك! تم تفعيل كود mr001 وحصلت على 500 جوهرة و 3000 نقود بنجاح!',
  },
  thenightnix: {
    coins: 5000,
    gems: 1000,
    message: 'مبروك! تم تفعيل كود thenightnix وحصلت على 1000 جوهرة و 5000 نقود بنجاح!',
  },
};

/**
 * Validates and activates promo codes:
 * - "Yoru": 100 gems & 200 coins
 * - "nightnix": 500 gems & 500 coins
 * - "0000": 100,000 gems & 0 coins
 * - "14789": 500 gems & 0 coins
 * - "36987": Unlocks Developer Free Currency Generator Tab on Main Menu!
 */
export function redeemPromoCode(inputCode: string): {
  success: boolean;
  message: string;
  newWallet?: PlayerWallet;
  coinsAwarded?: number;
  gemsAwarded?: number;
} {
  const normalized = inputCode.trim().toLowerCase();
  const currentWallet = loadWallet();
  const redeemedList = currentWallet.redeemedCodes || [];

  const promo = PROMO_CODES[normalized];

  if (promo) {
    if (redeemedList.includes(normalized)) {
      return {
        success: false,
        message: 'لقد قمت بتفعيل هذا الكود مسبقاً!',
      };
    }

    const updated: PlayerWallet = {
      ...currentWallet,
      coins: currentWallet.coins + promo.coins,
      gems: currentWallet.gems + promo.gems,
      redeemedCodes: [...redeemedList, normalized],
      unlockedFreeBank: normalized === '36987' ? true : currentWallet.unlockedFreeBank,
    };

    saveWallet(updated);
    return {
      success: true,
      message: promo.message,
      newWallet: updated,
      coinsAwarded: promo.coins,
      gemsAwarded: promo.gems,
    };
  }

  // Any other code is invalid
  return {
    success: false,
    message: 'هذا الكود غير صحيح، تأكد من كتابته بشكل سليم!',
  };
}

/**
 * Claims free recharge bonus from YouTube channel support (+1000 coins, +100 gems)
 */
export function claimYoutubeRecharge(): {
  success: boolean;
  message: string;
  newWallet: PlayerWallet;
  coinsAwarded: number;
  gemsAwarded: number;
} {
  const currentWallet = loadWallet();
  const coinsAwarded = 1000;
  const gemsAwarded = 100;

  const updated: PlayerWallet = {
    ...currentWallet,
    coins: currentWallet.coins + coinsAwarded,
    gems: currentWallet.gems + gemsAwarded,
  };

  saveWallet(updated);
  return {
    success: true,
    message: 'تم شحن رصيد مجاني بنجاح! +1000 نقود و +100 جوهرة',
    newWallet: updated,
    coinsAwarded,
    gemsAwarded,
  };
}

/**
 * Awards standard round completion reward: +50 Coins and +1 Gem!
 */
export function awardRoundRewards(isWinnerBonus: boolean = false): {
  earnedCoins: number;
  earnedGems: number;
  newWallet: PlayerWallet;
} {
  const current = loadWallet();
  const earnedCoins = isWinnerBonus ? 75 : 50; // 50 coins guaranteed per round, 75 if won
  const earnedGems = isWinnerBonus ? 2 : 1;    // 1 gem guaranteed per round, 2 if won

  const updated: PlayerWallet = {
    ...current,
    coins: current.coins + earnedCoins,
    gems: current.gems + earnedGems,
  };

  saveWallet(updated);
  return { earnedCoins, earnedGems, newWallet: updated };
}

/**
 * Free custom currency injection from developer bank unlocked by code 36987
 */
export function addCustomCurrency(coinsToAdd: number, gemsToAdd: number): PlayerWallet {
  const current = loadWallet();
  const updated: PlayerWallet = {
    ...current,
    coins: Math.max(0, current.coins + coinsToAdd),
    gems: Math.max(0, current.gems + gemsToAdd),
    unlockedFreeBank: true,
  };
  saveWallet(updated);
  return updated;
}
