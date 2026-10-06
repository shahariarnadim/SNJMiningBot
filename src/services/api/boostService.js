import apiClient from "./apiClient";

const getBoosts = async () => {
  return apiClient.get("/boosts");
};

const getActiveBoosts = async () => {
  return apiClient.get("/boosts/active");
};

const getBoostDetails = async (boostId) => {
  if (!boostId) {
    throw new Error("Boost ID is required.");
  }

  return apiClient.get(
    `/boosts/${encodeURIComponent(boostId)}`
  );
};

const activateBoost = async (boostId) => {
  if (!boostId) {
    throw new Error("Boost ID is required.");
  }

  return apiClient.post(
    `/boosts/${encodeURIComponent(boostId)}/activate`
  );
};

const getBoostHistory = async (limit = 20) => {
  return apiClient.get(
    `/boosts/history?limit=${encodeURIComponent(limit)}`
  );
};

const getBoostSettings = async () => {
  return apiClient.get("/boosts/settings");
};

const boostService = {
  getBoosts,
  getActiveBoosts,
  getBoostDetails,
  activateBoost,
  getBoostHistory,
  getBoostSettings,
};

export default boostService;
