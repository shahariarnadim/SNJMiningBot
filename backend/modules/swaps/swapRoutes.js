import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getSwapPairs,
  getSwapRate,
  calculateSwap,
  executeSwap,
  getSwapHistory,
  getSwapTransactionById,
  getSwapSettings,
  getSwapPairById,
} from "./swapController.js";

const router = express.Router();

/*
 * Get all available swap pairs
 */
router.get(
  "/pairs",
  authenticateUser,
  getSwapPairs
);

/*
 * Get swap settings
 */
router.get(
  "/settings",
  authenticateUser,
  getSwapSettings
);

/*
 * Get swap rate
 */
router.get(
  "/rate",
  authenticateUser,
  getSwapRate
);

/*
 * Calculate swap
 */
router.post(
  "/calculate",
  authenticateUser,
  calculateSwap
);

/*
 * Execute swap
 */
router.post(
  "/",
  authenticateUser,
  executeSwap
);

/*
 * Get swap history
 */
router.get(
  "/history",
  authenticateUser,
  getSwapHistory
);

/*
 * Get one swap transaction
 */
router.get(
  "/transaction/:id",
  authenticateUser,
  getSwapTransactionById
);

/*
 * Get one swap pair
 */
router.get(
  "/pair/:id",
  authenticateUser,
  getSwapPairById
);

export default router;
