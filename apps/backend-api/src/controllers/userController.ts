import { appUser } from "@workspace/database/schema";
import { ClientAppUserSchema, NewAppUserSchema } from "@workspace/database/zod-schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../../../../packages/database/database.js";
import { handleError } from "../middleware/errorHandler.js";
import { formatDate, generateUUID } from "../utils/helpers.js";
import logger from "../utils/logger.js";

export const userController = {
  // Get all users (non-deleted)
  async getAllUsers(c: Context) {
    try {
      logger.info("Getting all users");

      const allUsers = await db.select().from(appUser).where(isNull(appUser.deletedAt));

      logger.debug({ count: allUsers.length }, "Retrieved users from database");

      return c.json(allUsers);
    } catch (error) {
      logger.error({ error }, "Error getting all users");
      return handleError(c, error);
    }
  },

  // Get user by ID
  async getUserById(c: Context) {
    try {
      const uid = c.req.param("uid");
      logger.info({ userId: uid }, "Getting user by ID");

      const userData = await db
        .select()
        .from(appUser)
        .where(and(eq(appUser.uid, uid), isNull(appUser.deletedAt)));

      if (userData.length === 0) {
        logger.warn({ userId: uid }, "User not found");
        return c.json({ error: "User not found" }, 404);
      }

      logger.debug({ userId: uid }, "Retrieved user by ID");

      return c.json(userData[0]);
    } catch (error) {
      const uid = c.req.param("uid");
      logger.error({ error, userId: uid }, "Error getting user by ID");
      return c.json({ error: "Failed to retrieve user" }, 500);
    }
  },

  // Create a new user
  async createUser(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientAppUserSchema.parse(data);

      // Prepare the data for the database
      const newUser = NewAppUserSchema.parse({
        uid: data.uid || generateUUID(),
        clerkId: data.clerkId || generateUUID(),
        ...validated,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null,
      });

      const inserted = await db.insert(appUser).values(newUser).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a user
  async updateUser(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      // Validate the input with client schema
      const validated = ClientAppUserSchema.partial().parse(data);

      // Update with the validated data
      const updated = await db
        .update(appUser)
        .set({
          ...validated,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(appUser.uid, uid), isNull(appUser.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a user
  async deleteUser(c: Context) {
    try {
      const uid = c.req.param("uid");

      const updated = await db
        .update(appUser)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: null,
        })
        .where(and(eq(appUser.uid, uid), isNull(appUser.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },
};
