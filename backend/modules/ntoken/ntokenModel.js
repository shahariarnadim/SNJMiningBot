const createNTokenTransaction = ({
  id,
  telegramId,
  type,
  amount = 0,
  status = "COMPLETED",
  referenceId = null,
  description = "",
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!type) {
    throw new Error(
      "N Token transaction type is required."
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "N Token transaction amount must be greater than zero."
    );
  }

  return {
    id:
      String(
        id ||
          `ntx_${Date.now()}_${telegramId}`
      ),

    telegramId:
      String(telegramId),

    asset: "N_TOKEN",

    type:
      String(type),

    amount:
      numericAmount,

    status:
      String(status),

    referenceId:
      referenceId
        ? String(referenceId)
        : null,

    description:
      String(description || ""),

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


const createNTokenReward = ({
  id,
  telegramId,
  source,
  amount = 0,
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

  return {
    id:
      String(
        id ||
          `nreward_${Date.now()}_${telegramId}`
      ),

    telegramId:
      String(telegramId),

    source:
      String(source),

    amount:
      numericAmount,

    referenceId:
      referenceId
        ? String(referenceId)
        : null,

    status:
      "COMPLETED",

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


const sanitizeNTokenTransaction = (
  transaction = {}
) => {
  return {
    id:
      transaction.id || null,

    telegramId:
      transaction.telegramId || null,

    asset:
      "N_TOKEN",

    type:
      transaction.type || "UNKNOWN",

    amount:
      Number(
        transaction.amount || 0
      ),

    status:
      transaction.status ||
      "UNKNOWN",

    referenceId:
      transaction.referenceId ||
      null,

    description:
      transaction.description ||
      "",

    createdAt:
      transaction.createdAt ||
      null,

    updatedAt:
      transaction.updatedAt ||
      null,
  };
};


const sanitizeNTokenReward = (
  reward = {}
) => {
  return {
    id:
      reward.id || null,

    telegramId:
      reward.telegramId || null,

    source:
      reward.source || "UNKNOWN",

    amount:
      Number(
        reward.amount || 0
      ),

    referenceId:
      reward.referenceId ||
      null,

    status:
      reward.status ||
      "UNKNOWN",

    createdAt:
      reward.createdAt ||
      null,

    updatedAt:
      reward.updatedAt ||
      null,
  };
};


const ntokenModel = {
  createNTokenTransaction,
  createNTokenReward,
  sanitizeNTokenTransaction,
  sanitizeNTokenReward,
};

export default ntokenModel;
