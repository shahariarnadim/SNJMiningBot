import jwt from "jsonwebtoken";

import env from "../../config/env.js";

/*
 * JWT configuration
 */
const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN ||
  "7d";


/*
 * Make sure JWT secret exists.
 */
const requireJwtSecret = () => {
  if (!env.jwtSecret) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return env.jwtSecret;
};


/*
 * Generate JWT token.
 */
const generateToken = ({
  userId = null,
  telegramId = null,
  isAdmin = false,
} = {}) => {
  const secret =
    requireJwtSecret();

  if (!userId && !telegramId) {
    throw new Error(
      "User identity is required."
    );
  }

  const payload = {
    userId:
      userId
        ? String(userId)
        : null,

    telegramId:
      telegramId
        ? String(telegramId)
        : null,

    isAdmin:
      isAdmin === true,
  };

  return jwt.sign(
    payload,
    secret,
    {
      expiresIn:
        JWT_EXPIRES_IN,
    }
  );
};


/*
 * Verify JWT token.
 */
const verifyToken = (
  token
) => {
  const secret =
    requireJwtSecret();

  if (!token) {
    throw new Error(
      "JWT token is required."
    );
  }

  try {
    return jwt.verify(
      token,
      secret
    );
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      throw new Error(
        "JWT token has expired."
      );
    }

    throw new Error(
      "Invalid JWT token."
    );
  }
};


/*
 * Decode JWT token without
 * treating it as authenticated.
 */
const decodeToken = (
  token
) => {
  if (!token) {
    return null;
  }

  return jwt.decode(
    token
  );
};


/*
 * Extract Bearer token from
 * Authorization header.
 */
const extractBearerToken = (
  authorization
) => {
  if (
    !authorization ||
    typeof authorization !==
      "string"
  ) {
    return null;
  }

  if (
    !authorization.startsWith(
      "Bearer "
    )
  ) {
    return null;
  }

  const token =
    authorization
      .slice(7)
      .trim();

  return token || null;
};


/*
 * Verify Authorization header.
 */
const authenticateToken = (
  authorization
) => {
  const token =
    extractBearerToken(
      authorization
    );

  if (!token) {
    throw new Error(
      "Bearer authentication token is required."
    );
  }

  return verifyToken(
    token
  );
};


/*
 * Check whether a verified
 * JWT belongs to an admin.
 */
const isAdminToken = (
  decodedToken
) => {
  return (
    decodedToken &&
    decodedToken.isAdmin === true
  );
};


const jwtService = {
  generateToken,
  verifyToken,
  decodeToken,
  extractBearerToken,
  authenticateToken,
  isAdminToken,
};


export default jwtService;
