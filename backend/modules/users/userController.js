import userService from "./userService.js";

const getCurrentUser = async (
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

    const user =
      await userService.getUserProfile(
        telegramId
      );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    next(error);
  }
};

const updateCurrentUser = async (
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

    const updates =
      req.body || {};

    const user =
      await userService.updateUser(
        telegramId,
        updates
      );

    return res.status(200).json({
      success: true,
      message:
        "User profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Update current user error:",
      error
    );

    next(error);
  }
};

const getCurrentUserProfile = async (
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

    const profile =
      await userService.getUserProfile(
        telegramId
      );

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(
      "Get user profile error:",
      error
    );

    next(error);
  }
};

export {
  getCurrentUser,
  updateCurrentUser,
  getCurrentUserProfile,
};
