import ntokenService from "./ntokenService.js";


/*
 * Get N Token balance
 */
const getNTokenBalance = async (
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

    const balance =
      await ntokenService.getNTokenBalance(
        telegramId
      );

    return res.status(200).json({
      success: true,
      asset: "N_TOKEN",
      balance,
    });
  } catch (error) {
    console.error(
      "Get N Token balance error:",
      error
    );

    next(error);
  }
};


/*
 * Get N Token transaction history
 */
const getNTokenHistory = async (
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
      await ntokenService.getNTokenHistory(
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
      "Get N Token history error:",
      error
    );

    next(error);
  }
};


/*
 * Get N Token transactions
 */
const getNTokenTransactions =
  async (
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
        await ntokenService.getNTokenHistory(
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
        "Get N Token transactions error:",
        error
      );

      next(error);
    }
  };


/*
 * Get N Token settings
 */
const getNTokenSettings = async (
  req,
  res,
  next
) => {
  try {
    const settings =
      await ntokenService.getNTokenSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get N Token settings error:",
      error
    );

    next(error);
  }
};


/*
 * Get N Token rewards
 */
const getNTokenRewards = async (
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

    const rewards =
      await ntokenService.getNTokenRewards(
        telegramId
      );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    return res.status(200).json({
      success: true,
      data: rewards.slice(
        0,
        limit
      ),
    });
  } catch (error) {
    console.error(
      "Get N Token rewards error:",
      error
    );

    next(error);
  }
};


/*
 * Get one N Token transaction
 */
const getNTokenTransactionById =
  async (
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

      const { id } =
        req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Transaction ID is required.",
        });
      }

      const transaction =
        await ntokenService
          .getNTokenTransactionById(
            telegramId,
            id
          );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "N Token transaction not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      console.error(
        "Get N Token transaction error:",
        error
      );

      next(error);
    }
  };


export {
  getNTokenBalance,
  getNTokenHistory,
  getNTokenTransactions,
  getNTokenSettings,
  getNTokenRewards,
  getNTokenTransactionById,
};
