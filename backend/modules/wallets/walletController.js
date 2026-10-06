import walletService from "./walletService.js";


/*
 * Get all wallets
 */
const getWallets = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    const wallets =
      await walletService.getWallets(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: wallets,
    });
  } catch (error) {
    console.error(
      "Get wallets error:",
      error
    );

    next(error);
  }
};


/*
 * Get TON wallet
 */
const getTonWallet = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    const wallet =
      await walletService.getTonWallet(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error(
      "Get TON wallet error:",
      error
    );

    next(error);
  }
};


/*
 * Add TON wallet
 */
const addTonWallet = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    const {
      address,
      label = "",
    } = req.body || {};

    if (!address) {
      return res.status(400).json({
        success: false,
        message:
          "TON wallet address is required.",
      });
    }

    const wallet =
      await walletService.createWallet({
        telegramId,
        type: "TON",
        address,
        label,
      });

    return res.status(201).json({
      success: true,
      message:
        "TON wallet connected successfully.",
      data: wallet,
    });
  } catch (error) {
    console.error(
      "Add TON wallet error:",
      error
    );

    next(error);
  }
};


/*
 * Get wallet by ID
 */
const getWalletById = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const { id } =
      req.params;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Wallet ID is required.",
      });
    }

    const wallet =
      await walletService.getWalletById(
        telegramId,
        id
      );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message:
          "Wallet not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error(
      "Get wallet by ID error:",
      error
    );

    next(error);
  }
};


/*
 * Disconnect wallet
 */
const disconnectWallet = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const { id } =
      req.params;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Wallet ID is required.",
      });
    }

    const wallet =
      await walletService.disconnectWallet(
        telegramId,
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Wallet disconnected successfully.",
      data: wallet,
    });
  } catch (error) {
    console.error(
      "Disconnect wallet error:",
      error
    );

    next(error);
  }
};


/*
 * Set primary wallet
 */
const setPrimaryWallet = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const { id } =
      req.params;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Wallet ID is required.",
      });
    }

    const wallet =
      await walletService.setPrimaryWallet(
        telegramId,
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Primary wallet updated successfully.",
      data: wallet,
    });
  } catch (error) {
    console.error(
      "Set primary wallet error:",
      error
    );

    next(error);
  }
};


/*
 * Get supported wallets
 */
const getSupportedWallets =
  async (
    req,
    res,
    next
  ) => {
    try {
      const wallets =
        await walletService.getSupportedWallets();

      return res.status(200).json({
        success: true,
        data: wallets,
      });
    } catch (error) {
      console.error(
        "Get supported wallets error:",
        error
      );

      next(error);
    }
  };


/*
 * Get wallet status
 */
const getWalletStatus = async (
  req,
  res,
  next
) => {
  try {
    const { type } =
      req.params;

    if (!type) {
      return res.status(400).json({
        success: false,
        message:
          "Wallet type is required.",
      });
    }

    const status =
      await walletService.getWalletStatus(
        type
      );

    if (!status) {
      return res.status(404).json({
        success: false,
        message:
          "Wallet type not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error(
      "Get wallet status error:",
      error
    );

    next(error);
  }
};


export {
  getWallets,
  getTonWallet,
  addTonWallet,
  getWalletById,
  disconnectWallet,
  setPrimaryWallet,
  getSupportedWallets,
  getWalletStatus,
};
