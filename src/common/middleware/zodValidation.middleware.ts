import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

/**
 * Middleware to validate request data against Zod schemas
 * @param schema - Zod schema object with optional body, query, and params
 */
export const validate = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // 👇 overwrite request with validated & transformed data
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate only request body
 */
export const validateBody = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate only query parameters
 */
export const validateQuery = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate only route parameters
 */
export const validateParams = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};
