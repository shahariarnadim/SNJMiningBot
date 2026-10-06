const WITHDRAWAL_ASSETS = [
  "DOLLAR",
];

const WITHDRAWAL_METHODS = [
  "TON",
];

const WITHDRAWAL_STATUSES = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
  "FAILED",
];

const createWithdrawalRecord = ({
  id,
  telegramId,
  asset = "DOLLAR",
  amount,
  method = "TON",
  walletId = null,
  walletAddress = "",
  fee = 0,
  netAmount,
  status = "PENDING",
  transactionHash = null,
  note = "",
  idempotencyKey = null,
} = {}) => {
  if (!id) {
    throw new Error(
      "Withdrawal ID is required."
    );
  }

  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const withdrawalAsset =
    String(asset).toUpperCase();

  if (
    !WITHDRAWAL_ASSETS.includes(
      withdrawalAsset
    )
  ) {
    throw new Error(
      "Unsupported withdrawal asset."
    );
  }

  const withdrawalMethod =
    String(method).toUpperCase();

  if (
    !WITHDRAWAL_METHODS.includes(
      withdrawalMethod
    )
  ) {
    throw new Error(
      "Unsupported withdrawal method."
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Withdrawal amount must be greater than zero."
    );
  }

  const numericFee =
    Number(fee || 0);

  if (
    !Number.isFinite(numericFee) ||
    numericFee < 0
  ) {
    throw new Error(
      "Invalid withdrawal fee."
    );
  }

  const calculatedNetAmount =
    numericAmount - numericFee;

  if (
    calculatedNetAmount <= 0
  ) {
    throw new Error(
      "Net withdrawal amount must be greater than zero."
    );
  }

  const finalNetAmount =
    netAmount !== undefined &&
    netAmount !== null
      ? Number(netAmount)
      : calculatedNetAmount;

  if (
    !Number.isFinite(
      finalNetAmount
    ) ||
    finalNetAmount <= 0
  ) {
    throw new Error(
      "Invalid net withdrawal amount."
    );
  }

  const withdrawalStatus =
    String(status).toUpperCase();

  if (
    !WITHDRAWAL_STATUSES.includes(
      withdrawalStatus
    )
  ) {
    throw new Error(
      "Invalid withdrawal status."
    );
  }

  if (
    withdrawalMethod === "TON" &&
    !walletAddress
  ) {
    throw new Error(
      "TON wallet address is required."
    );
  }

  return {
    id: String(id),

    telegramId:
      String(telegramId),

    asset:
      withdrawalAsset,

    amount:
      numericAmount,

    method:
      withdrawalMethod,

    walletId:
      walletId
        ? String(walletId)
        : null,

    walletAddress:
      String(walletAddress || ""),

    fee:
      numericFee,

    netAmount:
      finalNetAmount,

    status:
      withdrawalStatus,

    transactionHash:
      transactionHash
        ? String(transactionHash)
        : null,

    note:
      String(note || ""),

    idempotencyKey:
      idempotencyKey
        ? String(idempotencyKey)
        : null,

    createdAt:
      new Date(),

    updatedAt:
      new Date(),

    completedAt:
      null,
  };
};


/*
 * Sanitize withdrawal data
 */
const sanitizeWithdrawal = (
  withdrawal = {}
) => {
  return {
    id:
      withdrawal.id || null,

    telegramId:
      withdrawal.telegramId || null,

    asset:
      withdrawal.asset || null,

    amount:
      Number(
        withdrawal.amount || 0
      ),

    method:
      withdrawal.method || null,

    walletId:
      withdrawal.walletId || null,

    walletAddress:
      withdrawal.walletAddress || "",

    fee:
      Number(
        withdrawal.fee || 0
      ),

    netAmount:
      Number(
        withdrawal.netAmount || 0
      ),

    status:
      withdrawal.status ||
      "PENDING",

    transactionHash:
      withdrawal.transactionHash ||
      null,

    note:
      withdrawal.note || "",

    createdAt:
      withdrawal.createdAt ||
      null,

    updatedAt:
      withdrawal.updatedAt ||
      null,

    completedAt:
      withdrawal.completedAt ||
      null,
  };
};


/*
 * Create withdrawal settings
 */
const createWithdrawalSettings = ({
  asset = "DOLLAR",
  method = "TON",
  enabled = true,
  minimumAmount = 0.01,
  maximumAmount = 0,
  fee = 0,
  dailyLimit = 0,
  requireWallet = true,
  autoProcessing = false,
} = {}) => {
  const withdrawalAsset =
    String(asset).toUpperCase();

  const withdrawalMethod =
    String(method).toUpperCase();

  if (
    !WITHDRAWAL_ASSETS.includes(
      withdrawalAsset
    )
  ) {
    throw new Error(
      "Unsupported withdrawal asset."
    );
  }

  if (
    !WITHDRAWAL_METHODS.includes(
      withdrawalMethod
    )
  ) {
    throw new Error(
      "Unsupported withdrawal method."
    );
  }

  const min =
    Number(minimumAmount);

  const max =
    Number(maximumAmount);

  const withdrawalFee =
    Number(fee);

  const limit =
    Number(dailyLimit);

  if (
    !Number.isFinite(min) ||
    min < 0
  ) {
    throw new Error(
      "Invalid minimum withdrawal amount."
    );
  }

  if (
    !Number.isFinite(max) ||
    max < 0
  ) {
    throw new Error(
      "Invalid maximum withdrawal amount."
    );
  }

  if (
    max > 0 &&
    max < min
  ) {
    throw new Error(
      "Maximum withdrawal cannot be less than minimum withdrawal."
    );
  }

  if (
    !Number.isFinite(
      withdrawalFee
    ) ||
    withdrawalFee < 0
  ) {
    throw new Error(
      "Invalid withdrawal fee."
    );
  }

  if (
    !Number.isFinite(limit) ||
    limit < 0
  ) {
    throw new Error(
      "Invalid daily withdrawal limit."
    );
  }

  return {
    asset:
      withdrawalAsset,

    method:
      withdrawalMethod,

    enabled:
      Boolean(enabled),

    minimumAmount:
      min,

    maximumAmount:
      max,

    fee:
      withdrawalFee,

    dailyLimit:
      limit,

    requireWallet:
      Boolean(requireWallet),

    autoProcessing:
      Boolean(autoProcessing),

    updatedAt:
      new Date(),
  };
};


/*
 * Sanitize withdrawal settings
 */
const sanitizeWithdrawalSettings = (
  settings = {}
) => {
  return {
    asset:
      settings.asset || null,

    method:
      settings.method || null,

    enabled:
      settings.enabled === true,

    minimumAmount:
      Number(
        settings.minimumAmount || 0
      ),

    maximumAmount:
      Number(
        settings.maximumAmount || 0
      ),

    fee:
      Number(
        settings.fee || 0
      ),

    dailyLimit:
      Number(
        settings.dailyLimit || 0
      ),

    requireWallet:
      settings.requireWallet !== false,

    autoProcessing:
      settings.autoProcessing === true,

    updatedAt:
      settings.updatedAt || null,
  };
};


/*
 * Validate withdrawal amount
 */
const validateWithdrawalAmount = ({
  amount,
  settings,
} = {}) => {
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
        "Withdrawal amount must be greater than zero.",
    };
  }

  if (!settings) {
    return {
      valid: false,
      message:
        "Withdrawal settings are unavailable.",
    };
  }

  if (
    numericAmount <
    Number(
      settings.minimumAmount || 0
    )
  ) {
    return {
      valid: false,
      message:
        `Minimum withdrawal is ${settings.minimumAmount}.`,
    };
  }

  if (
    Number(settings.maximumAmount || 0) >
      0 &&
    numericAmount >
      Number(
        settings.maximumAmount
      )
  ) {
    return {
      valid: false,
      message:
        `Maximum withdrawal is ${settings.maximumAmount}.`,
    };
  }

  return {
    valid: true,
    amount:
      numericAmount,
  };
};


/*
 * Supported withdrawal assets
 */
const getSupportedWithdrawalAssets =
  () => {
    return [
      ...WITHDRAWAL_ASSETS,
    ];
  };


/*
 * Supported withdrawal methods
 */
const getSupportedWithdrawalMethods =
  () => {
    return [
      ...WITHDRAWAL_METHODS,
    ];
  };


const withdrawalModel = {
  WITHDRAWAL_ASSETS,
  WITHDRAWAL_METHODS,
  WITHDRAWAL_STATUSES,

  createWithdrawalRecord,
  sanitizeWithdrawal,

  createWithdrawalSettings,
  sanitizeWithdrawalSettings,

  validateWithdrawalAmount,

  getSupportedWithdrawalAssets,
  getSupportedWithdrawalMethods,
};


export default withdrawalModel;
