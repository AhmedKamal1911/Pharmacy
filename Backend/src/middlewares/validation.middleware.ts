import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { asyncWrapper } from "./error.middleware";

/**
 * Validation middleware factory
 * Validates request body, params, or query against Zod schemas
 */
export function validateRequest<
  TBody = any,
  TParams = any,
  TQuery = any,
>(options: {
  body?: ZodType<TBody>;
  params?: ZodType<TParams>;
  query?: ZodType<TQuery>;
}) {
  return asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Validate body if schema provided
        if (options.body) {
          req.body = await options.body.parseAsync(req.body);
        }

        // Validate params if schema provided
        if (options.params) {
          const parsedParams = await options.params.parseAsync(req.params);
          (req.params as any) = parsedParams;
        }

        // Validate query if schema provided
        if (options.query) {
          const parsedQuery = await options.query.parseAsync(req.query);
          (req.query as any) = parsedQuery;
        }

        next();
      } catch (error) {
        next(error);
      }
    },
  );
}

/**
 * Generic validation middleware for single schema
 */
export function validate(
  schema: ZodType<any>,
  target: "body" | "params" | "query" = "body",
) {
  return asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsedValue = await schema.parseAsync(req[target]);
        (req[target] as any) = parsedValue;
        next();
      } catch (error) {
        next(error);
      }
    },
  );
}
