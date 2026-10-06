import miningService from "./miningService.js";

const getMiningStatus = async (
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

    const status =
      await miningService.getMiningStatus(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error(
      "Get mining status error:",
      error
    );

    next(error);
  }
};

const getActiveMiningSession = async (
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

    const session =
      await miningService.getActiveMiningSession(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error(
      "Get active mining session error:",
      error
    );

    next(error);
  }
};

const startMining = async (
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

    const session =
      await miningService.startMining(
        telegramId
      );

    return res.status(201).json({
      success: true,
      message:
        "Mining session started successfully.",
      data: session,
    });
  } catch (error) {
    console.error(
      "Start mining error:",
      error
    );

    next(error);
  }
};

const claimMiningReward = async (
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
      await miningService.claimMiningReward(
        telegramId
      );

    return res.status(200).json({
      success: true,
      message:
        "Mining reward claimed successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Claim mining reward error:",
      error
    );

    next(error);
  }
};

const getMiningHistory = async (
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

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const history =
      await miningService.getMiningHistory(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: history.slice(
        0,
        limit
      ),
    });
  } catch (error) {
    console.error(
      "Get mining history error:",
      error
    );

    next(error);
  }
};

const getMiningSettings = async (
  req,
  res,
  next
) => {
  try {
    const settings =
      await miningService.getMiningSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get mining settings error:",
      error
    );

    next(error);
  }
};

export {
  getMiningStatus,
  getActiveMiningSession,
  startMining,
  claimMiningReward,
  getMiningHistory,
  getMiningSettings,
};
