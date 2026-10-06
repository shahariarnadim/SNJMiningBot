import express from "express";

import authenticateUser from "../../middleware/auth.js";

import {
  getSettings,
  getPublicSettings,
  getSetting,
  getSettingValue,
  createSetting,
  updateSetting,
  updateSettings,
  deleteSetting,
  checkSetting,
  getSupportedCategories,
  getSupportedTypes,
} from "./settingsController.js";


const router = express.Router();


/*
 * Public settings
 *
 * These settings can be used
 * by the Mini App frontend.
 */
router.get(
  "/public",
  getPublicSettings
);


/*
 * Supported setting information
 */
router.get(
  "/categories",
  authenticateUser,
  getSupportedCategories
);

router.get(
  "/types",
  authenticateUser,
  getSupportedTypes
);


/*
 * Get all settings
 *
 * Admin protection will be added
 * in the Admin module.
 */
router.get(
  "/",
  authenticateUser,
  getSettings
);


/*
 * Get one setting
 */
router.get(
  "/key/:key",
  authenticateUser,
  getSetting
);


/*
 * Get one setting value
 */
router.get(
  "/value/:key",
  authenticateUser,
  getSettingValue
);


/*
 * Check whether setting exists
 */
router.get(
  "/exists/:key",
  authenticateUser,
  checkSetting
);


/*
 * Create a new setting
 *
 * Intended for Admin use.
 * Admin protection will be added later.
 */
router.post(
  "/",
  authenticateUser,
  createSetting
);


/*
 * Update multiple settings
 *
 * Intended for Admin use.
 */
router.patch(
  "/",
  authenticateUser,
  updateSettings
);


/*
 * Update one setting
 *
 * Intended for Admin use.
 */
router.patch(
  "/key/:key",
  authenticateUser,
  updateSetting
);


/*
 * Delete one setting
 *
 * Intended for Admin use.
 */
router.delete(
  "/key/:key",
  authenticateUser,
  deleteSetting
);


export default router;
