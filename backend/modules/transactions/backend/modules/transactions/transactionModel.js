const TRANSACTION_ASSETS = [
  "SNJ",
  "N_TOKEN",
  "DOLLAR",
];

const TRANSACTION_TYPES = [
  "MINING_REWARD",
  "MINING_CLAIM",

  "BOOST_REWARD",
  "BOOST_PURCHASE",

  "TASK_REWARD",
  "REFERRAL_REWARD",

  "SWAP_IN",
  "SWAP_OUT",

  "WITHDRAWAL",
  "WITHDRAWAL_FEE",
  "WITHDRAWAL_REFUND",

  "ADMIN_CREDIT",
  "ADMIN_DEBIT",

  "BONUS",
  "AD_REWARD",
];

const TRANSACTION_STATUSES = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REVERSED",
];

const createTransactionRecord = ({
  id,
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
  if (!id) {
    throw new Error(
      "Transaction ID is required."
    );
  }

  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const transactionAsset =
    String(asset).toUpperCase();

  if (
    !TRANSACTION_ASSETS.includes(
      transactionAsset
    )
  ) {
    throw new Error(
      "Unsupported transaction asset."
    );
  }

  const transactionType =
    String(type).toUpperCase();

  if (
    !TRANSACTION_TYPES.includes(
      transactionType
    )
  ) {
    throw new Error(
      "Unsupported transaction type."
    );
  }

  const transactionStatus =
    String(status).toUpperCase();

  if (
    !TRANSACTION_STATUSES.includes(
      transactionStatus
    )
  ) {
    throw new Error(
      "Invalid transaction status."
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Transaction amount must be greater than zero."
    );
  }

  if (
    balanceBefore !== null &&
    balanceBefore !== undefined &&
    !Number.isFinite(
      Number(balanceBefore)
    )
  ) {
    throw new Error(
      "Invalid balance before value."
    );
  }

  if (
    balanceAfter !== null &&
    balanceAfter !== undefined &&
    !Number.isFinite(
      Number(balanceAfter)
    )
  ) {
    throw new Error(
      "Invalid balance after value."
    );
  }

  return {
    id:
      String(id),

    telegramId:
      String(telegramId),

    asset:
      transactionAsset,

    type:
      transactionType,

    amount:
      numericAmount,

    status:
      transactionStatus,

    referenceId:
      referenceId
        ? String(referenceId)
        : null,

    referenceType:
      referenceType
        ? String(referenceType)
        : null,

    balanceBefore:
      balanceBefore !== null &&
      balanceBefore !== undefined
        ? Number(balanceBefore)
        : null,

    balanceAfter:
      balanceAfter !== null &&
      balanceAfter !== undefined
        ? Number(balanceAfter)
        : null,

    description:
      String(
        description || ""
      ),

    metadata:
      metadata &&
      typeof metadata === "object"
        ? metadata
        : {},

    idempotencyKey:
      idempotencyKey
        ? String(idempotencyKey)
        : null,

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


/*
 * Sanitize transaction
 *
 * Sensitive internal information
 * should not be exposed to users.
 */
const sanitizeTransaction = (
  transaction = {}
) => {
  return {
    id:
      transaction.id || null,

    telegramId:
      transaction.telegramId ||
      null,

    asset:
      transaction.asset || null,

    type:
      transaction.type || null,

    amount:
      Number(
        transaction.amount || 0
      ),

    status:
      transaction.status ||
      "PENDING",

    referenceId:
      transaction.referenceId ||
      null,

    referenceType:
      transaction.referenceType ||
      null,

    balanceBefore:
      transaction.balanceBefore !==
        null &&
      transaction.balanceBefore !==
        undefined
        ? Number(
            transaction.balanceBefore
          )
        : null,

    balanceAfter:
      transaction.balanceAfter !==
        null &&
      transaction.balanceAfter !==
        undefined
        ? Number(
            transaction.balanceAfter
          )
        : null,

    description:
      transaction.description ||
      "",

    metadata:
      transaction.metadata || {},

    createdAt:
      transaction.createdAt ||
      null,

    updatedAt:
      transaction.updatedAt ||
      null,
  };
};


/*
 * Transaction direction
 *
 * Positive balance change:
 * CREDIT
 *
 * Negative balance change:
 * DEBIT
 */
const getTransactionDirection =
  (type) => {
    const transactionType =
      String(type).toUpperCase();

    const debitTypes = [
      "BOOST_PURCHASE",
      "SWAP_OUT",
      "WITHDRAWAL",
      "WITHDRAWAL_FEE",
      "ADMIN_DEBIT",
    ];

    if (
      debitTypes.includes(
        transactionType
      )
    ) {
      return "DEBIT";
    }

    return "CREDIT";
  };


/*
 * Check whether transaction
 * changes a balance.
 */
const isBalanceChangingTransaction =
  (type) => {
    const transactionType =
      String(type).toUpperCase();

    return TRANSACTION_TYPES.includes(
      transactionType
    );
  };


/*
 * Validate transaction amount
 */
const validateTransactionAmount =
  (amount) => {
    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return {
        valid: false,
        message:
          "Transaction amount must be greater than zero.",
      };
    }

    return {
      valid: true,
      amount:
        numericAmount,
    };
  };


/*
 * Supported assets
 */
const getSupportedAssets = () => {
  return [
    ...TRANSACTION_ASSETS,
  ];
};


/*
 * Supported transaction types
 */
const getSupportedTransactionTypes =
  () => {
    return [
      ...TRANSACTION_TYPES,
    ];
  };


/*
 * Supported statuses
 */
const getSupportedStatuses = () => {
  return [
    ...TRANSACTION_STATUSES,
  ];
};


const transactionModel = {
  TRANSACTION_ASSETS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,

  createTransactionRecord,
  sanitizeTransaction,

  getTransactionDirection,
  isBalanceChangingTransaction,

  validateTransactionAmount,

  getSupportedAssets,
  getSupportedTransactionTypes,
  getSupportedStatuses,
};


export default transactionModel;
