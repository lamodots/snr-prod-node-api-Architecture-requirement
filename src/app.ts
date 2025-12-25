import express from "express";
import cors from "cors";
import helmet from "helmet";
import usersRoutes from "./users/users.routes";
import {
  requestLogger,
  detailedRequestLogger,
} from "./common/middleware/requestLogger.middleware";
import {
  errorHandler,
  notFoundHandler,
} from "./common/middleware/errorHandler.middleware";

const app = express();

// API version
const API_VERSION = "/api/v1";

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Conditional request logger based on DEBUG_REQUESTS environment variable
const logger =
  process.env.DEBUG_REQUESTS === "true" ? detailedRequestLogger : requestLogger;

app.use(logger);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// Register feature modules
app.use("/users", usersRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
