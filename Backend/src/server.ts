import dotenv from "dotenv";
import { initializeDatabase } from "./database";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT = process.env["PORT"] || 3000;

async function startServer(): Promise<void> {
  try {
    // Initialize database
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Pharmacy API Server running on port ${PORT}`);
      console.log(
        `📍 Environment: ${process.env["NODE_ENV"] || "development"}`,
      );
      console.log(`🔗 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  const { closeDatabase } = await import("./database");
  await closeDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  const { closeDatabase } = await import("./database");
  await closeDatabase();
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error("❌ Server startup failed:", error);
  process.exit(1);
});
