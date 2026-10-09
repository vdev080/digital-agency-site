import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiRateLimit } from "./middleware/rateLimits.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import adminHomepageRoutes from "./routes/adminHomepageRoutes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(apiRateLimit);

if (!env.isProduction) {
  app.use(morgan("dev"));
}

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", homepageRoutes);
app.use("/api/admin", adminHomepageRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
