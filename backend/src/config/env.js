import "dotenv/config";
import { isIP } from "node:net";

const isProduction = process.env.NODE_ENV === "production";

const requiredInProduction = ["MONGODB_URI", "JWT_SECRET", "CLIENT_URL"];
const missingVariables = requiredInProduction.filter((name) => !process.env[name]);

if (isProduction && missingVariables.length > 0) {
  throw new Error(
    `Missing required production environment variables: ${missingVariables.join(", ")}`,
  );
}

const port = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port number.");
}

const mongoDnsServers = (process.env.MONGODB_DNS_SERVERS ?? "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (mongoDnsServers.length === 0 || mongoDnsServers.some((server) => isIP(server) === 0)) {
  throw new Error("MONGODB_DNS_SERVERS must be a comma-separated list of IP addresses.");
}

export const env = Object.freeze({
  port,
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction,
  mongoUri: process.env.MONGODB_URI,
  mongoDnsServers,
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  cookieName: "admin_token",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
