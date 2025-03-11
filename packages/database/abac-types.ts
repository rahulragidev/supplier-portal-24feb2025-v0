/**
 * Attribute-Based Access Control (ABAC) Types
 * 
 * This file contains TypeScript type definitions for implementing an ABAC system
 * in the supplier management platform.
 */

import type { UUID } from './types.js';
import { z } from 'zod';

// ===================
// ABAC TYPES
// ===================

/**
 * Resource types for access control
 */
export type ResourceType = 
  | 'supplier'
  | 'supplier_site'
  | 'supplier_term'
  | 'approval_request'
  | 'document'
  | 'organization'
  | 'employee'
  | 'role'
  | 'org_unit';

/**
 * Action types for access control
 */
export type ActionType = 
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'transfer'
  | 'verify';

/**
 * Attributes that represent the context of the access control decision
 */
export interface ContextAttributes {
  organizationUid?: UUID;
  timeOfDay?: Date;
  requestIp?: string;
  clientType?: string;
  [key: string]: unknown;
}

/**
 * Attributes of the User (Subject)
 */
export interface SubjectAttributes {
  uid: UUID;
  userType: string;
  roles: string[];
  employeeCode?: string;
  orgUnitUids?: UUID[];
  organizationUid?: UUID;
  extraData?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Generic resource attributes interface
 */
export interface ResourceAttributes {
  uid: UUID;
  organizationUid?: UUID;
  authorId?: UUID;
  status?: string;
  type?: string;
  [key: string]: unknown;
}

/**
 * Permission condition function type
 */
export type PermissionCondition<R extends ResourceAttributes = ResourceAttributes> = (
  subject: SubjectAttributes,
  resource?: R,
  context?: ContextAttributes
) => boolean;

/**
 * Permission definition type
 */
export type Permission<R extends ResourceAttributes = ResourceAttributes> = 
  | boolean
  | PermissionCondition<R>;

/**
 * Permission configuration for a specific role
 */
export interface RolePermissionsConfig<R extends ResourceAttributes = ResourceAttributes> {
  [role: string]: {
    [action in ActionType]?: Permission<R>;
  };
}

/**
 * ABAC policy configuration for a specific resource type
 */
export interface ResourcePolicy<R extends ResourceAttributes = ResourceAttributes> {
  resourceType: ResourceType;
  rolePermissions: RolePermissionsConfig<R>;
}

/**
 * Complete ABAC policy configuration
 */
export interface AbacPolicyConfig {
  [resourceType: string]: ResourcePolicy;
}

/**
 * Zod schema for ABAC policy validation
 */
export const PermissionConditionSchema = z.function()
  .args(
    z.object({ uid: z.string() }).passthrough(),
    z.object({ uid: z.string() }).passthrough().optional(),
    z.object({}).passthrough().optional()
  )
  .returns(z.boolean());

export const PermissionSchema = z.union([
  z.boolean(),
  PermissionConditionSchema
]);

export const RolePermissionsConfigSchema = z.record(
  z.record(PermissionSchema)
);

export const ResourcePolicySchema = z.object({
  resourceType: z.string(),
  rolePermissions: RolePermissionsConfigSchema
});

export const AbacPolicyConfigSchema = z.record(ResourcePolicySchema);

/**
 * Result of an access control check
 */
export interface AccessControlResult {
  granted: boolean;
  reason?: string;
  resource?: ResourceType;
  action?: ActionType;
} 