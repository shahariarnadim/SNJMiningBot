import notificationService from "../modules/notifications/notificationService.js";


/*
 * Create an announcement for a specific user.
 */
const sendAnnouncementToUser = async ({
  telegramId,
  title,
  message,
  priority = "NORMAL",
  metadata = {},
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!title) {
    throw new Error(
      "Announcement title is required."
    );
  }

  if (!message) {
    throw new Error(
      "Announcement message is required."
    );
  }

  return notificationService.createNotification({
    telegramId,
    type: "ANNOUNCEMENT",
    title: String(title).trim(),
    message: String(message).trim(),
    priority: String(priority)
      .trim()
      .toUpperCase(),
    metadata,
  });
};


/*
 * Send an announcement to multiple users.
 *
 * User IDs are supplied by the caller.
 * No user list is hardcoded.
 */
const sendAnnouncementToUsers = async ({
  telegramIds = [],
  title,
  message,
  priority = "NORMAL",
  metadata = {},
} = {}) => {
  if (!Array.isArray(telegramIds)) {
    throw new Error(
      "Telegram user IDs must be an array."
    );
  }

  if (telegramIds.length === 0) {
    throw new Error(
      "At least one Telegram user ID is required."
    );
  }

  if (!title) {
    throw new Error(
      "Announcement title is required."
    );
  }

  if (!message) {
    throw new Error(
      "Announcement message is required."
    );
  }

  const results = [];

  for (const telegramId of telegramIds) {
    try {
      const notification =
        await sendAnnouncementToUser({
          telegramId,
          title,
          message,
          priority,
          metadata,
        });

      results.push({
        telegramId: String(telegramId),
        success: true,
        notification,
      });
    } catch (error) {
      results.push({
        telegramId: String(telegramId),
        success: false,
        error: error.message,
      });
    }
  }

  return {
    total: telegramIds.length,
    successful: results.filter(
      (item) => item.success
    ).length,
    failed: results.filter(
      (item) => !item.success
    ).length,
    results,
  };
};


/*
 * Send an announcement to all users.
 *
 * The current in-memory notification
 * module does not expose its user list.
 *
 * This method is intentionally kept as
 * a modular placeholder for the database
 * implementation.
 */
const sendAnnouncementToAll = async ({
  title,
  message,
  priority = "NORMAL",
  metadata = {},
} = {}) => {
  if (!title) {
    throw new Error(
      "Announcement title is required."
    );
  }

  if (!message) {
    throw new Error(
      "Announcement message is required."
    );
  }

  return {
    success: false,
    status: "DATABASE_REQUIRED",
    message:
      "Broadcast to all users will be enabled after the production database is connected.",
    announcement: {
      type: "ANNOUNCEMENT",
      title: String(title).trim(),
      message: String(message).trim(),
      priority: String(priority)
        .trim()
        .toUpperCase(),
      metadata,
    },
  };
};


/*
 * Get supported announcement
 * notification priorities.
 */
const getAnnouncementPriorities =
  async () => {
    return notificationService
      .getSupportedPriorities();
  };


/*
 * Validate announcement data
 * before sending.
 */
const validateAnnouncement = async ({
  title,
  message,
  priority = "NORMAL",
} = {}) => {
  if (!title) {
    return {
      valid: false,
      message:
        "Announcement title is required.",
    };
  }

  if (!message) {
    return {
      valid: false,
      message:
        "Announcement message is required.",
    };
  }

  const normalizedPriority =
    String(priority)
      .trim()
      .toUpperCase();

  const priorities =
    await getAnnouncementPriorities();

  if (
    !priorities.includes(
      normalizedPriority
    )
  ) {
    return {
      valid: false,
      message:
        "Invalid announcement priority.",
    };
  }

  return {
    valid: true,
    title: String(title).trim(),
    message: String(message).trim(),
    priority: normalizedPriority,
  };
};


const adminAnnouncementService = {
  sendAnnouncementToUser,
  sendAnnouncementToUsers,
  sendAnnouncementToAll,
  getAnnouncementPriorities,
  validateAnnouncement,
};


export default adminAnnouncementService;
