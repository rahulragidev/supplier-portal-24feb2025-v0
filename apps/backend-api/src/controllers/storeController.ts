import { address, store } from "@workspace/database/schema";
import {
  ClientStoreSchema,
  NewAddressSchema,
  NewStoreSchema,
} from "@workspace/database/zod-schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../../../../packages/database/database.js";
import { handleError } from "../middleware/errorHandler.js";
import { formatDate, generateUUID } from "../utils/helpers.js";

export const storeController = {
  // Get all stores (non-deleted)
  async getAllStores(c: Context) {
    try {
      const allStores = await db.select().from(store).where(isNull(store.deletedAt));

      return c.json(allStores);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get stores by organization
  async getStoresByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const storeData = await db
        .select()
        .from(store)
        .where(and(eq(store.organizationUid, orgUid), isNull(store.deletedAt)));

      return c.json(storeData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get store by ID
  async getStoreById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const storeData = await db
        .select()
        .from(store)
        .where(and(eq(store.uid, uid), isNull(store.deletedAt)));

      if (storeData.length === 0) {
        return c.json({ error: "Store not found" }, 404);
      }

      return c.json(storeData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new store
  async createStore(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientStoreSchema.parse(data);

      // Use transaction to ensure atomic operation
      const inserted = await db.transaction(async (tx) => {
        // Create address first
        const addressUid = data.addressUid || generateUUID();
        const newAddress = NewAddressSchema.parse({
          uid: addressUid,
          line1: data.address.line1,
          line2: data.address.line2,
          line3: data.address.line3,
          line4: data.address.line4,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          pincode: data.address.pincode,
          addressType: data.address.addressType || "OPERATIONAL",
          extraData: data.address.extraData,
          createdAt: formatDate(),
          updatedAt: formatDate(),
          createdBy: data.createdBy || null,
          lastUpdatedBy: data.createdBy || null,
        });

        await tx.insert(address).values(newAddress);

        // Prepare the data for the database
        const newStore = NewStoreSchema.parse({
          uid: data.uid || generateUUID(),
          organizationUid: validated.organizationUid,
          name: validated.name,
          storeCode: validated.storeCode,
          addressUid: addressUid,
          extraData: validated.extraData || {},
          createdAt: formatDate(),
          updatedAt: formatDate(),
          createdBy: data.createdBy || null,
          lastUpdatedBy: data.createdBy || null,
        });

        const inserted = await tx.insert(store).values(newStore).returning();
        return inserted[0];
      });

      return c.json(inserted, 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a store
  async updateStore(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      // Update with the data
      const updated = await db
        .update(store)
        .set({
          name: data.name,
          storeCode: data.storeCode,
          addressUid: data.addressUid,
          extraData: data.extraData,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(store.uid, uid), isNull(store.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Store not found" }, 404);
      }

      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a store
  async deleteStore(c: Context) {
    try {
      const uid = c.req.param("uid");

      const updated = await db
        .update(store)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: null,
        })
        .where(and(eq(store.uid, uid), isNull(store.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Store not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },
};
