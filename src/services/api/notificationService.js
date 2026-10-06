import apiClient from "./apiClient";

const getNotifications = async (limit = 20) => {
  return apiClient.get(
    `/notifications?limit=${encodeURIComponent(limit)}`
  );
};

const getUnreadNotifications = async () => {
  return apiClient.get("/notifications/unread");
};

const getUnreadCount = async () => {
  return apiClient.get("/notifications/unread-count");
};

const markAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error(
      "Notification ID is required."
    );
  }

  return apiClient.patch(
    `/notifications/${encodeURIComponent(
      notificationId
    )}/read`
  );
};

const markAllAsRead = async () => {
  return apiClient.patch(
    "/notifications/read-all"
  );
};

const deleteNotification = async (notificationId) => {
  if (!notificationId) {
    throw new Error(
      "Notification ID is required."
    );
  }

  return apiClient.delete(
    `/notifications/${encodeURIComponent(
      notificationId
    )}`
  );
};

const notificationService = {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;
