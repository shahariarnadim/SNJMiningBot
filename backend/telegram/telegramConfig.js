import env from "../config/env.js";

const telegramConfig = {
  botToken: env.telegramBotToken,

  botUsername: env.telegramBotUsername,

  isConfigured: Boolean(
    env.telegramBotToken &&
      env.telegramBotUsername
  ),
};

export default telegramConfig;
