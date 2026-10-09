import http from "node:http";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();

  const server = http.createServer(app);
  server.listen(env.port, () => {
    console.info(`API listening on port ${env.port} (${env.nodeEnv}).`);
  });

  const shutdown = (signal) => {
    console.info(`${signal} received; closing server.`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("Unable to start API:", error.message);
  process.exit(1);
});
