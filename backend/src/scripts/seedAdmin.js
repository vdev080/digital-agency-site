import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import Admin from "../models/Admin.js";

async function seedAdmin() {
  const name = process.env.SEED_ADMIN_NAME?.trim();
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!name || !email || !password || password.length < 12) throw new Error("Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and a 12+ character SEED_ADMIN_PASSWORD before seeding.");
  await connectDatabase();
  if (await Admin.exists({ email })) throw new Error("An admin with that email already exists.");
  const admin = new Admin({ name, email, role: "super_admin" });
  await admin.setPassword(password);
  await admin.save();
  console.info("Initial admin account created.");
}

seedAdmin().catch((error) => { console.error(`Admin seed failed: ${error.message}`); process.exitCode = 1; }).finally(async () => { await mongoose.connection.close(); });
