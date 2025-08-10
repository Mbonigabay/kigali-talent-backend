import jwt from "jsonwebtoken";
import { sendResponse } from "../util/response.js";
import log4js from "log4js";
const logger = log4js.getLogger("authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate a user with a JWT.
 * It extracts the token from the 'Authorization' header, verifies it,
 * and attaches the user's payload to the request object.
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return sendResponse(res, 403, "Invalid or expired token.", null);
      }
      req.user = user;
      next();
    });
  } else {
    sendResponse(res, 401, "Authorization token is required.", null);
  }
};

/**
 * Middleware to authorize a user based on their role.
 * This function returns a new middleware that checks for a specific role.
 * @param {string} requiredRole The role required to access the route.
 */
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      sendResponse(
        res,
        403,
        "Forbidden: You do not have the required permissions.",
        null
      );
    }
  };
};
