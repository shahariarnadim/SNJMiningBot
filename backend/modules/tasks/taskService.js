import taskModel from "./taskModel.js";
import balanceService from "../balances/balanceService.js";
import crypto from "crypto";

const tasks = new Map();
const taskCompletions = new Map();

/*
 * Temporary demo tasks.
 *
 * Production version:
 * These values will come from Database/Admin Panel.
 */
const defaultTasks = [
  {
    id: "task_telegram",
    title: "Join Telegram Channel",
    description:
      "Join the official SNJ Telegram channel.",
    url: "",
    type: "TELEGRAM",
    reward: 5,
    nTokenReward: 1,
    enabled: true,
    verificationMethod: "TELEGRAM",
  },
  {
    id: "task_website",
    title: "Visit Website",
    description:
      "Visit the official SNJ website.",
    url: "",
    type: "WEBSITE",
    reward: 2,
    nTokenReward: 0,
    enabled: true,
    verificationMethod: "VISIT",
  },
];

/*
 * Initialize default tasks.
 */
const initializeTasks = () => {
  if (tasks.size > 0) {
    return;
  }

  for (const taskData of defaultTasks) {
    const task =
      taskModel.createTaskRecord(
        taskData
      );

    tasks.set(task.id, task);
  }
};

initializeTasks();

/*
 * Get all enabled tasks.
 */
const getTasks = async () => {
  initializeTasks();

  return Array.from(tasks.values())
    .filter(
      (task) => task.enabled
    )
    .map((task) =>
      taskModel.sanitizeTask(task)
    );
};

/*
 * Get one task by ID.
 */
const getTaskById = async (
  taskId
) => {
  initializeTasks();

  if (!taskId) {
    return null;
  }

  return (
    tasks.get(String(taskId)) ||
    null
  );
};

/*
 * Find a user's task completion.
 */
const getTaskCompletion = async (
  telegramId,
  taskId
) => {
  const key =
    `${telegramId}:${taskId}`;

  return (
    taskCompletions.get(key) ||
    null
  );
};

/*
 * Start a task.
 *
 * Starting a task does NOT give reward.
 */
const startTask = async (
  telegramId,
  taskId
) => {
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

  const task =
    await getTaskById(taskId);

  if (!task) {
    throw new Error(
      "Task not found."
    );
  }

  if (!task.enabled) {
    throw new Error(
      "This task is currently disabled."
    );
  }

  const existing =
    await getTaskCompletion(
      telegramId,
      taskId
    );

  if (
    existing &&
    existing.status === "REWARDED"
  ) {
    throw new Error(
      "This task has already been completed."
    );
  }

  const completion =
    taskModel.createTaskCompletionRecord(
      {
        id:
          existing?.id ||
          crypto.randomUUID(),

        telegramId,

        taskId,

        status: "STARTED",

        reward: task.reward,

        nTokenReward:
          task.nTokenReward,
      }
    );

  completion.startedAt =
    new Date();

  completion.updatedAt =
    new Date();

  const key =
    `${telegramId}:${taskId}`;

  taskCompletions.set(
    key,
    completion
  );

  return {
    task:
      taskModel.sanitizeTask(task),

    completion:
      taskModel.sanitizeTaskCompletion(
        completion
      ),
  };
};


/*
 * Submit task for verification.
 */
const submitTask = async (
  telegramId,
  taskId,
  proof = {}
) => {
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

  const task =
    await getTaskById(taskId);

  if (!task) {
    throw new Error(
      "Task not found."
    );
  }

  const key =
    `${telegramId}:${taskId}`;

  const completion =
    taskCompletions.get(key);

  if (!completion) {
    throw new Error(
      "Task has not been started."
    );
  }

  if (
    completion.status === "REWARDED"
  ) {
    throw new Error(
      "Task reward has already been given."
    );
  }

  /*
   * Basic proof validation.
   *
   * Real verification will be implemented
   * later for Telegram, social tasks,
   * website visits, etc.
   */
  const hasProof =
    proof &&
    typeof proof === "object";

  if (!hasProof) {
    throw new Error(
      "Task verification proof is required."
    );
  }

  completion.status = "PENDING";
  completion.proof = proof;
  completion.submittedAt =
    new Date();
  completion.updatedAt =
    new Date();

  taskCompletions.set(
    key,
    completion
  );

  return {
    task:
      taskModel.sanitizeTask(task),

    completion:
      taskModel.sanitizeTaskCompletion(
        completion
      ),

    message:
      "Task submitted for verification.",
  };
};


/*
 * Verify task.
 *
 * For now this is a controlled server-side
 * verification placeholder.
 *
 * Later each verification method will
 * have its own verifier.
 */
const verifyTask = async (
  telegramId,
  taskId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const task =
    await getTaskById(taskId);

  if (!task) {
    throw new Error(
      "Task not found."
    );
  }

  const key =
    `${telegramId}:${taskId}`;

  const completion =
    taskCompletions.get(key);

  if (!completion) {
    throw new Error(
      "Task submission not found."
    );
  }

  if (
    completion.status === "REWARDED"
  ) {
    throw new Error(
      "Task has already been rewarded."
    );
  }

  if (
    completion.status !== "PENDING"
  ) {
    throw new Error(
      "Task is not ready for verification."
    );
  }

  /*
   * Temporary verification.
   *
   * Production verification will be
   * implemented according to the task type.
   */
  const verified = true;

  if (!verified) {
    completion.status =
      "REJECTED";

    completion.updatedAt =
      new Date();

    taskCompletions.set(
      key,
      completion
    );

    return {
      verified: false,
      completion:
        taskModel.sanitizeTaskCompletion(
          completion
        ),
    };
  }

  completion.status =
    "VERIFIED";

  completion.verifiedAt =
    new Date();

  completion.updatedAt =
    new Date();

  taskCompletions.set(
    key,
    completion
  );

  return {
    verified: true,

    task:
      taskModel.sanitizeTask(task),

    completion:
      taskModel.sanitizeTaskCompletion(
        completion
      ),
  };
};


/*
 * Give task reward.
 *
 * This function must only run after
 * successful verification.
 */
const rewardTask = async (
  telegramId,
  taskId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const key =
    `${telegramId}:${taskId}`;

  const completion =
    taskCompletions.get(key);

  if (!completion) {
    throw new Error(
      "Task completion not found."
    );
  }

  if (
    completion.status === "REWARDED"
  ) {
    throw new Error(
      "Task reward has already been given."
    );
  }

  if (
    completion.status !== "VERIFIED"
  ) {
    throw new Error(
      "Task must be verified before reward."
    );
  }

  const task =
    await getTaskById(taskId);

  if (!task) {
    throw new Error(
      "Task not found."
    );
  }

  /*
   * Reward SNJ.
   */
  if (
    Number(task.reward) > 0
  ) {
    await balanceService.addBalance(
      telegramId,
      "snj",
      task.reward
    );
  }

  /*
   * Reward N Token.
   */
  if (
    Number(task.nTokenReward) > 0
  ) {
    await balanceService.addBalance(
      telegramId,
      "nToken",
      task.nTokenReward
    );
  }

  completion.status =
    "REWARDED";

  completion.reward =
    Number(task.reward || 0);

  completion.nTokenReward =
    Number(
      task.nTokenReward || 0
    );

  completion.rewardedAt =
    new Date();

  completion.updatedAt =
    new Date();

  taskCompletions.set(
    key,
    completion
  );

  return {
    success: true,

    reward:
      Number(task.reward || 0),

    nTokenReward:
      Number(
        task.nTokenReward || 0
      ),

    completion:
      taskModel.sanitizeTaskCompletion(
        completion
      ),
  };
};


/*
 * Get task history.
 */
const getTaskHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const history =
    [];

  for (
    const completion
    of taskCompletions.values()
  ) {
    if (
      completion.telegramId ===
      String(telegramId)
    ) {
      history.push(
        taskModel.sanitizeTaskCompletion(
          completion
        )
      );
    }
  }

  return history;
};


/*
 * Task settings.
 */
const getTaskSettings = async () => {
  return {
    allowTasks: true,

    verificationRequired:
      true,

    rewardOnlyAfterVerification:
      true,
  };
};


const taskService = {
  getTasks,
  getTaskById,
  getTaskCompletion,
  startTask,
  submitTask,
  verifyTask,
  rewardTask,
  getTaskHistory,
  getTaskSettings,
};

export default taskService;
