import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import telegramAuthRoutes from "./telegram/telegramAuthRoutes.js";
import userRoutes from "./modules/users/userRoutes.js";
import balanceRoutes from "./modules/balances/balanceRoutes.js";
import miningRoutes from "./modules/mining/miningRoutes.js";
import boostRoutes from "./modules/boosts/boostRoutes.js";
import taskRoutes from "./modules/tasks/taskRoutes.js";
import referralRoutes from "./modules/referrals/referralRoutes.js";
import nTokenRoutes from "./modules/ntoken/nTokenRoutes.js";
import swapRoutes from "./modules/swaps/swapRoutes.js";
import walletRoutes from "./modules/wallets/walletRoutes.js";
import withdrawalRoutes from "./modules/withdrawals/withdrawalRoutes.js";
import transactionRoutes from "./modules/transactions/transactionRoutes.js";
import notificationRoutes from "./modules/notifications/notificationRoutes.js";
import settingsRoutes from "./modules/settings/settingsRoutes.js";
import adminRoutes from "./admin/adminRoutes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body
app.use(express.json({ limit: "1mb" }));
/*
 * Telegram Authentication
 */
app.use("/api/auth", telegramAuthRoutes);


/*
 * User API
 */
app.use("/api/users", userRoutes);


/*
 * Balance API
 */
app.use("/api/balances", balanceRoutes);


/*
 * Mining API
 */
app.use("/api/mining", miningRoutes);


/*
 * Boost API
 */
app.use("/api/boosts", boostRoutes);


/*
 * Task API
 */
app.use("/api/tasks", taskRoutes);


/*
 * Referral API
 */
app.use("/api/referrals", referralRoutes);


/*
 * N Token API
 */
app.use("/api/ntoken", nTokenRoutes);


/*
 * Swap API
 */
app.use("/api/swaps", swapRoutes);


/*
 * Wallet API
 */
app.use("/api/wallets", walletRoutes);


/*
 * Withdrawal API
 */
app.use("/api/withdrawals", withdrawalRoutes);


/*
 * Transaction API
 */
app.use("/api/transactions", transactionRoutes);


/*
 * Notification API
 */
app.use("/api/notifications", notificationRoutes);


/*
 * Settings API
 */
app.use("/api/settings", settingsRoutes);


/*
 * Admin API
 */
app.use("/api/admin", adminRoutes);
// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SNJ Mining Backend is running.",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// API Root
app.get("/api", (req, res) => {
  res.json({
    success: true,
    name: "SNJ Mining API",
    version: "1.0.0",
    status: "online",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message || "Internal server error.",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `SNJ Mining Backend running on port ${PORT}`
  );
});
