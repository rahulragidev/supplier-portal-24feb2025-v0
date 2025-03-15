import type { Context } from "hono";

import { appUser, employeeOrgUnitRole, role } from "@workspace/database/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../../../../packages/database/index.js";

/**
 * Checks if the user has the specified permission.
 */
async function hasPermission(userId: string, requiredPermission: string): Promise<boolean> {
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
 */
export function requirePermission(requiredPermission: string) {
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
