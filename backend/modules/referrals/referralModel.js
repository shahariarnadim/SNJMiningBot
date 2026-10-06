const createReferralRecord = ({
  id,
  referrerTelegramId,
  referredTelegramId = null,
  referralCode = "",
  status = "PENDING",
  snjReward = 0,
  nTokenReward = 0,
  dollarReward = 0,
} = {}) => {
  if (!referrerTelegramId) {
    throw new Error(
      "Referrer Telegram user ID is required."
    );
  }

  const numericSNJReward =
    Number(snjReward);

  const numericNTokenReward =
    Number(nTokenReward);

  const numericDollarReward =
    Number(dollarReward);

  if (
    !Number.isFinite(numericSNJReward) ||
    numericSNJReward < 0
  ) {
    throw new Error(
      "SNJ referral reward cannot be negative."
    );
  }

  if (
    !Number.isFinite(numericNTokenReward) ||
    numericNTokenReward < 0
  ) {
    throw new Error(
      "N Token referral reward cannot be negative."
    );
  }

  if (
    !Number.isFinite(numericDollarReward) ||
    numericDollarReward < 0
  ) {
    throw new Error(
      "Dollar referral reward cannot be negative."
    );
  }

  return {
    id:
      String(
        id ||
          `referral_${Date.now()}`
      ),

    referrerTelegramId:
      String(referrerTelegramId),

    referredTelegramId:
      referredTelegramId
        ? String(referredTelegramId)
        : null,

    referralCode:
      String(referralCode || ""),

    status:
      String(status || "PENDING"),

    snjReward:
      numericSNJReward,

    nTokenReward:
      numericNTokenReward,

    dollarReward:
      numericDollarReward,

    rewardedAt: null,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};


const createReferralLinkRecord = ({
  telegramId,
  referralCode,
  botUsername = "",
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!referralCode) {
    throw new Error(
      "Referral code is required."
    );
  }

  const cleanUsername =
    String(botUsername || "")
      .replace(/^@/, "");

  return {
    telegramId:
      String(telegramId),

    referralCode:
      String(referralCode),

    botUsername:
      cleanUsername,

    link:
      cleanUsername
        ? `https://t.me/${cleanUsername}?start=ref_${referralCode}`
        : `ref_${referralCode}`,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};


const sanitizeReferral = (
  referral = {}
) => {
  return {
    id:
      referral.id || null,

    referrerTelegramId:
      referral.referrerTelegramId ||
      null,

    referredTelegramId:
      referral.referredTelegramId ||
      null,

    referralCode:
      referral.referralCode || "",

    status:
      referral.status || "UNKNOWN",

    snjReward:
      Number(
        referral.snjReward || 0
      ),

    nTokenReward:
      Number(
        referral.nTokenReward || 0
      ),

    dollarReward:
      Number(
        referral.dollarReward || 0
      ),

    rewardedAt:
      referral.rewardedAt || null,

    createdAt:
      referral.createdAt || null,

    updatedAt:
      referral.updatedAt || null,
  };
};


const sanitizeReferralLink = (
  link = {}
) => {
  return {
    telegramId:
      link.telegramId || null,

    referralCode:
      link.referralCode || "",

    botUsername:
      link.botUsername || "",

    link:
      link.link || "",

    createdAt:
      link.createdAt || null,

    updatedAt:
      link.updatedAt || null,
  };
};


const referralModel = {
  createReferralRecord,
  createReferralLinkRecord,
  sanitizeReferral,
  sanitizeReferralLink,
};

export default referralModel;
