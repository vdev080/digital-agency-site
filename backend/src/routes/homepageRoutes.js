import { Router } from "express";
import { getPublicHomepage } from "../controllers/homepageController.js";
const router = Router();
router.get("/homepage", getPublicHomepage);
export default router;
