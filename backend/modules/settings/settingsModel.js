const SETTING_CATEGORIES = [
  "PUBLIC",
  "MINING",
  "REWARDS",
  "WITHDRAWALS",
  "SWAPS",
  "BACKGROUND",
];


const SETTING_TYPES = [
  "STRING",
  "NUMBER",
  "BOOLEAN",
  "JSON",
];


const createSettingRecord = ({
  id,
  key,
  value,
  category = "PUBLIC",
  type = "STRING",
  description = "",
  isPublic = false,
  editableByAdmin = true,
} = {}) => {
  if (!id) {
    throw new Error(
      "Setting ID is required."
    );
  }

  if (!key) {
    throw new Error(
      "Setting key is required."
    );
  }

  const settingCategory =
    String(category).toUpperCase();

  if (
    !SETTING_CATEGORIES.includes(
      settingCategory
    )
  ) {
    throw new Error(
      "Unsupported setting category."
    );
  }

  const settingType =
    String(type).toUpperCase();

  if (
    !SETTING_TYPES.includes(
      settingType
    )
  ) {
    throw new Error(
      "Unsupported setting type."
    );
  }

  return {
    id: String(id),

    key: String(key),

    value,

    category:
      settingCategory,

    type:
      settingType,

    description:
      String(description || ""),

    isPublic:
      Boolean(isPublic),

    editableByAdmin:
      Boolean(editableByAdmin),

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
};


const sanitizeSetting = (
  setting = {}
) => {
  return {
    id:
      setting.id || null,

    key:
      setting.key || "",

    value:
      setting.value ?? null,

    category:
      setting.category || "PUBLIC",

    type:
      setting.type || "STRING",

    description:
      setting.description || "",

    isPublic:
      setting.isPublic === true,

    editableByAdmin:
      setting.editableByAdmin !== false,

    createdAt:
      setting.createdAt || null,

    updatedAt:
      setting.updatedAt || null,
  };
};


/*
 * Validate setting value
 * according to its declared type.
 */
const validateSettingValue = (
  value,
  type
) => {
  const settingType =
    String(type).toUpperCase();

  switch (settingType) {
    case "STRING":
      return {
        valid:
          typeof value === "string",
        value:
          typeof value === "string"
            ? value
            : null,
      };

    case "NUMBER": {
      const numericValue =
        Number(value);

      return {
        valid:
          Number.isFinite(
            numericValue
          ),
        value:
          Number.isFinite(
            numericValue
          )
            ? numericValue
            : null,
      };
    }

    case "BOOLEAN":
      return {
        valid:
          typeof value === "boolean",
        value:
          typeof value === "boolean"
            ? value
            : null,
      };

    case "JSON":
      return {
        valid:
          value !== null &&
          typeof value === "object",
        value:
          value !== null &&
          typeof value === "object"
            ? value
            : null,
      };

    default:
      return {
        valid: false,
        value: null,
      };
  }
};


/*
 * Create default SNJ Mining settings.
 *
 * These are initial defaults only.
 * Later they will be stored in
 * the real database and controlled
 * from the Admin Panel.
 */
const getDefaultSettings = () => {
  return [
    createSettingRecord({
      id: "setting-public-app-name",
      key: "app_name",
      value: "SNJ Mining",
      category: "PUBLIC",
      type: "STRING",
      description:
        "Application name.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-public-app-version",
      key: "app_version",
      value: "1.0.0",
      category: "PUBLIC",
      type: "STRING",
      description:
        "Application version.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-mining-rate",
      key: "mining_rate",
      value: 1,
      category: "MINING",
      type: "NUMBER",
      description:
        "SNJ mining reward rate.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-mining-duration",
      key: "mining_duration_seconds",
      value: 14400,
      category: "MINING",
      type: "NUMBER",
      description:
        "Mining session duration in seconds.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-mining-enabled",
      key: "mining_enabled",
      value: true,
      category: "MINING",
      type: "BOOLEAN",
      description:
        "Whether mining is enabled.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-claim-enabled",
      key: "claim_enabled",
      value: true,
      category: "REWARDS",
      type: "BOOLEAN",
      description:
        "Whether mining rewards can be claimed.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-ad-reward",
      key: "ad_reward",
      value: 0,
      category: "REWARDS",
      type: "NUMBER",
      description:
        "Reward for an approved advertisement action.",
      isPublic: false,
    }),

    createSettingRecord({
      id: "setting-referral-snj-reward",
      key: "referral_snj_reward",
      value: 0,
      category: "REWARDS",
      type: "NUMBER",
      description:
        "SNJ reward for a successful referral.",
      isPublic: false,
    }),

    createSettingRecord({
      id: "setting-referral-ntoken-reward",
      key: "referral_ntoken_reward",
      value: 0,
      category: "REWARDS",
      type: "NUMBER",
      description:
        "N Token reward for a successful referral.",
      isPublic: false,
    }),

    createSettingRecord({
      id: "setting-withdrawal-enabled",
      key: "withdrawal_enabled",
      value: true,
      category: "WITHDRAWALS",
      type: "BOOLEAN",
      description:
        "Whether withdrawals are enabled.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-withdrawal-minimum",
      key: "withdrawal_minimum",
      value: 0.01,
      category: "WITHDRAWALS",
      type: "NUMBER",
      description:
        "Minimum Dollar withdrawal amount.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-withdrawal-fee",
      key: "withdrawal_fee",
      value: 0,
      category: "WITHDRAWALS",
      type: "NUMBER",
      description:
        "Withdrawal processing fee.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-swap-enabled",
      key: "swap_enabled",
      value: true,
      category: "SWAPS",
      type: "BOOLEAN",
      description:
        "Whether token swapping is enabled.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-swap-rate",
      key: "n_token_to_dollar_rate",
      value: 0.01,
      category: "SWAPS",
      type: "NUMBER",
      description:
        "N Token to Dollar exchange rate.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-swap-minimum",
      key: "swap_minimum",
      value: 1,
      category: "SWAPS",
      type: "NUMBER",
      description:
        "Minimum swap amount.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-background-type",
      key: "background_type",
      value: "dark",
      category: "BACKGROUND",
      type: "STRING",
      description:
        "Current application background type.",
      isPublic: true,
    }),

    createSettingRecord({
      id: "setting-background-image",
      key: "background_image",
      value: "",
      category: "BACKGROUND",
      type: "STRING",
      description:
        "Admin-selected background image URL.",
      isPublic: true,
    }),
  ];
};


const getSupportedCategories = () => [
  ...SETTING_CATEGORIES,
];


const getSupportedTypes = () => [
  ...SETTING_TYPES,
];


const settingsModel = {
  SETTING_CATEGORIES,

  SETTING_TYPES,

  createSettingRecord,

  sanitizeSetting,

  validateSettingValue,

  getDefaultSettings,

  getSupportedCategories,

  getSupportedTypes,
};


export default settingsModel;
