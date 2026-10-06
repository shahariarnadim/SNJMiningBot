import crypto from "crypto";

import withdrawalModel from "./withdrawalModel.js";
import balanceService from "../balances/balanceService.js";
import walletService from "../wallets/walletService.js";


const withdrawals = new Map();


/*
 * Default withdrawal settings
 *
 * These are temporary defaults.
 * Later they will come from the database
 * and Admin Settings.
 */
let withdrawalSettings =
  withdrawalModel.createWithdrawalSettings({
    asset: "DOLLAR",
    method: "TON",
    enabled: true,
    minimumAmount: 0.01,
    maximumAmount: 0,
    fee: 0,
    dailyLimit: 0,
    requireWallet: true,
    autoProcessing: false,
  });


/*
 * Get withdrawal settings
 */
const getWithdrawalSettings =
  async () => {
    return withdrawalModel
      .sanitizeWithdrawalSettings(
        withdrawalSettings
      );
  };


/*
 * Update withdrawal settings
 *
 * This will later be restricted
 * to Admin only.
 */
const updateWithdrawalSettings =
  async (
    updates = {}
  ) => {
    withdrawalSettings =
      withdrawalModel.createWithdrawalSettings({
        ...withdrawalSettings,
        ...updates,
      });

    return withdrawalModel
      .sanitizeWithdrawalSettings(
        withdrawalSettings
      );
  };


/*
 * Find withdrawal by ID
 */
const findWithdrawalById =
  async (
    withdrawalId
  ) => {
    if (!withdrawalId) {
      return null;
    }

    return (
      withdrawals.get(
        String(withdrawalId)
      ) || null
    );
  };


/*
 * Find withdrawal by
 * idempotency key.
 */
const findByIdempotencyKey =
  async (
    telegramId,
    idempotencyKey
  ) => {
    if (
      !telegramId ||
      !idempotencyKey
    ) {
      return null;
    }

    return Array.from(
      withdrawals.values()
    ).find(
      (withdrawal) =>
        withdrawal.telegramId ===
          String(telegramId) &&
        withdrawal.idempotencyKey ===
          String(idempotencyKey)
    ) || null;
  };


/*
 * Get user's withdrawals
 */
const getWithdrawalHistory =
  async (
    telegramId
  ) => {
    if (!telegramId) {
      throw new Error(
        "Telegram user ID is required."
      );
    }

    return Array.from(
      withdrawals.values()
    )
      .filter(
        (withdrawal) =>
          withdrawal.telegramId ===
          String(telegramId)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .map(
        (withdrawal) =>
          withdrawalModel
            .sanitizeWithdrawal(
              withdrawal
            )
      );
  };


/*
 * Get withdrawal by ID
 */
const getWithdrawal =
  async (
    telegramId,
    withdrawalId
  ) => {
    const withdrawal =
      await findWithdrawalById(
        withdrawalId
      );

    if (!withdrawal) {
      return null;
    }

    if (
      withdrawal.telegramId !==
      String(telegramId)
    ) {
      throw new Error(
        "Withdrawal access denied."
      );
    }

    return withdrawalModel
      .sanitizeWithdrawal(
        withdrawal
      );
  };


/*
 * Validate withdrawal
 */
const validateWithdrawal =
  async ({
    telegramId,
    amount,
    method = "TON",
    walletId = null,
  } = {}) => {
    if (!telegramId) {
      return {
        valid: false,
        message:
          "Telegram user ID is required.",
      };
    }

    const settings =
      await getWithdrawalSettings();

    if (!settings.enabled) {
      return {
        valid: false,
        message:
          "Withdrawals are currently disabled.",
      };
    }

    const withdrawalMethod =
      String(method).toUpperCase();

    if (
      withdrawalMethod !==
      settings.method
    ) {
      return {
        valid: false,
        message:
          "Selected withdrawal method is unavailable.",
      };
    }

    const amountValidation =
      withdrawalModel
        .validateWithdrawalAmount({
          amount,
          settings,
        });

    if (
      !amountValidation.valid
    ) {
      return amountValidation;
    }

    const numericAmount =
      amountValidation.amount;

    /*
     * Check Dollar balance.
     */
    const balance =
      await balanceService.getDollarBalance(
        telegramId
      );

    if (
      Number(balance) <
      numericAmount
    ) {
      return {
        valid: false,
        message:
          "Insufficient dollar balance.",
      };
    }

    /*
     * Get wallet.
     */
    let wallet = null;

    if (
      settings.requireWallet
    ) {
      if (walletId) {
        wallet =
          await walletService.getWalletById(
            telegramId,
            walletId
          );
      } else {
        wallet =
          await walletService.getTonWallet(
            telegramId
          );
      }

      if (!wallet) {
        return {
          valid: false,
          message:
            "Active TON wallet is required.",
        };
      }

      if (
        wallet.status !==
        "ACTIVE"
      ) {
        return {
          valid: false,
          message:
            "TON wallet is not active.",
        };
      }
    }

    const fee =
      Number(settings.fee || 0);

    const netAmount =
      numericAmount - fee;

    if (
      netAmount <= 0
    ) {
      return {
        valid: false,
        message:
          "Withdrawal amount after fee must be greater than zero.",
      };
    }

    return {
      valid: true,

      asset:
        settings.asset,

      method:
        withdrawalMethod,

      amount:
        numericAmount,

      fee,

      netAmount,

      wallet: wallet
        ? {
            id: wallet.id,
            type: wallet.type,
            address:
              wallet.address,
          }
        : null,
    };
  };


/*
 * Create withdrawal
 */
const createWithdrawal =
  async ({
    telegramId,
    amount,
    method = "TON",
    walletId = null,
    idempotencyKey = null,
    note = "",
  } = {}) => {
    if (!telegramId) {
      throw new Error(
        "Telegram user ID is required."
      );
    }

    /*
     * Prevent duplicate request.
     */
    if (idempotencyKey) {
      const existing =
        await findByIdempotencyKey(
          telegramId,
          idempotencyKey
        );

      if (existing) {
        return withdrawalModel
          .sanitizeWithdrawal(
            existing
          );
      }
    }

    /*
     * Validate everything
     * before changing balance.
     */
    const validation =
      await validateWithdrawal({
        telegramId,
        amount,
        method,
        walletId,
      });

    if (!validation.valid) {
      throw new Error(
        validation.message
      );
    }

    /*
     * Create withdrawal record.
     */
    const withdrawal =
      withdrawalModel
        .createWithdrawalRecord({
          id:
            crypto.randomUUID(),

          telegramId,

          asset:
            validation.asset,

          amount:
            validation.amount,

          method:
            validation.method,

          walletId:
            validation.wallet?.id ||
            null,

          walletAddress:
            validation.wallet
              ?.address || "",

          fee:
            validation.fee,

          netAmount:
            validation.netAmount,

          status:
            "PENDING",

          idempotencyKey,

          note,
        });

    /*
     * IMPORTANT:
     * Reserve/deduct the Dollar
     * balance after validation.
     */
    await balanceService
      .subtractBalance(
        telegramId,
        "dollar",
        validation.amount
      );

    withdrawals.set(
      withdrawal.id,
      withdrawal
    );

    return withdrawalModel
      .sanitizeWithdrawal(
        withdrawal
      );
  };


/*
 * Cancel pending withdrawal
 */
const cancelWithdrawal =
  async (
    telegramId,
    withdrawalId
  ) => {
    const withdrawal =
      await findWithdrawalById(
        withdrawalId
      );

    if (!withdrawal) {
      throw new Error(
        "Withdrawal not found."
      );
    }

    if (
      withdrawal.telegramId !==
      String(telegramId)
    ) {
      throw new Error(
        "Withdrawal access denied."
      );
    }

    if (
      withdrawal.status !==
      "PENDING"
    ) {
      throw new Error(
        "Only pending withdrawals can be cancelled."
      );
    }

    /*
     * Return reserved amount
     * to user's Dollar balance.
     */
    await balanceService.addBalance(
      telegramId,
      "dollar",
      withdrawal.amount
    );

    withdrawal.status =
      "CANCELLED";

    withdrawal.updatedAt =
      new Date();

    withdrawals.set(
      withdrawal.id,
      withdrawal
    );

    return withdrawalModel
      .sanitizeWithdrawal(
        withdrawal
      );
  };


/*
 * Process withdrawal status
 *
 * Later this will be used by
 * Admin/payment processing.
 */
const updateWithdrawalStatus =
  async (
    withdrawalId,
    status,
    transactionHash = null,
    note = ""
  ) => {
    const withdrawal =
      await findWithdrawalById(
        withdrawalId
      );

    if (!withdrawal) {
      throw new Error(
        "Withdrawal not found."
      );
    }

    const newStatus =
      String(status).toUpperCase();

    if (
      !withdrawalModel
        .WITHDRAWAL_STATUSES
        .includes(newStatus)
    ) {
      throw new Error(
        "Invalid withdrawal status."
      );
    }

    /*
     * Prevent changing
     * completed/cancelled records.
     */
    if (
      [
        "COMPLETED",
        "CANCELLED",
      ].
