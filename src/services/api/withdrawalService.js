import apiClient from "./apiClient";

const getWithdrawalSettings = async () => {
  return apiClient.get("/withdrawals/settings");
};

const getWithdrawalMethods = async () => {
  return apiClient.get("/withdrawals/methods");
};

const validateWithdrawal = async (amount, method = "TON") => {
  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Withdrawal amount must be greater than zero."
    );
  }

  if (!method) {
    throw new Error(
      "Withdrawal method is required."
    );
  }

  return apiClient.post("/withdrawals/validate", {
    amount: Number(amount),
    method,
  });
};

const createWithdrawal = async (
  amount,
  method = "TON",
  walletAddress
) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Withdrawal amount must be greater than zero."
    );
  }

  if (!method) {
    throw new Error(
      "Withdrawal method is required."
    );
  }

  if (!walletAddress?.trim()) {
    throw new Error(
      "Wallet address is required."
    );
  }

  return apiClient.post("/withdrawals", {
    amount: Number(amount),
    method,
    walletAddress: walletAddress.trim(),
  });
};

const getWithdrawalHistory = async (limit = 20) => {
  return apiClient.get(
    `/withdrawals/history?limit=${encodeURIComponent(limit)}`
  );
};

const getWithdrawalDetails = async (withdrawalId) => {
  if (!withdrawalId) {
    throw new Error(
      "Withdrawal ID is required."
    );
  }

  return apiClient.get(
    `/withdrawals/${encodeURIComponent(withdrawalId)}`
  );
};

const withdrawalService = {
  getWithdrawalSettings,
  getWithdrawalMethods,
  validateWithdrawal,
  createWithdrawal,
  getWithdrawalHistory,
  getWithdrawalDetails,
};

export default withdrawalService;
