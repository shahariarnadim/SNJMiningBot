import boostModel from "./boostModel.js";
import balanceService from "../balances/balanceService.js";

const boosts = new Map();
const boostActivations = new Map();

/*
 * Temporary default boosts.
 *
 * Later these values will come from
 * Database/Admin Settings.
 */
const defaultBoosts = [
  {
    id: "boost_2x",
    name: "2X Mining Boost",
    description: "Double your mining rate.",
    multiplier: 2,
    durationSeconds: 60 * 60,
    cost: 10,
    enabled: true,
  },
  {
    id: "boost_3x",
    name: "3X Mining Boost",
    description: "Triple your mining rate.",
    multiplier: 3,
    durationSeconds: 30 * 60,
    cost: 20,
    enabled: true,
  },
];

/*
 * Initialize default boosts.
 */
const initializeBoosts = () => {
  if (boosts.size > 0) {
    return;
  }

  for (const boostData of defaultBoosts) {
    const boost =
      boostModel.createBoostRecord(boostData);

    boosts.set(boost.id, boost);
  }
};

initializeBoosts();

/*
 * Get all available boosts.
 */
const getBoosts = async () => {
  initializeBoosts();

  return Array.from(boosts.values())
    .filter((boost) => boost.enabled)
    .map((boost) =>
      boostModel.sanitizeBoost(boost)
    );
};

/*
 * Find one boost by ID.
 */
const getBoostById = async (boostId) => {
  initializeBoosts();

  if (!boostId) {
    return null;
  }

  return boosts.get(String(boostId)) || null;
};

/*
 * Find active boost for a user.
 */
const getActiveBoost = async (telegramId) => {
  if (!telegramId) {
    return null;
  }

  const activation =
    boostActivations.get(
      String(telegramId)
    );

  if (!activation) {
    return null;
  }

  const now = Date.now();

  const endsAt =
    new Date(activation.endsAt).getTime();

  if (
    activation.status === "ACTIVE" &&
    now >= endsAt
  ) {
    activation.status = "EXPIRED";
    activation.updatedAt = new Date();

    boostActivations.set(
      String(telegramId),
      activation
    );

    return null;
  }

  if (activation.status !== "ACTIVE") {
    return null;
  }

  return boostModel.sanitizeBoostActivation(
    activation
  );
};

/*
 * Activate a boost.
 */
const activateBoost = async (
  telegramId,
  boostId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!boostId) {
    throw new Error(
      "Boost ID is required."
    );
  }

  /*
   * Check existing active boost.
   */
  const existingBoost =
    await getActiveBoost(telegramId);

  if (existingBoost) {
    throw new Error(
      "An active boost already exists."
    );
  }

  /*
   * Find requested boost.
   */
  const boost =
    await getBoostById(boostId);

  if (!boost) {
    throw new Error(
      "Boost not found."
    );
  }

  if (!boost.enabled) {
    throw new Error(
      "This boost is currently disabled."
    );
  }

  /*
   * Check boost cost.
   */
  const cost = Number(boost.cost || 0);

  if (cost > 0) {
    await balanceService.subtractBalance(
      telegramId,
      "snj",
      cost
    );
  }

  /*
   * Create activation.
   */
  const activation =
    boostModel.createBoostActivation({
      telegramId,
      boostId: boost.id,
      multiplier: boost.multiplier,
      durationSeconds:
        boost.durationSeconds,
    });

  boostActivations.set(
    String(telegramId),
    activation
  );

  return {
    boost:
      boostModel.sanitizeBoost(boost),

    activation:
      boostModel.sanitizeBoostActivation(
        activation
      ),
  };
};

/*
 * Get boost history.
 */
const getBoostHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const activation =
    boostActivations.get(
      String(telegramId)
    );

  if (!activation) {
    return [];
  }

  return [
    boostModel.sanitizeBoostActivation(
      activation
    ),
  ];
};

/*
 * Get boost settings.
 */
const getBoostSettings = async () => {
  return {
    defaultEnabled: true,
    allowMultipleActiveBoosts: false,
  };
};

const boostService = {
  getBoosts,
  getBoostById,
  getActiveBoost,
  activateBoost,
  getBoostHistory,
  getBoostSettings,
};

export default boostService;
