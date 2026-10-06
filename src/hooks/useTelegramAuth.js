import { useCallback, useEffect, useState } from "react";

import telegramWebApp from "../services/telegram/telegramWebApp";
import telegramAuth from "../services/telegram/telegramAuth";

const useTelegramAuth = () => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authenticate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      telegramWebApp.initTelegramWebApp();

      const telegramUser =
        telegramWebApp.getTelegramUser();

      if (!telegramUser) {
        throw new Error(
          "Telegram user information is not available."
        );
      }

      const response =
        await telegramAuth.authenticateTelegramUser();

      const authenticatedUser =
        response?.user ||
        response?.data?.user ||
        telegramUser;

      setUser(authenticatedUser);
      setAuthenticated(true);

      return authenticatedUser;
    } catch (authError) {
      console.error(
        "Telegram authentication failed:",
        authError
      );

      setUser(null);
      setAuthenticated(false);

      setError(
        authError?.message ||
          "Telegram authentication failed."
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    telegramAuth.clearAuthToken();

    setUser(null);
    setAuthenticated(false);
  }, []);

  const getInitData = useCallback(() => {
    return telegramWebApp.getTelegramInitData();
  }, []);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return {
    user,
    authenticated,
    loading,
    error,
    authenticate,
    logout,
    getInitData,
  };
};

export default useTelegramAuth;
