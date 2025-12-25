import app from "./app";
import { logger } from "./common/config/logger";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason: Error) => {
  logger.error("Unhandled Rejection", {
    reason: reason.message,
    stack: reason.stack,
  });
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
