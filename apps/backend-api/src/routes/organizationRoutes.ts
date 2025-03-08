import { Hono } from "hono";
import { organizationController } from "../controllers/organizationController.js";
import { validateBody } from "../middleware/validation.js";
import { ClientOrganizationSchema } from "@workspace/database/zod-schema";
import { z } from "zod";

// Create a router for organization endpoints
const organizationRoutes = new Hono();

// Define schema for URL parameter validation
const UidParamSchema = z.object({
  uid: z.string().uuid()
});

// Get all organizations
organizationRoutes.get("/", organizationController.getAllOrganizations);

// Get organization by ID 
organizationRoutes.get("/:uid", organizationController.getOrganizationById);

// Create a new organization
organizationRoutes.post("/", validateBody(ClientOrganizationSchema), organizationController.createOrganization);

// Update an organization
organizationRoutes.put("/:uid", validateBody(ClientOrganizationSchema.partial()), organizationController.updateOrganization);

// Soft delete an organization
organizationRoutes.delete("/:uid", organizationController.deleteOrganization);

export default organizationRoutes; 