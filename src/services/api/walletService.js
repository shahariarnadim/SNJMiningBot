import apiClient from "./apiClient";

const getWallets = async () => {
  return apiClient.get("/wallets");
};

const getTONWallet = async () => {
  return apiClient.get("/wallets/ton");
};

const saveTONWallet = async (address) => {
  const walletAddress = String(address || "").trim();

  if (!walletAddress) {
    throw new Error("TON wallet address is required.");
  }

  return apiClient.post("/wallets/ton", {
    address: walletAddress,
  });
};

const removeTONWallet = async () => {
  return apiClient.delete("/wallets/ton");
};

const getWalletStatus = async () => {
  return apiClient.get("/wallets/status");
};

const getSupportedWallets = async () => {
  return apiClient.get("/wallets/supported");
};

const walletService = {
  getWallets,
  getTONWallet,
  saveTONWallet,
  removeTONWallet,
  getWalletStatus,
  getSupportedWallets,
};

export default walletService;
