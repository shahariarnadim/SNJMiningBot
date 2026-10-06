import apiClient from "./apiClient";

const getBalances = async () => {
  return apiClient.get("/balances");
};

const getSNJBalance = async () => {
  return apiClient.get("/balances/snj");
};

const getNTokenBalance = async () => {
  return apiClient.get("/balances/ntoken");
};

const getDollarBalance = async () => {
  return apiClient.get("/balances/dollar");
};

const getBalanceSummary = async () => {
  return apiClient.get("/balances/summary");
};

const balanceService = {
  getBalances,
  getSNJBalance,
  getNTokenBalance,
  getDollarBalance,
  getBalanceSummary,
};

export default balanceService;
