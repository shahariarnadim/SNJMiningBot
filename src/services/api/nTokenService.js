import apiClient from "./apiClient";

const getNTokenBalance = async () => {
  return apiClient.get("/ntoken/balance");
};

const getNTokenHistory = async (limit = 20) => {
  return apiClient.get(
    `/ntoken/history?limit=${encodeURIComponent(limit)}`
  );
};

const getNTokenTransactions = async (limit = 20) => {
  return apiClient.get(
    `/ntoken/transactions?limit=${encodeURIComponent(limit)}`
  );
};

const getNTokenSettings = async () => {
  return apiClient.get("/ntoken/settings");
};

const getNTokenRewardSummary = async () => {
  return apiClient.get("/ntoken/rewards");
};

const nTokenService = {
  getNTokenBalance,
  getNTokenHistory,
  getNTokenTransactions,
  getNTokenSettings,
  getNTokenRewardSummary,
};

export default nTokenService;
