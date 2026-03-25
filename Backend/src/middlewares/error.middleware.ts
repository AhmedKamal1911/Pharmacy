import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { PharmacyError } from "../types";

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle known custom errors
  if (error instanceof PharmacyError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.isOperational ? error.message : "Internal server error",
    });
    return;
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Invalid input data",
      details: validationErrors,
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;

    switch (prismaError.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          message: "Resource already exists",
          error: "Duplicate entry",
        });
        return;
      case "P2025":
        res.status(404).json({
          success: false,
          message: "Resource not found",
          error: "Record not found",
        });
        return;
      default:
        res.status(500).json({
          success: false,
          message: "Database error",
          error: "An error occurred while processing your request",
        });
        return;
    }
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env["NODE_ENV"] === "development"
        ? error.message
        : "Something went wrong",
  });
}

/**
 * Async wrapper to catch errors in async route handlers
 */
export function asyncWrapper<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>,
) {
  return (req: T, res: U, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
