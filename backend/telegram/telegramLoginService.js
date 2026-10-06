import telegramWebApp from "./telegramWebApp.js";

import userService from "../modules/users/userService.js";

import jwtService from "../services/auth/jwtService.js";

import {
  isAdminTelegramId,
} from "../admin/adminAuth.js";


/*
 * Complete Telegram Login
 *
 * 1. Telegram initData validate
 * 2. Telegram user information read
 * 3. User create/find
 * 4. Admin status check
 * 5. JWT token generate
 */
const loginWithTelegram = async ({
  initData = "",
} = {}) => {

  if (!initData) {
    throw new Error(
      "Telegram initData is required."
    );
  }


  /*
   * Validate Telegram WebApp data
   */
  const isValid =
    telegramWebApp.validateInitData(
      initData
    );

  if (!isValid) {
    throw new Error(
      "Invalid Telegram WebApp authentication data."
    );
  }


  /*
   * Get Telegram user
   */
  const telegramUser =
    telegramWebApp.getTelegramUserFromInitData(
      initData
    );

  if (!telegramUser) {
    throw new Error(
      "Telegram user information not found."
    );
  }


  /*
   * Find existing user
   * or create a new user
   */
  const user =
    await userService.getOrCreateTelegramUser(
      telegramUser
    );


  /*
   * Check admin status
   */
  const isAdmin =
    isAdminTelegramId(
      telegramUser.id
    );


  /*
   * Generate JWT
   */
  const token =
    jwtService.generateToken({
      userId:
        user.id,
      telegramId:
        telegramUser.id,
      isAdmin,
    });


  /*
   * Return login result
   */
  return {
    success: true,

    token,

    user: {
      ...user,
      isAdmin,
    },

    telegram: {
      id:
        telegramUser.id,

      username:
        telegramUser.username ||
        null,

      firstName:
        telegramUser.first_name ||
        null,

      lastName:
        telegramUser.last_name ||
        null,

      languageCode:
        telegramUser.language_code ||
        null,
    },
  };
};


const telegramLoginService = {
  loginWithTelegram,
};


export default telegramLoginService;
