import crypto from "crypto";


/*
 * Temporary in-memory audit log storage.
 *
 * Production database storage will be
 * connected during the database steps.
 */
const auditLogs = new Map();


/*
 * Supported audit actions.
 */
const AUDIT_ACTIONS = [
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "ENABLE",
  "DISABLE",
  "APPROVE",
  "REJECT",
  "CREDIT",
  "DEBIT",
  "WITHDRAWAL_STATUS_UPDATE",
  "ANNOUNCEMENT",
  "SETTINGS_UPDATE",
  "USER_STATUS_UPDATE",
  "OTHER",
];


/*
 * Create an audit log.
 */
const createAuditLog = async ({
  adminTelegramId,
  action,
  module,
  targetId = null,
  targetType = null,
  description = "",
  metadata = {},
  ipAddress = null,
  userAgent = null,
} = {}) => {
  if (!adminTelegramId) {
    throw new Error(
      "Admin Telegram ID is required."
    );
  }

  if (!action) {
    throw new Error(
      "Audit action is required."
    );
  }

  if (!module) {
    throw new Error(
      "Audit module is required."
    );
  }

  const normalizedAction =
    String(action)
      .trim()
      .toUpperCase();

  if (
    !AUDIT_ACTIONS.includes(
      normalizedAction
    )
  ) {
    throw new Error(
      "Invalid audit action."
    );
  }

  const auditLog = {
    id: crypto.randomUUID(),

    adminTelegramId:
      String(adminTelegramId),

    action:
      normalizedAction,

    module:
      String(module)
        .trim()
        .toUpperCase(),

    targetId:
      targetId
        ? String(targetId)
        : null,

    targetType:
      targetType
        ? String(targetType)
        : null,

    description:
      String(
        description || ""
      ).trim(),

    metadata:
      metadata &&
      typeof metadata === "object"
        ? metadata
        : {},

    ipAddress:
      ipAddress || null,

    userAgent:
      userAgent || null,

    createdAt:
      new Date(),
  };

  auditLogs.set(
    auditLog.id,
    auditLog
  );

  return sanitizeAuditLog(
    auditLog
  );
};


/*
 * Sanitize audit log before
 * returning it to the caller.
 */
const sanitizeAuditLog = (
  log = {}
) => {
  return {
    id:
      log.id || null,

    adminTelegramId:
      log.adminTelegramId || null,

    action:
      log.action || null,

    module:
      log.module || null,

    targetId:
      log.targetId || null,

    targetType:
      log.targetType || null,

    description:
      log.description || "",

    metadata:
      log.metadata || {},

    ipAddress:
      log.ipAddress || null,

    userAgent:
      log.userAgent || null,

    createdAt:
      log.createdAt || null,
  };
};


/*
 * Get audit logs.
 *
 * Supports filtering by:
 * - Admin
 * - Action
 * - Module
 * - Target
 */
const getAuditLogs = async ({
  adminTelegramId = null,
  action = null,
  module = null,
  targetId = null,
  limit = 50,
} = {}) => {
  const safeLimit = Math.min(
    Math.max(
      Number(limit) || 50,
      1
    ),
    100
  );

  let logs =
    Array.from(
      auditLogs.values()
    );

  if (adminTelegramId) {
    logs = logs.filter(
      (log) =>
        log.adminTelegramId ===
        String(adminTelegramId)
    );
  }

  if (action) {
    const normalizedAction =
      String(action)
        .trim()
        .toUpperCase();

    logs = logs.filter(
      (log) =>
        log.action ===
        normalizedAction
    );
  }

  if (module) {
    const normalizedModule =
      String(module)
        .trim()
        .toUpperCase();

    logs = logs.filter(
      (log) =>
        log.module ===
        normalizedModule
    );
  }

  if (targetId) {
    logs = logs.filter(
      (log) =>
        log.targetId ===
        String(targetId)
    );
  }

  logs.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return logs
    .slice(0, safeLimit)
    .map(sanitizeAuditLog);
};


/*
 * Get one audit log.
 */
const getAuditLog = async (
  auditLogId
) => {
  if (!auditLogId) {
    throw new Error(
      "Audit log ID is required."
    );
  }

  const log =
    auditLogs.get(
      String(auditLogId)
    );

  if (!log) {
    return null;
  }

  return sanitizeAuditLog(
    log
  );
};


/*
 * Delete an audit log.
 *
 * This is kept as a separate method
 * because production policy may later
 * prevent deletion entirely.
 */
const deleteAuditLog = async (
  auditLogId
) => {
  if (!auditLogId) {
    throw new Error(
      "Audit log ID is required."
    );
  }

  const exists =
    auditLogs.has(
      String(auditLogId)
    );

  if (!exists) {
    throw new Error(
      "Audit log not found."
    );
  }

  auditLogs.delete(
    String(auditLogId)
  );

  return {
    success: true,
    message:
      "Audit log deleted.",
  };
};


/*
 * Get supported audit actions.
 */
const getSupportedActions =
  async () => {
    return [
      ...AUDIT_ACTIONS,
    ];
  };


const adminAuditService = {
  createAuditLog,
  getAuditLogs,
  getAuditLog,
  deleteAuditLog,
  getSupportedActions,
};


export default adminAuditService;
