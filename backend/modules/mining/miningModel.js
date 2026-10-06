const createMiningSession = ({
  telegramId,
  durationSeconds = 4 * 60 * 60,
  miningRate = 0,
} = {}) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const duration =
    Number(durationSeconds);

  const rate =
    Number(miningRate);

  if (
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    throw new Error(
      "Mining duration must be greater than zero."
    );
  }

  if (
    !Number.isFinite(rate) ||
    rate < 0
  ) {
    throw new Error(
      "Mining rate cannot be negative."
    );
  }

  const startedAt =
    new Date();

  const endsAt =
    new Date(
      startedAt.getTime() +
        duration * 1000
    );

  return {
    id:
      `mine_${Date.now()}_${telegramId}`,

    telegramId:
      String(telegramId),

    status: "ACTIVE",

    durationSeconds: duration,

    miningRate: rate,

    startedAt,

    endsAt,

    claimedAt: null,

    completedAt: null,

    reward: 0,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
};

const sanitizeMiningSession = (
  session = {}
) => {
  return {
    id:
      session.id || null,

    telegramId:
      session.telegramId || null,

    status:
      session.status || "UNKNOWN",

    durationSeconds:
      Number(
        session.durationSeconds || 0
      ),

    miningRate:
      Number(
        session.miningRate || 0
      ),

    startedAt:
      session.startedAt || null,

    endsAt:
      session.endsAt || null,

    claimedAt:
      session.claimedAt || null,

    completedAt:
      session.completedAt || null,

    reward:
      Number(
        session.reward || 0
      ),
  };
};

const calculateMiningReward = (
  session = {},
  currentTime = new Date()
) => {
  if (!session.startedAt) {
    return 0;
  }

  const startedAt =
    new Date(
      session.startedAt
    ).getTime();

  const endsAt =
    new Date(
      session.endsAt
    ).getTime();

  const now =
    new Date(
      currentTime
    ).getTime();

  const effectiveEnd =
    Math.min(
      now,
      endsAt
    );

  const elapsedSeconds =
    Math.max(
      0,
      (effectiveEnd -
        startedAt) /
        1000
    );

  const duration =
    Number(
      session.durationSeconds || 0
    );

  const rate =
    Number(
      session.miningRate || 0
    );

  if (
    duration <= 0 ||
    rate < 0
  ) {
    return 0;
  }

  const completedRatio =
    Math.min(
      1,
      elapsedSeconds /
        duration
    );

  return Number(
    (
      rate *
      completedRatio
    ).toFixed(8)
  );
};

const miningModel = {
  createMiningSession,
  sanitizeMiningSession,
  calculateMiningReward,
};

export default miningModel;
