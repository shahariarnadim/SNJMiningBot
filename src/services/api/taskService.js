import apiClient from "./apiClient";

const getTasks = async () => {
  return apiClient.get("/tasks");
};

const getTaskDetails = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  return apiClient.get(
    `/tasks/${encodeURIComponent(taskId)}`
  );
};

const startTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  return apiClient.post(
    `/tasks/${encodeURIComponent(taskId)}/start`
  );
};

const submitTask = async (taskId, proof = {}) => {
  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  return apiClient.post(
    `/tasks/${encodeURIComponent(taskId)}/submit`,
    proof
  );
};

const getTaskHistory = async (limit = 20) => {
  return apiClient.get(
    `/tasks/history?limit=${encodeURIComponent(limit)}`
  );
};

const getTaskSettings = async () => {
  return apiClient.get("/tasks/settings");
};

const taskService = {
  getTasks,
  getTaskDetails,
  startTask,
  submitTask,
  getTaskHistory,
  getTaskSettings,
};

export default taskService;
