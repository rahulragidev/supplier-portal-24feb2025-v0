import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../../../packages/database/database.js";
import { role, employeeOrgUnitRole, appUser } from "@workspace/database/schema";
import { 
  NewRoleSchema,
  NewEmployeeOrgUnitRoleSchema 
} from "@workspace/database/zod-schema";
import { eq, and, isNull } from "drizzle-orm";
import { handleError } from "../middleware/errorHandler.js";
import { generateUUID, formatDate } from "../utils/helpers.js";

export const roleController = {
  // Get all roles (non-deleted)
  async getAllRoles(c: Context) {
    try {
      const allRoles = await db
        .select()
        .from(role)
        .where(isNull(role.deletedAt));
      
      return c.json(allRoles);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get roles by organization
  async getRolesByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const roleData = await db
        .select()
        .from(role)
        .where(and(
          eq(role.organizationUid, orgUid),
          isNull(role.deletedAt)
        ));
      
      return c.json(roleData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get role by ID
  async getRoleById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const roleData = await db
        .select()
        .from(role)
        .where(and(
          eq(role.uid, uid),
          isNull(role.deletedAt)
        ));
      
      if (roleData.length === 0) {
        return c.json({ error: "Role not found" }, 404);
      }
      
      return c.json(roleData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new role
  async createRole(c: Context) {
    try {
      const data = await c.req.json();
      
      // Prepare the data for the database
      const newRole = NewRoleSchema.parse({
        uid: data.uid || generateUUID(),
        organizationUid: data.organizationUid,
        name: data.name,
        roleCode: data.roleCode,
        extraData: data.extraData || {},
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(role).values(newRole).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a role
  async updateRole(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      // Update with the data
      const updated = await db
        .update(role)
        .set({
          name: data.name,
          roleCode: data.roleCode,
          extraData: data.extraData,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(role.uid, uid),
          isNull(role.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Role not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a role
  async deleteRole(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      const updated = await db
        .update(role)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(role.uid, uid),
          isNull(role.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Role not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- EMPLOYEE ROLE ASSIGNMENTS ---

  // Get employee's org unit roles
  async getEmployeeRoles(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const orgUnitRoleData = await db
        .select()
        .from(employeeOrgUnitRole)
        .where(and(
          eq(employeeOrgUnitRole.employeeUserUid, userUid),
          isNull(employeeOrgUnitRole.deletedAt)
        ));
      
      return c.json(orgUnitRoleData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new employee org unit role
  async assignEmployeeRole(c: Context) {
    try {
      const data = await c.req.json();
      
      // Check if user exists in app_user table
      const employeeUserUid = data.employeeUserUid;
      const existingUser = await db
        .select()
        .from(appUser)
        .where(eq(appUser.uid, employeeUserUid));
      
      // If user doesn't exist, return an error
      if (existingUser.length === 0) {
        return c.json({ 
          error: "Employee user does not exist. Please create the employee first." 
        }, 400);
      }
      
      // Prepare the data for the database
      const newOrgUnitRole = NewEmployeeOrgUnitRoleSchema.parse({
        uid: data.uid || generateUUID(),
        employeeUserUid: employeeUserUid,
        orgUnitUid: data.orgUnitUid,
        roleUid: data.roleUid,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(employeeOrgUnitRole).values(newOrgUnitRole).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Delete an employee org unit role
  async removeEmployeeRole(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();
      
      const updated = await db
        .update(employeeOrgUnitRole)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(employeeOrgUnitRole.uid, uid),
          isNull(employeeOrgUnitRole.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Employee org unit role not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  }
}; 