const NOTIFICATION_TYPES = [
  "MINING_COMPLETE",
  "MINING_CLAIM",
  "TASK_REWARD",
  "REFERRAL_REWARD",
  "BOOST",
  "SWAP",
  "WITHDRAWAL",
  "ANNOUNCEMENT",
  "SYSTEM",
];


const NOTIFICATION_PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
];


const createNotificationRecord = ({
  id,
  telegramId,
  type,
  title,
  message,
  priority = "NORMAL",
  referenceId = null,
  referenceType = null,
  metadata = {},
  isRead = false,
} = {}) => {
  if (!id) {
    throw new Error(
      "Notification ID is required."
    );
  }

  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!type) {
    throw new Error(
      "Notification type is required."
    );
  }

  const notificationType =
    String(type).toUpperCase();

  if (
    !NOTIFICATION_TYPES.includes(
      notificationType
    )
  ) {
    throw new Error(
      "Unsupported notification type."
    );
  }

  if (!title) {
    throw new Error(
      "Notification title is required."
    );
  }

  if (!message) {
    throw new Error(
      "Notification message is required."
    );
  }

  const notificationPriority =
    String(priority).toUpperCase();

  if (
    !NOTIFICATION_PRIORITIES.includes(
      notificationPriority
    )
  ) {
    throw new Error(
      "Invalid notification priority."
    );
  }

  return {
    id: String(id),

    telegramId: String(
      telegramId
    ),

    type: notificationType,

    title: String(title),

    message: String(message),

    priority:
      notificationPriority,

    referenceId:
      referenceId
        ? String(referenceId)
        : null,

    referenceType:
      referenceType
        ? String(referenceType)
        : null,

    metadata:
      metadata &&
      typeof metadata === "object"
        ? metadata
        : {},

    isRead: Boolean(isRead),

    readAt: isRead
      ? new Date()
      : null,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};


const sanitizeNotification = (
  notification = {}
) => {
  return {
    id:
      notification.id || null,

    telegramId:
      notification.telegramId ||
      null,

    type:
      notification.type || null,

    title:
      notification.title || "",

    message:
      notification.message || "",

    priority:
      notification.priority ||
      "NORMAL",

    referenceId:
      notification.referenceId ||
      null,

    referenceType:
      notification.referenceType ||
      null,

    metadata:
      notification.metadata || {},

    isRead:
      notification.isRead === true,

    readAt:
      notification.readAt || null,

    createdAt:
      notification.createdAt ||
      null,

    updatedAt:
      notification.updatedAt ||
      null,
  };
};


const createNotificationPreference = ({
  telegramId,
  enabled = true,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return {
    telegramId: String(
      telegramId
    ),

    enabled: Boolean(
      enabled
    ),

    updatedAt: new Date(),
  };
};


const sanitizeNotificationPreference = (
  preference = {}
) => {
  return {
    telegramId:
      preference.telegramId ||
      null,

    enabled:
      preference.enabled !== false,

    updatedAt:
      preference.updatedAt ||
      null,
  };
};


const getSupportedNotificationTypes =
  () => [
    ...NOTIFICATION_TYPES,
  ];


const getSupportedPriorities =
  () => [
    ...NOTIFICATION_PRIORITIES,
  ];


const notificationModel = {
  NOTIFICATION_TYPES,

  NOTIFICATION_PRIORITIES,

  createNotificationRecord,

  sanitizeNotification,

  createNotificationPreference,

  sanitizeNotificationPreference,

  getSupportedNotificationTypes,

  getSupportedPriorities,
};


export default notificationModel;
