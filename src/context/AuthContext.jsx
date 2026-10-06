import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import telegramWebApp from "../services/telegram/telegramWebApp";
import telegramAuth from "../services/telegram/telegramAuth";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(
    telegramAuth.isAuthenticated()
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        telegramWebApp.initTelegramWebApp();

        const telegramUser =
          telegramWebApp.getTelegramUser();

        if (!telegramUser) {
          setUser(null);
          setAuthenticated(
            telegramAuth.isAuthenticated()
          );
          return;
        }

        const response =
          await telegramAuth.authenticateTelegramUser();

        setUser(
          response?.user ||
            response?.data?.user ||
            telegramUser
        );

        setAuthenticated(true);
      } catch (authError) {
        console.error(
          "Authentication initialization failed:",
          authError
        );

        setError(
          authError?.message ||
            "Authentication failed."
        );

        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    telegramAuth.clearAuthToken();

    setUser(null);
    setAuthenticated(false);
  };

  const refreshAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const telegramUser =
        telegramWebApp.getTelegramUser();

      if (!telegramUser) {
        throw new Error(
          "Telegram user information is not available."
        );
      }

      const response =
        await telegramAuth.authenticateTelegramUser();

      setUser(
        response?.user ||
          response?.data?.user ||
          telegramUser
      );

      setAuthenticated(true);

      return response;
    } catch (authError) {
      console.error(
        "Authentication refresh failed:",
        authError
      );

      setError(
        authError?.message ||
          "Authentication refresh failed."
      );

      setAuthenticated(false);

      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authenticated,
    error,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};

export default AuthProvider;
