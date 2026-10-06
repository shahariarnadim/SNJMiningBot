import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getReferralLink,
  createReferral,
  getReferralStats,
  getReferralHistory,
  getReferralById,
  completeReferral,
  rewardReferral,
  getReferralSettings,
} from "./referralController.js";

const router = express.Router();

/*
 * Get referral link
 */
router.get(
  "/link",
  authenticateUser,
  getReferralLink
);

/*
 * Get referral statistics
 */
router.get(
  "/stats",
  authenticateUser,
  getReferralStats
);

/*
 * Get referral history
 */
router.get(
  "/history",
  authenticateUser,
  getReferralHistory
);

/*
 * Get referral settings
 */
router.get(
  "/settings",
  authenticateUser,
  getReferralSettings
);

/*
 * Create referral
 */
router.post(
  "/",
  authenticateUser,
  createReferral
);

/*
 * Complete referral
 *
 * This endpoint is temporary.
 * Production verification will move
 * this action to a trusted server/admin flow.
 */
router.post(
  "/complete",
  authenticateUser,
  completeReferral
);

/*
 * Reward referral
 *
 * This endpoint will later be restricted
 * to a trusted server/admin process.
 */
router.post(
  "/:id/reward",
  authenticateUser,
  rewardReferral
);

/*
 * Get one referral by ID
 */
router.get(
  "/:id",
  authenticateUser,
  getReferralById
);

export default router;
