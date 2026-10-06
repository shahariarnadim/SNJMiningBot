import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  frontendUrl:
    process.env.FRONTEND_URL || "*",

  databaseUrl:
    process.env.DATABASE_URL || "",

  jwtSecret:
    process.env.JWT_SECRET || "",

  telegramBotToken:
    process.env.TELEGRAM_BOT_TOKEN || "",

  telegramBotUsername:
    process.env.TELEGRAM_BOT_USERNAME || "",

  adminTelegramIds:
    process.env.ADMIN_TELEGRAM_IDS
      ? process.env.ADMIN_TELEGRAM_IDS
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [],
};

export default env;
