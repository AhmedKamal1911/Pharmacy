import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { ZodError } from "zod";
import { errorHandler } from "./middlewares/error.middleware";

// Import routes
import medicineRoutes from "./modules/medicine/medicine.routes";

const app: Application = express();

// Global middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
  });
});

// API routes
app.use("/api/medicines", medicineRoutes);
// app.use('/api/patients', patientRoutes);
// app.use('/api/sales', saleRoutes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
