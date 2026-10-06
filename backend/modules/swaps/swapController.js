import swapService from "./swapService.js";

/*
 * Get all available swap pairs
 */
const getSwapPairs = async (
  req,
  res,
  next
) => {
  try {
    const pairs =
      await swapService.getSwapPairs();

    return res.status(200).json({
      success: true,
      data: pairs,
    });
  } catch (error) {
    console.error(
      "Get swap pairs error:",
      error
    );

    next(error);
  }
};


/*
 * Get swap rate
 */
const getSwapRate = async (
  req,
  res,
  next
) => {
  try {
    const {
      fromAsset,
      toAsset,
    } = req.query;

    if (
      !fromAsset ||
      !toAsset
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Source and destination assets are required.",
      });
    }

    const rate =
      await swapService.getSwapRate(
        fromAsset,
        toAsset
      );

    return res.status(200).json({
      success: true,
      data: rate,
    });
  } catch (error) {
    console.error(
      "Get swap rate error:",
      error
    );

    next(error);
  }
};


/*
 * Calculate swap amount
 */
const calculateSwap = async (
  req,
  res,
  next
) => {
  try {
    const {
      fromAsset,
      toAsset,
      amount,
    } = req.body || {};

    if (
      !fromAsset ||
      !toAsset
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Source and destination assets are required.",
      });
    }

    if (
      amount === undefined ||
      amount === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Swap amount is required.",
      });
    }

    const calculation =
      await swapService.calculateSwap({
        fromAsset,
        toAsset,
        amount,
      });

    return res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    console.error(
      "Calculate swap error:",
      error
    );

    next(error);
  }
};


/*
 * Execute swap
 */
const executeSwap = async (
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

    const {
      fromAsset,
      toAsset,
      amount,
    } = req.body || {};

    if (
      !fromAsset ||
      !toAsset
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Source and destination assets are required.",
      });
    }

    if (
      amount === undefined ||
      amount === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Swap amount is required.",
      });
    }

    const result =
      await swapService.executeSwap({
        telegramId,
        fromAsset,
        toAsset,
        amount,
      });

    return res.status(200).json({
      success: true,
      message:
        "Swap completed successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Execute swap error:",
      error
    );

    next(error);
  }
};


/*
 * Get swap history
 */
const getSwapHistory = async (
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
      await swapService.getSwapHistory(
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
      "Get swap history error:",
      error
    );

    next(error);
  }
};


/*
 * Get one swap transaction
 */
const getSwapTransactionById =
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
            "Swap transaction ID is required.",
        });
      }

      const transaction =
        await swapService
          .getSwapTransactionById(
            telegramId,
            id
          );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message:
            "Swap transaction not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      console.error(
        "Get swap transaction error:",
        error
      );

      next(error);
    }
  };


/*
 * Get swap settings
 */
const getSwapSettings = async (
  req,
  res,
  next
) => {
  try {
    const settings =
      await swapService
        .getSwapSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get swap settings error:",
      error
    );

    next(error);
  }
};


/*
 * Get one swap pair by ID
 */
const getSwapPairById = async (
  req,
  res,
  next
) => {
  try {
    const { id } =
      req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Swap pair ID is required.",
      });
    }

    const pair =
      await swapService
        .getSwapPairById(id);

    if (!pair) {
      return res.status(404).json({
        success: false,
        message:
          "Swap pair not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data:
        swapService
          ? pair
          : null,
    });
  } catch (error) {
    console.error(
      "Get swap pair error:",
      error
    );

    next(error);
  }
};


export {
  getSwapPairs,
  getSwapRate,
  calculateSwap,
  executeSwap,
  getSwapHistory,
  getSwapTransactionById,
  getSwapSettings,
  getSwapPairById,
};
