import apiClient from "../api/apiClient";

const authenticateTelegramUser = async () => {
  const initData = window.Telegram?.WebApp?.initData || "";

  if (!initData) {
    throw new Error(
      "Telegram authentication data is not available."
    );
  }

  const response = await apiClient.post(
    "/auth/telegram",
    {
      initData,
    }
  );

  if (response?.token) {
    localStorage.setItem(
      "snj_auth_token",
      response.token
    );
  }

  return response;
};

const getStoredAuthToken = () => {
  return localStorage.getItem("snj_auth_token");
};

const clearAuthToken = () => {
  localStorage.removeItem("snj_auth_token");
};

const isAuthenticated = () => {
  return Boolean(getStoredAuthToken());
};

const telegramAuth = {
  authenticateTelegramUser,
  getStoredAuthToken,
  clearAuthToken,
  isAuthenticated,
};

export default telegramAuth;
