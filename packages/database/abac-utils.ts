/**
 * Attribute-Based Access Control (ABAC) Utilities
 * 
 * This file contains utility functions to support the ABAC implementation.
 */

import { eq, and, isNull } from "drizzle-orm";
import { db } from "./database.js";
import { appUser, employee, employeeOrgUnitRole, role } from "./schema.js";
import type { 
  SubjectAttributes, 
  ResourceAttributes,
  ContextAttributes
} from "./abac-types.js";
import type { AppUser, Employee, Role } from "./types.js";

/**
 * Extract subject attributes from a user
 * @param user The user to extract attributes from
 * @param employeeData Optional employee data if available
 * @param userRoles Optional user roles if available
 * @returns Subject attributes for ABAC decisions
 */
export async function getSubjectAttributes(
  user: AppUser,
  employeeData?: Employee,
  userRoles?: string[]
): Promise<SubjectAttributes> {
  const subjectAttributes: SubjectAttributes = {
    uid: user.uid,
    userType: user.userType,
    roles: [],
    extraData: user.extraData as Record<string, unknown>
  };

  // If extraData contains roles, use them
  if (user.extraData && typeof user.extraData === 'object' && 'roles' in user.extraData) {
    const extraRoles = user.extraData.roles;
    if (Array.isArray(extraRoles)) {
      subjectAttributes.roles = subjectAttributes.roles.concat(extraRoles);
    }
  }

  // If roles were passed in directly, add them
  if (userRoles && Array.isArray(userRoles)) {
    subjectAttributes.roles = subjectAttributes.roles.concat(userRoles);
  }

  // Always add the user type as a role
  if (!subjectAttributes.roles.includes(user.userType)) {
    subjectAttributes.roles.push(user.userType);
  }

  // If the user is an employee, fetch additional employee attributes
  if (user.userType === 'EMPLOYEE') {
    try {
      // Use the provided employee data or fetch it
      const employeeInfo = employeeData || await db.query.employee.findFirst({
        where: and(
          eq(employee.userUid, user.uid),
          isNull(employee.deletedAt)
        )
      });

      if (employeeInfo) {
        // Add employee-specific attributes
        subjectAttributes.employeeCode = employeeInfo.employeeCode;
        subjectAttributes.organizationUid = employeeInfo.organizationUid;

        // Fetch employee's roles from the employeeOrgUnitRole table
        const employeeRoles = await db
          .select({
            roleCode: role.roleCode,
            roleName: role.name,
            orgUnitUid: employeeOrgUnitRole.orgUnitUid
          })
          .from(employeeOrgUnitRole)
          .innerJoin(role, eq(employeeOrgUnitRole.roleUid, role.uid))
          .where(and(
            eq(employeeOrgUnitRole.employeeUserUid, user.uid),
            isNull(employeeOrgUnitRole.deletedAt),
            isNull(role.deletedAt)
          ));

        // Add the org unit UIDs to the subject attributes
        subjectAttributes.orgUnitUids = employeeRoles.map(r => r.orgUnitUid);

        // Add the role codes/names to the subject roles
        const roleNames = employeeRoles.map(r => r.roleName);
        const roleCodes = employeeRoles.filter(r => r.roleCode).map(r => r.roleCode as string);
        
        subjectAttributes.roles = [
          ...subjectAttributes.roles,
          ...roleNames,
          ...roleCodes
        ];
      }
    } catch (error) {
      console.error('Error fetching employee data for ABAC:', error);
    }
  }

  // Ensure roles array has no duplicates
  subjectAttributes.roles = [...new Set(subjectAttributes.roles)];

  return subjectAttributes;
}

/**
 * Extract resource attributes from an object
 * @param resource The resource to extract attributes from
 * @returns Resource attributes for ABAC decisions
 */
export function getResourceAttributes(resource: any): ResourceAttributes {
  if (!resource || typeof resource !== 'object') {
    throw new Error('Resource must be an object');
  }
  
  if (!resource.uid) {
    throw new Error('Resource must have a uid property');
  }

  // Extract base attributes
  const resourceAttributes: ResourceAttributes = {
    uid: resource.uid,
    organizationUid: resource.organizationUid,
    authorId: resource.createdBy || resource.authorId,
    status: resource.status,
  };

  // Add any additional properties from the resource
  for (const [key, value] of Object.entries(resource)) {
    if (!resourceAttributes[key] && 
        value !== undefined && 
        typeof value !== 'object') {
      resourceAttributes[key] = value;
    }
  }

  return resourceAttributes;
}

/**
 * Create a context attributes object with the provided values
 * @param partialContext Partial context attributes
 * @returns Complete context attributes
 */
export function createContextAttributes(
  partialContext?: Partial<ContextAttributes>
): ContextAttributes {
  return {
    timeOfDay: new Date(),
    ...partialContext
  };
} 