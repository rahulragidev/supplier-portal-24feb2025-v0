import { orgUnit } from "@workspace/database/schema";
import { db } from "@workspace/database/server";
import { NewOrgUnitSchema } from "@workspace/database/zod-schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { handleError } from "../middleware/errorHandler.js";
import { formatDate, generateUUID } from "../utils/helpers.js";

export const orgUnitController = {
  // Get all org units (non-deleted)
  async getAllOrgUnits(c: Context) {
    try {
      const allOrgUnits = await db.select().from(orgUnit).where(isNull(orgUnit.deletedAt));

      return c.json(allOrgUnits);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get org units by organization
  async getOrgUnitsByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const orgUnitData = await db
        .select()
        .from(orgUnit)
        .where(and(eq(orgUnit.organizationUid, orgUid), isNull(orgUnit.deletedAt)));

      return c.json(orgUnitData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get org unit by ID
  async getOrgUnitById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const orgUnitData = await db
        .select()
        .from(orgUnit)
        .where(and(eq(orgUnit.uid, uid), isNull(orgUnit.deletedAt)));

      if (orgUnitData.length === 0) {
        return c.json({ error: "Org unit not found" }, 404);
      }

      return c.json(orgUnitData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new org unit
  async createOrgUnit(c: Context) {
    try {
      const data = await c.req.json();

      // Prepare the data for the database
      const newOrgUnit = NewOrgUnitSchema.parse({
        uid: data.uid || generateUUID(),
        organizationUid: data.organizationUid,
        name: data.name,
        orgUnitCode: data.orgUnitCode,
        unitType: data.unitType,
        parentUid: data.parentUid || null,
        extraData: data.extraData || {},
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null,
      });

      const inserted = await db.insert(orgUnit).values(newOrgUnit).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update an org unit
  async updateOrgUnit(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      // Update with the data
      const updated = await db
        .update(orgUnit)
        .set({
          name: data.name,
          orgUnitCode: data.orgUnitCode,
          unitType: data.unitType,
          parentUid: data.parentUid,
          extraData: data.extraData,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(orgUnit.uid, uid), isNull(orgUnit.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Org unit not found" }, 404);
      }

      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete an org unit
  async deleteOrgUnit(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      const updated = await db
        .update(orgUnit)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(orgUnit.uid, uid), isNull(orgUnit.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Org unit not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },
};
