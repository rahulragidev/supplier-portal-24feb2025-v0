import { ClientSupplierSchema, ClientSupplierSiteSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { supplierController } from "../controllers/supplierController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for supplier endpoints
const supplierRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- SUPPLIERS ---

// Get all suppliers - requires the suppliers:list permission
supplierRoutes.get("/", requirePermission("suppliers:list"), supplierController.getAllSuppliers);

// Get suppliers by organization - requires the suppliers:get-by-organization permission
supplierRoutes.get(
  "/organization/:orgUid",
  requirePermission("suppliers:get-by-organization"),
  supplierController.getSuppliersByOrganization
);

// --- SUPPLIER SITES ---
// Note: These specific routes must come before the parameterized routes like /:userUid

// Get all supplier sites - requires the supplier-sites:list permission
supplierRoutes.get(
  "/sites",
  requirePermission("supplier-sites:list"),
  supplierController.getAllSites
);

// Get supplier site by ID - requires the supplier-sites:get-by-id permission
supplierRoutes.get(
  "/sites/:userUid",
  requirePermission("supplier-sites:get-by-id"),
  supplierController.getSiteById
);

// Create a new supplier site - requires the supplier-sites:create permission
supplierRoutes.post(
  "/sites",
  requirePermission("supplier-sites:create"),
  validateBody(ClientSupplierSiteSchema),
  supplierController.createSite
);

// Update a supplier site - requires the supplier-sites:update permission
supplierRoutes.put(
  "/sites/:userUid",
  requirePermission("supplier-sites:update"),
  validateBody(ClientSupplierSiteSchema.partial()),
  supplierController.updateSite
);

// Update supplier site status - requires the supplier-sites:update-status permission
supplierRoutes.put(
  "/sites/:userUid/status",
  requirePermission("supplier-sites:update-status"),
  supplierController.updateSiteStatus
);

// Soft delete a supplier site - requires the supplier-sites:delete permission
supplierRoutes.delete(
  "/sites/:userUid",
  requirePermission("supplier-sites:delete"),
  supplierController.deleteSite
);

// --- SUPPLIER INVITATIONS ---

// Get all supplier invitations - requires the supplier-invitations:list permission
supplierRoutes.get(
  "/invitations",
  requirePermission("supplier-invitations:list"),
  supplierController.getAllInvitations
);

// Get supplier invitations by organization - requires the supplier-invitations:get-by-organization permission
supplierRoutes.get(
  "/invitations/organization/:orgUid",
  requirePermission("supplier-invitations:get-by-organization"),
  supplierController.getInvitationsByOrganization
);

// Create a new supplier invitation - requires the supplier-invitations:create permission
supplierRoutes.post(
  "/invitations",
  requirePermission("supplier-invitations:create"),
  supplierController.createInvitation
);

// Update invitation status - requires the supplier-invitations:update-status permission
supplierRoutes.put(
  "/invitations/:uid/status",
  requirePermission("supplier-invitations:update-status"),
  supplierController.updateInvitationStatus
);

// --- SUPPLIER ROUTES WITH PARAMETERS ---
// These routes must come after the more specific routes above

// Get supplier by ID - requires the suppliers:get-by-id permission
supplierRoutes.get(
  "/:userUid",
  requirePermission("suppliers:get-by-id"),
  supplierController.getSupplierById
);

// Create a new supplier - requires the suppliers:create permission
supplierRoutes.post(
  "/",
  requirePermission("suppliers:create"),
  validateBody(ClientSupplierSchema),
  supplierController.createSupplier
);

// Update a supplier - requires the suppliers:update permission
supplierRoutes.put(
  "/:userUid",
  requirePermission("suppliers:update"),
  validateBody(ClientSupplierSchema.partial()),
  supplierController.updateSupplier
);

// Update supplier status - requires the suppliers:update-status permission
supplierRoutes.put(
  "/:userUid/status",
  requirePermission("suppliers:update-status"),
  supplierController.updateSupplierStatus
);

// Soft delete a supplier - requires the suppliers:delete permission
supplierRoutes.delete(
  "/:userUid",
  requirePermission("suppliers:delete"),
  supplierController.deleteSupplier
);

// Get supplier sites by supplier - requires the supplier-sites:get-by-supplier permission
supplierRoutes.get(
  "/:supplierUid/sites",
  requirePermission("supplier-sites:get-by-supplier"),
  supplierController.getSitesBySupplier
);

export default supplierRoutes;
