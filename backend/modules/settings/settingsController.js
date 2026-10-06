import settingsService from "./settingsService.js";


/*
 * Get all settings
 *
 * Intended for Admin use.
 */
const getSettings = async (
  req,
  res,
  next
) => {
  try {
    const {
      category = null,
      publicOnly = "false",
    } = req.query || {};

    const settings =
      await settingsService.getSettings({
        category,
        publicOnly:
          publicOnly === true ||
          publicOnly === "true",
      });

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get settings error:",
      error
    );

    next(error);
  }
};


/*
 * Get public settings
 */
const getPublicSettings = async (
  req,
  res,
  next
) => {
  try {
    const settings =
      await settingsService
        .getPublicSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get public settings error:",
      error
    );

    next(error);
  }
};


/*
 * Get one setting
 */
const getSetting = async (
  req,
  res,
  next
) => {
  try {
    const {
      key,
    } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message:
          "Setting key is required.",
      });
    }

    const setting =
      await settingsService.getSetting(
        key
      );

    if (!setting) {
      return res.status(404).json({
        success: false,
        message:
          "Setting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error(
      "Get setting error:",
      error
    );

    next(error);
  }
};


/*
 * Get one setting value
 */
const getSettingValue = async (
  req,
  res,
  next
) => {
  try {
    const {
      key,
    } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message:
          "Setting key is required.",
      });
    }

    const value =
      await settingsService
        .getSettingValue(
          key
        );

    return res.status(200).json({
      success: true,
      key,
      value,
    });
  } catch (error) {
    console.error(
      "Get setting value error:",
      error
    );

    next(error);
  }
};


/*
 * Create a new setting
 *
 * Intended for Admin use.
 */
const createSetting = async (
  req,
  res,
  next
) => {
  try {
    const {
      key,
      value,
      category = "PUBLIC",
      type = "STRING",
      description = "",
      isPublic = false,
      editableByAdmin = true,
    } = req.body || {};

    if (!key) {
      return res.status(400).json({
        success: false,
        message:
          "Setting key is required.",
      });
    }

    const setting =
      await settingsService
        .createSetting({
          key,
          value,
          category,
          type,
          description,
          isPublic,
          editableByAdmin,
        });

    return res.status(201).json({
      success: true,
      message:
        "Setting created successfully.",
      data: setting,
    });
  } catch (error) {
    console.error(
      "Create setting error:",
      error
    );

    next(error);
  }
};


/*
 * Update one setting
 *
 * Intended for Admin use.
 */
const updateSetting = async (
  req,
  res,
  next
) => {
  try {
    const {
      key,
    } = req.params;

    const {
      value,
    } = req.body || {};

    if (!key) {
      return res.status(400).json({
        success: false,
        message:
          "Setting key is required.",
      });
    }

    if (
      value === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Setting value is required.",
      });
    }

    const setting =
      await settingsService
        .updateSetting(
          key,
          value
        );

    return res.status(200).json({
      success: true,
      message:
        "Setting updated successfully.",
      data: setting,
    });
  } catch (error) {
    console.error(
      "Update setting error:",
      error
    );

    next(error);
  }
};


/*
 * Update multiple settings
 *
 * Intended for Admin use.
 */
const updateSettings = async (
  req,
  res,
  next
) => {
  try {
    const {
      updates,
    } = req.body || {};

    if (
      !updates ||
      typeof updates !== "object" ||
      Array.isArray(updates)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "updates must be an object.",
      });
    }

    const settings =
      await settingsService
        .updateSettings(
          updates
        );

    return res.status(200).json({
      success: true,
      message:
        "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error(
      "Update settings error:",
      error
    );

    next(error);
  }
};


/*
 * Delete setting
 *
 * Intended for Admin use.
 */
const deleteSetting = async (
  req,
  res,
  next
) => {
  try {
    const {
      key,
    } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message:
          "Setting key is required.",
      });
    }

    const result =
      await settingsService
        .deleteSetting(
          key
        );

    return res.status(200).json({
      success: true,
      message:
        "Setting deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Delete setting error:",
      error
    );

    next(error);
  }
};


/*
 * Check setting existence
 */
const checkSetting = async (
  req,
  res,
  next
) => {
  try {
    const {
      key,
    } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        message:
          "Setting key is required.",
      });
    }

    const exists =
      await settingsService.hasSetting(
        key
      );

    return res.status(200).json({
      success: true,
      key,
      exists,
    });
  } catch (error) {
    console.error(
      "Check setting error:",
      error
    );

    next(error);
  }
};


/*
 * Get supported setting categories
 */
const getSupportedCategories =
  async (
    req,
    res,
    next
  ) => {
    try {
      const categories =
        await settingsService
          .getSupportedCategories();

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error(
        "Get setting categories error:",
        error
      );

      next(error);
    }
  };


/*
 * Get supported setting types
 */
const getSupportedTypes =
  async (
    req,
    res,
    next
  ) => {
    try {
      const types =
        await settingsService
          .getSupportedTypes();

      return res.status(200).json({
        success: true,
        data: types,
      });
    } catch (error) {
      console.error(
        "Get setting types error:",
        error
      );

      next(error);
    }
  };


export {
  getSettings,
  getPublicSettings,
  getSetting,
  getSettingValue,
  createSetting,
  updateSetting,
  updateSettings,
  deleteSetting,
  checkSetting,
  getSupportedCategories,
  getSupportedTypes,
};
