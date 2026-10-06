import express from "express";

import {
  authenticateTelegramUser,
} from "./telegramAuthController.js";

const router = express.Router();

router.post(
  "/telegram",
  authenticateTelegramUser
);

export default router;
