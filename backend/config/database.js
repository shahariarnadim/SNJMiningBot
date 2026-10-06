import env from "./env.js";

let database = null;

const connectDatabase = async () => {
  if (!env.databaseUrl) {
    console.warn(
      "DATABASE_URL is not configured. Database connection is disabled."
    );

    return null;
  }

  /*
   * Production database connection will be added here.
   *
   * The database layer remains independent from:
   * - Mining
   * - Boost
   * - Tasks
   * - Friends / Referrals
   * - N Token
   * - Swap
   * - Wallet
   * - Withdrawals
   * - Admin
   */

  database = {
    connected: true,
    urlConfigured: true,
  };

  console.log("Database configuration loaded.");

  return database;
};

const getDatabase = () => {
  return database;
};

const disconnectDatabase = async () => {
  database = null;

  console.log("Database connection closed.");
};

const databaseConfig = {
  connectDatabase,
  getDatabase,
  disconnectDatabase,
};

export default databaseConfig;
