import referralService from "../modules/referrals/referralService.js";


/*
 * Get referral settings.
 */
const getReferralSettings = async () => {
  return referralService.getReferralSettings();
};


/*
 * Update referral settings.
 *
 * Admin can control:
 * - referral enabled/disabled
 * - SNJ reward
 * - N Token reward
 * - minimum conditions
 */
const updateReferralSettings = async (
  values = {}
) => {
  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error(
      "Referral settings must be an object."
    );
  }

  const allowedFields = [
    "enabled",
    "snjReward",
    "nTokenReward",
    "minimumRequirement",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (
      Object.prototype.hasOwnProperty.call(
        values,
        field
      )
    ) {
      updates[field] = values[field];
    }
  }

  if (
    Object.keys(updates).length === 0
  ) {
    throw new Error(
      "No valid referral settings were provided."
    );
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "enabled"
    )
  ) {
    updates.enabled =
      Boolean(updates.enabled);
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "snjReward"
    )
  ) {
    const reward =
      Number(updates.snjReward);

    if (
      !Number.isFinite(reward) ||
      reward < 0
    ) {
      throw new Error(
        "SNJ referral reward must be a non-negative number."
      );
    }

    updates.snjReward =
      reward;
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "nTokenReward"
    )
  ) {
    const reward =
      Number(updates.nTokenReward);

    if (
      !Number.isFinite(reward) ||
      reward < 0
    ) {
      throw new Error(
        "N Token referral reward must be a non-negative number."
      );
    }

    updates.nTokenReward =
      reward;
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "minimumRequirement"
    )
  ) {
    const requirement =
      Number(
        updates.minimumRequirement
      );

    if (
      !Number.isFinite(
        requirement
      ) ||
      requirement < 0
    ) {
      throw new Error(
        "Minimum referral requirement must be a non-negative number."
      );
    }

    updates.minimumRequirement =
      requirement;
  }


  return referralService.updateReferralSettings(
    updates
  );
};


/*
 * Enable referral system.
 */
const enableReferral = async () => {
  return updateReferralSettings({
    enabled: true,
  });
};


/*
 * Disable referral system.
 */
const disableReferral = async () => {
  return updateReferralSettings({
    enabled: false,
  });
};


/*
 * Update SNJ referral reward.
 */
const updateSNJReward = async (
  amount
) => {
  return updateReferralSettings({
    snjReward: amount,
  });
};


/*
 * Update N Token referral reward.
 */
const updateNTokenReward = async (
  amount
) => {
  return updateReferralSettings({
    nTokenReward: amount,
  });
};


/*
 * Get referral statistics.
 */
const getReferralStats = async () => {
  return referralService.getReferralStats();
};


/*
 * Get referral history.
 */
const getReferralHistory = async ({
  limit = 50,
} = {}) => {
  const safeLimit = Math.min(
    Math.max(
      Number(limit) || 50,
      1
    ),
    100
  );

  return referralService.getReferralHistory({
    limit: safeLimit,
  });
};


const adminReferralService = {
  getReferralSettings,
  updateReferralSettings,
  enableReferral,
  disableReferral,
  updateSNJReward,
  updateNTokenReward,
  getReferralStats,
  getReferralHistory,
};


export default adminReferralService;
