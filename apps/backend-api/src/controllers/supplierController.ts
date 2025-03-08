import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../../../packages/database/database.js";
import { supplier, supplierSite, supplierInvitation } from "@workspace/database/schema";
import { 
  NewSupplierSchema, 
  ClientSupplierSchema,
  NewSupplierInvitationSchema,
  NewSupplierSiteSchema,
  ClientSupplierSiteSchema
} from "@workspace/database/zod-schema";
import { eq, and, isNull } from "drizzle-orm";
import { handleError } from "../middleware/errorHandler.js";
import { generateUUID, formatDate } from "../utils/helpers.js";

export const supplierController = {
  // Get all suppliers (non-deleted)
  async getAllSuppliers(c: Context) {
    try {
      const allSuppliers = await db
        .select()
        .from(supplier)
        .where(isNull(supplier.deletedAt));
      
      return c.json(allSuppliers);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get suppliers by organization
  async getSuppliersByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const supplierData = await db
        .select()
        .from(supplier)
        .where(and(
          eq(supplier.organizationUid, orgUid),
          isNull(supplier.deletedAt)
        ));
      
      return c.json(supplierData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get supplier by ID
  async getSupplierById(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const supplierData = await db
        .select()
        .from(supplier)
        .where(and(
          eq(supplier.userUid, userUid),
          isNull(supplier.deletedAt)
        ));
      
      if (supplierData.length === 0) {
        return c.json({ error: "Supplier not found" }, 404);
      }
      
      return c.json(supplierData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new supplier
  async createSupplier(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientSupplierSchema.parse(data);
      
      // Prepare the data for the database
      const newSupplier = NewSupplierSchema.parse({
        ...validated,
        userUid: data.userUid || generateUUID(),
        status: data.status || "DRAFT", // Default status
        revisionNumber: 1,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(supplier).values(newSupplier).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a supplier
  async updateSupplier(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      // Validate the input with client schema
      const validated = ClientSupplierSchema.partial().parse(data);
      
      // Get the current supplier to increment revision number
      const currentSupplier = await db
        .select()
        .from(supplier)
        .where(and(
          eq(supplier.userUid, userUid),
          isNull(supplier.deletedAt)
        ));
      
      if (currentSupplier.length === 0) {
        return c.json({ error: "Supplier not found" }, 404);
      }
      
      // Increment revision number
      const revisionNumber = currentSupplier[0]?.revisionNumber ? currentSupplier[0].revisionNumber + 1 : 1;
      
      // Update with the validated data
      const updated = await db
        .update(supplier)
        .set({
          ...validated,
          revisionNumber,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplier.userUid, userUid),
          isNull(supplier.deletedAt)
        ))
        .returning();
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update supplier status
  async updateSupplierStatus(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      if (!data.status) {
        return c.json({ error: "Status is required" }, 400);
      }
      
      // Update the status
      const updated = await db
        .update(supplier)
        .set({
          status: data.status,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplier.userUid, userUid),
          isNull(supplier.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Supplier not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a supplier
  async deleteSupplier(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      const updated = await db
        .update(supplier)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplier.userUid, userUid),
          isNull(supplier.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Supplier not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- SUPPLIER INVITATIONS ---

  // Get all supplier invitations
  async getAllInvitations(c: Context) {
    try {
      const allInvitations = await db
        .select()
        .from(supplierInvitation)
        .where(isNull(supplierInvitation.deletedAt));
      
      return c.json(allInvitations);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get supplier invitations by organization
  async getInvitationsByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const invitationData = await db
        .select()
        .from(supplierInvitation)
        .where(and(
          eq(supplierInvitation.organizationUid, orgUid),
          isNull(supplierInvitation.deletedAt)
        ));
      
      return c.json(invitationData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new supplier invitation
  async createInvitation(c: Context) {
    try {
      const data = await c.req.json();
      
      // Set expiry date (e.g., 7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Prepare the data for the database
      const newInvitation = NewSupplierInvitationSchema.parse({
        uid: data.uid || generateUUID(),
        organizationUid: data.organizationUid,
        invitedByEmployeeUserUid: data.invitedByEmployeeUserUid,
        email: data.email,
        status: data.status || "SENT",
        expiresAt: data.expiresAt || expiresAt,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        lastUpdatedBy: data.lastUpdatedBy || null
      });
      
      const inserted = await db.insert(supplierInvitation).values(newInvitation).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update invitation status
  async updateInvitationStatus(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      if (!data.status) {
        return c.json({ error: "Status is required" }, 400);
      }
      
      // Update the status
      const updated = await db
        .update(supplierInvitation)
        .set({
          status: data.status,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplierInvitation.uid, uid),
          isNull(supplierInvitation.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Invitation not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- SUPPLIER SITES ---

  // Get all supplier sites
  async getAllSites(c: Context) {
    try {
      const allSites = await db
        .select()
        .from(supplierSite)
        .where(isNull(supplierSite.deletedAt));
      
      return c.json(allSites);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get supplier sites by supplier
  async getSitesBySupplier(c: Context) {
    try {
      const supplierUid = c.req.param("supplierUid");
      const siteData = await db
        .select()
        .from(supplierSite)
        .where(and(
          eq(supplierSite.supplierUserUid, supplierUid),
          isNull(supplierSite.deletedAt)
        ));
      
      return c.json(siteData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get supplier site by ID
  async getSiteById(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const siteData = await db
        .select()
        .from(supplierSite)
        .where(and(
          eq(supplierSite.userUid, userUid),
          isNull(supplierSite.deletedAt)
        ));
      
      if (siteData.length === 0) {
        return c.json({ error: "Supplier site not found" }, 404);
      }
      
      return c.json(siteData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new supplier site
  async createSite(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientSupplierSiteSchema.parse(data);
      
      // Prepare the data for the database
      const newSite = NewSupplierSiteSchema.parse({
        ...validated,
        userUid: data.userUid || generateUUID(),
        status: data.status || "PENDING", // Default status
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(supplierSite).values(newSite).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a supplier site
  async updateSite(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      // Validate the input with client schema
      const validated = ClientSupplierSiteSchema.partial().parse(data);
      
      // Update with the validated data
      const updated = await db
        .update(supplierSite)
        .set({
          ...validated,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplierSite.userUid, userUid),
          isNull(supplierSite.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Supplier site not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update supplier site status
  async updateSiteStatus(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      if (!data.status) {
        return c.json({ error: "Status is required" }, 400);
      }
      
      // Update the status
      const updated = await db
        .update(supplierSite)
        .set({
          status: data.status,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplierSite.userUid, userUid),
          isNull(supplierSite.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Supplier site not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a supplier site
  async deleteSite(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      const updated = await db
        .update(supplierSite)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(supplierSite.userUid, userUid),
          isNull(supplierSite.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Supplier site not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  }
}; 