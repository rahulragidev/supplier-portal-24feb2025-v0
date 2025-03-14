import { ClientSupplierSchema, ClientSupplierSiteSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { supplierController } from "../controllers/supplierController.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for supplier endpoints
const supplierRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- SUPPLIERS ---

// Get all suppliers
supplierRoutes.get("/", supplierController.getAllSuppliers);

// Get suppliers by organization
supplierRoutes.get("/organization/:orgUid", supplierController.getSuppliersByOrganization);

// --- SUPPLIER SITES ---
// Note: These specific routes must come before the parameterized routes like /:userUid

// Get all supplier sites
supplierRoutes.get("/sites", supplierController.getAllSites);

// Get supplier site by ID
supplierRoutes.get("/sites/:userUid", supplierController.getSiteById);

// Create a new supplier site
supplierRoutes.post(
  "/sites",
  validateBody(ClientSupplierSiteSchema),
  supplierController.createSite
);

// Update a supplier site
supplierRoutes.put(
  "/sites/:userUid",
  validateBody(ClientSupplierSiteSchema.partial()),
  supplierController.updateSite
);

// Update supplier site status
supplierRoutes.put("/sites/:userUid/status", supplierController.updateSiteStatus);

// Soft delete a supplier site
supplierRoutes.delete("/sites/:userUid", supplierController.deleteSite);

// --- SUPPLIER INVITATIONS ---

// Get all supplier invitations
supplierRoutes.get("/invitations", supplierController.getAllInvitations);

// Get supplier invitations by organization
supplierRoutes.get(
  "/invitations/organization/:orgUid",
  supplierController.getInvitationsByOrganization
);

// Create a new supplier invitation
supplierRoutes.post("/invitations", supplierController.createInvitation);

// Update invitation status
supplierRoutes.put("/invitations/:uid/status", supplierController.updateInvitationStatus);

// --- SUPPLIER ROUTES WITH PARAMETERS ---
// These routes must come after the more specific routes above

// Get supplier by ID
supplierRoutes.get("/:userUid", supplierController.getSupplierById);

// Create a new supplier
supplierRoutes.post("/", validateBody(ClientSupplierSchema), supplierController.createSupplier);

// Update a supplier
supplierRoutes.put(
  "/:userUid",
  validateBody(ClientSupplierSchema.partial()),
  supplierController.updateSupplier
);

// Update supplier status
supplierRoutes.put("/:userUid/status", supplierController.updateSupplierStatus);

// Soft delete a supplier
supplierRoutes.delete("/:userUid", supplierController.deleteSupplier);

// Get supplier sites by supplier
supplierRoutes.get("/:supplierUid/sites", supplierController.getSitesBySupplier);

export default supplierRoutes;
