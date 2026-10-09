import { Router } from "express";
import { getAdminHomepage, updateHomepage } from "../controllers/homepageController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.use(requireAuth);
router.get("/homepage", getAdminHomepage);
router.put("/homepage", updateHomepage);
export default router;
