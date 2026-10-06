import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getTasks,
  getTaskById,
  startTask,
  submitTask,
  verifyTask,
  rewardTask,
  getTaskHistory,
  getTaskSettings,
} from "./taskController.js";

const router = express.Router();

/*
 * Get all available tasks
 */
router.get(
  "/",
  authenticateUser,
  getTasks
);

/*
 * Get task history
 */
router.get(
  "/history",
  authenticateUser,
  getTaskHistory
);

/*
 * Get task settings
 */
router.get(
  "/settings",
  authenticateUser,
  getTaskSettings
);

/*
 * Get one task by ID
 */
router.get(
  "/:id",
  authenticateUser,
  getTaskById
);

/*
 * Start task
 */
router.post(
  "/:id/start",
  authenticateUser,
  startTask
);

/*
 * Submit task for verification
 */
router.post(
  "/:id/submit",
  authenticateUser,
  submitTask
);

/*
 * Verify task
 */
router.post(
  "/:id/verify",
  authenticateUser,
  verifyTask
);

/*
 * Credit task reward
 */
router.post(
  "/:id/reward",
  authenticateUser,
  rewardTask
);

export default router;
