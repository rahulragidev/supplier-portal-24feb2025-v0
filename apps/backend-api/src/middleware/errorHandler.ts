import type { Context } from "hono";
import { z } from "zod";

/**
 * Centralized error handler for API requests
 * @param {Context} c - Hono context
 * @param {unknown} error - Error to handle
 * @returns {Response} Appropriate error response
 */
export const handleError = (c: Context, error: unknown) => {
  console.error("Error:", error);

  if (error instanceof z.ZodError) {
    return c.json({ error: error.format() }, 400);
  }

  if (error instanceof Error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ error: "An unknown error occurred" }, 500);
};
