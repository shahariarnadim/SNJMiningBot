import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getMiningStatus,
  getActiveMiningSession,
  startMining,
  claimMiningReward,
  getMiningHistory,
  getMiningSettings,
} from "./miningController.js";

const router = express.Router();

router.get(
  "/status",
  authenticateUser,
  getMiningStatus
);

router.get(
  "/session/active",
  authenticateUser,
  getActiveMiningSession
);

router.post(
  "/start",
  authenticateUser,
  startMining
);

router.post(
  "/claim",
  authenticateUser,
  claimMiningReward
);

router.get(
  "/history",
  authenticateUser,
  getMiningHistory
);

router.get(
  "/settings",
  authenticateUser,
  getMiningSettings
);

export default router;
