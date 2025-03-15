import type { Context } from "hono";

import { appUser, employeeOrgUnitRole, role } from "@workspace/database/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../../../../packages/database/database.js";

/**
 * Union type of all valid permission strings in the system.
 * This provides type safety, autocomplete, and prevents typos.
 */
export type Permission =
  // Users
  | "users:list"
  | "users:get-by-id"
  | "users:create"
  | "users:update"
  | "users:delete"

  // Organizations
  | "organizations:list"
  | "organizations:get-by-id"
  | "organizations:create"
  | "organizations:update"
  | "organizations:delete"

  // Employees
  | "employees:list"
  | "employees:get-by-id"
  | "employees:create"
  | "employees:update"
  | "employees:delete"
  | "employees:get-by-organization"

  // Roles
  | "roles:list"
  | "roles:get-by-id"
  | "roles:create"
  | "roles:update"
  | "roles:delete"
  | "roles:get-by-organization"

  // Employee Roles
  | "employee-roles:list"
  | "employee-roles:assign"
  | "employee-roles:remove"

  // Org Units
  | "org-units:list"
  | "org-units:get-by-id"
  | "org-units:create"
  | "org-units:update"
  | "org-units:delete"
  | "org-units:get-by-organization"

  // Stores
  | "stores:list"
  | "stores:get-by-id"
  | "stores:create"
  | "stores:update"
  | "stores:delete"
  | "stores:get-by-organization"

  // Suppliers
  | "suppliers:list"
  | "suppliers:get-by-id"
  | "suppliers:create"
  | "suppliers:update"
  | "suppliers:update-status"
  | "suppliers:delete"
  | "suppliers:get-by-organization"

  // Supplier Sites
  | "supplier-sites:list"
  | "supplier-sites:get-by-id"
  | "supplier-sites:create"
  | "supplier-sites:update"
  | "supplier-sites:update-status"
  | "supplier-sites:delete"
  | "supplier-sites:get-by-supplier"

  // Supplier Invitations
  | "supplier-invitations:list"
  | "supplier-invitations:get-by-organization"
  | "supplier-invitations:create"
  | "supplier-invitations:update-status"

  // Addresses
  | "addresses:list"
  | "addresses:get-by-id"
  | "addresses:create"
  | "addresses:update"
  | "addresses:delete"

  // Documents
  | "documents:get-by-id"
  | "documents:create"
  | "documents:update-status"
  | "documents:delete"
  | "documents:get-by-site"

  // Document Verifications
  | "document-verifications:list"
  | "document-verifications:get-by-supplier"
  | "document-verifications:create"
  | "document-verifications:update-status"

  // Terms
  | "terms:list"
  | "terms:get-by-id"
  | "terms:create"
  | "terms:update"
  | "terms:delete"
  | "terms:get-by-site"

  // Financial Terms
  | "financial-terms:get-by-term"
  | "financial-terms:create"
  | "financial-terms:update"

  // Trade Terms
  | "trade-terms:get-by-term"
  | "trade-terms:create"
  | "trade-terms:update"

  // Support Terms
  | "support-terms:get-by-term"
  | "support-terms:create"
  | "support-terms:update"

  // Term Notes
  | "term-notes:get-by-term"
  | "term-notes:create"
  | "term-notes:delete"

  // Approval Processes
  | "approval-processes:list"
  | "approval-processes:get-by-id"
  | "approval-processes:create"
  | "approval-processes:update"
  | "approval-processes:delete"
  | "approval-processes:get-by-organization"

  // Approval Steps
  | "approval-steps:get-by-id"
  | "approval-steps:create"
  | "approval-steps:update"
  | "approval-steps:delete"
  | "approval-steps:get-by-process"

  // Approval Responsibilities
  | "approval-responsibilities:create"
  | "approval-responsibilities:update"
  | "approval-responsibilities:delete"
  | "approval-responsibilities:get-by-step"

  // Approval Requests
  | "approval-requests:list"
  | "approval-requests:get-by-id"
  | "approval-requests:create"
  | "approval-requests:update-status"
  | "approval-requests:update-step"
  | "approval-requests:get-by-supplier"

  // Approval Logs
  | "approval-logs:get-by-request"
  | "approval-logs:create"

  // Approval Comments
  | "approval-comments:get-by-request"
  | "approval-comments:create";

/**
 * Checks if the user has the specified permission.
 */
async function hasPermission(userId: string, requiredPermission: Permission): Promise<boolean> {
  // 1. Get the user's direct permissions.
  const userRecord = await db
    .select({ permissions: appUser.permissions })
    .from(appUser)
    .where(eq(appUser.uid, userId))
    .limit(1);

  console.log("userRecord", userRecord);

  const userPermissions: string[] = userRecord[0]?.permissions || [];

  // 2. Get all roles assigned to the user.
  const userRoles = await db
    .select({ roleUid: employeeOrgUnitRole.roleUid })
    .from(employeeOrgUnitRole)
    .where(
      and(eq(employeeOrgUnitRole.employeeUserUid, userId), isNull(employeeOrgUnitRole.deletedAt))
    );

  const roleIds = userRoles.map((r) => r.roleUid);

  // 3. Get permissions from those roles.
  let rolePermissions: string[] = [];
  if (roleIds.length > 0) {
    const rolesRecords = await db
      .select({ permissions: role.permissions })
      .from(role)
      .where(and(inArray(role.uid, roleIds), isNull(role.deletedAt)));
    rolePermissions = rolesRecords.flatMap((r) => r.permissions || []);
  }

  // 4. Combine user and role permissions.
  const allPermissions = [...userPermissions, ...rolePermissions];
  return allPermissions.includes(requiredPermission);
}

/**
 * Middleware factory that returns a middleware function to check for the required permission.
 * This is now type-safe and will provide autocomplete and type checking.
 */
export function requirePermission(requiredPermission: Permission) {
  return async (c: Context, next: () => Promise<void>) => {
    // Get the userId from the context (set by authenticateToken middleware)
    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    // Check if the user has the required permission.
    const permitted = await hasPermission(userId, requiredPermission);
    if (!permitted) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }
    await next();
  };
}
