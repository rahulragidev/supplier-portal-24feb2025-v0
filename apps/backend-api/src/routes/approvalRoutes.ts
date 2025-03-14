import { ClientApprovalRequestSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { approvalController } from "../controllers/approvalController.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for approval endpoints
const approvalRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- APPROVAL PROCESSES ---

// Get all approval processes
approvalRoutes.get("/", approvalController.getAllProcesses);

// Important: Place more specific routes BEFORE parameterized routes to prevent capturing
// Get processes by organization (must be before the /:uid route)
approvalRoutes.get(
  "/processes/organization/:orgUid",
  approvalController.getProcessesByOrganization
);

// Create a new approval process
approvalRoutes.post("/processes", approvalController.createProcess);

// Get approval process by ID
approvalRoutes.get("/processes/:uid", approvalController.getProcessById);

// Update an approval process
approvalRoutes.put("/processes/:uid", approvalController.updateProcess);

// Soft delete an approval process
approvalRoutes.delete("/processes/:uid", approvalController.deleteProcess);

// --- APPROVAL STEPS ---

// Get approval steps by process
approvalRoutes.get("/processes/:processUid/steps", approvalController.getStepsByProcess);

// Get approval step by ID
approvalRoutes.get("/steps/:uid", approvalController.getStepById);

// Create a new approval step
approvalRoutes.post("/steps", approvalController.createStep);

// Update an approval step
approvalRoutes.put("/steps/:uid", approvalController.updateStep);

// Soft delete an approval step
approvalRoutes.delete("/steps/:uid", approvalController.deleteStep);

// --- APPROVAL RESPONSIBILITIES ---

// Get responsibilities by step
approvalRoutes.get(
  "/steps/:stepUid/responsibilities",
  approvalController.getResponsibilitiesByStep
);

// Create a new approval responsibility
approvalRoutes.post("/responsibilities", approvalController.createResponsibility);

// Update an approval responsibility
approvalRoutes.put("/responsibilities/:uid", approvalController.updateResponsibility);

// Soft delete an approval responsibility
approvalRoutes.delete("/responsibilities/:uid", approvalController.deleteResponsibility);

// --- APPROVAL REQUESTS ---

// Get all approval requests
approvalRoutes.get("/requests", approvalController.getAllRequests);

// Important: Place specific routes before parameterized routes
// Get approval requests by supplier (must be before the /:uid route)
approvalRoutes.get("/requests/supplier/:supplierUid", approvalController.getRequestsBySupplier);

// Get approval request by ID
approvalRoutes.get("/requests/:uid", approvalController.getRequestById);

// Create a new approval request
approvalRoutes.post(
  "/requests",
  validateBody(ClientApprovalRequestSchema),
  approvalController.createRequest
);

// Update approval request status
approvalRoutes.put("/requests/:uid/status", approvalController.updateRequestStatus);

// Update approval request step
approvalRoutes.put("/requests/:uid/step", approvalController.updateRequestStep);

// Get logs by request
approvalRoutes.get("/requests/:requestUid/logs", approvalController.getLogsByRequest);

// Get comments by request
approvalRoutes.get("/requests/:requestUid/comments", approvalController.getCommentsByRequest);

// --- APPROVAL LOGS ---

// Create a new approval log
approvalRoutes.post("/logs", approvalController.createLog);

// --- APPROVAL COMMENTS ---

// Add a comment to a request
approvalRoutes.post("/comments", approvalController.createComment);

export default approvalRoutes;
