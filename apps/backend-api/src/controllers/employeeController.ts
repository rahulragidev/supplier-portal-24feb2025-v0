import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../../../packages/database/database.js";
import { employee } from "@workspace/database/schema";
import { 
  NewEmployeeSchema, 
  ClientEmployeeSchema 
} from "@workspace/database/zod-schema";
import { eq, and, isNull } from "drizzle-orm";
import { handleError } from "../middleware/errorHandler.js";
import { generateUUID, formatDate } from "../utils/helpers.js";

export const employeeController = {
  // Get all employees (non-deleted)
  async getAllEmployees(c: Context) {
    try {
      const allEmployees = await db
        .select()
        .from(employee)
        .where(isNull(employee.deletedAt));
      
      return c.json(allEmployees);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get employees by organization
  async getEmployeesByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("orgUid");
      const employeeData = await db
        .select()
        .from(employee)
        .where(and(
          eq(employee.organizationUid, orgUid),
          isNull(employee.deletedAt)
        ));
      
      return c.json(employeeData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get employee by ID
  async getEmployeeById(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const employeeData = await db
        .select()
        .from(employee)
        .where(and(
          eq(employee.userUid, userUid),
          isNull(employee.deletedAt)
        ));
      
      if (employeeData.length === 0) {
        return c.json({ error: "Employee not found" }, 404);
      }
      
      return c.json(employeeData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new employee
  async createEmployee(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientEmployeeSchema.parse(data);
      
      // Prepare the data for the database
      const newEmployee = NewEmployeeSchema.parse({
        ...validated,
        userUid: data.userUid || generateUUID(),
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(employee).values(newEmployee).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update an employee
  async updateEmployee(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      // Validate the input with client schema
      const validated = ClientEmployeeSchema.partial().parse(data);
      
      // Update with the validated data
      const updated = await db
        .update(employee)
        .set({
          ...validated,
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(employee.userUid, userUid),
          isNull(employee.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Employee not found" }, 404);
      }
      
      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete an employee
  async deleteEmployee(c: Context) {
    try {
      const userUid = c.req.param("userUid");
      const data = await c.req.json();
      
      const updated = await db
        .update(employee)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null
        })
        .where(and(
          eq(employee.userUid, userUid),
          isNull(employee.deletedAt)
        ))
        .returning();
      
      if (updated.length === 0) {
        return c.json({ error: "Employee not found" }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  }
}; 