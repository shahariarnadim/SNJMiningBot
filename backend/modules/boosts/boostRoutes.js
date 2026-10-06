import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getBoosts,
  getActiveBoost,
  getBoostById,
  activateBoost,
  getBoostHistory,
  getBoostSettings,
} from "./boostController.js";

const router = express.Router();

/*
 * Get all available boosts
 */
router.get(
  "/",
  authenticateUser,
  getBoosts
);

/*
 * Get currently active boost
 */
router.get(
  "/active",
  authenticateUser,
  getActiveBoost
);

/*
 * Get boost settings
 */
router.get(
  "/settings",
  authenticateUser,
  getBoostSettings
);

/*
 * Get boost history
 */
router.get(
  "/history",
  authenticateUser,
  getBoostHistory
);

/*
 * Get one boost by ID
 */
router.get(
  "/:id",
  authenticateUser,
  getBoostById
);

/*
 * Activate boost
 */
router.post(
  "/:id/activate",
  authenticateUser,
  activateBoost
);

export default router;
