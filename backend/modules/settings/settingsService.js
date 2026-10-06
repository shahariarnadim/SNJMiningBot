import crypto from "crypto";
import settingsModel from "./settingsModel.js";


const settings = new Map();


/*
 * Initialize default settings
 */
const initializeSettings = async () => {
  if (settings.size > 0) {
    return;
  }

  const defaultSettings =
    settingsModel.getDefaultSettings();

  for (const setting of defaultSettings) {
    settings.set(
      setting.key,
      setting
    );
  }
};


/*
 * Find setting by key
 */
const findSettingByKey = async (
  key
) => {
  if (!key) {
    return null;
  }

  await initializeSettings();

  return (
    settings.get(
      String(key)
    ) || null
  );
};


/*
 * Get setting
 */
const getSetting = async (
  key
) => {
  const setting =
    await findSettingByKey(key);

  if (!setting) {
    return null;
  }

  return settingsModel.sanitizeSetting(
    setting
  );
};


/*
 * Get setting value
 */
const getSettingValue = async (
  key,
  defaultValue = null
) => {
  const setting =
    await findSettingByKey(key);

  if (!setting) {
    return defaultValue;
  }

  return setting.value;
};


/*
 * Get all settings
 */
const getSettings = async ({
  category = null,
  publicOnly = false,
} = {}) => {
  await initializeSettings();

  let result =
    Array.from(
      settings.values()
    );

  if (category) {
    const normalizedCategory =
      String(category).toUpperCase();

    result = result.filter(
      (setting) =>
        setting.category ===
        normalizedCategory
    );
  }

  if (publicOnly) {
    result = result.filter(
      (setting) =>
        setting.isPublic === true
    );
  }

  result.sort(
    (a, b) =>
      String(a.key).localeCompare(
        String(b.key)
      )
  );

  return result.map(
    (setting) =>
      settingsModel.sanitizeSetting(
        setting
      )
  );
};


/*
 * Get public settings
 */
const getPublicSettings =
  async () => {
    return getSettings({
      publicOnly: true,
    });
  };


/*
 * Create setting
 */
const createSetting = async ({
  key,
  value,
  category = "PUBLIC",
  type = "STRING",
  description = "",
  isPublic = false,
  editableByAdmin = true,
} = {}) => {
  if (!key) {
    throw new Error(
      "Setting key is required."
    );
  }

  await initializeSettings();

  const settingKey =
    String(key).trim();

  if (
    settings.has(settingKey)
  ) {
    throw new Error(
      "Setting already exists."
    );
  }

  const validation =
    settingsModel.validateSettingValue(
      value,
      type
    );

  if (!validation.valid) {
    throw new Error(
      "Invalid setting value."
    );
  }

  const setting =
    settingsModel.createSettingRecord({
      id: crypto.randomUUID(),
      key: settingKey,
      value: validation.value,
      category,
      type,
      description,
      isPublic,
      editableByAdmin,
    });

  settings.set(
    settingKey,
    setting
  );

  return settingsModel.sanitizeSetting(
    setting
  );
};


/*
 * Update setting
 */
const updateSetting = async (
  key,
  value
) => {
  if (!key) {
    throw new Error(
      "Setting key is required."
    );
  }

  await initializeSettings();

  const settingKey =
    String(key).trim();

  const setting =
    settings.get(settingKey);

  if (!setting) {
    throw new Error(
      "Setting not found."
    );
  }

  if (
    setting.editableByAdmin !== true
  ) {
    throw new Error(
      "This setting cannot be edited."
    );
  }

  const validation =
    settingsModel.validateSettingValue(
      value,
      setting.type
    );

  if (!validation.valid) {
    throw new Error(
      "Invalid setting value."
    );
  }

  setting.value =
    validation.value;

  setting.updatedAt =
    new Date();

  settings.set(
    settingKey,
    setting
  );

  return settingsModel.sanitizeSetting(
    setting
  );
};


/*
 * Update multiple settings
 */
const updateSettings = async (
  updates = {}
) => {
  if (
    !updates ||
    typeof updates !== "object" ||
    Array.isArray(updates)
  ) {
    throw new Error(
      "Settings updates must be an object."
    );
  }

  const results = [];

  for (
    const [key, value] of
    Object.entries(updates)
  ) {
    const updated =
      await updateSetting(
        key,
        value
      );

    results.push(updated);
  }

  return results;
};


/*
 * Delete setting
 */
const deleteSetting = async (
  key
) => {
  if (!key) {
    throw new Error(
      "Setting key is required."
    );
  }

  await initializeSettings();

  const settingKey =
    String(key).trim();

  const setting =
    settings.get(settingKey);

  if (!setting) {
    throw new Error(
      "Setting not found."
    );
  }

  if (
    setting.editableByAdmin !== true
  ) {
    throw new Error(
      "This setting cannot be deleted."
    );
  }

  settings.delete(
    settingKey
  );

  return {
    success: true,
    key: settingKey,
  };
};


/*
 * Check whether a setting exists
 */
const hasSetting = async (
  key
) => {
  await initializeSettings();

  return settings.has(
    String(key)
  );
};


/*
 * Get supported categories
 */
const getSupportedCategories =
  async () => {
    return settingsModel
      .getSupportedCategories();
  };


/*
 * Get supported setting types
 */
const getSupportedTypes =
  async () => {
    return settingsModel
      .getSupportedTypes();
  };


const settingsService = {
  initializeSettings,

  findSettingByKey,

  getSetting,

  getSettingValue,

  getSettings,

  getPublicSettings,

  createSetting,

  updateSetting,

  updateSettings,

  deleteSetting,

  hasSetting,

  getSupportedCategories,

  getSupportedTypes,
};


export default settingsService;
