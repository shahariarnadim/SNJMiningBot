import settingsService from "../modules/settings/settingsService.js";
import miningService from "../modules/mining/miningService.js";


/*
 * Get current mining settings.
 */
const getMiningSettings = async () => {
  const settings =
    await settingsService.getSettingsByCategory(
      "MINING"
    );

  return settings;
};


/*
 * Get a single mining setting.
 */
const getMiningSetting = async (
  key
) => {
  if (!key) {
    throw new Error(
      "Mining setting key is required."
    );
  }

  const setting =
    await settingsService.getSetting(
      key
    );

  if (!setting) {
    throw new Error(
      "Mining setting not found."
    );
  }

  return setting;
};


/*
 * Update a single mining setting.
 *
 * Examples:
 * mining_rate
 * mining_duration_seconds
 * mining_enabled
 * claim_enabled
 */
const updateMiningSetting = async (
  key,
  value
) => {
  if (!key) {
    throw new Error(
      "Mining setting key is required."
    );
  }

  const setting =
    await settingsService.getSetting(
      key
    );

  if (!setting) {
    throw new Error(
      "Mining setting not found."
    );
  }

  if (
    setting.category !== "MINING"
  ) {
    throw new Error(
      "This setting does not belong to the mining module."
    );
  }

  return settingsService.updateSetting(
    key,
    value
  );
};


/*
 * Update multiple mining settings.
 */
const updateMiningSettings = async (
  values = {}
) => {
  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error(
      "Mining settings must be an object."
    );
  }

  const allowedKeys = [
    "mining_rate",
    "mining_duration_seconds",
    "mining_enabled",
    "claim_enabled",
    "ad_reward",
  ];

  const updates = {};

  for (
    const key of allowedKeys
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        values,
        key
      )
    ) {
      updates[key] = values[key];
    }
  }

  if (
    Object.keys(updates).length === 0
  ) {
    throw new Error(
      "No valid mining settings were provided."
    );
  }

  return settingsService.updateSettings(
    updates
  );
};


/*
 * Enable mining.
 */
const enableMining = async () => {
  return updateMiningSetting(
    "mining_enabled",
    true
  );
};


/*
 * Disable mining.
 */
const disableMining = async () => {
  return updateMiningSetting(
    "mining_enabled",
    false
  );
};


/*
 * Enable claim.
 */
const enableClaim = async () => {
  return updateMiningSetting(
    "claim_enabled",
    true
  );
};


/*
 * Disable claim.
 */
const disableClaim = async () => {
  return updateMiningSetting(
    "claim_enabled",
    false
  );
};


/*
 * Update mining rate.
 */
const updateMiningRate = async (
  rate
) => {
  const numericRate =
    Number(rate);

  if (
    !Number.isFinite(numericRate) ||
    numericRate < 0
  ) {
    throw new Error(
      "Mining rate must be a valid non-negative number."
    );
  }

  return updateMiningSetting(
    "mining_rate",
    numericRate
  );
};


/*
 * Update mining duration.
 *
 * Duration is stored in seconds.
 */
const updateMiningDuration = async (
  durationSeconds
) => {
  const duration =
    Number(durationSeconds);

  if (
    !Number.isInteger(duration) ||
    duration <= 0
  ) {
    throw new Error(
      "Mining duration must be a positive integer in seconds."
    );
  }

  return updateMiningSetting(
    "mining_duration_seconds",
    duration
  );
};


/*
 * Get mining status for a user.
 *
 * This is kept separate from
 * admin settings so the admin module
 * does not contain mining business logic.
 */
const getUserMiningStatus = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return miningService.getMiningStatus(
    telegramId
  );
};


const adminMiningService = {
  getMiningSettings,
  getMiningSetting,
  updateMiningSetting,
  updateMiningSettings,
  enableMining,
  disableMining,
  enableClaim,
  disableClaim,
  updateMiningRate,
  updateMiningDuration,
  getUserMiningStatus,
};


export default adminMiningService;
