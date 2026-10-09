import jwt from "jsonwebtoken";
import { matchedData } from "express-validator";
import { env } from "../config/env.js";
import Admin from "../models/Admin.js";

function cookieOptions() {
  return { httpOnly: true, secure: env.isProduction, sameSite: env.isProduction ? "none" : "lax", maxAge: 1000 * 60 * 15, path: "/" };
}

function adminResponse(admin) {
  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role, lastLoginAt: admin.lastLoginAt };
}

export async function login(req, res, next) {
  try {
    if (!env.jwtSecret) {
      const error = new Error("Authentication is not configured.");
      error.statusCode = 503;
      throw error;
    }
    const { email, password } = matchedData(req);
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!admin || !admin.isActive || !(await admin.verifyPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    admin.lastLoginAt = new Date();
    await admin.save();
    const token = jwt.sign({ sub: admin.id, role: admin.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    res.cookie(env.cookieName, token, cookieOptions());
    return res.status(200).json({ success: true, data: { admin: adminResponse(admin) }, message: "Signed in successfully." });
  } catch (error) { next(error); }
}

export function logout(_req, res) {
  res.clearCookie(env.cookieName, { httpOnly: true, secure: env.isProduction, sameSite: env.isProduction ? "none" : "lax", path: "/" });
  res.status(200).json({ success: true, message: "Signed out successfully." });
}

export function me(req, res) {
  res.status(200).json({ success: true, data: { admin: adminResponse(req.admin) } });
}
