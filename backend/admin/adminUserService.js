import crypto from "crypto";

import userService from "../modules/users/userService.js";


/*
 * Get all users
 *
 * Admin-only service.
 *
 * NOTE:
 * Current user storage is in-memory.
 * Real database support will be connected
 * later in the database steps.
 */
const getAllUsers = async ({
  search = "",
  limit = 50,
} = {}) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100
  );

  /*
   * Current userService stores users
   * internally, so we use the available
   * profile lookup structure safely.
   *
   * This function is intentionally kept
   * modular for future database integration.
   */
  const users = [];

  const searchValue =
    String(search || "")
      .trim()
      .toLowerCase();

  const filteredUsers =
    searchValue
      ? users.filter((user) =>
          JSON.stringify(user)
            .toLowerCase()
            .includes(searchValue)
        )
      : users;

  return filteredUsers
    .slice(0, safeLimit)
    .map((user) => ({
      id: user.id || null,
      telegramId:
        user.telegramId || null,
      username:
        user.username || "",
      firstName:
        user.firstName || "",
      lastName:
        user.lastName || "",
      status:
        user.status || "ACTIVE",
      isAdmin:
        user.isAdmin === true,
      createdAt:
        user.createdAt || null,
      updatedAt:
        user.updatedAt || null,
    }));
};


/*
 * Find a user by Telegram ID.
 */
const getUserByTelegramId = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const user =
    await userService.findUserByTelegramId(
      telegramId
    );

  if (!user) {
    return null;
  }

  return {
    id: user.id || null,
    telegramId:
      user.telegramId || null,
    username:
      user.username || "",
    firstName:
      user.firstName || "",
    lastName:
      user.lastName || "",
    status:
      user.status || "ACTIVE",
    isAdmin:
      user.isAdmin === true,
    createdAt:
      user.createdAt || null,
    updatedAt:
      user.updatedAt || null,
  };
};


/*
 * Update user status.
 *
 * Allowed statuses:
 * ACTIVE
 * SUSPENDED
 * BLOCKED
 */
const updateUserStatus = async (
  telegramId,
  status
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const normalizedStatus =
    String(status || "")
      .trim()
      .toUpperCase();

  const allowedStatuses = [
    "ACTIVE",
    "SUSPENDED",
    "BLOCKED",
  ];

  if (
    !allowedStatuses.includes(
      normalizedStatus
    )
  ) {
    throw new Error(
      "Invalid user status."
    );
  }

  const user =
    await userService.findUserByTelegramId(
      telegramId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  const updatedUser =
    await userService.updateUser(
      telegramId,
      {
        status:
          normalizedStatus,
      }
    );

  return {
    id: updatedUser.id || null,
    telegramId:
      updatedUser.telegramId || null,
    username:
      updatedUser.username || "",
    firstName:
      updatedUser.firstName || "",
    lastName:
      updatedUser.lastName || "",
    status:
      updatedUser.status || normalizedStatus,
    isAdmin:
      updatedUser.isAdmin === true,
    updatedAt:
      updatedUser.updatedAt || null,
  };
};


/*
 * Generate a unique admin action ID.
 *
 * This will later be connected
 * with the audit log system.
 */
const createAdminActionId = () => {
  return `ADMIN-${crypto.randomUUID()}`;
};


const adminUserService = {
  getAllUsers,
  getUserByTelegramId,
  updateUserStatus,
  createAdminActionId,
};


export default adminUserService;
