import { ClientEmployeeSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { employeeController } from "../controllers/employeeController.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for employee endpoints
const employeeRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all employees
employeeRoutes.get("/", employeeController.getAllEmployees);

// Get employee by ID
employeeRoutes.get("/:userUid", employeeController.getEmployeeById);

// Create a new employee
employeeRoutes.post("/", validateBody(ClientEmployeeSchema), employeeController.createEmployee);

// Update an employee
employeeRoutes.put(
  "/:userUid",
  validateBody(ClientEmployeeSchema.partial()),
  employeeController.updateEmployee
);

// Soft delete an employee
employeeRoutes.delete("/:userUid", employeeController.deleteEmployee);

export default employeeRoutes;
