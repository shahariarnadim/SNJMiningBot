const createBalanceRecord = ({
  telegramId,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return {
    telegramId: String(telegramId),

    snj: 0,

    nToken: 0,

    dollar: 0,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};

const sanitizeBalance = (
  balance = {}
) => {
  return {
    telegramId:
      balance.telegramId || null,

    snj: Number(balance.snj || 0),

    nToken: Number(
      balance.nToken || 0
    ),

    dollar: Number(
      balance.dollar || 0
    ),

    updatedAt:
      balance.updatedAt || null,
  };
};

const balanceModel = {
  createBalanceRecord,
  sanitizeBalance,
};

export default balanceModel;
