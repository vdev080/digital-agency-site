import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import Admin from "../models/Admin.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token || !env.jwtSecret) {
      const error = new Error("Authentication required.");
      error.statusCode = 401;
      throw error;
    }
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub);
    if (!admin || !admin.isActive) {
      const error = new Error("Authentication required.");
      error.statusCode = 401;
      throw error;
    }
    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Authentication required." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission for this action." });
    }
    next();
  };
}
