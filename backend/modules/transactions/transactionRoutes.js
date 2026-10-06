import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getTransactions,
  getTransaction,
  getAssetHistory,
  getTransactionSummary,
  getSupportedAssets,
  getSupportedTransactionTypes,
  getSupportedStatuses,
  updateTransactionStatus,
} from "./transactionController.js";


const router = express.Router();


/*
 * Supported transaction information
 */
router.get(
  "/assets",
  authenticateUser,
  getSupportedAssets
);

router.get(
  "/types",
  authenticateUser,
  getSupportedTransactionTypes
);

router.get(
  "/statuses",
  authenticateUser,
  getSupportedStatuses
);


/*
 * User transaction history
 */
router.get(
  "/",
  authenticateUser,
  getTransactions
);


/*
 * Transaction summary
 */
router.get(
  "/summary",
  authenticateUser,
  getTransactionSummary
);


/*
 * Asset-specific transaction history
 *
 * Example:
 * /api/transactions/history/SNJ
 * /api/transactions/history/N_TOKEN
 * /api/transactions/history/DOLLAR
 */
router.get(
  "/history/:asset",
  authenticateUser,
  getAssetHistory
);


/*
 * Get one transaction
 */
router.get(
  "/:id",
  authenticateUser,
  getTransaction
);


/*
 * Update transaction status
 *
 * IMPORTANT:
 * This endpoint will later be protected
 * by Admin Authentication.
 *
 * Do not expose it publicly in production.
 */
router.patch(
  "/:id/status",
  authenticateUser,
  updateTransactionStatus
);


export default router;
