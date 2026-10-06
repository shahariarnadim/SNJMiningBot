import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getBalances,
  getSNJBalance,
  getNTokenBalance,
  getDollarBalance,
} from "./balanceController.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  getBalances
);

router.get(
  "/snj",
  authenticateUser,
  getSNJBalance
);

router.get(
  "/ntoken",
  authenticateUser,
  getNTokenBalance
);

router.get(
  "/dollar",
  authenticateUser,
  getDollarBalance
);

export default router;
