import ntokenModel from "./ntokenModel.js";
import balanceService from "../balances/balanceService.js";

const nTokenTransactions = new Map();
const nTokenRewards = new Map();

const nTokenSettings = {
  enabled: true,
  minimumBalanceForSwap: 0,
  allowRewards: true,
};


/*
 * Get N Token balance
 */
const getNTokenBalance = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return balanceService.getNTokenBalance(
    telegramId
  );
};


/*
 * Add N Token
 */
const addNToken = async (
  telegramId,
  amount,
  type = "REWARD",
  referenceId = null,
  description = ""
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "N Token amount must be greater than zero."
    );
  }

  if (!nTokenSettings.enabled) {
    throw new Error(
      "N Token system is currently disabled."
    );
  }

  if (!nTokenSettings.allowRewards) {
    throw new Error(
      "N Token rewards are currently disabled."
    );
  }

  const balance =
    await balanceService.addBalance(
      telegramId,
      "nToken",
      numericAmount
    );

  const transaction =
    ntokenModel.createNTokenTransaction({
      telegramId,
      type,
      amount: numericAmount,
      status: "COMPLETED",
      referenceId,
      description,
    });

  nTokenTransactions.set(
    transaction.id,
    transaction
  );

  return {
    amount: numericAmount,
    balance,
    transaction:
      ntokenModel.sanitizeNTokenTransaction(
        transaction
      ),
  };
};


/*
 * Create N Token reward
 */
const createNTokenReward = async ({
  telegramId,
  source,
  amount,
  referenceId = null,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!source) {
    throw new Error(
      "N Token reward source is required."
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "N Token reward must be greater than zero."
    );
  }

  const reward =
    ntokenModel.createNTokenReward({
      telegramId,
      source,
      amount: numericAmount,
      referenceId,
    });

  nTokenRewards.set(
    reward.id,
    reward
  );

  const result =
    await addNToken(
      telegramId,
      numericAmount,
      `REWARD_${String(
        source
      ).toUpperCase()}`,
      referenceId,
      `N Token reward from ${source}`
    );

  return {
    reward:
      ntokenModel.sanitizeNTokenReward(
        reward
      ),
    result,
  };
};


/*
 * Get N Token transaction history
 */
const getNTokenHistory = async (
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
    nTokenTransactions.values()
  )
    .filter(
      (transaction) =>
        transaction.telegramId ===
        userId
    )
    .map(
      (transaction) =>
        ntokenModel.sanitizeNTokenTransaction(
          transaction
        )
    )
    );
};


/*
 * Get N Token rewards
 */
const getNTokenRewards = async (
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
    nTokenRewards.values()
  )
    .filter(
      (reward) =>
        reward.telegramId ===
        userId
    )
    .map(
      (reward) =>
        ntokenModel.sanitizeNTokenReward(
          reward
        )
    );
};


/*
 * Get one N Token transaction
 */
const getNTokenTransactionById =
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
        "Transaction ID is required."
      );
    }

    const transaction =
      nTokenTransactions.get(
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
        "Transaction access denied."
      );
    }

    return ntokenModel
      .sanitizeNTokenTransaction(
        transaction
      );
  };


/*
 * Get N Token settings
 */
const getNTokenSettings =
  async () => {
    return {
      enabled:
        nTokenSettings.enabled,

      minimumBalanceForSwap:
        nTokenSettings
          .minimumBalanceForSwap,

      allowRewards:
        nTokenSettings
          .allowRewards,
    };
  };


const ntokenService = {
  getNTokenBalance,
  addNToken,
  createNTokenReward,
  getNTokenHistory,
  getNTokenRewards,
  getNTokenTransactionById,
  getNTokenSettings,
};

export default ntokenService;
