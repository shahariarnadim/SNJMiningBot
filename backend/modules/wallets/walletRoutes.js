import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getWallets,
  getTonWallet,
  addTonWallet,
  getWalletById,
  disconnectWallet,
  setPrimaryWallet,
  getSupportedWallets,
  getWalletStatus,
} from "./walletController.js";


const router = express.Router();


/*
 * Get supported wallet types
 * Public endpoint
 */
router.get(
  "/supported",
  getSupportedWallets
);


/*
 * Get wallet provider status
 * Public endpoint
 */
router.get(
  "/status/:type",
  getWalletStatus
);


/*
 * Get all user wallets
 */
router.get(
  "/",
  authenticateUser,
  getWallets
);


/*
 * Get connected TON wallet
 */
router.get(
  "/ton",
  authenticateUser,
  getTonWallet
);


/*
 * Add TON wallet
 */
router.post(
  "/ton",
  authenticateUser,
  addTonWallet
);


/*
 * Get wallet by ID
 */
router.get(
  "/:id",
  authenticateUser,
  getWalletById
);


/*
 * Disconnect wallet
 */
router.delete(
  "/ton",
  authenticateUser,
  async (req, res, next) => {
    try {
      const wallet =
        await getTonWalletForDelete(
          req
        );

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message:
            "TON wallet not found.",
        });
      }

      req.params.id =
        wallet.id;

      return disconnectWallet(
        req,
        res,
        next
      );
    } catch (error) {
      next(error);
    }
  }
);


/*
 * Disconnect wallet by ID
 */
router.delete(
  "/:id",
  authenticateUser,
  disconnectWallet
);


/*
 * Set primary wallet
 */
router.patch(
  "/:id/primary",
  authenticateUser,
  setPrimaryWallet
);


/*
 * Helper for TON wallet delete
 */
async function getTonWalletForDelete(
  req
) {
  const telegramId =
    req.user?.telegramId;

  if (!telegramId) {
    return null;
  }

  const wallets =
    await import("./walletService.js");

  return wallets.default.getTonWallet(
    telegramId
  );
}


export default router;
