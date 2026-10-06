import balanceModel from "./balanceModel.js";

const balances = new Map();

const findBalanceByTelegramId = async (
  telegramId
) => {
  if (!telegramId) {
    return null;
  }

  return (
    balances.get(String(telegramId)) ||
    null
  );
};

const getOrCreateBalance = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const userId = String(
    telegramId
  );

  const existingBalance =
    await findBalanceByTelegramId(
      userId
    );

  if (existingBalance) {
    return existingBalance;
  }

  const balance =
    balanceModel.createBalanceRecord({
      telegramId: userId,
    });

  balances.set(
    userId,
    balance
  );

  return balance;
};

const getBalanceSummary = async (
  telegramId
) => {
  const balance =
    await getOrCreateBalance(
      telegramId
    );

  return balanceModel.sanitizeBalance(
    balance
  );
};

const getSNJBalance = async (
  telegramId
) => {
  const balance =
    await getOrCreateBalance(
      telegramId
    );

  return Number(
    balance.snj || 0
  );
};

const getNTokenBalance = async (
  telegramId
) => {
  const balance =
    await getOrCreateBalance(
      telegramId
    );

  return Number(
    balance.nToken || 0
  );
};

const getDollarBalance = async (
  telegramId
) => {
  const balance =
    await getOrCreateBalance(
      telegramId
    );

  return Number(
    balance.dollar || 0
  );
};

const addBalance = async (
  telegramId,
  asset,
  amount
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
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
      "Balance amount must be greater than zero."
    );
  }

  const allowedAssets = [
    "snj",
    "nToken",
    "dollar",
  ];

  if (
    !allowedAssets.includes(asset)
  ) {
    throw new Error(
      "Unsupported balance asset."
    );
  }

  const balance =
    await getOrCreateBalance(
      telegramId
    );

  balance[asset] =
    Number(balance[asset] || 0) +
    numericAmount;

  balance.updatedAt =
    new Date();

  balances.set(
    String(telegramId),
    balance
  );

  return balanceModel.sanitizeBalance(
    balance
  );
};

const subtractBalance = async (
  telegramId,
  asset,
  amount
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
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
      "Balance amount must be greater than zero."
    );
  }

  const allowedAssets = [
    "snj",
    "nToken",
    "dollar",
  ];

  if (
    !allowedAssets.includes(asset)
  ) {
    throw new Error(
      "Unsupported balance asset."
    );
  }

  const balance =
    await getOrCreateBalance(
      telegramId
    );

  const currentBalance =
    Number(balance[asset] || 0);

  if (
    currentBalance <
    numericAmount
  ) {
    throw new Error(
      "Insufficient balance."
    );
  }

  balance[asset] =
    currentBalance -
    numericAmount;

  balance.updatedAt =
    new Date();

  balances.set(
    String(telegramId),
    balance
  );

  return balanceModel.sanitizeBalance(
    balance
  );
};

const balanceService = {
  findBalanceByTelegramId,
  getOrCreateBalance,
  getBalanceSummary,
  getSNJBalance,
  getNTokenBalance,
  getDollarBalance,
  addBalance,
  subtractBalance,
};

export default balanceService;
