import apiClient from "./apiClient";

const getCurrentUser = async () => {
  return apiClient.get("/users/me");
};

const updateCurrentUser = async (userData = {}) => {
  return apiClient.patch(
    "/users/me",
    userData
  );
};

const getUserBalance = async () => {
  return apiClient.get("/users/me/balance");
};

const getUserProfile = async () => {
  return apiClient.get("/users/me/profile");
};

const userService = {
  getCurrentUser,
  updateCurrentUser,
  getUserBalance,
  getUserProfile,
};

export default userService;
