import withdrawalService from "./withdrawalService.js";


/*
 * Get withdrawal settings
 */
const getWithdrawalSettings =
  async (
    req,
    res,
    next
  ) => {
    try {
      const settings =
        await withdrawalService
          .getWithdrawalSettings();

      return res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error(
        "Get withdrawal settings error:",
        error
      );

      next(error);
    }
  };


/*
 * Validate withdrawal
 */
const validateWithdrawal =
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

      const {
        amount,
        method = "TON",
        walletId = null,
      } = req.body || {};

      if (
        amount === undefined ||
        amount === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Withdrawal amount is required.",
        });
      }

      const result =
        await withdrawalService
          .validateWithdrawal({
            telegramId,
            amount,
            method,
            walletId,
          });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(
        "Validate withdrawal error:",
        error
      );

      next(error);
    }
  };


/*
 * Create withdrawal
 */
const createWithdrawal =
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

      const {
        amount,
        method = "TON",
        walletId = null,
        idempotencyKey = null,
        note = "",
      } = req.body || {};

      if (
        amount === undefined ||
        amount === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Withdrawal amount is required.",
        });
      }

      const withdrawal =
        await withdrawalService
          .createWithdrawal({
            telegramId,
            amount,
            method,
            walletId,
            idempotencyKey,
            note,
          });

      return res.status(201).json({
        success: true,
        message:
          "Withdrawal request created successfully.",
        data: withdrawal,
      });
    } catch (error) {
      console.error(
        "Create withdrawal error:",
        error
      );

      next(error);
    }
  };


/*
 * Get withdrawal history
 */
const getWithdrawalHistory =
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

      const history =
        await withdrawalService
          .getWithdrawalHistory(
            telegramId
          );

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error(
        "Get withdrawal history error:",
        error
      );

      next(error);
    }
  };


/*
 * Get single withdrawal
 */
const getWithdrawal =
  async (
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
            "Withdrawal ID is required.",
        });
      }

      const withdrawal =
        await withdrawalService
          .getWithdrawal(
            telegramId,
            id
          );

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message:
            "Withdrawal not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: withdrawal,
      });
    } catch (error) {
      console.error(
        "Get withdrawal error:",
        error
      );

      next(error);
    }
  };


/*
 * Cancel withdrawal
 */
const cancelWithdrawal =
  async (
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
            "Withdrawal ID is required.",
        });
      }

      const withdrawal =
        await withdrawalService
          .cancelWithdrawal(
            telegramId,
            id
          );

      return res.status(200).json({
        success: true,
        message:
          "Withdrawal cancelled successfully.",
        data: withdrawal,
      });
    } catch (error) {
      console.error(
        "Cancel withdrawal error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported withdrawal assets
 */
const getSupportedWithdrawalAssets =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assets =
        await withdrawalService
          .getSupportedWithdrawalAssets();

      return res.status(200).json({
        success: true,
        data: assets,
      });
    } catch (error) {
      console.error(
        "Get supported withdrawal assets error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported withdrawal methods
 */
const getSupportedWithdrawalMethods =
  async (
    req,
    res,
    next
  ) => {
    try {
      const methods =
        await withdrawalService
          .getSupportedWithdrawalMethods();

      return res.status(200).json({
        success: true,
        data: methods,
      });
    } catch (error) {
      console.error(
        "Get supported withdrawal methods error:",
        error
      );

      next(error);
    }
  };


/*
 * Update withdrawal status
 *
 * This endpoint is intended for
 * trusted Admin/System processing.
 *
 * Route protection will be added
 * in the Admin module later.
 */
const updateWithdrawalStatus =
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
        transactionHash = null,
        note = "",
      } = req.body || {};

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Withdrawal ID is required.",
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Withdrawal status is required.",
        });
      }

      const withdrawal =
        await withdrawalService
          .updateWithdrawalStatus(
            id,
            status,
            transactionHash,
            note
          );

      return res.status(200).json({
        success: true,
        message:
          "Withdrawal status updated successfully.",
        data: withdrawal,
      });
    } catch (error) {
      console.error(
        "Update withdrawal status error:",
        error
      );

      next(error);
    }
  };


export {
  getWithdrawalSettings,
  validateWithdrawal,
  createWithdrawal,
  getWithdrawalHistory,
  getWithdrawal,
  cancelWithdrawal,
  getSupportedWithdrawalAssets,
  getSupportedWithdrawalMethods,
  updateWithdrawalStatus,
};
