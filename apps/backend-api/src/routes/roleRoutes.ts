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

// Get all roles - requires the roles:list permission
roleRoutes.get("/", requirePermission("roles:list"), roleController.getAllRoles);

// Get role by ID - requires the roles:get-by-id permission
roleRoutes.get("/:uid", requirePermission("roles:get-by-id"), roleController.getRoleById);

// Create a new role - requires the roles:create permission
roleRoutes.post("/", requirePermission("roles:create"), roleController.createRole);

// Update a role - requires the roles:update permission
roleRoutes.put("/:uid", requirePermission("roles:update"), roleController.updateRole);

// Delete a role - requires the roles:delete permission
roleRoutes.delete("/:uid", requirePermission("roles:delete"), roleController.deleteRole);

// Get roles by organization - requires the roles:get-by-organization permission
roleRoutes.get(
  "/organization/:orgUid",
  requirePermission("roles:get-by-organization"),
  roleController.getRolesByOrganization
);

// --- EMPLOYEE ROLE ASSIGNMENTS ---

// Get employee's org unit roles - requires the employee-roles:list permission
roleRoutes.get(
  "/employee/:userUid/assignments",
  requirePermission("employee-roles:list"),
  roleController.getEmployeeRoles
);

// Create a new employee org unit role assignment - requires the employee-roles:assign permission
roleRoutes.post(
  "/assignments",
  requirePermission("employee-roles:assign"),
  roleController.assignEmployeeRole
);

// Delete an employee org unit role assignment - requires the employee-roles:remove permission
roleRoutes.delete(
  "/assignments/:uid",
  requirePermission("employee-roles:remove"),
  roleController.removeEmployeeRole
);

export default roleRoutes;
