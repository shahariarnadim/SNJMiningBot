import telegramWebApp from "./telegramWebApp.js";

const authenticateTelegramUser = async (
  req,
  res,
  next
) => {
  try {
    const { initData } = req.body || {};

    if (!initData) {
      return res.status(400).json({
        success: false,
        message:
          "Telegram init data is required.",
      });
    }

    const validation =
      telegramWebApp.validateInitData
        ? telegramWebApp.validateInitData(initData)
        : telegramWebApp.validateTelegramInitData(
            initData
          );

    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message:
          validation.message ||
          "Invalid Telegram authentication data.",
      });
    }

    const telegramUser =
      telegramWebApp.getTelegramUserFromInitData(
        initData
      );

    if (!telegramUser?.id) {
      return res.status(401).json({
        success: false,
        message:
          "Telegram user information is missing.",
      });
    }

    /*
     * User database lookup/creation will be connected
     * here in the User module.
     *
     * JWT token generation will also be connected
     * after the authentication module is completed.
     */

    return res.status(200).json({
      success: true,
      message:
        "Telegram authentication successful.",
      user: telegramUser,
      token: null,
    });
  } catch (error) {
    console.error(
      "Telegram authentication controller error:",
      error
    );

    next(error);
  }
};

export {
  authenticateTelegramUser,
};
