import { ClientOrganizationSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { employeeController } from "../controllers/employeeController.js";
import { organizationController } from "../controllers/organizationController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for organization endpoints
const organizationRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all organizations - requires the organizations:list permission
organizationRoutes.get(
  "/",
  requirePermission("organizations:list"),
  organizationController.getAllOrganizations
);

// Get organization by ID - requires the organizations:get-by-id permission
organizationRoutes.get(
  "/:uid",
  requirePermission("organizations:get-by-id"),
  organizationController.getOrganizationById
);

// Get employees by organization - requires the employees:get-by-organization permission
organizationRoutes.get(
  "/:uid/employees",
  requirePermission("employees:get-by-organization"),
  employeeController.getEmployeesByOrganization
);

// Create a new organization - requires the organizations:create permission
organizationRoutes.post(
  "/",
  requirePermission("organizations:create"),
  validateBody(ClientOrganizationSchema),
  organizationController.createOrganization
);

// Update an organization - requires the organizations:update permission
organizationRoutes.put(
  "/:uid",
  requirePermission("organizations:update"),
  validateBody(ClientOrganizationSchema.partial()),
  organizationController.updateOrganization
);

// Soft delete an organization - requires the organizations:delete permission
organizationRoutes.delete(
  "/:uid",
  requirePermission("organizations:delete"),
  organizationController.deleteOrganization
);

export default organizationRoutes;
