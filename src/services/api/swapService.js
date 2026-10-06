import apiClient from "./apiClient";

const getSwapSettings = async () => {
  return apiClient.get("/swaps/settings");
};

const getSwapPairs = async () => {
  return apiClient.get("/swaps/pairs");
};

const getExchangeRate = async (fromAsset, toAsset) => {
  if (!fromAsset || !toAsset) {
    throw new Error(
      "From asset and to asset are required."
    );
  }

  return apiClient.get(
    `/swaps/rate?from=${encodeURIComponent(
      fromAsset
    )}&to=${encodeURIComponent(toAsset)}`
  );
};

const calculateSwap = async (
  fromAsset,
  toAsset,
  amount
) => {
  if (!fromAsset || !toAsset) {
    throw new Error(
      "From asset and to asset are required."
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Swap amount must be greater than zero."
    );
  }

  return apiClient.post("/swaps/calculate", {
    fromAsset,
    toAsset,
    amount: Number(amount),
  });
};

const createSwap = async (
  fromAsset,
  toAsset,
  amount
) => {
  if (!fromAsset || !toAsset) {
    throw new Error(
      "From asset and to asset are required."
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Swap amount must be greater than zero."
    );
  }

  return apiClient.post("/swaps", {
    fromAsset,
    toAsset,
    amount: Number(amount),
  });
};

const getSwapHistory = async (limit = 20) => {
  return apiClient.get(
    `/swaps/history?limit=${encodeURIComponent(limit)}`
  );
};

const swapService = {
  getSwapSettings,
  getSwapPairs,
  getExchangeRate,
  calculateSwap,
  createSwap,
  getSwapHistory,
};

export default swapService;
