import { getAuth } from "@clerk/nextjs/server";
import type { Context, Next } from "hono";
import logger from "../utils/logger.js";

export const authenticateToken = async (c: Context, next: Next) => {
  try {
    const { userId } = getAuth(c.req as any);

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Add the userId to the context for use in route handlers
    c.set("userId", userId);

    await next();
  } catch (error: unknown) {
    logger.error(error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};
