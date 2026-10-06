const createUserRecord = ({
  telegramId,
  username = "",
  firstName = "",
  lastName = "",
  languageCode = "",
  isAdmin = false,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return {
    telegramId: String(telegramId),

    username: String(username || ""),

    firstName: String(firstName || ""),

    lastName: String(lastName || ""),

    languageCode: String(
      languageCode || ""
    ),

    isAdmin: Boolean(isAdmin),

    isActive: true,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};

const sanitizeUser = (user = {}) => {
  return {
    id: user.id || null,

    telegramId:
      user.telegramId || null,

    username:
      user.username || "",

    firstName:
      user.firstName || "",

    lastName:
      user.lastName || "",

    languageCode:
      user.languageCode || "",

    isActive:
      user.isActive !== false,

    createdAt:
      user.createdAt || null,

    updatedAt:
      user.updatedAt || null,
  };
};

const userModel = {
  createUserRecord,
  sanitizeUser,
};

export default userModel;
