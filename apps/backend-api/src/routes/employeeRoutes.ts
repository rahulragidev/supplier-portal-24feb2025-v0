import { Hono } from "hono";
import { employeeController } from "../controllers/employeeController.js";
import { validateBody } from "../middleware/validation.js";
import { ClientEmployeeSchema } from "@workspace/database/zod-schema";
import { z } from "zod";

// Create a router for employee endpoints
const employeeRoutes = new Hono();

// Define schema for URL parameter validation
const UidParamSchema = z.object({
  uid: z.string().uuid()
});

// Get all employees
employeeRoutes.get("/", employeeController.getAllEmployees);

// Get employee by ID 
employeeRoutes.get("/:userUid", employeeController.getEmployeeById);

// Create a new employee
employeeRoutes.post("/", validateBody(ClientEmployeeSchema), employeeController.createEmployee);

// Update an employee
employeeRoutes.put("/:userUid", validateBody(ClientEmployeeSchema.partial()), employeeController.updateEmployee);

// Soft delete an employee
employeeRoutes.delete("/:userUid", employeeController.deleteEmployee);

// Get employees by organization
employeeRoutes.get("/organization/:orgUid", employeeController.getEmployeesByOrganization);

export default employeeRoutes; 