import notificationService from "./notificationService.js";


/*
 * Get user's notifications
 */
const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    const {
      unreadOnly = "false",
      type = null,
      limit = 50,
    } = req.query || {};

    const notifications =
      await notificationService.getNotifications({
        telegramId,
        unreadOnly:
          unreadOnly === true ||
          unreadOnly === "true",
        type,
        limit,
      });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    next(error);
  }
};


/*
 * Get one notification
 */
const getNotification = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const {
      id,
    } = req.params;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Notification ID is required.",
      });
    }

    const notification =
      await notificationService.getNotification(
        telegramId,
        id
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(
      "Get notification error:",
      error
    );

    next(error);
  }
};


/*
 * Get unread notifications
 */
const getUnreadNotifications =
  async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.user?.telegramId;

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user information is missing.",
        });
      }

      const notifications =
        await notificationService
          .getNotifications({
            telegramId,
            unreadOnly: true,
            limit: 100,
          });

      return res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error(
        "Get unread notifications error:",
        error
      );

      next(error);
    }
  };


/*
 * Get unread notification count
 */
const getUnreadCount = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    const count =
      await notificationService
        .getUnreadCount(
          telegramId
        );

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "Get unread notification count error:",
      error
    );

    next(error);
  }
};


/*
 * Mark one notification as read
 */
const markNotificationAsRead =
  async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.user?.telegramId;

      const {
        id,
      } = req.params;

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user information is missing.",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Notification ID is required.",
        });
      }

      const notification =
        await notificationService
          .markAsRead(
            telegramId,
            id
          );

      return res.status(200).json({
        success: true,
        message:
          "Notification marked as read.",
        data: notification,
      });
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );

      next(error);
    }
  };


/*
 * Mark all notifications as read
 */
const markAllNotificationsAsRead =
  async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.user?.telegramId;

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user information is missing.",
        });
      }

      const result =
        await notificationService
          .markAllAsRead(
            telegramId
          );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read.",
        data: result,
      });
    } catch (error) {
      console.error(
        "Mark all notifications as read error:",
        error
      );

      next(error);
    }
  };


/*
 * Delete one notification
 */
const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    const telegramId =
      req.user?.telegramId;

    const {
      id,
    } = req.params;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Notification ID is required.",
      });
    }

    const result =
      await notificationService
        .deleteNotification(
          telegramId,
          id
        );

    return res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    next(error);
  }
};


/*
 * Delete all notifications
 */
const deleteAllNotifications =
  async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.user?.telegramId;

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user information is missing.",
        });
      }

      const result =
        await notificationService
          .deleteAllNotifications(
            telegramId
          );

      return res.status(200).json({
        success: true,
        message:
          "All notifications deleted successfully.",
        data: result,
      });
    } catch (error) {
      console.error(
        "Delete all notifications error:",
        error
      );

      next(error);
    }
  };


/*
 * Get notification preference
 */
const getNotificationPreference =
  async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.user?.telegramId;

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user information is missing.",
        });
      }

      const preference =
        await notificationService
          .getNotificationPreference(
            telegramId
          );

      return res.status(200).json({
        success: true,
        data: preference,
      });
    } catch (error) {
      console.error(
        "Get notification preference error:",
        error
      );

      next(error);
    }
  };


/*
 * Update notification preference
 */
const updateNotificationPreference =
  async (
    req,
    res,
    next
  ) => {
    try {
      const telegramId =
        req.user?.telegramId;

      const {
        enabled,
      } = req.body || {};

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message:
            "Authenticated user information is missing.",
        });
      }

      if (
        typeof enabled !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "enabled must be a boolean value.",
        });
      }

      const preference =
        await notificationService
          .updateNotificationPreference(
            telegramId,
            enabled
          );

      return res.status(200).json({
        success: true,
        message:
          "Notification preference updated successfully.",
        data: preference,
      });
    } catch (error) {
      console.error(
        "Update notification preference error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported notification types
 */
const getSupportedTypes =
  async (
    req,
    res,
    next
  ) => {
    try {
      const types =
        await notificationService
          .getSupportedTypes();

      return res.status(200).json({
        success: true,
        data: types,
      });
    } catch (error) {
      console.error(
        "Get notification types error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported notification priorities
 */
const getSupportedPriorities =
  async (
    req,
    res,
    next
  ) => {
    try {
      const priorities =
        await notificationService
          .getSupportedPriorities();

      return res.status(200).json({
        success: true,
        data: priorities,
      });
    } catch (error) {
      console.error(
        "Get notification priorities error:",
        error
      );

      next(error);
    }
  };


export {
  getNotifications,
  getNotification,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationPreference,
  updateNotificationPreference,
  getSupportedTypes,
  getSupportedPriorities,
};
