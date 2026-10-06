const createBoostRecord = ({
  id,
  name,
  description = "",
  multiplier = 1,
  durationSeconds = 3600,
  cost = 0,
  enabled = true,
} = {}) => {
  if (!id) {
    throw new Error("Boost ID is required.");
  }

  if (!name) {
    throw new Error("Boost name is required.");
  }

  const numericMultiplier = Number(multiplier);
  const numericDuration = Number(durationSeconds);
  const numericCost = Number(cost);

  if (
    !Number.isFinite(numericMultiplier) ||
    numericMultiplier <= 0
  ) {
    throw new Error(
      "Boost multiplier must be greater than zero."
    );
  }

  if (
    !Number.isFinite(numericDuration) ||
    numericDuration <= 0
  ) {
    throw new Error(
      "Boost duration must be greater than zero."
    );
  }

  if (
    !Number.isFinite(numericCost) ||
    numericCost < 0
  ) {
    throw new Error(
      "Boost cost cannot be negative."
    );
  }

  return {
    id: String(id),

    name: String(name),

    description: String(description || ""),

    multiplier: numericMultiplier,

    durationSeconds: numericDuration,

    cost: numericCost,

    enabled: Boolean(enabled),

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};

const createBoostActivation = ({
  telegramId,
  boostId,
  multiplier,
  durationSeconds,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  if (!boostId) {
    throw new Error("Boost ID is required.");
  }

  const now = new Date();

  const duration = Number(durationSeconds);

  if (
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    throw new Error(
      "Boost duration must be greater than zero."
    );
  }

  return {
    id:
      `boost_activation_${Date.now()}_${telegramId}`,

    telegramId: String(telegramId),

    boostId: String(boostId),

    multiplier: Number(multiplier),

    startedAt: now,

    endsAt: new Date(
      now.getTime() + duration * 1000
    ),

    status: "ACTIVE",

    createdAt: now,

    updatedAt: now,
  };
};

const sanitizeBoost = (boost = {}) => {
  return {
    id: boost.id || null,

    name: boost.name || "",

    description: boost.description || "",

    multiplier: Number(boost.multiplier || 1),

    durationSeconds: Number(
      boost.durationSeconds || 0
    ),

    cost: Number(boost.cost || 0),

    enabled: boost.enabled !== false,

    createdAt: boost.createdAt || null,

    updatedAt: boost.updatedAt || null,
  };
};

const sanitizeBoostActivation = (
  activation = {}
) => {
  return {
    id: activation.id || null,

    telegramId:
      activation.telegramId || null,

    boostId: activation.boostId || null,

    multiplier: Number(
      activation.multiplier || 1
    ),

    startedAt:
      activation.startedAt || null,

    endsAt:
      activation.endsAt || null,

    status:
      activation.status || "UNKNOWN",

    createdAt:
      activation.createdAt || null,

    updatedAt:
      activation.updatedAt || null,
  };
};

const boostModel = {
  createBoostRecord,
  createBoostActivation,
  sanitizeBoost,
  sanitizeBoostActivation,
};

export default boostModel;
