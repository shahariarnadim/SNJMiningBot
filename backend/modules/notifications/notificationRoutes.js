import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
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
} from "./notificationController.js";


const router = express.Router();


/*
 * Supported notification information
 */
router.get(
  "/types",
  authenticateUser,
  getSupportedTypes
);

router.get(
  "/priorities",
  authenticateUser,
  getSupportedPriorities
);


/*
 * Notification preferences
 */
router.get(
  "/preference",
  authenticateUser,
  getNotificationPreference
);

router.patch(
  "/preference",
  authenticateUser,
  updateNotificationPreference
);


/*
 * Unread notifications
 *
 * IMPORTANT:
 * These routes must be placed
 * before "/:id".
 */
router.get(
  "/unread",
  authenticateUser,
  getUnreadNotifications
);

router.get(
  "/unread-count",
  authenticateUser,
  getUnreadCount
);


/*
 * Mark all notifications as read
 */
router.patch(
  "/read-all",
  authenticateUser,
  markAllNotificationsAsRead
);


/*
 * Delete all notifications
 */
router.delete(
  "/all",
  authenticateUser,
  deleteAllNotifications
);


/*
 * Get all notifications
 */
router.get(
  "/",
  authenticateUser,
  getNotifications
);


/*
 * Get one notification
 */
router.get(
  "/:id",
  authenticateUser,
  getNotification
);


/*
 * Mark one notification as read
 */
router.patch(
  "/:id/read",
  authenticateUser,
  markNotificationAsRead
);


/*
 * Delete one notification
 */
router.delete(
  "/:id",
  authenticateUser,
  deleteNotification
);


export default router;
