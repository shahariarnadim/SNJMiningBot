import miningModel from "./miningModel.js";

import balanceService from "../balances/balanceService.js";

const miningSessions = new Map();

const miningSettings = {
  durationSeconds: 4 * 60 * 60,
  miningRate: 1,
};

const findActiveMiningSession = async (
  telegramId
) => {
  if (!telegramId) {
    return null;
  }

  const session =
    miningSessions.get(
      String(telegramId)
    );

  if (
    !session ||
    session.status !== "ACTIVE"
  ) {
    return null;
  }

  return session;
};

const startMining = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const existingSession =
    await findActiveMiningSession(
      telegramId
    );

  if (existingSession) {
    throw new Error(
      "An active mining session already exists."
    );
  }

  const session =
    miningModel.createMiningSession({
      telegramId,
      durationSeconds:
        miningSettings.durationSeconds,
      miningRate:
        miningSettings.miningRate,
    });

  miningSessions.set(
    String(telegramId),
    session
  );

  return miningModel.sanitizeMiningSession(
    session
  );
};

const getMiningStatus = async (
  telegramId
) => {
  const session =
    await findActiveMiningSession(
      telegramId
    );

  if (!session) {
    return {
      active: false,
      status: "INACTIVE",
      miningRate:
        miningSettings.miningRate,
      durationSeconds:
        miningSettings.durationSeconds,
      remainingSeconds: 0,
      progress: 0,
    };
  }

  const now =
    new Date();

  const startTime =
    new Date(
      session.startedAt
    ).getTime();

  const endTime =
    new Date(
      session.endsAt
    ).getTime();

  const currentTime =
    now.getTime();

  const duration =
    session.durationSeconds;

  const elapsedSeconds =
    Math.max(
      0,
      Math.min(
        duration,
        (currentTime -
          startTime) /
          1000
      )
    );

  const remainingSeconds =
    Math.max(
      0,
      Math.ceil(
        (endTime -
          currentTime) /
          1000
      )
    );

  const progress =
    duration > 0
      ? Number(
          (
            (elapsedSeconds /
              duration) *
            100
          ).toFixed(2)
        )
      : 0;

  const reward =
    miningModel.calculateMiningReward(
      session,
      now
    );

  if (
    remainingSeconds === 0 &&
    session.status === "ACTIVE"
  ) {
    session.status = "COMPLETED";
    session.completedAt = now;
    session.reward = reward;
    session.updatedAt = now;

    miningSessions.set(
      String(telegramId),
      session
    );
  }

  return {
    active:
      session.status === "ACTIVE",

    status:
      session.status,

    miningRate:
      session.miningRate,

    durationSeconds:
      session.durationSeconds,

    remainingSeconds,

    progress,

    reward,

    session:
      miningModel.sanitizeMiningSession(
        session
      ),
  };
};

const getActiveMiningSession =
  async (telegramId) => {
    const session =
      await findActiveMiningSession(
        telegramId
      );

    if (!session) {
      return null;
    }

    return miningModel.sanitizeMiningSession(
      session
    );
  };

const claimMiningReward = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const session =
    miningSessions.get(
      String(telegramId)
    );

  if (!session) {
    throw new Error(
      "No mining session found."
    );
  }

  if (
    session.status !== "COMPLETED"
  ) {
    throw new Error(
      "Mining session is not completed yet."
    );
  }

  if (session.claimedAt) {
    throw new Error(
      "Mining reward has already been claimed."
    );
  }

  const reward =
    miningModel.calculateMiningReward(
      session,
      new Date(
        session.endsAt
      )
    );

  if (reward <= 0) {
    throw new Error(
      "Mining reward is not available."
    );
  }

  const updatedBalance =
    await balanceService.addBalance(
      telegramId,
      "snj",
      reward
    );

  session.claimedAt =
    new Date();

  session.reward =
    reward;

  session.status =
    "CLAIMED";

  session.updatedAt =
    new Date();

  miningSessions.set(
    String(telegramId),
    session
  );

  return {
    reward,
    balance:
      updatedBalance,
    session:
      miningModel.sanitizeMiningSession(
        session
      ),
  };
};

const getMiningHistory = async (
  telegramId
) => {
  if (!telegramId) {
    throw new Error(
      "Telegram user ID is required."
    );
  }

  const session =
    miningSessions.get(
      String(telegramId)
    );

  if (!session) {
    return [];
  }

  return [
    miningModel.sanitizeMiningSession(
      session
    ),
  ];
};

const getMiningSettings = async () => {
  return {
    durationSeconds:
      miningSettings.durationSeconds,

    miningRate:
      miningSettings.miningRate,
  };
};

const miningService = {
  findActiveMiningSession,
  startMining,
  getMiningStatus,
  getActiveMiningSession,
  claimMiningReward,
  getMiningHistory,
  getMiningSettings,
};

export default miningService;
