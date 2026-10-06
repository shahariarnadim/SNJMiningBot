import env from "../config/env.js";


/*
 * Check whether a Telegram ID
 * belongs to an administrator.
 */
const isAdminTelegramId = (
  telegramId
) => {
  if (!telegramId) {
    return false;
  }

  return env.adminTelegramIds.includes(
    String(telegramId)
  );
};


/*
 * Admin Authentication
 *
 * This middleware will be used
 * after normal user authentication.
 */
const authenticateAdmin = async (
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


    const isAdmin =
      isAdminTelegramId(
        telegramId
      );


    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Admin access denied.",
      });
    }


    req.user = {
      ...req.user,
      isAdmin: true,
    };


    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(403).json({
      success: false,
      message:
        "Admin authorization failed.",
    });
  }
};


/*
 * Combined User + Admin Authentication
 *
 * This helper can be used when
 * both authentication checks are
 * required in a route.
 */
const requireAdmin = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }


  if (
    req.user.isAdmin !== true
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Admin access denied.",
    });
  }


  next();
};


export {
  isAdminTelegramId,
  authenticateAdmin,
  requireAdmin,
};
