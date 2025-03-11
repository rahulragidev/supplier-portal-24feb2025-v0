import { Hono } from "hono";
import type { Context } from "hono";
import { supplierController } from "../controllers/supplierController.js";
import { validateBody } from "../middleware/validation.js";
import { abac, requireResource } from "../middleware/abacMiddleware.js";
import { ClientSupplierSchema, ClientSupplierSiteSchema } from "@workspace/database/zod-schema";
import { z } from "zod";
import { db } from "../../../../packages/database/database.js";
import { supplier } from "../../../../packages/database/schema.js";
import { eq, and, isNull } from "drizzle-orm";

// Create a router for supplier endpoints
const supplierRoutes = new Hono();

// Define schema for URL parameter validation
const UidParamSchema = z.object({
  userUid: z.string().uuid()
});

// Helper function to get a supplier by UID
const getSupplierById = async (c: Context) => {
  const { userUid } = c.req.param();
  if (!userUid) return null;
  
  return await db.query.supplier.findFirst({
    where: and(
      eq(supplier.userUid, userUid),
      isNull(supplier.deletedAt)
    )
  });
};

// --- SUPPLIERS ---

// Get all suppliers
supplierRoutes.get("/", 
  abac({
    resourceType: 'supplier',
    action: 'view'
  }), 
  supplierController.getAllSuppliers
);

// Get supplier by ID
supplierRoutes.get("/:userUid", 
  requireResource('supplier', getSupplierById),
  abac({
    resourceType: 'supplier',
    action: 'view',
    getResource: (c) => c.get('resource')
  }), 
  supplierController.getSupplierById
);

// Create a new supplier
supplierRoutes.post("/", 
  validateBody(ClientSupplierSchema),
  abac({
    resourceType: 'supplier',
    action: 'create'
  }), 
  supplierController.createSupplier
);

// Update a supplier
supplierRoutes.put("/:userUid", 
  validateBody(ClientSupplierSchema.partial()),
  requireResource('supplier', getSupplierById),
  abac({
    resourceType: 'supplier',
    action: 'update',
    getResource: (c) => c.get('resource')
  }), 
  supplierController.updateSupplier
);

// Delete a supplier
supplierRoutes.delete("/:userUid", 
  requireResource('supplier', getSupplierById),
  abac({
    resourceType: 'supplier',
    action: 'delete',
    getResource: (c) => c.get('resource')
  }), 
  supplierController.deleteSupplier
);

// Get suppliers by organization
supplierRoutes.get("/organization/:orgUid", supplierController.getSuppliersByOrganization);

// --- SUPPLIER SITES ---

// Get all supplier sites
supplierRoutes.get("/sites", supplierController.getAllSites);

// Get supplier sites by supplier
supplierRoutes.get("/:supplierUid/sites", supplierController.getSitesBySupplier);

// Get supplier site by ID
supplierRoutes.get("/sites/:userUid", supplierController.getSiteById);

// Create a new supplier site
supplierRoutes.post("/sites", validateBody(ClientSupplierSiteSchema), supplierController.createSite);

// Update a supplier site
supplierRoutes.put("/sites/:userUid", validateBody(ClientSupplierSiteSchema.partial()), supplierController.updateSite);

// Update supplier site status
supplierRoutes.put("/sites/:userUid/status", supplierController.updateSiteStatus);

// Soft delete a supplier site
supplierRoutes.delete("/sites/:userUid", supplierController.deleteSite);

// --- SUPPLIER INVITATIONS ---

// Get all supplier invitations
supplierRoutes.get("/invitations", supplierController.getAllInvitations);

// Get supplier invitations by organization
supplierRoutes.get("/invitations/organization/:orgUid", supplierController.getInvitationsByOrganization);

// Create a new supplier invitation
supplierRoutes.post("/invitations", supplierController.createInvitation);

// Update invitation status
supplierRoutes.put("/invitations/:uid/status", supplierController.updateInvitationStatus);

export default supplierRoutes; 