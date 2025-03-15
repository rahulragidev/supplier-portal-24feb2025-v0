import { Hono } from "hono";
import { z } from "zod";
import { roleController } from "../controllers/roleController.js";
import { requirePermission } from "../middleware/permissions.js";

// Create a router for role endpoints
const roleRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all roles - requires the role:read permission
roleRoutes.get("/", requirePermission("roles:list"), roleController.getAllRoles);

// Get role by ID - requires the role:read permission
roleRoutes.get("/:uid", requirePermission("roles:get-by-id"), roleController.getRoleById);

// Create a new role - requires the role:create permission
roleRoutes.post("/", requirePermission("roles:create"), roleController.createRole);

// Update a role - requires the role:update permission
roleRoutes.put("/:uid", requirePermission("roles:update"), roleController.updateRole);

// Delete a role - requires the role:delete permission
roleRoutes.delete("/:uid", requirePermission("roles:delete"), roleController.deleteRole);

// Get roles by organization - requires the role:read permission
roleRoutes.get(
  "/organization/:orgUid",
  requirePermission("roles:get-by-organization"),
  roleController.getRolesByOrganization
);

// --- EMPLOYEE ROLE ASSIGNMENTS ---

// Get employee's org unit roles - requires the role:read permission
roleRoutes.get(
  "/employee/:userUid/assignments",
  requirePermission("employee-roles:list"),
  roleController.getEmployeeRoles
);

// Create a new employee org unit role assignment
roleRoutes.post("/assignments", roleController.assignEmployeeRole);

// Delete an employee org unit role assignment
roleRoutes.delete("/assignments/:uid", roleController.removeEmployeeRole);

export default roleRoutes;
