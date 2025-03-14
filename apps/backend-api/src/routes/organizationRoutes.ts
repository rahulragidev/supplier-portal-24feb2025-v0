import { ClientOrganizationSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { employeeController } from "../controllers/employeeController.js";
import { organizationController } from "../controllers/organizationController.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for organization endpoints
const organizationRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all organizations
organizationRoutes.get("/", organizationController.getAllOrganizations);

// Get organization by ID
organizationRoutes.get("/:uid", organizationController.getOrganizationById);

// Get employees by organization
organizationRoutes.get("/:uid/employees", employeeController.getEmployeesByOrganization);

// Create a new organization
organizationRoutes.post(
  "/",
  validateBody(ClientOrganizationSchema),
  organizationController.createOrganization
);

// Update an organization
organizationRoutes.put(
  "/:uid",
  validateBody(ClientOrganizationSchema.partial()),
  organizationController.updateOrganization
);

// Soft delete an organization
organizationRoutes.delete("/:uid", organizationController.deleteOrganization);

export default organizationRoutes;
