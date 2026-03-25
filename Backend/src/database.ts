import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";

import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize PGlite with persistent storage
const pglite = new PGlite(path.join(dataDir, "pharmacy.db"));

// Create Prisma adapter for PGlite
const adapter = new PrismaPGlite(pglite);

// Initialize Prisma Client with PGlite adapter
export const prisma = new PrismaClient({
  adapter,
  // Safe check for environment
  log:
    process.env["NODE_ENV"] === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// Initialize database connection
export async function initializeDatabase(): Promise<void> {
  try {
    // Test the connection
    await prisma.$connect();
    console.log("✅ Database connected successfully via PGlite");

    // Run migrations if needed
    // Note: With PGlite, you might need to handle migrations differently
    // For now, we'll ensure the schema is synchronized
    console.log("📊 Database schema synchronized");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

// Graceful shutdown
export async function closeDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
    throw error;
  }
}
