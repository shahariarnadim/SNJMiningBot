import apiClient from "./apiClient";

const getReferralInfo = async () => {
  return apiClient.get("/referrals");
};

const getReferralLink = async () => {
  return apiClient.get("/referrals/link");
};

const getReferralStats = async () => {
  return apiClient.get("/referrals/stats");
};

const getReferralHistory = async (limit = 20) => {
  return apiClient.get(
    `/referrals/history?limit=${encodeURIComponent(limit)}`
  );
};

const getReferralDetails = async (referralId) => {
  if (!referralId) {
    throw new Error("Referral ID is required.");
  }

  return apiClient.get(
    `/referrals/${encodeURIComponent(referralId)}`
  );
};

const referralService = {
  getReferralInfo,
  getReferralLink,
  getReferralStats,
  getReferralHistory,
  getReferralDetails,
};

export default referralService;
