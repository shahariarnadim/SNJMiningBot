import taskService from "../modules/tasks/taskService.js";


/*
 * Get all tasks.
 */
const getAllTasks = async () => {
  return taskService.getTasks();
};


/*
 * Get a single task by ID.
 */
const getTaskById = async (taskId) => {
  if (!taskId) {
    throw new Error(
      "Task ID is required."
    );
  }

  const task =
    await taskService.getTaskById(taskId);

  if (!task) {
    throw new Error(
      "Task not found."
    );
  }

  return task;
};


/*
 * Create a new task.
 *
 * Task URLs are supplied by Admin.
 * No task URL is hardcoded here.
 */
const createTask = async ({
  title,
  description = "",
  url = "",
  type = "LINK",
  reward = 0,
  nTokenReward = 0,
  enabled = true,
  verificationMethod = "MANUAL",
} = {}) => {
  if (!title) {
    throw new Error(
      "Task title is required."
    );
  }

  const numericReward =
    Number(reward);

  const numericNTokenReward =
    Number(nTokenReward);

  if (
    !Number.isFinite(numericReward) ||
    numericReward < 0
  ) {
    throw new Error(
      "Task reward must be a non-negative number."
    );
  }

  if (
    !Number.isFinite(
      numericNTokenReward
    ) ||
    numericNTokenReward < 0
  ) {
    throw new Error(
      "N Token reward must be a non-negative number."
    );
  }

  return taskService.createTask({
    title:
      String(title).trim(),

    description:
      String(description || "").trim(),

    url:
      String(url || "").trim(),

    type:
      String(type).trim().toUpperCase(),

    reward:
      numericReward,

    nTokenReward:
      numericNTokenReward,

    enabled:
      Boolean(enabled),

    verificationMethod:
      String(
        verificationMethod || "MANUAL"
      )
        .trim()
        .toUpperCase(),
  });
};


/*
 * Update an existing task.
 */
const updateTask = async (
  taskId,
  values = {}
) => {
  if (!taskId) {
    throw new Error(
      "Task ID is required."
    );
  }

  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error(
      "Task update data must be an object."
    );
  }

  const allowedFields = [
    "title",
    "description",
    "url",
    "type",
    "reward",
    "nTokenReward",
    "enabled",
    "verificationMethod",
  ];

  const updates = {};

  for (
    const field of allowedFields
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        values,
        field
      )
    ) {
      updates[field] =
        values[field];
    }
  }

  if (
    Object.keys(updates).length === 0
  ) {
    throw new Error(
      "No valid task fields were provided."
    );
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "title"
    )
  ) {
    updates.title =
      String(
        updates.title
      ).trim();

    if (!updates.title) {
      throw new Error(
        "Task title cannot be empty."
      );
    }
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "description"
    )
  ) {
    updates.description =
      String(
        updates.description || ""
      ).trim();
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "url"
    )
  ) {
    updates.url =
      String(
        updates.url || ""
      ).trim();
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "type"
    )
  ) {
    updates.type =
      String(
        updates.type
      )
        .trim()
        .toUpperCase();
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "reward"
    )
  ) {
    const reward =
      Number(updates.reward);

    if (
      !Number.isFinite(reward) ||
      reward < 0
    ) {
      throw new Error(
        "Task reward must be a non-negative number."
      );
    }

    updates.reward =
      reward;
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "nTokenReward"
    )
  ) {
    const nTokenReward =
      Number(
        updates.nTokenReward
      );

    if (
      !Number.isFinite(
        nTokenReward
      ) ||
      nTokenReward < 0
    ) {
      throw new Error(
        "N Token reward must be a non-negative number."
      );
    }

    updates.nTokenReward =
      nTokenReward;
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "enabled"
    )
  ) {
    updates.enabled =
      Boolean(
        updates.enabled
      );
  }


  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "verificationMethod"
    )
  ) {
    updates.verificationMethod =
      String(
        updates.verificationMethod
      )
        .trim()
        .toUpperCase();
  }


  return taskService.updateTask(
    taskId,
    updates
  );
};


/*
 * Enable a task.
 */
const enableTask = async (
  taskId
) => {
  return updateTask(
    taskId,
    {
      enabled: true,
    }
  );
};


/*
 * Disable a task.
 */
const disableTask = async (
  taskId
) => {
  return updateTask(
    taskId,
    {
      enabled: false,
    }
  );
};


/*
 * Delete a task.
 */
const deleteTask = async (
  taskId
) => {
  if (!taskId) {
    throw new Error(
      "Task ID is required."
    );
  }

  return taskService.deleteTask(
    taskId
  );
};


/*
 * Get task completion history
 * for a specific user.
 */
const getTaskHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return taskService.getTaskHistory(
    telegramId
  );
};


const adminTaskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  enableTask,
  disableTask,
  deleteTask,
  getTaskHistory,
};


export default adminTaskService;
