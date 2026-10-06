import crypto from "crypto";

import transactionModel from "./transactionModel.js";


const transactions = new Map();


/*
 * Create a transaction
 */
const createTransaction = async ({
  telegramId,
  asset,
  type,
  amount,
  status = "COMPLETED",
  referenceId = null,
  referenceType = null,
  balanceBefore = null,
  balanceAfter = null,
  description = "",
  metadata = {},
  idempotencyKey = null,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  /*
   * Prevent duplicate transaction
   * when an idempotency key exists.
   */
  if (idempotencyKey) {
    const existing =
      await findByIdempotencyKey(
        telegramId,
        idempotencyKey
      );

    if (existing) {
      return transactionModel
        .sanitizeTransaction(
          existing
        );
    }
  }

  const amountValidation =
    transactionModel
      .validateTransactionAmount(
        amount
      );

  if (!amountValidation.valid) {
    throw new Error(
      amountValidation.message
    );
  }

  const transaction =
    transactionModel
      .createTransactionRecord({
        id:
          crypto.randomUUID(),

        telegramId,

        asset,

        type,

        amount:
          amountValidation.amount,

        status,

        referenceId,

        referenceType,

        balanceBefore,

        balanceAfter,

        description,

        metadata,

        idempotencyKey,
      });

  transactions.set(
    transaction.id,
    transaction
  );

  return transactionModel
    .sanitizeTransaction(
      transaction
    );
};


/*
 * Find transaction by ID
 */
const findTransactionById =
  async (
    transactionId
  ) => {
    if (!transactionId) {
      return null;
    }

    return (
      transactions.get(
        String(transactionId)
      ) || null
    );
  };


/*
 * Find transaction using
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

    return (
      Array.from(
        transactions.values()
      ).find(
        (transaction) =>
          transaction.telegramId ===
            String(telegramId) &&
          transaction.idempotencyKey ===
            String(idempotencyKey)
      ) || null
    );
  };


/*
 * Get user's transactions
 */
const getTransactions =
  async ({
    telegramId,
    asset = null,
    type = null,
    status = null,
    limit = 50,
  } = {}) => {
    if (!telegramId) {
      throw new Error(
        "Telegram user ID is required."
      );
    }

    const safeLimit = Math.min(
      Math.max(
        Number(limit) || 50,
        1
      ),
      100
    );

    let result =
      Array.from(
        transactions.values()
      ).filter(
        (transaction) =>
          transaction.telegramId ===
          String(telegramId)
      );

    if (asset) {
      const normalizedAsset =
        String(asset).toUpperCase();

      result =
        result.filter(
          (transaction) =>
            transaction.asset ===
            normalizedAsset
        );
    }

    if (type) {
      const normalizedType =
        String(type).toUpperCase();

      result =
        result.filter(
          (transaction) =>
            transaction.type ===
            normalizedType
        );
    }

    if (status) {
      const normalizedStatus =
        String(status).toUpperCase();

      result =
        result.filter(
          (transaction) =>
            transaction.status ===
            normalizedStatus
        );
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return result
      .slice(0, safeLimit)
      .map(
        (transaction) =>
          transactionModel
            .sanitizeTransaction(
              transaction
            )
      );
  };


/*
 * Get transaction by ID
 */
const getTransaction =
  async (
    telegramId,
    transactionId
  ) => {
    const transaction =
      await findTransactionById(
        transactionId
      );

    if (!transaction) {
      return null;
    }

    if (
      transaction.telegramId !==
      String(telegramId)
    ) {
      throw new Error(
        "Transaction access denied."
      );
    }

    return transactionModel
      .sanitizeTransaction(
        transaction
      );
  };


/*
 * Get asset transaction history
 */
const getAssetHistory =
  async (
    telegramId,
    asset,
    limit = 50
  ) => {
    return getTransactions({
      telegramId,
      asset,
      limit,
    });
  };


/*
 * Get transaction summary
 */
const getTransactionSummary =
  async (
    telegramId
  ) => {
    const userTransactions =
      await getTransactions({
        telegramId,
        limit: 100,
      });

    const summary = {
      SNJ: {
        credits: 0,
        debits: 0,
        transactions: 0,
      },

      N_TOKEN: {
        credits: 0,
        debits: 0,
        transactions: 0,
      },

      DOLLAR: {
        credits: 0,
        debits: 0,
        transactions: 0,
      },
    };

    for (
      const transaction
      of userTransactions
    ) {
      const asset =
        transaction.asset;

      if (
        !summary[asset]
      ) {
        continue;
      }

      const amount =
        Number(
          transaction.amount || 0
        );

      const direction =
        transactionModel
          .getTransactionDirection(
            transaction.type
          );

      summary[asset]
        .transactions += 1;

      if (
        direction ===
        "DEBIT"
      ) {
        summary[asset]
          .debits += amount;
      } else {
        summary[asset]
          .credits += amount;
      }
    }

    return summary;
  };


/*
 * Update transaction status
 */
const updateTransactionStatus =
  async (
    transactionId,
    status,
    metadata = {}
  ) => {
    const transaction =
      await findTransactionById(
        transactionId
      );

    if (!transaction) {
      throw new Error(
        "Transaction not found."
      );
    }

    const newStatus =
      String(status).toUpperCase();

    if (
      !transactionModel
        .TRANSACTION_STATUSES
        .includes(newStatus)
    ) {
      throw new Error(
        "Invalid transaction status."
      );
    }

    if (
      [
        "COMPLETED",
        "REVERSED",
      ].includes(
        transaction.status
      ) &&
      transaction.status !==
        newStatus
    ) {
      throw new Error(
        "Finalized transaction cannot be changed."
      );
    }

    transaction.status =
      newStatus;

    if (
      metadata &&
      typeof metadata ===
        "object"
    ) {
      transaction.metadata = {
        ...transaction.metadata,
        ...metadata,
      };
    }

    transaction.updatedAt =
      new Date();

    transactions.set(
      transaction.id,
      transaction
    );

    return transactionModel
      .sanitizeTransaction(
        transaction
      );
  };


/*
 * Get supported transaction
 * assets
 */
const getSupportedAssets =
  async () => {
    return transactionModel
      .getSupportedAssets();
  };


/*
 * Get supported transaction
 * types
 */
const getSupportedTransactionTypes =
  async () => {
    return transactionModel
      .getSupportedTransactionTypes();
  };


/*
 * Get supported transaction
 * statuses
 */
const getSupportedStatuses =
  async () => {
    return transactionModel
      .getSupportedStatuses();
  };


const transactionService = {
  createTransaction,

  findTransactionById,
  findByIdempotencyKey,

  getTransactions,
  getTransaction,
  getAssetHistory,

  getTransactionSummary,

  updateTransactionStatus,

  getSupportedAssets,
  getSupportedTransactionTypes,
  getSupportedStatuses,
};


export default transactionService;
