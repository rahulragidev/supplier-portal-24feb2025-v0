import { Hono } from "hono";
import { orgUnitController } from "../controllers/orgUnitController.js";
import { z } from "zod";

// Create a router for org unit endpoints
const orgUnitRoutes = new Hono();

// Define schema for URL parameter validation
const UidParamSchema = z.object({
  uid: z.string().uuid()
});

// Get all org units
orgUnitRoutes.get("/", orgUnitController.getAllOrgUnits);

// Get org unit by ID 
orgUnitRoutes.get("/:uid", orgUnitController.getOrgUnitById);

// Create a new org unit
orgUnitRoutes.post("/", orgUnitController.createOrgUnit);

// Update an org unit
orgUnitRoutes.put("/:uid", orgUnitController.updateOrgUnit);

// Soft delete an org unit
orgUnitRoutes.delete("/:uid", orgUnitController.deleteOrgUnit);

// Get org units by organization
orgUnitRoutes.get("/organization/:orgUid", orgUnitController.getOrgUnitsByOrganization);

export default orgUnitRoutes; 