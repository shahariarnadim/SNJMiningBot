import taskService from "./taskService.js";

const getTasks = async (
  req,
  res,
  next
) => {
  try {
    const tasks =
      await taskService.getTasks();

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    );

    next(error);
  }
};


const getTaskById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Task ID is required.",
      });
    }

    const task =
      await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(
      "Get task by ID error:",
      error
    );

    next(error);
  }
};


const startTask = async (
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

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Task ID is required.",
      });
    }

    const result =
      await taskService.startTask(
        telegramId,
        id
      );

    return res.status(201).json({
      success: true,
      message:
        "Task started successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Start task error:",
      error
    );

    next(error);
  }
};


const submitTask = async (
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

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Task ID is required.",
      });
    }

    const
