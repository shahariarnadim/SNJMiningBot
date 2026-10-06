const createSwapPair = ({
  id,
  fromAsset,
  toAsset,
  rate = 0,
  minAmount = 0,
  enabled = true,
} = {}) => {
  if (!id) {
    throw new Error(
      "Swap pair ID is required."
    );
  }

  if (!fromAsset) {
    throw new Error(
      "Source asset is required."
    );
  }

  if (!toAsset) {
    throw new Error(
      "Destination asset is required."
    );
  }

  if (
    String(fromAsset).toUpperCase() ===
    String(toAsset).toUpperCase()
  ) {
    throw new Error(
      "Source and destination assets must be different."
    );
  }

  const numericRate =
    Number(rate);

  const numericMinAmount =
    Number(minAmount);

  if (
    !Number.isFinite(numericRate) ||
    numericRate <= 0
  ) {
    throw new Error(
      "Swap rate must be greater than zero."
    );
  }

  if (
    !Number.isFinite(numericMinAmount) ||
    numericMinAmount < 0
  ) {
    throw new Error(
      "Minimum swap amount cannot be negative."
    );
  }

  return {
    id: String(id),

    fromAsset:
      String(fromAsset).toUpperCase(),

    toAsset:
      String(toAsset).toUpperCase(),

    rate:
      numericRate,

    minAmount:
      numericMinAmount,

    enabled:
      Boolean(enabled),

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


const createSwapTransaction = ({
  id,
  telegramId,
  fromAsset,
  toAsset,
  fromAmount,
  toAmount,
  rate,
  status = "COMPLETED",
  referenceId = null,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!fromAsset) {
    throw new Error(
      "Source asset is required."
    );
  }

  if (!toAsset) {
    throw new Error(
      "Destination asset is required."
    );
  }

  const numericFromAmount =
    Number(fromAmount);

  const numericToAmount =
    Number(toAmount);

  const numericRate =
    Number(rate);

  if (
    !Number.isFinite(numericFromAmount) ||
    numericFromAmount <= 0
  ) {
    throw new Error(
      "Swap source amount must be greater than zero."
    );
  }

  if (
    !Number.isFinite(numericToAmount) ||
    numericToAmount <= 0
  ) {
    throw new Error(
      "Swap destination amount must be greater than zero."
    );
  }

  if (
    !Number.isFinite(numericRate) ||
    numericRate <= 0
  ) {
    throw new Error(
      "Swap rate must be greater than zero."
    );
  }

  return {
    id:
      String(
        id ||
          `swap_${Date.now()}_${telegramId}`
      ),

    telegramId:
      String(telegramId),

    fromAsset:
      String(fromAsset).toUpperCase(),

    toAsset:
      String(toAsset).toUpperCase(),

    fromAmount:
      numericFromAmount,

    toAmount:
      numericToAmount,

    rate:
      numericRate,

    status:
      String(status),

    referenceId:
      referenceId
        ? String(referenceId)
        : null,

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


const sanitizeSwapPair = (
  pair = {}
) => {
  return {
    id:
      pair.id || null,

    fromAsset:
      pair.fromAsset || null,

    toAsset:
      pair.toAsset || null,

    rate:
      Number(pair.rate || 0),

    minAmount:
      Number(pair.minAmount || 0),

    enabled:
      pair.enabled !== false,

    createdAt:
      pair.createdAt || null,

    updatedAt:
      pair.updatedAt || null,
  };
};


const sanitizeSwapTransaction = (
  transaction = {}
) => {
  return {
    id:
      transaction.id || null,

    telegramId:
      transaction.telegramId || null,

    fromAsset:
      transaction.fromAsset || null,

    toAsset:
      transaction.toAsset || null,

    fromAmount:
      Number(
        transaction.fromAmount || 0
      ),

    toAmount:
      Number(
        transaction.toAmount || 0
      ),

    rate:
      Number(
        transaction.rate || 0
      ),

    status:
      transaction.status ||
      "UNKNOWN",

    referenceId:
      transaction.referenceId ||
      null,

    createdAt:
      transaction.createdAt ||
      null,

    updatedAt:
      transaction.updatedAt ||
      null,
  };
};


const swapModel = {
  createSwapPair,
  createSwapTransaction,
  sanitizeSwapPair,
  sanitizeSwapTransaction,
};

export default swapModel;
