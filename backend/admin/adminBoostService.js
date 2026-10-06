import boostService from "../modules/boosts/boostService.js";


/*
 * Get all available boosts.
 */
const getAllBoosts = async () => {
  return boostService.getBoosts();
};


/*
 * Get a single boost.
 */
const getBoostById = async (
  boostId
) => {
  if (!boostId) {
    throw new Error(
      "Boost ID is required."
    );
  }

  const boost =
    await boostService.getBoostById(
      boostId
    );

  if (!boost) {
    throw new Error(
      "Boost not found."
    );
  }

  return boost;
};


/*
 * Create a new boost.
 */
const createBoost = async ({
  name,
  description = "",
  multiplier = 1,
  durationSeconds = 3600,
  cost = 0,
  enabled = true,
} = {}) => {
  if (!name) {
    throw new Error(
      "Boost name is required."
    );
  }

  const numericMultiplier =
    Number(multiplier);

  const numericDuration =
    Number(durationSeconds);

  const numericCost =
    Number(cost);

  if (
    !Number.isFinite(
      numericMultiplier
    ) ||
    numericMultiplier <= 0
  ) {
    throw new Error(
      "Boost multiplier must be greater than zero."
    );
  }

  if (
    !Number.isInteger(
      numericDuration
    ) ||
    numericDuration <= 0
  ) {
    throw new Error(
      "Boost duration must be a positive integer in seconds."
    );
  }

  if (
    !Number.isFinite(
      numericCost
    ) ||
    numericCost < 0
  ) {
    throw new Error(
      "Boost cost must be a non-negative number."
    );
  }

  return boostService.createBoost({
    name:
      String(name).trim(),
    description:
      String(description || "").trim(),
    multiplier:
      numericMultiplier,
    durationSeconds:
      numericDuration,
    cost:
      numericCost,
    enabled:
      Boolean(enabled),
  });
};


/*
 * Update an existing boost.
 */
const updateBoost = async (
  boostId,
  values = {}
) => {
  if (!boostId) {
    throw new Error(
      "Boost ID is required."
    );
  }

  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error(
      "Boost update data must be an object."
    );
  }

  const allowedFields = [
    "name",
    "description",
    "multiplier",
    "durationSeconds",
    "cost",
    "enabled",
  ];

  const updates = {};

  for (
    const field of allowedFields
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        values,
        field
      )
    ) {
      updates[field] =
        values[field];
    }
  }

  if (
    Object.keys(updates).length === 0
  ) {
    throw new Error(
      "No valid boost fields were provided."
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "multiplier"
    )
  ) {
    const multiplier =
      Number(updates.multiplier);

    if (
      !Number.isFinite(multiplier) ||
      multiplier <= 0
    ) {
      throw new Error(
        "Boost multiplier must be greater than zero."
      );
    }

    updates.multiplier =
      multiplier;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "durationSeconds"
    )
  ) {
    const duration =
      Number(
        updates.durationSeconds
      );

    if (
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      throw new Error(
        "Boost duration must be a positive integer in seconds."
      );
    }

    updates.durationSeconds =
      duration;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "cost"
    )
  ) {
    const cost =
      Number(updates.cost);

    if (
      !Number.isFinite(cost) ||
      cost < 0
    ) {
      throw new Error(
        "Boost cost must be a non-negative number."
      );
    }

    updates.cost =
      cost;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "name"
    )
  ) {
    updates.name =
      String(
        updates.name
      ).trim();

    if (!updates.name) {
      throw new Error(
        "Boost name cannot be empty."
      );
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "description"
    )
  ) {
    updates.description =
      String(
        updates.description || ""
      ).trim();
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "enabled"
    )
  ) {
    updates.enabled =
      Boolean(
        updates.enabled
      );
  }

  return boostService.updateBoost(
    boostId,
    updates
  );
};


/*
 * Enable a boost.
 */
const enableBoost = async (
  boostId
) => {
  return updateBoost(
    boostId,
    {
      enabled: true,
    }
  );
};


/*
 * Disable a boost.
 */
const disableBoost = async (
  boostId
) => {
  return updateBoost(
    boostId,
    {
      enabled: false,
    }
  );
};


/*
 * Delete a boost.
 *
 * Deletion is kept inside the admin
 * module so normal users never get
 * access to this operation.
 */
const deleteBoost = async (
  boostId
) => {
  if (!boostId) {
    throw new Error(
      "Boost ID is required."
    );
  }

  return boostService.deleteBoost(
    boostId
  );
};


/*
 * Get boost activation history.
 */
const getBoostHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  return boostService.getBoostHistory(
    telegramId
  );
};


const adminBoostService = {
  getAllBoosts,
  getBoostById,
  createBoost,
  updateBoost,
  enableBoost,
  disableBoost,
  deleteBoost,
  getBoostHistory,
};


export default adminBoostService;
