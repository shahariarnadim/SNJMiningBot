import apiClient from "./apiClient";

const getAppSettings = async () => {
  return apiClient.get("/settings");
};

const getPublicSettings = async () => {
  return apiClient.get("/settings/public");
};

const getMiningSettings = async () => {
  return apiClient.get("/settings/mining");
};

const getRewardSettings = async () => {
  return apiClient.get("/settings/rewards");
};

const getWithdrawalSettings = async () => {
  return apiClient.get("/settings/withdrawals");
};

const getSwapSettings = async () => {
  return apiClient.get("/settings/swaps");
};

const getBackgroundSettings = async () => {
  return apiClient.get("/settings/background");
};

const settingsService = {
  getAppSettings,
  getPublicSettings,
  getMiningSettings,
  getRewardSettings,
  getWithdrawalSettings,
  getSwapSettings,
  getBackgroundSettings,
};

export default settingsService;
