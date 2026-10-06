import express from "express";

import authenticateAdmin from "./adminAuth.js";

const router = express.Router();


/*
 * Admin Authentication Check
 *
 * GET /api/admin/auth
 *
 * Used to verify whether the
 * authenticated Telegram user
 * has administrator access.
 */
router.get(
  "/auth",
  authenticateAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin authentication successful.",
      admin: true,
      user: {
        telegramId:
          req.user?.telegramId || null,
        isAdmin:
          req.user?.isAdmin === true,
      },
    });
  }
);


/*
 * Admin Dashboard Health Check
 *
 * GET /api/admin/health
 */
router.get(
  "/health",
  authenticateAdmin,
  (req, res) => {
    res.json({
      success: true,
      service: "SNJ Mining Admin API",
      status: "online",
      admin: true,
      timestamp:
        new Date().toISOString(),
    });
  }
);


export default router;
