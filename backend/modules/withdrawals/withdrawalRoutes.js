import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getWithdrawalSettings,
  validateWithdrawal,
  createWithdrawal,
  getWithdrawalHistory,
  getWithdrawal,
  cancelWithdrawal,
  getSupportedWithdrawalAssets,
  getSupportedWithdrawalMethods,
  updateWithdrawalStatus,
} from "./withdrawalController.js";


const router = express.Router();


/*
 * Get withdrawal settings
 *
 * Authentication required.
 */
router.get(
  "/settings",
  authenticateUser,
  getWithdrawalSettings
);


/*
 * Get supported withdrawal assets
 *
 * Example:
 * DOLLAR
 */
router.get(
  "/assets",
  authenticateUser,
  getSupportedWithdrawalAssets
);


/*
 * Get supported withdrawal methods
 *
 * Example:
 * TON
 */
router.get(
  "/methods",
  authenticateUser,
  getSupportedWithdrawalMethods
);


/*
 * Validate withdrawal
 *
 * This checks:
 * - Minimum amount
 * - Maximum amount
 * - Dollar balance
 * - TON wallet
 * - Withdrawal status
 */
router.post(
  "/validate",
  authenticateUser,
  validateWithdrawal
);


/*
 * Create withdrawal request
 */
router.post(
  "/",
  authenticateUser,
  createWithdrawal
);


/*
 * Get user's withdrawal history
 */
router.get(
  "/history",
  authenticateUser,
  getWithdrawalHistory
);


/*
 * Get single withdrawal
 */
router.get(
  "/:id",
  authenticateUser,
  getWithdrawal
);


/*
 * Cancel pending withdrawal
 */
router.patch(
  "/:id/cancel",
  authenticateUser,
  cancelWithdrawal
);


/*
 * Update withdrawal status
 *
 * IMPORTANT:
 * This route is temporarily defined
 * here for module completeness.
 *
 * Later it MUST be protected by
 * Admin Authentication.
 */
router.patch(
  "/:id/status",
  authenticateUser,
  updateWithdrawalStatus
);


export default router;
