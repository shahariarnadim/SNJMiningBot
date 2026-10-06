import transactionService from "./transactionService.js";


/*
 * Get user's transactions
 */
const getTransactions = async (
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
      asset = null,
      type = null,
      status = null,
      limit = 50,
    } = req.query || {};

    const transactions =
      await transactionService.getTransactions({
        telegramId,
        asset,
        type,
        status,
        limit,
      });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(
      "Get transactions error:",
      error
    );

    next(error);
  }
};


/*
 * Get transaction by ID
 */
const getTransaction = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const {
      id,
    } = req.params;

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
          "Transaction ID is required.",
      });
    }

    const transaction =
      await transactionService.getTransaction(
        telegramId,
        id
      );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message:
          "Transaction not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error(
      "Get transaction error:",
      error
    );

    next(error);
  }
};


/*
 * Get transaction history
 * for a specific asset
 */
const getAssetHistory = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const {
      asset,
    } = req.params;

    const {
      limit = 50,
    } = req.query || {};

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    if (!asset) {
      return res.status(400).json({
        success: false,
        message:
          "Asset is required.",
      });
    }

    const history =
      await transactionService
        .getAssetHistory(
          telegramId,
          asset,
          limit
        );

    return res.status(200).json({
      success: true,
      asset:
        String(asset).toUpperCase(),
      data: history,
    });
  } catch (error) {
    console.error(
      "Get asset transaction history error:",
      error
    );

    next(error);
  }
};


/*
 * Get transaction summary
 */
const getTransactionSummary =
  async (
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

      const summary =
        await transactionService
          .getTransactionSummary(
            telegramId
          );

      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error(
        "Get transaction summary error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported assets
 */
const getSupportedAssets =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assets =
        await transactionService
          .getSupportedAssets();

      return res.status(200).json({
        success: true,
        data: assets,
      });
    } catch (error) {
      console.error(
        "Get supported transaction assets error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported transaction types
 */
const getSupportedTransactionTypes =
  async (
    req,
    res,
    next
  ) => {
    try {
      const types =
        await transactionService
          .getSupportedTransactionTypes();

      return res.status(200).json({
        success: true,
        data: types,
      });
    } catch (error) {
      console.error(
        "Get supported transaction types error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported statuses
 */
const getSupportedStatuses =
  async (
    req,
    res,
    next
  ) => {
    try {
      const statuses =
        await transactionService
          .getSupportedStatuses();

      return res.status(200).json({
        success: true,
        data: statuses,
      });
    } catch (error) {
      console.error(
        "Get supported transaction statuses error:",
        error
      );

      next(error);
    }
  };


/*
 * Update transaction status
 *
 * This is intended for
 * trusted Admin/System use.
 *
 * Admin protection will be added
 * in the Admin module later.
 */
const updateTransactionStatus =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        id,
      } = req.params;

      const {
        status,
        metadata = {},
      } = req.body || {};

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Transaction ID is required.",
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Transaction status is required.",
        });
      }

      const transaction =
        await transactionService
          .updateTransactionStatus(
            id,
            status,
            metadata
          );

      return res.status(200).json({
        success: true,
        message:
          "Transaction status updated successfully.",
        data: transaction,
      });
    } catch (error) {
      console.error(
        "Update transaction status error:",
        error
      );

      next(error);
    }
  };


export {
  getTransactions,
  getTransaction,
  getAssetHistory,
  getTransactionSummary,
  getSupportedAssets,
  getSupportedTransactionTypes,
  getSupportedStatuses,
  updateTransactionStatus,
};
