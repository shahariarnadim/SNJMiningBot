import crypto from "crypto";

import walletModel from "./walletModel.js";


const wallets = new Map();


/*
 * Default wallet providers
 */
const walletStatuses = new Map([
  [
    "TON",
    walletModel.createWalletStatus({
      type: "TON",
      status: "ACTIVE",
      enabled: true,
    }),
  ],

  [
    "BINANCE",
    walletModel.createWalletStatus({
      type: "BINANCE",
      status: "COMING_SOON",
      enabled: false,
    }),
  ],

  [
    "BITGET",
    walletModel.createWalletStatus({
      type: "BITGET",
      status: "COMING_SOON",
      enabled: false,
    }),
  ],

  [
    "OKX",
    walletModel.createWalletStatus({
      type: "OKX",
      status: "COMING_SOON",
      enabled: false,
    }),
  ],

  [
    "BYBIT",
    walletModel.createWalletStatus({
      type: "BYBIT",
      status: "COMING_SOON",
      enabled: false,
    }),
  ],
]);


/*
 * Create wallet
 */
const createWallet = async ({
  telegramId,
  type = "TON",
  address,
  label = "",
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const walletType =
    String(type).toUpperCase();

  const provider =
    walletStatuses.get(
      walletType
    );

  if (!provider) {
    throw new Error(
      "Unsupported wallet type."
    );
  }

  if (!provider.enabled) {
    throw new Error(
      `${walletType} wallet is currently unavailable.`
    );
  }

  if (walletType === "TON") {
    const validation =
      walletModel.validateTonAddress(
        address
      );

    if (!validation.valid) {
      throw new Error(
        validation.message
      );
    }

    address =
      validation.address;
  }

  const userId =
    String(telegramId);

  const existingWallets =
    Array.from(
      wallets.values()
    ).filter(
      (wallet) =>
        wallet.telegramId ===
        userId
    );

  const duplicate =
    existingWallets.find(
      (wallet) =>
        wallet.type ===
          walletType &&
        wallet.address ===
          address
    );

  if (duplicate) {
    return walletModel.sanitizeWallet(
      duplicate
    );
  }

  const wallet =
    walletModel.createWalletRecord({
      id:
        crypto.randomUUID(),
      telegramId:
        userId,
      type:
        walletType,
      address,
      label,
      status:
        "ACTIVE",
    });

  /*
   * First wallet becomes primary.
   */
  if (
    existingWallets.length === 0
  ) {
    wallet.isPrimary = true;
  }

  wallets.set(
    wallet.id,
    wallet
  );

  return walletModel.sanitizeWallet(
    wallet
  );
};


/*
 * Get all wallets
 */
const getWallets = async (
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
    wallets.values()
  )
    .filter(
      (wallet) =>
        wallet.telegramId ===
        userId
    )
    .map(
      (wallet) =>
        walletModel.sanitizeWallet(
          wallet
        )
    );
};


/*
 * Get TON wallet
 */
const getTonWallet = async (
  telegramId
) => {
  const userWallets =
    await getWallets(
      telegramId
    );

  return (
    userWallets.find(
      (wallet) =>
        wallet.type === "TON" &&
        wallet.status ===
          "ACTIVE"
    ) || null
  );
};


/*
 * Get wallet by ID
 */
const getWalletById = async (
  telegramId,
  walletId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!walletId) {
    throw new Error(
      "Wallet ID is required."
    );
  }

  const wallet =
    wallets.get(
      String(walletId)
    );

  if (!wallet) {
    return null;
  }

  if (
    wallet.telegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Wallet access denied."
    );
  }

  return walletModel.sanitizeWallet(
    wallet
  );
};


/*
 * Disconnect wallet
 */
const disconnectWallet = async (
  telegramId,
  walletId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!walletId) {
    throw new Error(
      "Wallet ID is required."
    );
  }

  const wallet =
    wallets.get(
      String(walletId)
    );

  if (!wallet) {
    throw new Error(
      "Wallet not found."
    );
  }

  if (
    wallet.telegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Wallet access denied."
    );
  }

  wallet.status =
    "DISCONNECTED";

  wallet.isPrimary =
    false;

  wallet.updatedAt =
    new Date();

  wallets.set(
    wallet.id,
    wallet
  );

  /*
   * If the disconnected wallet
   * was primary, select another
   * active wallet if available.
   */
  const activeWallet =
    Array.from(
      wallets.values()
    ).find(
      (item) =>
        item.telegramId ===
          String(telegramId) &&
        item.status ===
          "ACTIVE"
    );

  if (activeWallet) {
    activeWallet.isPrimary =
      true;

    activeWallet.updatedAt =
      new Date();

    wallets.set(
      activeWallet.id,
      activeWallet
    );
  }

  return walletModel.sanitizeWallet(
    wallet
  );
};


/*
 * Set primary wallet
 */
const setPrimaryWallet = async (
  telegramId,
  walletId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!walletId) {
    throw new Error(
      "Wallet ID is required."
    );
  }

  const wallet =
    wallets.get(
      String(walletId)
    );

  if (!wallet) {
    throw new Error(
      "Wallet not found."
    );
  }

  if (
    wallet.telegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Wallet access denied."
    );
  }

  if (
    wallet.status !== "ACTIVE"
  ) {
    throw new Error(
      "Only active wallets can be primary."
    );
  }

  for (
    const item
    of wallets.values()
  ) {
    if (
      item.telegramId ===
      String(telegramId)
    ) {
      item.isPrimary =
        item.id ===
        wallet.id;

      item.updatedAt =
        new Date();

      wallets.set(
        item.id,
        item
      );
    }
  }

  return walletModel.sanitizeWallet(
    wallet
  );
};


/*
 * Get supported wallet types
 */
const getSupportedWallets =
  async () => {
    return Array.from(
      walletStatuses.values()
    ).map(
      (wallet) =>
        walletModel
          .sanitizeWalletStatus(
            wallet
          )
    );
  };


/*
 * Get wallet status
 */
const getWalletStatus = async (
  type
) => {
  if (!type) {
    throw new Error(
      "Wallet type is required."
    );
  }

  const walletType =
    String(type).toUpperCase();

  const status =
    walletStatuses.get(
      walletType
    );

  if (!status) {
    return null;
  }

  return walletModel
    .sanitizeWalletStatus(
      status
    );
};


const walletService = {
  createWallet,
  getWallets,
  getTonWallet,
  getWalletById,
  disconnectWallet,
  setPrimaryWallet,
  getSupportedWallets,
  getWalletStatus,
};


export default walletService;
