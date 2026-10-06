import swapModel from "./swapModel.js";
import balanceService from "../balances/balanceService.js";

const swapPairs = new Map();
const swapTransactions = new Map();

const defaultSwapPairs = [
  {
    id: "ntoken_to_dollar",
    fromAsset: "N_TOKEN",
    toAsset: "DOLLAR",
    rate: 0.01,
    minAmount: 1,
    enabled: true,
  },
];


/*
 * Initialize default swap pairs
 */
const initializeSwapPairs = () => {
  if (swapPairs.size > 0) {
    return;
  }

  for (const pairData of defaultSwapPairs) {
    const pair =
      swapModel.createSwapPair(
        pairData
      );

    swapPairs.set(
      pair.id,
      pair
    );
  }
};

initializeSwapPairs();


/*
 * Get all swap pairs
 */
const getSwapPairs = async () => {
  initializeSwapPairs();

  return Array.from(
    swapPairs.values()
  )
    .filter(
      (pair) => pair.enabled
    )
    .map(
      (pair) =>
        swapModel.sanitizeSwapPair(
          pair
        )
    );
};


/*
 * Get one swap pair
 */
const getSwapPairById = async (
  pairId
) => {
  initializeSwapPairs();

  if (!pairId) {
    return null;
  }

  return (
    swapPairs.get(
      String(pairId)
    ) || null
  );
};


/*
 * Get exchange rate
 */
const getSwapRate = async (
  fromAsset,
  toAsset
) => {
  if (!fromAsset || !toAsset) {
    throw new Error(
      "Source and destination assets are required."
    );
  }

  const from =
    String(fromAsset)
      .toUpperCase();

  const to =
    String(toAsset)
      .toUpperCase();

  const pair =
    Array.from(
      swapPairs.values()
    ).find(
      (item) =>
        item.fromAsset === from &&
        item.toAsset === to &&
        item.enabled
    );

  if (!pair) {
    throw new Error(
      "Swap pair is not available."
    );
  }

  return {
    fromAsset: pair.fromAsset,
    toAsset: pair.toAsset,
    rate: Number(pair.rate),
    minAmount:
      Number(pair.minAmount),
  };
};


/*
 * Calculate swap
 */
const calculateSwap = async ({
  fromAsset,
  toAsset,
  amount,
} = {}) => {
  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Swap amount must be greater than zero."
    );
  }

  const rate =
    await getSwapRate(
      fromAsset,
      toAsset
    );

  if (
    numericAmount <
    rate.minAmount
  ) {
    throw new Error(
      `Minimum swap amount is ${rate.minAmount}.`
    );
  }

  const toAmount =
    Number(
      (
        numericAmount *
        rate.rate
      ).toFixed(8)
    );

  if (toAmount <= 0) {
    throw new Error(
      "Calculated swap amount is invalid."
    );
  }

  return {
    fromAsset:
      rate.fromAsset,

    toAsset:
      rate.toAsset,

    fromAmount:
      numericAmount,

    toAmount,

    rate:
      rate.rate,

    minAmount:
      rate.minAmount,
  };
};


/*
 * Execute swap
 *
 * IMPORTANT:
 * Balance changes are performed
 * on the backend only.
 */
const executeSwap = async ({
  telegramId,
  fromAsset,
  toAsset,
  amount,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const calculation =
    await calculateSwap({
      fromAsset,
      toAsset,
      amount,
    });

  const assetMap = {
    SNJ: "snj",
    N_TOKEN: "nToken",
    DOLLAR: "dollar",
  };

  const fromKey =
    assetMap[
      calculation.fromAsset
    ];

  const toKey =
    assetMap[
      calculation.toAsset
    ];

  if (!fromKey || !toKey) {
    throw new Error(
      "Unsupported swap asset."
    );
  }

  /*
   * Check balance before changing it.
   */
  const currentBalance =
    await balanceService.getBalanceSummary(
      telegramId
    );

  const available =
    Number(
      currentBalance[fromKey] || 0
    );

  if (
    available <
    calculation.fromAmount
  ) {
    throw new Error(
      "Insufficient balance for swap."
    );
  }

  /*
   * Remove source asset.
   */
  await balanceService.subtractBalance(
    telegramId,
    fromKey,
    calculation.fromAmount
  );

  /*
   * Add destination asset.
   */
  await balanceService.addBalance(
    telegramId,
    toKey,
    calculation.toAmount
  );

  /*
   * Create transaction record.
   */
  const transaction =
    swapModel.createSwapTransaction({
      telegramId,
      fromAsset:
        calculation.fromAsset,
      toAsset:
        calculation.toAsset,
      fromAmount:
        calculation.fromAmount,
      toAmount:
        calculation.toAmount,
      rate:
        calculation.rate,
      status:
        "COMPLETED",
    });

  swapTransactions.set(
    transaction.id,
    transaction
  );

  return {
    success: true,

    transaction:
      swapModel.sanitizeSwapTransaction(
        transaction
      ),

    balance:
      await balanceService.getBalanceSummary(
        telegramId
      ),
  };
};


/*
 * Get swap history
 */
const getSwapHistory = async (
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
    swapTransactions.values()
  )
    .filter(
      (transaction) =>
        transaction.telegramId ===
        userId
    )
    .map(
      (transaction) =>
        swapModel.sanitizeSwapTransaction(
          transaction
        )
    );
};


/*
 * Get swap transaction
 */
const getSwapTransactionById =
  async (
    telegramId,
    transactionId
  ) => {
    if (!telegramId) {
      throw new Error(
        "Telegram user ID is required."
      );
    }

    if (!transactionId) {
      throw new Error(
        "Swap transaction ID is required."
      );
    }

    const transaction =
      swapTransactions.get(
        String(transactionId)
      );

    if (!transaction) {
      return null;
    }

    if (
      transaction.telegramId !==
      String(telegramId)
    ) {
      throw new Error(
        "Swap transaction access denied."
      );
    }

    return swapModel
      .sanitizeSwapTransaction(
        transaction
      );
  };


/*
 * Get swap settings
 */
const getSwapSettings =
  async () => {
    return {
      enabled: true,

      defaultFromAsset:
        "N_TOKEN",

      defaultToAsset:
        "DOLLAR",

      allowUserSwap:
        true,
    };
  };


const swapService = {
  getSwapPairs,
  getSwapPairById,
  getSwapRate,
  calculateSwap,
  executeSwap,
  getSwapHistory,
  getSwapTransactionById,
  getSwapSettings,
};

export default swapService;
