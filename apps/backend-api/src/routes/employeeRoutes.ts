import { ClientEmployeeSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { employeeController } from "../controllers/employeeController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for employee endpoints
const employeeRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all employees - requires the employees:list permission
employeeRoutes.get("/", requirePermission("employees:list"), employeeController.getAllEmployees);

// Get employee by ID - requires the employees:get-by-id permission
employeeRoutes.get(
  "/:userUid",
  requirePermission("employees:get-by-id"),
  employeeController.getEmployeeById
);

// Create a new employee - requires the employees:create permission
employeeRoutes.post(
  "/",
  requirePermission("employees:create"),
  validateBody(ClientEmployeeSchema),
  employeeController.createEmployee
);

// Update an employee - requires the employees:update permission
employeeRoutes.put(
  "/:userUid",
  requirePermission("employees:update"),
  validateBody(ClientEmployeeSchema.partial()),
  employeeController.updateEmployee
);

// Soft delete an employee - requires the employees:delete permission
employeeRoutes.delete(
  "/:userUid",
  requirePermission("employees:delete"),
  employeeController.deleteEmployee
);

export default employeeRoutes;
