import { Request, Response, NextFunction } from "express";
/****WORKS IN ALL EXPRESS APP */
/**
 * Color codes for console output
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Get color based on HTTP status code
 */
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  if (statusCode >= 200) return colors.green;
  return colors.reset;
};

/**
 * Get color based on HTTP method
 */
const getMethodColor = (method: string): string => {
  const methodColors: { [key: string]: string } = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    PATCH: colors.magenta,
    DELETE: colors.red,
  };
  return methodColors[method] || colors.reset;
};

/**
 * Format timestamp
 */
const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Get client IP address
 */
const getClientIP = (req: Request): string => {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

/**
 * Request logging middleware
 * Logs all incoming HTTP requests with method, path, status, and response time
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = getTimestamp();

  // Log request start
  if (process.env.NODE_ENV === "development") {
    console.log(
      `${colors.bright}[${timestamp}]${colors.reset} ` +
        `${getMethodColor(req.method)}${req.method}${colors.reset} ` +
        `${req.originalUrl}`
    );
  }

  // Capture response finish event
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor = getStatusColor(res.statusCode);
    const methodColor = getMethodColor(req.method);

    // Build log message
    const logMessage = [
      `${colors.bright}[${getTimestamp()}]${colors.reset}`,
      `${methodColor}${req.method}${colors.reset}`,
      `${req.originalUrl}`,
      `${statusColor}${res.statusCode}${colors.reset}`,
      `${duration}ms`,
      process.env.NODE_ENV === "development" ? `- ${getClientIP(req)}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    console.log(logMessage);

    // Optional: Log additional details for errors
    if (res.statusCode >= 400 && process.env.NODE_ENV === "development") {
      console.log(`  Body:`, req.body);
      console.log(`  Query:`, req.query);
      console.log(`  Params:`, req.params);
    }
  });

  next();
};

/**
 * Advanced request logger with more details
 * Use this for debugging purposes
 */
export const detailedRequestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = getTimestamp();

  console.log("\n" + "=".repeat(80));
  console.log(`${colors.bright}Incoming Request [${timestamp}]${colors.reset}`);
  console.log(
    `${getMethodColor(req.method)}Method:${colors.reset}`,
    req.method
  );
  console.log(`${colors.cyan}URL:${colors.reset}`, req.originalUrl);
  console.log(`${colors.cyan}IP:${colors.reset}`, getClientIP(req));
  console.log(
    `${colors.cyan}User-Agent:${colors.reset}`,
    req.get("user-agent") || "N/A"
  );

  if (Object.keys(req.params).length > 0) {
    console.log(`${colors.magenta}Params:${colors.reset}`, req.params);
  }

  if (Object.keys(req.query).length > 0) {
    console.log(`${colors.yellow}Query:${colors.reset}`, req.query);
  }

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`${colors.blue}Body:${colors.reset}`, req.body);
  }

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `${getStatusColor(res.statusCode)}Status:${colors.reset}`,
      res.statusCode
    );
    console.log(`${colors.green}Duration:${colors.reset}`, `${duration}ms`);
    console.log("=".repeat(80) + "\n");
  });

  next();
};

/**
 * Skip logging for specific routes (e.g., health checks)
 */
export const skipLogger = (paths: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (paths.some((path) => req.path.startsWith(path))) {
      return next();
    }
    requestLogger(req, res, next);
  };
};
