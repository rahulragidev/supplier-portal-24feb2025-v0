import { address } from "@workspace/database/schema";
import { ClientAddressSchema, NewAddressSchema } from "@workspace/database/zod-schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../../../../packages/database/database.js";
import { handleError } from "../middleware/errorHandler.js";
import { formatDate, generateUUID } from "../utils/helpers.js";

export const addressController = {
  // Get all addresses (non-deleted)
  async getAllAddresses(c: Context) {
    try {
      const allAddresses = await db.select().from(address).where(isNull(address.deletedAt));

      return c.json(allAddresses);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get address by ID
  async getAddressById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const addressData = await db
        .select()
        .from(address)
        .where(and(eq(address.uid, uid), isNull(address.deletedAt)));

      if (addressData.length === 0) {
        return c.json({ error: "Address not found" }, 404);
      }

      return c.json(addressData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new address
  async createAddress(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientAddressSchema.parse(data);

      // Prepare the data for the database
      const newAddress = NewAddressSchema.parse({
        uid: data.uid || generateUUID(),
        ...validated,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null,
      });

      const inserted = await db.insert(address).values(newAddress).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update an address
  async updateAddress(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      // Validate the input with client schema
      const validated = ClientAddressSchema.partial().parse(data);

      // Update with the validated data
      const updated = await db
        .update(address)
        .set({
          ...validated,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(address.uid, uid), isNull(address.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Address not found" }, 404);
      }

      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete an address
  async deleteAddress(c: Context) {
    try {
      const uid = c.req.param("uid");

      const updated = await db
        .update(address)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: null,
        })
        .where(and(eq(address.uid, uid), isNull(address.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Address not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },
};
