import type { Context, Next } from "hono";
import type { z } from "zod";
import { handleError } from "./errorHandler.js";

/**
 * Middleware that validates request body against a Zod schema
 * @param {z.ZodType} schema - Zod schema to validate against
 * @returns {function} Middleware function
 */
export const validateBody = (schema: z.ZodType) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set("validated", validated);
      await next();
    } catch (error) {
      return handleError(c, error);
    }
  };
};

/**
 * Middleware that validates URL parameters against a Zod schema
 * @param {z.ZodType} schema - Zod schema to validate against
 * @returns {function} Middleware function
 */
export const validateParams = (schema: z.ZodType) => {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validated = schema.parse(params);
      c.set("validatedParams", validated);
      await next();
    } catch (error) {
      return handleError(c, error);
    }
  };
};
