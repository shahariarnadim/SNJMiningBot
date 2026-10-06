const createTaskRecord = ({
  id,
  title,
  description = "",
  url = "",
  type = "LINK",
  reward = 0,
  nTokenReward = 0,
  enabled = true,
  verificationMethod = "MANUAL",
} = {}) => {
  if (!id) {
    throw new Error("Task ID is required.");
  }

  if (!title) {
    throw new Error("Task title is required.");
  }

  const numericReward = Number(reward);
  const numericNTokenReward =
    Number(nTokenReward);

  if (
    !Number.isFinite(numericReward) ||
    numericReward < 0
  ) {
    throw new Error(
      "Task reward cannot be negative."
    );
  }

  if (
    !Number.isFinite(numericNTokenReward) ||
    numericNTokenReward < 0
  ) {
    throw new Error(
      "N Token reward cannot be negative."
    );
  }

  return {
    id: String(id),

    title: String(title),

    description: String(
      description || ""
    ),

    url: String(url || ""),

    type: String(type || "LINK"),

    reward: numericReward,

    nTokenReward: numericNTokenReward,

    enabled: Boolean(enabled),

    verificationMethod: String(
      verificationMethod || "MANUAL"
    ),

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};


const createTaskCompletionRecord = ({
  id,
  telegramId,
  taskId,
  status = "PENDING",
  reward = 0,
  nTokenReward = 0,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!taskId) {
    throw new Error(
      "Task ID is required."
    );
  }

  return {
    id:
      String(
        id ||
          `task_completion_${Date.now()}_${telegramId}`
      ),

    telegramId: String(telegramId),

    taskId: String(taskId),

    status: String(status),

    reward: Number(reward || 0),

    nTokenReward: Number(
      nTokenReward || 0
    ),

    submittedAt: new Date(),

    verifiedAt: null,

    rewardedAt: null,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};


const sanitizeTask = (task = {}) => {
  return {
    id: task.id || null,

    title: task.title || "",

    description:
      task.description || "",

    url: task.url || "",

    type: task.type || "LINK",

    reward: Number(
      task.reward || 0
    ),

    nTokenReward: Number(
      task.nTokenReward || 0
    ),

    enabled:
      task.enabled !== false,

    verificationMethod:
      task.verificationMethod ||
      "MANUAL",

    createdAt:
      task.createdAt || null,

    updatedAt:
      task.updatedAt || null,
  };
};


const sanitizeTaskCompletion = (
  completion = {}
) => {
  return {
    id: completion.id || null,

    telegramId:
      completion.telegramId || null,

    taskId:
      completion.taskId || null,

    status:
      completion.status || "UNKNOWN",

    reward: Number(
      completion.reward || 0
    ),

    nTokenReward: Number(
      completion.nTokenReward || 0
    ),

    submittedAt:
      completion.submittedAt || null,

    verifiedAt:
      completion.verifiedAt || null,

    rewardedAt:
      completion.rewardedAt || null,

    createdAt:
      completion.createdAt || null,

    updatedAt:
      completion.updatedAt || null,
  };
};


const taskModel = {
  createTaskRecord,
  createTaskCompletionRecord,
  sanitizeTask,
  sanitizeTaskCompletion,
};

export default taskModel;
