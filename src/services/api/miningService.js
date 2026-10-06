import apiClient from "./apiClient";

const getMiningStatus = async () => {
  return apiClient.get("/mining/status");
};

const getActiveMiningSession = async () => {
  return apiClient.get("/mining/session/active");
};

const startMining = async () => {
  return apiClient.post("/mining/start");
};

const claimMiningReward = async () => {
  return apiClient.post("/mining/claim");
};

const getMiningHistory = async (limit = 20) => {
  return apiClient.get(
    `/mining/history?limit=${encodeURIComponent(limit)}`
  );
};

const getMiningSettings = async () => {
  return apiClient.get("/mining/settings");
};

const miningService = {
  getMiningStatus,
  getActiveMiningSession,
  startMining,
  claimMiningReward,
  getMiningHistory,
  getMiningSettings,
};

export default miningService;
