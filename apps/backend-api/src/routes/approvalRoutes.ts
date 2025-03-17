import { ClientApprovalRequestSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { approvalController } from "../controllers/approvalController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for approval endpoints
const approvalRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- APPROVAL PROCESSES ---

// Get all approval processes - requires the approval-processes:list permission
approvalRoutes.get(
  "/",
  requirePermission("approval-processes:list"),
  approvalController.getAllProcesses
);

// Important: Place more specific routes BEFORE parameterized routes to prevent capturing
// Get processes by organization - requires the approval-processes:get-by-organization permission
approvalRoutes.get(
  "/processes/organization/:orgUid",
  requirePermission("approval-processes:get-by-organization"),
  approvalController.getProcessesByOrganization
);

// Create a new approval process - requires the approval-processes:create permission
approvalRoutes.post(
  "/processes",
  requirePermission("approval-processes:create"),
  approvalController.createProcess
);

// Get approval process by ID - requires the approval-processes:get-by-id permission
approvalRoutes.get(
  "/processes/:uid",
  requirePermission("approval-processes:get-by-id"),
  approvalController.getProcessById
);

// Update an approval process - requires the approval-processes:update permission
approvalRoutes.put(
  "/processes/:uid",
  requirePermission("approval-processes:update"),
  approvalController.updateProcess
);

// Soft delete an approval process - requires the approval-processes:delete permission
approvalRoutes.delete(
  "/processes/:uid",
  requirePermission("approval-processes:delete"),
  approvalController.deleteProcess
);

// --- APPROVAL STEPS ---

// Get approval steps by process - requires the approval-steps:get-by-process permission
approvalRoutes.get(
  "/processes/:processUid/steps",
  requirePermission("approval-steps:get-by-process"),
  approvalController.getStepsByProcess
);

// Get approval step by ID - requires the approval-steps:get-by-id permission
approvalRoutes.get(
  "/steps/:uid",
  requirePermission("approval-steps:get-by-id"),
  approvalController.getStepById
);

// Create a new approval step - requires the approval-steps:create permission
approvalRoutes.post(
  "/steps",
  requirePermission("approval-steps:create"),
  approvalController.createStep
);

// Update an approval step - requires the approval-steps:update permission
approvalRoutes.put(
  "/steps/:uid",
  requirePermission("approval-steps:update"),
  approvalController.updateStep
);

// Soft delete an approval step - requires the approval-steps:delete permission
approvalRoutes.delete(
  "/steps/:uid",
  requirePermission("approval-steps:delete"),
  approvalController.deleteStep
);

// --- APPROVAL RESPONSIBILITIES ---

// Get responsibilities by step - requires the approval-responsibilities:get-by-step permission
approvalRoutes.get(
  "/steps/:stepUid/responsibilities",
  requirePermission("approval-responsibilities:get-by-step"),
  approvalController.getResponsibilitiesByStep
);

// Create a new approval responsibility - requires the approval-responsibilities:create permission
approvalRoutes.post(
  "/responsibilities",
  requirePermission("approval-responsibilities:create"),
  approvalController.createResponsibility
);

// Update an approval responsibility - requires the approval-responsibilities:update permission
approvalRoutes.put(
  "/responsibilities/:uid",
  requirePermission("approval-responsibilities:update"),
  approvalController.updateResponsibility
);

// Soft delete an approval responsibility - requires the approval-responsibilities:delete permission
approvalRoutes.delete(
  "/responsibilities/:uid",
  requirePermission("approval-responsibilities:delete"),
  approvalController.deleteResponsibility
);

// --- APPROVAL REQUESTS ---

// Get all approval requests - requires the approval-requests:list permission
approvalRoutes.get(
  "/requests",
  requirePermission("approval-requests:list"),
  approvalController.getAllRequests
);

// Important: Place specific routes before parameterized routes
// Get approval requests by supplier - requires the approval-requests:get-by-supplier permission
approvalRoutes.get(
  "/requests/supplier/:supplierUid",
  requirePermission("approval-requests:get-by-supplier"),
  approvalController.getRequestsBySupplier
);

// Get approval request by ID - requires the approval-requests:get-by-id permission
approvalRoutes.get(
  "/requests/:uid",
  requirePermission("approval-requests:get-by-id"),
  approvalController.getRequestById
);

// Create a new approval request - requires the approval-requests:create permission
approvalRoutes.post(
  "/requests",
  requirePermission("approval-requests:create"),
  validateBody(ClientApprovalRequestSchema),
  approvalController.createRequest
);

// Update approval request status - requires the approval-requests:update-status permission
approvalRoutes.put(
  "/requests/:uid/status",
  requirePermission("approval-requests:update-status"),
  approvalController.updateRequestStatus
);

// Update approval request step - requires the approval-requests:update-step permission
approvalRoutes.put(
  "/requests/:uid/step",
  requirePermission("approval-requests:update-step"),
  approvalController.updateRequestStep
);

// Get logs by request - requires the approval-logs:get-by-request permission
approvalRoutes.get(
  "/requests/:requestUid/logs",
  requirePermission("approval-logs:get-by-request"),
  approvalController.getLogsByRequest
);

// Get comments by request - requires the approval-comments:get-by-request permission
approvalRoutes.get(
  "/requests/:requestUid/comments",
  requirePermission("approval-comments:get-by-request"),
  approvalController.getCommentsByRequest
);

// --- APPROVAL LOGS ---

// Create a new approval log - requires the approval-logs:create permission
approvalRoutes.post(
  "/logs",
  requirePermission("approval-logs:create"),
  approvalController.createLog
);

// --- APPROVAL COMMENTS ---

// Add a comment to a request - requires the approval-comments:create permission
approvalRoutes.post(
  "/comments",
  requirePermission("approval-comments:create"),
  approvalController.createComment
);

export default approvalRoutes;
