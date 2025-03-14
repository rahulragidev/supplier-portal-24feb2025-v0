import { employee } from "@workspace/database/schema";
import { appUser } from "@workspace/database/schema";
import { ClientEmployeeSchema, NewEmployeeSchema } from "@workspace/database/zod-schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../../../../packages/database/database.js";
import { handleError } from "../middleware/errorHandler.js";
import { formatDate, generateUUID } from "../utils/helpers.js";

export const employeeController = {
  // Get all employees (non-deleted)
  async getAllEmployees(c: Context) {
    try {
      const allEmployees = await db.select().from(employee).where(isNull(employee.deletedAt));

      return c.json(allEmployees);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get employees by organization
  async getEmployeesByOrganization(c: Context) {
    try {
      const orgUid = c.req.param("uid");
      const employeeData = await db
        .select()
        .from(employee)
        .where(and(eq(employee.organizationUid, orgUid), isNull(employee.deletedAt)));

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
        .where(and(eq(employee.userUid, userUid), isNull(employee.deletedAt)));

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

      // Generate a UUID if not provided
      const userUid = data.userUid || generateUUID();

      // Use transaction to ensure atomic operation
      const inserted = await db.transaction(async (tx) => {
        // Check if user exists in app_user table
        const existingUser = await tx.select().from(appUser).where(eq(appUser.uid, userUid));

        // If user doesn't exist, create one first
        if (existingUser.length === 0) {
          // Create basic app_user first to satisfy foreign key constraint
          await tx.insert(appUser).values({
            uid: userUid,
            clerkId: data.clerkId || generateUUID(), // Generate if not provided
            userName: `${validated.email}`, // Use email as username for now
            userType: "EMPLOYEE", // Since we're creating an employee
            createdAt: formatDate(),
            updatedAt: formatDate(),
            createdBy: data.createdBy || null,
            lastUpdatedBy: data.createdBy || null,
          });
        }

        // Prepare the data for the database with the same userUid
        const newEmployee = NewEmployeeSchema.parse({
          ...validated,
          userUid: userUid,
          createdAt: formatDate(),
          updatedAt: formatDate(),
          createdBy: data.createdBy || null,
          lastUpdatedBy: data.createdBy || null,
        });

        // Insert employee record
        const inserted = await tx.insert(employee).values(newEmployee).returning();
        return inserted[0];
      });

      return c.json(inserted, 201);
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
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(employee.userUid, userUid), isNull(employee.deletedAt)))
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

      const updated = await db
        .update(employee)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: null,
        })
        .where(and(eq(employee.userUid, userUid), isNull(employee.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Employee not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },
};
