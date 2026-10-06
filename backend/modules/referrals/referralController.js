import referralService from "./referralService.js";

const getReferralLink = async (
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

    const botUsername =
      req.body?.botUsername ||
      req.query?.botUsername ||
      "";

    const link =
      await referralService.getReferralLink(
        telegramId,
        botUsername
      );

    return res.status(200).json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error(
      "Get referral link error:",
      error
    );

    next(error);
  }
};


const createReferral = async (
  req,
  res,
  next
) => {
  try {
    const referrerTelegramId =
      req.user?.telegramId;

    if (!referrerTelegramId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user information is missing.",
      });
    }

    const {
      referredTelegramId,
    } = req.body || {};

    if (!referredTelegramId) {
      return res.status(400).json({
        success: false,
        message:
          "Referred Telegram user ID is required.",
      });
    }

    const referral =
      await referralService.createReferral({
        referrerTelegramId,
        referredTelegramId,
      });

    return res.status(201).json({
      success: true,
      message:
        "Referral created successfully.",
      data: referral,
    });
  } catch (error) {
    console.error(
      "Create referral error:",
      error
    );

    next(error);
  }
};


const getReferralStats = async (
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

    const stats =
      await referralService.getReferralStats(
        telegramId
      );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "Get referral stats error:",
      error
    );

    next(error);
  }
};


const getReferralHistory = async (
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
      await referralService.getReferralHistory(
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
      "Get referral history error:",
      error
    );

    next(error);
  }
};


const getReferralById = async (
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
          "Referral ID is required.",
      });
    }

    const referral =
      await referralService.getReferralById(
        telegramId,
        id
      );

    if (!referral) {
      return res.status(404).json({
        success: false,
        message:
          "Referral not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: referral,
    });
  } catch (error) {
    console.error(
      "Get referral by ID error:",
      error
    );

    next(error);
  }
};


const completeReferral = async (
  req,
  res,
  next
) => {
  try {
    const {
      referredTelegramId,
    } = req.body || {};

    if (!referredTelegramId) {
      return res.status(400).json({
        success: false,
        message:
          "Referred Telegram user ID is required.",
      });
    }

    const referral =
      await referralService.completeReferral(
        referredTelegramId
      );

    return res.status(200).json({
      success: true,
      message:
        "Referral marked as completed.",
      data: referral,
    });
  } catch (error) {
    console.error(
      "Complete referral error:",
      error
    );

    next(error);
  }
};


const rewardReferral = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Referral ID is required.",
      });
    }

    const result =
      await referralService.rewardReferral(
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Referral reward credited successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Reward referral error:",
      error
    );

    next(error);
  }
};


const getReferralSettings =
  async (
    req,
    res,
    next
  ) => {
    try {
      const settings =
        await referralService
          .getReferralSettings();

      return res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error(
        "Get referral settings error:",
        error
      );

      next(error);
    }
  };


export {
  getReferralLink,
  createReferral,
  getReferralStats,
  getReferralHistory,
  getReferralById,
  completeReferral,
  rewardReferral,
  getReferralSettings,
};
