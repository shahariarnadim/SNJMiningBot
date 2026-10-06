import balanceService from "./balanceService.js";

const getBalances = async (
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

    const balances =
      await balanceService.getBalanceSummary(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    console.error(
      "Get balances error:",
      error
    );

    next(error);
  }
};

const getSNJBalance = async (
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
      await balanceService.getSNJBalance(
        telegramId
      );

    return res.status(200).json({
      success: true,
      asset: "SNJ",
      balance,
    });
  } catch (error) {
    console.error(
      "Get SNJ balance error:",
      error
    );

    next(error);
  }
};

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
      await balanceService.getNTokenBalance(
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

const getDollarBalance = async (
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
      await balanceService.getDollarBalance(
        telegramId
      );

    return res.status(200).json({
      success: true,
      asset: "DOLLAR",
      balance,
    });
  } catch (error) {
    console.error(
      "Get Dollar balance error:",
      error
    );

    next(error);
  }
};

export {
  getBalances,
  getSNJBalance,
  getNTokenBalance,
  getDollarBalance,
};
