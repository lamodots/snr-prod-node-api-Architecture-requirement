import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../../lib/generated/prisma/client";

/**
 * Custom Error class with status code support
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Format Zod validation errors
 */
const formatZodError = (error: ZodError) => {
  const formattedErrors = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation failed",
    errors: formattedErrors,
  };
};

/**
 * Handle Prisma errors
 */
const handlePrismaError = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma error codes
    switch (error.code) {
      case "P2002":
        // Unique constraint violation
        const target = (error.meta?.target as string[]) || [];
        return {
          statusCode: 409,
          message: `Duplicate value for ${target.join(", ")}`,
        };
      case "P2025":
        // Record not found
        return {
          statusCode: 404,
          message: "Record not found",
        };
      case "P2003":
        // Foreign key constraint violation
        return {
          statusCode: 400,
          message: "Invalid reference to related record",
        };
      case "P2014":
        // Invalid relation
        return {
          statusCode: 400,
          message: "Invalid relation in query",
        };
      default:
        return {
          statusCode: 400,
          message: error.message || "Database operation failed",
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: "Invalid data provided",
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: "Database connection failed",
    };
  }

  return null;
};

/**
 * Centralized error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default to 500 server error
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;
  let errors: any = undefined;

  // Check if it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    const zodError = formatZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errors = zodError.errors;
    isOperational = true;
  }
  // Handle Prisma errors
  else if (err.constructor.name.includes("Prisma")) {
    const prismaError = handlePrismaError(err);
    if (prismaError) {
      statusCode = prismaError.statusCode;
      message = prismaError.message;
      isOperational = true;
    }
  }
  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    isOperational = true;
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    isOperational = true;
  }
  // Handle SyntaxError (malformed JSON)
  else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON payload";
    isOperational = true;
  }

  // Log error for debugging (only in development or for non-operational errors)
  if (process.env.NODE_ENV === "development" || !isOperational) {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.path,
      method: req.method,
      ...(errors && { validationErrors: errors }),
    });
  }

  // Send error response
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

/**
 * 404 Not Found handler
 * Place this after all routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};

/**
 * Async error wrapper for route handlers
 * Eliminates need for try-catch in every async route
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
