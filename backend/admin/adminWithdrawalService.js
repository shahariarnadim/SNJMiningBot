import settingsService from "../modules/settings/settingsService.js";
import withdrawalService from "../modules/withdrawals/withdrawalService.js";


/*
 * Get current withdrawal settings.
 */
const getWithdrawalSettings = async () => {
  const settings =
    await settingsService.getSettingsByCategory(
      "WITHDRAWALS"
    );

  return settings;
};


/*
 * Get a single withdrawal setting.
 */
const getWithdrawalSetting = async (
  key
) => {
  if (!key) {
    throw new Error(
      "Withdrawal setting key is required."
    );
  }

  const setting =
    await settingsService.getSetting(
      key
    );

  if (!setting) {
    throw new Error(
      "Withdrawal setting not found."
    );
  }

  if (
    setting.category !== "WITHDRAWALS"
  ) {
    throw new Error(
      "This setting does not belong to the withdrawal module."
    );
  }

  return setting;
};


/*
 * Update a single withdrawal setting.
 */
const updateWithdrawalSetting = async (
  key,
  value
) => {
  const setting =
    await getWithdrawalSetting(key);

  return settingsService.updateSetting(
    setting.key,
    value
  );
};


/*
 * Update multiple withdrawal settings.
 *
 * These settings remain centralized
 * and database-controlled later.
 */
const updateWithdrawalSettings = async (
  values = {}
) => {
  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error(
      "Withdrawal settings must be an object."
    );
  }

  const allowedKeys = [
    "withdrawal_enabled",
    "withdrawal_minimum",
    "withdrawal_fee",
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
      updates[key] =
        values[key];
    }
  }

  if (
    Object.keys(updates).length === 0
  ) {
    throw new Error(
      "No valid withdrawal settings were provided."
    );
  }


  /*
   * Validate withdrawal enabled.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "withdrawal_enabled"
    )
  ) {
    updates.withdrawal_enabled =
      Boolean(
        updates.withdrawal_enabled
      );
  }


  /*
   * Validate minimum withdrawal.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "withdrawal_minimum"
    )
  ) {
    const minimum =
      Number(
        updates.withdrawal_minimum
      );

    if (
      !Number.isFinite(minimum) ||
      minimum < 0
    ) {
      throw new Error(
        "Withdrawal minimum must be a non-negative number."
      );
    }

    updates.withdrawal_minimum =
      minimum;
  }


  /*
   * Validate withdrawal fee.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "withdrawal_fee"
    )
  ) {
    const fee =
      Number(
        updates.withdrawal_fee
      );

    if (
      !Number.isFinite(fee) ||
      fee < 0
    ) {
      throw new Error(
        "Withdrawal fee must be a non-negative number."
      );
    }

    updates.withdrawal_fee =
      fee;
  }


  return settingsService.updateSettings(
    updates
  );
};


/*
 * Enable withdrawals.
 */
const enableWithdrawals = async () => {
  return updateWithdrawalSetting(
    "withdrawal_enabled",
    true
  );
};


/*
 * Disable withdrawals.
 */
const disableWithdrawals = async () => {
  return updateWithdrawalSetting(
    "withdrawal_enabled",
    false
  );
};


/*
 * Update minimum withdrawal amount.
 */
const updateMinimumWithdrawal = async (
  amount
) => {
  return updateWithdrawalSetting(
    "withdrawal_minimum",
    Number(amount)
  );
};


/*
 * Update withdrawal fee.
 */
const updateWithdrawalFee = async (
  fee
) => {
  return updateWithdrawalSetting(
    "withdrawal_fee",
    Number(fee)
  );
};


/*
 * Get supported withdrawal assets.
 */
const getSupportedAssets = async () => {
  return withdrawalService
    .getSupportedAssets();
};


/*
 * Get supported withdrawal methods.
 */
const getSupportedMethods = async () => {
  return withdrawalService
    .getSupportedMethods();
};


/*
 * Get a user's withdrawal history.
 *
 * This is kept separate from admin
 * settings and withdrawal processing.
 */
const getUserWithdrawalHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return withdrawalService
    .getWithdrawalHistory(
      telegramId
    );
};


/*
 * Update withdrawal status.
 *
 * This operation is intended for
 * trusted Admin/System use only.
 */
const updateWithdrawalStatus = async (
  withdrawalId,
  status,
  data = {}
) => {
  if (!withdrawalId) {
    throw new Error(
      "Withdrawal ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "Withdrawal status is required."
    );
  }

  return withdrawalService
    .updateWithdrawalStatus(
      withdrawalId,
      status,
      data
    );
};


const adminWithdrawalService = {
  getWithdrawalSettings,
  getWithdrawalSetting,
  updateWithdrawalSetting,
  updateWithdrawalSettings,
  enableWithdrawals,
  disableWithdrawals,
  updateMinimumWithdrawal,
  updateWithdrawalFee,
  getSupportedAssets,
  getSupportedMethods,
  getUserWithdrawalHistory,
  updateWithdrawalStatus,
};


export default adminWithdrawalService;
