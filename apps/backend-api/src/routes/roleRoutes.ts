import { Hono } from "hono";
import { z } from "zod";
import { roleController } from "../controllers/roleController.js";

// Create a router for role endpoints
const roleRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all roles
roleRoutes.get("/", roleController.getAllRoles);

// Get role by ID
roleRoutes.get("/:uid", roleController.getRoleById);

// Create a new role
roleRoutes.post("/", roleController.createRole);

// Update a role
roleRoutes.put("/:uid", roleController.updateRole);

// Soft delete a role
roleRoutes.delete("/:uid", roleController.deleteRole);

// Get roles by organization
roleRoutes.get("/organization/:orgUid", roleController.getRolesByOrganization);

// --- EMPLOYEE ROLE ASSIGNMENTS ---

// Get employee's org unit roles
roleRoutes.get("/employee/:userUid/assignments", roleController.getEmployeeRoles);

// Create a new employee org unit role assignment
roleRoutes.post("/assignments", roleController.assignEmployeeRole);

// Delete an employee org unit role assignment
roleRoutes.delete("/assignments/:uid", roleController.removeEmployeeRole);

export default roleRoutes;
