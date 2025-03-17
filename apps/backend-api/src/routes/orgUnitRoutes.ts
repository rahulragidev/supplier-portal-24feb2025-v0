import { Hono } from "hono";
import { z } from "zod";
import { orgUnitController } from "../controllers/orgUnitController.js";
import { requirePermission } from "../middleware/permissions.js";

// Create a router for org unit endpoints
const orgUnitRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all org units - requires the org-units:list permission
orgUnitRoutes.get("/", requirePermission("org-units:list"), orgUnitController.getAllOrgUnits);

// Get org unit by ID - requires the org-units:get-by-id permission
orgUnitRoutes.get(
  "/:uid",
  requirePermission("org-units:get-by-id"),
  orgUnitController.getOrgUnitById
);

// Create a new org unit - requires the org-units:create permission
orgUnitRoutes.post("/", requirePermission("org-units:create"), orgUnitController.createOrgUnit);

// Update an org unit - requires the org-units:update permission
orgUnitRoutes.put("/:uid", requirePermission("org-units:update"), orgUnitController.updateOrgUnit);

// Soft delete an org unit - requires the org-units:delete permission
orgUnitRoutes.delete(
  "/:uid",
  requirePermission("org-units:delete"),
  orgUnitController.deleteOrgUnit
);

// Get org units by organization - requires the org-units:get-by-organization permission
orgUnitRoutes.get(
  "/organization/:orgUid",
  requirePermission("org-units:get-by-organization"),
  orgUnitController.getOrgUnitsByOrganization
);

export default orgUnitRoutes;
