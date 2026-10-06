import apiClient from "./apiClient";

const getTransactions = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.asset) {
    query.set("asset", params.asset);
  }

  if (params.type) {
    query.set("type", params.type);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.limit) {
    query.set(
      "limit",
      String(params.limit)
    );
  }

  const queryString = query.toString();

  return apiClient.get(
    `/transactions${queryString ? `?${queryString}` : ""}`
  );
};

const getTransactionDetails = async (
  transactionId
) => {
  if (!transactionId) {
    throw new Error(
      "Transaction ID is required."
    );
  }

  return apiClient.get(
    `/transactions/${encodeURIComponent(
      transactionId
    )}`
  );
};

const getTransactionHistory = async (
  asset,
  limit = 20
) => {
  if (!asset) {
    throw new Error(
      "Asset is required."
    );
  }

  return apiClient.get(
    `/transactions/history/${encodeURIComponent(
      asset
    )}?limit=${encodeURIComponent(limit)}`
  );
};

const getTransactionSummary = async () => {
  return apiClient.get(
    "/transactions/summary"
  );
};

const transactionService = {
  getTransactions,
  getTransactionDetails,
  getTransactionHistory,
  getTransactionSummary,
};

export default transactionService;
