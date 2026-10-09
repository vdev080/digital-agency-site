import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { loginRateLimit } from "../middleware/rateLimits.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.post("/login", loginRateLimit, [body("email").isEmail().normalizeEmail(), body("password").isString().isLength({ min: 8, max: 128 })], validate, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
export default router;
