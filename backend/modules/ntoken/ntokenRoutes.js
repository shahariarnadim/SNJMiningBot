import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getNTokenBalance,
  getNTokenHistory,
  getNTokenTransactions,
  getNTokenSettings,
  getNTokenRewards,
  getNTokenTransactionById,
} from "./ntokenController.js";

const router = express.Router();

/*
 * Get N Token balance
 */
router.get(
  "/balance",
  authenticateUser,
  getNTokenBalance
);

/*
 * Get N Token history
 */
router.get(
  "/history",
  authenticateUser,
  getNTokenHistory
);

/*
 * Get N Token transactions
 */
router.get(
  "/transactions",
  authenticateUser,
  getNTokenTransactions
);

/*
 * Get N Token settings
 */
router.get(
  "/settings",
  authenticateUser,
  getNTokenSettings
);

/*
 * Get N Token rewards
 */
router.get(
  "/rewards",
  authenticateUser,
  getNTokenRewards
);

/*
 * Get one N Token transaction
 */
router.get(
  "/transactions/:id",
  authenticateUser,
  getNTokenTransactionById
);

export default router;
