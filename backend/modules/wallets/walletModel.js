const SUPPORTED_WALLET_TYPES = [
  "TON",
  "BINANCE",
  "BITGET",
  "OKX",
  "BYBIT",
];

const WALLET_STATUSES = [
  "ACTIVE",
  "DISCONNECTED",
  "COMING_SOON",
];


const createWalletRecord = ({
  id,
  telegramId,
  type = "TON",
  address = "",
  status = "ACTIVE",
  label = "",
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!id) {
    throw new Error(
      "Wallet ID is required."
    );
  }

  const walletType =
    String(type).toUpperCase();

  if (
    !SUPPORTED_WALLET_TYPES.includes(
      walletType
    )
  ) {
    throw new Error(
      "Unsupported wallet type."
    );
  }

  const walletStatus =
    String(status).toUpperCase();

  if (
    !WALLET_STATUSES.includes(
      walletStatus
    )
  ) {
    throw new Error(
      "Invalid wallet status."
    );
  }

  if (
    walletStatus === "ACTIVE" &&
    !address
  ) {
    throw new Error(
      "Wallet address is required for an active wallet."
    );
  }

  return {
    id: String(id),

    telegramId:
      String(telegramId),

    type:
      walletType,

    address:
      String(address || ""),

    label:
      String(label || ""),

    status:
      walletStatus,

    isPrimary:
      false,

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


const sanitizeWallet = (
  wallet = {}
) => {
  return {
    id:
      wallet.id || null,

    telegramId:
      wallet.telegramId || null,

    type:
      wallet.type || null,

    address:
      wallet.address || "",

    label:
      wallet.label || "",

    status:
      wallet.status ||
      "DISCONNECTED",

    isPrimary:
      wallet.isPrimary === true,

    createdAt:
      wallet.createdAt ||
      null,

    updatedAt:
      wallet.updatedAt ||
      null,
  };
};


const createWalletStatus = ({
  type,
  status = "COMING_SOON",
  enabled = false,
} = {}) => {
  if (!type) {
    throw new Error(
      "Wallet type is required."
    );
  }

  const walletType =
    String(type).toUpperCase();

  if (
    !SUPPORTED_WALLET_TYPES.includes(
      walletType
    )
  ) {
    throw new Error(
      "Unsupported wallet type."
    );
  }

  return {
    type:
      walletType,

    status:
      String(status).toUpperCase(),

    enabled:
      Boolean(enabled),

    updatedAt:
      new Date(),
  };
};


const sanitizeWalletStatus = (
  wallet = {}
) => {
  return {
    type:
      wallet.type || null,

    status:
      wallet.status ||
      "COMING_SOON",

    enabled:
      wallet.enabled === true,

    updatedAt:
      wallet.updatedAt ||
      null,
  };
};


const validateTonAddress = (
  address = ""
) => {
  const value =
    String(address).trim();

  if (!value) {
    return {
      valid: false,
      message:
        "TON wallet address is required.",
    };
  }

  /*
   * Basic TON address validation.
   * Final blockchain validation will be
   * handled by the wallet integration layer.
   */
  const tonAddressPattern =
    /^(EQ|UQ|kQ|0Q)[A-Za-z0-9_-]{46,60}$/;

  if (
    !tonAddressPattern.test(value)
  ) {
    return {
      valid: false,
      message:
        "Invalid TON wallet address format.",
    };
  }

  return {
    valid: true,
    address: value,
  };
};


const walletModel = {
  SUPPORTED_WALLET_TYPES,
  WALLET_STATUSES,
  createWalletRecord,
  sanitizeWallet,
  createWalletStatus,
  sanitizeWalletStatus,
  validateTonAddress,
};

export default walletModel;
