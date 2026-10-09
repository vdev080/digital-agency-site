import { Router } from "express";
import { databaseStatus } from "../config/db.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    database: databaseStatus(),
  });
});

export default router;
