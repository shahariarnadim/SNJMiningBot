import userModel from "./userModel.js";

const users = new Map();

const findUserByTelegramId = async (
  telegramId
) => {
  if (!telegramId) {
    return null;
  }

  return (
    users.get(String(telegramId)) ||
    null
  );
};

const createUser = async (
  telegramUser
) => {
  if (!telegramUser?.id) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const telegramId = String(
    telegramUser.id
  );

  const existingUser =
    await findUserByTelegramId(
      telegramId
    );

  if (existingUser) {
    return existingUser;
  }

  const user =
    userModel.createUserRecord({
      telegramId,
      username:
        telegramUser.username || "",
      firstName:
        telegramUser.first_name || "",
      lastName:
        telegramUser.last_name || "",
      languageCode:
        telegramUser.language_code || "",
    });

  users.set(telegramId, user);

  return user;
};

const getOrCreateTelegramUser = async (
  telegramUser
) => {
  const existingUser =
    await findUserByTelegramId(
      telegramUser?.id
    );

  if (existingUser) {
    return existingUser;
  }

  return createUser(telegramUser);
};

const updateUser = async (
  telegramId,
  updates = {}
) => {
  const user =
    await findUserByTelegramId(
      telegramId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  const allowedFields = [
    "username",
    "firstName",
    "lastName",
    "languageCode",
    "isActive",
  ];

  for (const field of allowedFields) {
    if (
      Object.prototype.hasOwnProperty.call(
        updates,
        field
      )
    ) {
      user[field] = updates[field];
    }
  }

  user.updatedAt = new Date();

  users.set(
    String(telegramId),
    user
  );

  return user;
};

const getUserProfile = async (
  telegramId
) => {
  const user =
    await findUserByTelegramId(
      telegramId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  return userModel.sanitizeUser(
    user
  );
};

const userService = {
  findUserByTelegramId,
  createUser,
  getOrCreateTelegramUser,
  updateUser,
  getUserProfile,
};

export default userService;
