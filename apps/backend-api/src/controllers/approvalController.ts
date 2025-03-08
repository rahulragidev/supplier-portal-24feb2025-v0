import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../../../packages/database/database.js";
import { 
  approvalProcess, 
  approvalStep, 
  approvalResponsibility, 
  approvalRequest,
  approvalLog,
  approvalComment
} from "@workspace/database/schema";
import { 
  NewApprovalProcessSchema,
  NewApprovalStepSchema,
  NewApprovalResponsibilitySchema,
  NewApprovalRequestSchema,
  NewApprovalLogSchema,
  NewApprovalCommentSchema,
  ClientApprovalRequestSchema
} from "@workspace/database/zod-schema";
import { eq, and, isNull } from "drizzle-orm";
import { handleError } from "../middleware/errorHandler.js";
import { generateUUID, formatDate } from "../utils/helpers.js";

export const approvalController = {
  // --- APPROVAL PROCESSES ---

  // Get all approval processes
  async getAllProcesses(c: Context) {
    try {
      const allProcesses = await db
        .select()
        .from(approvalProcess)
        .where(isNull(approvalProcess.deletedAt));
      
      return c.json(allProcesses);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get approval processes by organization
  async getProcessesByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const processData = await db
        .select()
        .from(approvalProcess)
        .where(and(
          eq(approvalProcess.organizationUid, orgUid),
          isNull(approvalProcess.deletedAt)
        ));
      
      return c.json(processData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get approval process by ID
  async getProcessById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const processData = await db
        .select()
        .from(approvalProcess)
        .where(and(
          eq(approvalProcess.uid, uid),
          isNull(approvalProcess.deletedAt)
        ));
      
      if (processData.length === 0) {
        return c.json({ error: "Approval process not found" }, 404);
      }
      
      return c.json(processData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new approval process
  async createProcess(c: Context) {
    try {
      const data = await c.req.json();
      
      // Prepare the data for the database
      const newProcess = NewApprovalProcessSchema.parse({
        uid: data.uid || generateUUID(),
        organizationUid: data.organizationUid,
        name: data.name,
        extraData: data.extraData || {},
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(approvalProcess).values(newProcess).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update an approval process
  async updateProcess(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      // Update with the data
      const updated = await db
        .update(approvalProcess)
        .set({
          name: data.name,
          extraData: data.extraData,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalProcess.uid, uid),
          isNull(approvalProcess.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval process not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete an approval process
  async deleteProcess(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      const updated = await db
        .update(approvalProcess)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalProcess.uid, uid),
          isNull(approvalProcess.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval process not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- APPROVAL STEPS ---

  // Get approval steps by process
  async getStepsByProcess(c: Context) {
    try {
      const processUid = c.req.param("processUid");
      const stepData = await db
        .select()
        .from(approvalStep)
        .where(and(
          eq(approvalStep.approvalProcessUid, processUid),
          isNull(approvalStep.deletedAt)
        ))
        .orderBy(approvalStep.stepOrder);
      
      return c.json(stepData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get approval step by ID
  async getStepById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const stepData = await db
        .select()
        .from(approvalStep)
        .where(and(
          eq(approvalStep.uid, uid),
          isNull(approvalStep.deletedAt)
        ));
      
      if (stepData.length === 0) {
        return c.json({ error: "Approval step not found" }, 404);
      }
      
      return c.json(stepData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new approval step
  async createStep(c: Context) {
    try {
      const data = await c.req.json();
      
      // Prepare the data for the database
      const newStep = NewApprovalStepSchema.parse({
        uid: data.uid || generateUUID(),
        approvalProcessUid: data.approvalProcessUid,
        stepName: data.stepName,
        stepOrder: data.stepOrder,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(approvalStep).values(newStep).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update an approval step
  async updateStep(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      // Update with the data
      const updated = await db
        .update(approvalStep)
        .set({
          stepName: data.stepName,
          stepOrder: data.stepOrder,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalStep.uid, uid),
          isNull(approvalStep.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval step not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete an approval step
  async deleteStep(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      const updated = await db
        .update(approvalStep)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalStep.uid, uid),
          isNull(approvalStep.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval step not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- APPROVAL RESPONSIBILITIES ---

  // Get responsibilities by step
  async getResponsibilitiesByStep(c: Context) {
    try {
      const stepUid = c.req.param("stepUid");
      const responsibilityData = await db
        .select()
        .from(approvalResponsibility)
        .where(and(
          eq(approvalResponsibility.approvalStepUid, stepUid),
          isNull(approvalResponsibility.deletedAt)
        ));
      
      return c.json(responsibilityData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new approval responsibility
  async createResponsibility(c: Context) {
    try {
      const data = await c.req.json();
      
      // Prepare the data for the database
      const newResponsibility = NewApprovalResponsibilitySchema.parse({
        uid: data.uid || generateUUID(),
        approvalStepUid: data.approvalStepUid,
        responsibilityType: data.responsibilityType,
        roleUid: data.roleUid || null,
        orgUnitUid: data.orgUnitUid || null,
        employeeUserUid: data.employeeUserUid || null,
        fallbackRoleUid: data.fallbackRoleUid || null,
        fallbackOrgUnitUid: data.fallbackOrgUnitUid || null,
        fallbackEmployeeUserUid: data.fallbackEmployeeUserUid || null,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(approvalResponsibility).values(newResponsibility).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update an approval responsibility
  async updateResponsibility(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      // Update with the data
      const updated = await db
        .update(approvalResponsibility)
        .set({
          responsibilityType: data.responsibilityType,
          roleUid: data.roleUid || null,
          orgUnitUid: data.orgUnitUid || null,
          employeeUserUid: data.employeeUserUid || null,
          fallbackRoleUid: data.fallbackRoleUid || null,
          fallbackOrgUnitUid: data.fallbackOrgUnitUid || null,
          fallbackEmployeeUserUid: data.fallbackEmployeeUserUid || null,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalResponsibility.uid, uid),
          isNull(approvalResponsibility.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval responsibility not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete an approval responsibility
  async deleteResponsibility(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      const updated = await db
        .update(approvalResponsibility)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalResponsibility.uid, uid),
          isNull(approvalResponsibility.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval responsibility not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- APPROVAL REQUESTS ---

  // Get all approval requests
  async getAllRequests(c: Context) {
    try {
      const allRequests = await db
        .select()
        .from(approvalRequest)
        .where(isNull(approvalRequest.deletedAt));
      
      return c.json(allRequests);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get approval requests by supplier
  async getRequestsBySupplier(c: Context) {
    try {
      const supplierUid = c.req.param("supplierUid");
      const requestData = await db
        .select()
        .from(approvalRequest)
        .where(and(
          eq(approvalRequest.supplierUserUid, supplierUid),
          isNull(approvalRequest.deletedAt)
        ));
      
      return c.json(requestData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get approval request by ID
  async getRequestById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const requestData = await db
        .select()
        .from(approvalRequest)
        .where(and(
          eq(approvalRequest.uid, uid),
          isNull(approvalRequest.deletedAt)
        ));
      
      if (requestData.length === 0) {
        return c.json({ error: "Approval request not found" }, 404);
      }
      
      return c.json(requestData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new approval request
  async createRequest(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientApprovalRequestSchema.parse(data);
      
      // Prepare the data for the database
      const newRequest = NewApprovalRequestSchema.parse({
        uid: data.uid || generateUUID(),
        ...validated,
        createdAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(approvalRequest).values(newRequest).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update approval request status
  async updateRequestStatus(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      if (!data.status) {
        return c.json({ error: "Status is required" }, 400);
      }
      
      // Prepare update data based on status
      const updateData: any = {
        status: data.status,
        lastUpdatedBy: data.lastUpdatedBy || null
      };
      
      // If status is final (approved or rejected), set the completion date
      if (data.status === "APPROVED" || data.status === "REJECTED") {
        updateData.completedAt = formatDate();
      }
      
      // Update the status
      const updated = await db
        .update(approvalRequest)
        .set(updateData)
        .where(and(
          eq(approvalRequest.uid, uid),
          isNull(approvalRequest.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval request not found" }, 404);
      }
      
      // Create an approval log for this action
      if (data.actionByUserUid) {
        await db.insert(approvalLog).values({
          uid: generateUUID(),
          approvalRequestUid: uid,
          approvalStepUid: updated[0]?.stepUid || "",
          actionByUserUid: data.actionByUserUid,
          actionDate: formatDate(),
          status: data.status,
          createdAt: formatDate(),
          updatedAt: formatDate(),
          createdBy: data.actionByUserUid,
          lastUpdatedBy: data.actionByUserUid
        });
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update approval request step
  async updateRequestStep(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      if (!data.stepUid) {
        return c.json({ error: "Step UID is required" }, 400);
      }
      
      // Update the step
      const updated = await db
        .update(approvalRequest)
        .set({
          stepUid: data.stepUid,
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(approvalRequest.uid, uid),
          isNull(approvalRequest.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Approval request not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- APPROVAL LOGS ---

  // Get logs by approval request
  async getLogsByRequest(c: Context) {
    try {
      const requestUid = c.req.param("requestUid");
      const logData = await db
        .select()
        .from(approvalLog)
        .where(and(
          eq(approvalLog.approvalRequestUid, requestUid),
          isNull(approvalLog.deletedAt)
        ))
        .orderBy(approvalLog.actionDate);
      
      return c.json(logData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new approval log
  async createLog(c: Context) {
    try {
      const data = await c.req.json();
      
      // Prepare the data for the database
      const newLog = NewApprovalLogSchema.parse({
        uid: data.uid || generateUUID(),
        approvalRequestUid: data.approvalRequestUid,
        approvalStepUid: data.approvalStepUid,
        actionByUserUid: data.actionByUserUid,
        actionDate: data.actionDate || formatDate(),
        status: data.status,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(approvalLog).values(newLog).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- APPROVAL COMMENTS ---

  // Get comments by approval request
  async getCommentsByRequest(c: Context) {
    try {
      const requestUid = c.req.param("requestUid");
      const commentData = await db
        .select()
        .from(approvalComment)
        .where(eq(approvalComment.approvalRequestUid, requestUid))
        .orderBy(approvalComment.createdAt);
      
      return c.json(commentData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Add a comment to an approval request
  async createComment(c: Context) {
    try {
      const data = await c.req.json();
      
      if (!data.commentText || !data.commentByUserUid || !data.approvalRequestUid || !data.approvalStepUid) {
        return c.json({ error: "Comment text, user ID, request ID, and step ID are required" }, 400);
      }
      
      // Create the comment
      const newComment = NewApprovalCommentSchema.parse({
        uid: data.uid || generateUUID(),
        approvalRequestUid: data.approvalRequestUid,
        approvalStepUid: data.approvalStepUid,
        commentText: data.commentText,
        commentByUserUid: data.commentByUserUid,
        createdAt: formatDate(),
        createdBy: data.commentByUserUid
      });
      
      const inserted = await db.insert(approvalComment).values(newComment).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  }
}; 