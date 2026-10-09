import { setServers } from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    if (env.isProduction) {
      throw new Error("MONGODB_URI is required in production.");
    }

    console.warn("MONGODB_URI is not configured; starting without a database connection.");
    return false;
  }

  setServers(env.mongoDnsServers);

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  console.info("MongoDB connected.");
  return true;
}

export function databaseStatus() {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}
