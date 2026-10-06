import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getCurrentUser,
  updateCurrentUser,
  getCurrentUserProfile,
} from "./userController.js";

const router = express.Router();

router.get(
  "/me",
  authenticateUser,
  getCurrentUser
);

router.patch(
  "/me",
  authenticateUser,
  updateCurrentUser
);

router.get(
  "/me/profile",
  authenticateUser,
  getCurrentUserProfile
);

export default router;
