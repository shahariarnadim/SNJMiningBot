import crypto from "crypto";
import notificationModel from "./notificationModel.js";


const notifications = new Map();

const preferences = new Map();


/*
 * Create notification
 */
const createNotification = async ({
  telegramId,
  type,
  title,
  message,
  priority = "NORMAL",
  referenceId = null,
  referenceType = null,
  metadata = {},
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const preference =
    preferences.get(
      String(telegramId)
    );

  if (
    preference &&
    preference.enabled === false
  ) {
    return null;
  }

  const notification =
    notificationModel.createNotificationRecord({
      id: crypto.randomUUID(),
      telegramId,
      type,
      title,
      message,
      priority,
      referenceId,
      referenceType,
      metadata,
    });

  notifications.set(
    notification.id,
    notification
  );

  return notificationModel.sanitizeNotification(
    notification
  );
};


/*
 * Find notification by ID
 */
const findNotificationById = async (
  notificationId
) => {
  if (!notificationId) {
    return null;
  }

  return (
    notifications.get(
      String(notificationId)
    ) || null
  );
};


/*
 * Get user's notifications
 */
const getNotifications = async ({
  telegramId,
  unreadOnly = false,
  type = null,
  limit = 50,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const safeLimit = Math.min(
    Math.max(
      Number(limit) || 50,
      1
    ),
    100
  );

  let result =
    Array.from(
      notifications.values()
    ).filter(
      (notification) =>
        notification.telegramId ===
        String(telegramId)
    );

  if (unreadOnly) {
    result = result.filter(
      (notification) =>
        notification.isRead === false
    );
  }

  if (type) {
    const normalizedType =
      String(type).toUpperCase();

    result = result.filter(
      (notification) =>
        notification.type ===
        normalizedType
    );
  }

  result.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return result
    .slice(0, safeLimit)
    .map(
      (notification) =>
        notificationModel.sanitizeNotification(
          notification
        )
    );
};


/*
 * Get one notification
 */
const getNotification = async (
  telegramId,
  notificationId
) => {
  const notification =
    await findNotificationById(
      notificationId
    );

  if (!notification) {
    return null;
  }

  if (
    notification.telegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Notification access denied."
    );
  }

  return notificationModel.sanitizeNotification(
    notification
  );
};


/*
 * Mark notification as read
 */
const markAsRead = async (
  telegramId,
  notificationId
) => {
  const notification =
    await findNotificationById(
      notificationId
    );

  if (!notification) {
    throw new Error(
      "Notification not found."
    );
  }

  if (
    notification.telegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Notification access denied."
    );
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    notification.updatedAt =
      new Date();

    notifications.set(
      notification.id,
      notification
    );
  }

  return notificationModel.sanitizeNotification(
    notification
  );
};


/*
 * Mark all notifications as read
 */
const markAllAsRead = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const now = new Date();

  let updatedCount = 0;

  for (
    const notification of
    notifications.values()
  ) {
    if (
      notification.telegramId !==
      String(telegramId)
    ) {
      continue;
    }

    if (notification.isRead) {
      continue;
    }

    notification.isRead = true;
    notification.readAt = now;
    notification.updatedAt = now;

    notifications.set(
      notification.id,
      notification
    );

    updatedCount += 1;
  }

  return {
    updatedCount,
  };
};


/*
 * Get unread notification count
 */
const getUnreadCount = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return Array.from(
    notifications.values()
  ).filter(
    (notification) =>
      notification.telegramId ===
        String(telegramId) &&
      notification.isRead === false
  ).length;
};


/*
 * Delete notification
 */
const deleteNotification = async (
  telegramId,
  notificationId
) => {
  const notification =
    await findNotificationById(
      notificationId
    );

  if (!notification) {
    throw new Error(
      "Notification not found."
    );
  }

  if (
    notification.telegramId !==
    String(telegramId)
  ) {
    throw new Error(
      "Notification access denied."
    );
  }

  notifications.delete(
    notification.id
  );

  return {
    success: true,
    id: notification.id,
  };
};


/*
 * Delete all notifications
 */
const deleteAllNotifications = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  let deletedCount = 0;

  for (
    const notification of
    notifications.values()
  ) {
    if (
      notification.telegramId !==
      String(telegramId)
    ) {
      continue;
    }

    notifications.delete(
      notification.id
    );

    deletedCount += 1;
  }

  return {
    deletedCount,
  };
};


/*
 * Get notification preference
 */
const getNotificationPreference =
  async (
    telegramId
  ) => {
    if (!telegramId) {
      throw new Error(
        "Telegram user ID is required."
      );
    }

    const userId =
      String(telegramId);

    let preference =
      preferences.get(userId);

    if (!preference) {
      preference =
        notificationModel.createNotificationPreference({
          telegramId: userId,
          enabled: true,
        });

      preferences.set(
        userId,
        preference
      );
    }

    return notificationModel
      .sanitizeNotificationPreference(
        preference
      );
  };


/*
 * Update notification preference
 */
const updateNotificationPreference =
  async (
    telegramId,
    enabled
  ) => {
    if (!telegramId) {
      throw new Error(
        "Telegram user ID is required."
      );
    }

    if (
      typeof enabled !==
      "boolean"
    ) {
      throw new Error(
        "Notification enabled value must be boolean."
      );
    }

    const userId =
      String(telegramId);

    const preference =
      notificationModel
        .createNotificationPreference({
          telegramId: userId,
          enabled,
        });

    preferences.set(
      userId,
      preference
    );

    return notificationModel
      .sanitizeNotificationPreference(
        preference
      );
  };


/*
 * Get supported notification types
 */
const getSupportedTypes =
  async () => {
    return notificationModel
      .getSupportedNotificationTypes();
  };


/*
 * Get supported priorities
 */
const getSupportedPriorities =
  async () => {
    return notificationModel
      .getSupportedPriorities();
  };


const notificationService = {
  createNotification,

  findNotificationById,

  getNotifications,

  getNotification,

  markAsRead,

  markAllAsRead,

  getUnreadCount,

  deleteNotification,

  deleteAllNotifications,

  getNotificationPreference,

  updateNotificationPreference,

  getSupportedTypes,

  getSupportedPriorities,
};


export default notificationService;
