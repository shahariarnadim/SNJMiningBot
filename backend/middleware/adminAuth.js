import env from "../config/env.js";

const authenticateAdmin = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const token = authorization
      .slice(7)
      .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication token is missing.",
      });
    }

    if (!env.jwtSecret) {
      return res.status(503).json({
        success: false,
        message:
          "Admin authentication service is not configured.",
      });
    }

    /*
     * Admin JWT verification will be added here.
     *
     * Important:
     * - Normal users cannot access admin APIs.
     * - Admin permissions will be checked server-side.
     * - Admin roles will be controlled by the database.
     * - Secrets will never be exposed to the frontend.
     */

    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(403).json({
      success: false,
      message: "Admin authorization failed.",
    });
  }
};

export default authenticateAdmin;
