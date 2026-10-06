import env from "../config/env.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authorization
      .slice(7)
      .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    /*
     * JWT verification will be connected here.
     *
     * The backend will verify the token before allowing
     * access to protected user APIs.
     */

    if (!env.jwtSecret) {
      return res.status(503).json({
        success: false,
        message:
          "Authentication service is not configured.",
      });
    }

    req.user = {
      authenticated: true,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Invalid authentication.",
    });
  }
};

export default authenticateUser;
