import boostService from "./boostService.js";

const getBoosts = async (
  req,
  res,
  next
) => {
  try {
    const boosts =
      await boostService.getBoosts();

    return res.status(200).json({
      success: true,
      data: boosts,
    });
  } catch (error) {
    console.error(
      "Get boosts error:",
      error
    );

    next(error);
  }
};

const getActiveBoost = async (
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

    const boost =
      await boostService.getActiveBoost(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: boost,
    });
  } catch (error) {
    console.error(
      "Get active boost error:",
      error
    );

    next(error);
  }
};

const getBoostById = async (
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
          "Boost ID is required.",
      });
    }

    const boost =
      await boostService.getBoostById(id);

    if (!boost) {
      return res.status(404).json({
        success: false,
        message: "Boost not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: boost,
    });
  } catch (error) {
    console.error(
      "Get boost by ID error:",
      error
    );

    next(error);
  }
};

const activateBoost = async (
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
          "Boost ID is required.",
      });
    }

    const result =
      await boostService.activateBoost(
        telegramId,
        id
      );

    return res.status(201).json({
      success: true,
      message:
        "Boost activated successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Activate boost error:",
      error
    );

    next(error);
  }
};

const getBoostHistory = async (
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
      await boostService.getBoostHistory(
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
      "Get boost history error:",
      error
    );

    next(error);
  }
};

const getBoostSettings = async (
  req,
  res,
  next
) => {
  try {
    const settings =
      await boostService.getBoostSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get boost settings error:",
      error
    );

    next(error);
  }
};

export {
  getBoosts,
  getActiveBoost,
  getBoostById,
  activateBoost,
  getBoostHistory,
  getBoostSettings,
};
