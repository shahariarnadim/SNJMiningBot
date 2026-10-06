import crypto from "crypto";

import telegramConfig from "./telegramConfig.js";

const parseInitData = (initData = "") => {
  const params = new URLSearchParams(initData);

  const data = {};

  for (const [key, value] of params.entries()) {
    data[key] = value;
  }

  return data;
};

const validateTelegramInitData = (
  initData = ""
) => {
  if (!initData) {
    return {
      valid: false,
      data: null,
      message: "Telegram init data is missing.",
    };
  }

  if (!telegramConfig.botToken) {
    return {
      valid: false,
      data: null,
      message:
        "Telegram bot token is not configured.",
    };
  }

  try {
    const params = new URLSearchParams(initData);

    const receivedHash = params.get("hash");

    if (!receivedHash) {
      return {
        valid: false,
        data: null,
        message: "Telegram hash is missing.",
      };
    }

    params.delete("hash");

    const dataCheckString = Array.from(
      params.entries()
    )
      .sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
      )
      .map(
        ([key, value]) =>
          `${key}=${value}`
      )
      .join("\n");

    const secretKey = crypto
      .createHmac(
        "sha256",
        "WebAppData"
      )
      .update(telegramConfig.botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac(
        "sha256",
        secretKey
      )
      .update(dataCheckString)
      .digest("hex");

    const receivedBuffer =
      Buffer.from(receivedHash, "hex");

    const calculatedBuffer =
      Buffer.from(calculatedHash, "hex");

    if (
      receivedBuffer.length !==
      calculatedBuffer.length
    ) {
      return {
        valid: false,
        data: null,
        message:
          "Telegram data validation failed.",
      };
    }

    const isValid =
      crypto.timingSafeEqual(
        receivedBuffer,
        calculatedBuffer
      );

    if (!isValid) {
      return {
        valid: false,
        data: null,
        message:
          "Invalid Telegram init data.",
      };
    }

    return {
      valid: true,
      data: parseInitData(initData),
      message:
        "Telegram init data validated successfully.",
    };
  } catch (error) {
    console.error(
      "Telegram init data validation error:",
      error
    );

    return {
      valid: false,
      data: null,
      message:
        "Telegram init data validation failed.",
    };
  }
};

const getTelegramUserFromInitData = (
  initData = ""
) => {
  const validation =
    validateTelegramInitData(initData);

  if (!validation.valid) {
    return null;
  }

  if (!validation.data?.user) {
    return null;
  }

  try {
    return JSON.parse(
      validation.data.user
    );
  } catch (error) {
    console.error(
      "Failed to parse Telegram user:",
      error
    );

    return null;
  }
};

const telegramWebApp = {
  parseInitData,
  validateTelegramInitData,
  getTelegramUserFromInitData,
};

export default telegramWebApp;
