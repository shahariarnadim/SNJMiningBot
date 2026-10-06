import referralModel from "./referralModel.js";
import balanceService from "../balances/balanceService.js";

const referrals = new Map();
const referralLinks = new Map();

const referralSettings = {
  snjReward: 10,
  nTokenReward: 1,
  dollarReward: 0,
  minimumActivityRequired: true,
};


/*
 * Generate a unique referral code.
 */
const generateReferralCode = (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const cleanId =
    String(telegramId)
      .replace(/\D/g, "");

  return `SNJ${cleanId.slice(-8)}`;
};


/*
 * Get or create referral link.
 */
const getReferralLink = async (
  telegramId,
  botUsername = ""
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const key =
    String(telegramId);

  const existing =
    referralLinks.get(key);

  if (existing) {
    return referralModel
      .sanitizeReferralLink(
        existing
      );
  }

  const referralCode =
    generateReferralCode(
      telegramId
    );

  const link =
    referralModel
      .createReferralLinkRecord({
        telegramId,
        referralCode,
        botUsername,
      });

  referralLinks.set(
    key,
    link
  );

  return referralModel
    .sanitizeReferralLink(
      link
    );
};


/*
 * Register a new referral.
 */
const createReferral = async ({
  referrerTelegramId,
  referredTelegramId,
} = {}) => {
  if (!referrerTelegramId) {
    throw new Error(
      "Referrer Telegram user ID is required."
    );
  }

  if (!referredTelegramId) {
    throw new Error(
      "Referred Telegram user ID is required."
    );
  }

  const referrer =
    String(referrerTelegramId);

  const referred =
    String(referredTelegramId);

  /*
   * Prevent self-referral.
   */
  if (referrer === referred) {
    throw new Error(
      "Self-referral is not allowed."
    );
  }

  /*
   * Prevent duplicate referral.
   */
  for (
    const referral
    of referrals.values()
  ) {
    if (
      referral.referredTelegramId ===
      referred
    ) {
      throw new Error(
        "This user has already been referred."
      );
    }
  }

  const referralLink =
    referralLinks.get(referrer);

  const referralCode =
    referralLink?.referralCode ||
    generateReferralCode(referrer);

  const referral =
    referralModel
      .createReferralRecord({
        referrerTelegramId:
          referrer,

        referredTelegramId:
          referred,

        referralCode,

        status: "PENDING",

        snjReward:
          referralSettings.snjReward,

        nTokenReward:
          referralSettings.nTokenReward,

        dollarReward:
          referralSettings.dollarReward,
      });

  referrals.set(
    referral.id,
    referral
  );

  return referralModel
    .sanitizeReferral(
      referral
    );
};


/*
 * Get referral statistics.
 */
const getReferralStats = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const userId =
    String(telegramId);

  const userReferrals =
    Array.from(
      referrals.values()
    ).filter(
      (referral) =>
        referral.referrerTelegramId ===
        userId
    );

  const total =
    userReferrals.length;

  const pending =
    userReferrals.filter(
      (referral) =>
        referral.status ===
        "PENDING"
    ).length;

  const completed =
    userReferrals.filter(
      (referral) =>
        referral.status ===
        "COMPLETED"
    ).length;

  const rewarded =
    userReferrals.filter(
      (referral) =>
        referral.status ===
        "REWARDED"
    ).length;

  return {
    total,
    pending,
    completed,
    rewarded,
  };
};


/*
 * Get referral history.
 */
const getReferralHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const userId =
    String(telegramId);

  return Array.from(
    referrals.values()
  )
    .filter(
      (referral) =>
        referral.referrerTelegramId ===
        userId
    )
    .map(
      (referral) =>
        referralModel
          .sanitizeReferral(
            referral
          )
    );
};


/*
 * Get one referral.
 */
const getReferralById = async (
  telegramId,
  referralId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!referralId) {
    throw new Error(
      "Referral ID is required."
    );
  }

  const referral =
    referrals.get(
      String(referralId)
    );

  if (!referral) {
    return null;
  }

  if (
    referral.referrerTelegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Referral access denied."
    );
  }

  return referralModel
    .sanitizeReferral(
      referral
    );
};


/*
 * Mark referral as completed.
 */
const completeReferral = async (
  referredTelegramId
) => {
  if (!referredTelegramId) {
    throw new Error(
      "Referred Telegram user ID is required."
    );
  }

  const referred =
    String(
      referredTelegramId
    );

  const referral =
    Array.from(
      referrals.values()
    ).find(
      (item) =>
        item.referredTelegramId ===
        referred
    );

  if (!referral) {
    throw new Error(
      "Referral record not found."
    );
  }

  if (
    referral.status ===
    "REWARDED"
  ) {
    throw new Error(
      "Referral reward has already been given."
    );
  }

  referral.status =
    "COMPLETED";

  referral.updatedAt =
    new Date();

  referrals.set(
    referral.id,
    referral
  );

  return referralModel
    .sanitizeReferral(
      referral
    );
};


/*
 * Reward a completed referral.
 */
const rewardReferral = async (
  referralId
) => {
  if (!referralId) {
    throw new Error(
      "Referral ID is required."
    );
  }

  const referral =
    referrals.get(
      String(referralId)
    );

  if (!referral) {
    throw new Error(
      "Referral not found."
    );
  }

  if (
    referral.status ===
    "REWARDED"
  ) {
    throw new Error(
      "Referral reward has already been given."
    );
  }

  if (
    referral.status !==
    "COMPLETED"
  ) {
    throw new Error(
      "Referral must be completed before reward."
    );
  }

  /*
   * SNJ reward.
   */
  if (
    Number(referral.snjReward) > 0
  ) {
    await balanceService.addBalance(
      referral.referrerTelegramId,
      "snj",
      referral.snjReward
    );
  }

  /*
   * N Token reward.
   */
  if (
    Number(
      referral.nTokenReward
    ) > 0
  ) {
    await balanceService.addBalance(
      referral.referrerTelegramId,
      "nToken",
      referral.nTokenReward
    );
  }

  /*
   * Dollar reward.
   */
  if (
    Number(
      referral.dollarReward
    ) > 0
  ) {
    await balanceService.addBalance(
      referral.referrerTelegramId,
      "dollar",
      referral.dollarReward
    );
  }

  referral.status =
    "REWARDED";

  referral.rewardedAt =
    new Date();

  referral.updatedAt =
    new Date();

  referrals.set(
    referral.id,
    referral
  );

  return {
    success: true,

    referral:
      referralModel
        .sanitizeReferral(
          referral
        ),

    rewards: {
      snj:
        Number(
          referral.snjReward || 0
        ),

      nToken:
        Number(
          referral.nTokenReward || 0
        ),

      dollar:
        Number(
          referral.dollarReward || 0
        ),
    },
  };
};


/*
 * Referral settings.
 */
const getReferralSettings =
  async () => {
    return {
      snjReward:
        referralSettings.snjReward,

      nTokenReward:
        referralSettings.nTokenReward,

      dollarReward:
        referralSettings.dollarReward,

      minimumActivityRequired:
        referralSettings
          .minimumActivityRequired,
    };
  };


const referralService = {
  generateReferralCode,
  getReferralLink,
  createReferral,
  getReferralStats,
  getReferralHistory,
  getReferralById,
  completeReferral,
  rewardReferral,
  getReferralSettings,
};

export default referralService;
