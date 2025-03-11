/**
 * Attribute-Based Access Control (ABAC) Service
 * 
 * This file contains the core ABAC service implementation for permission checks
 * in the supplier management platform.
 */

import type {
  ActionType,
  ResourceType,
  SubjectAttributes,
  ResourceAttributes,
  ContextAttributes,
  Permission,
  AccessControlResult,
  AbacPolicyConfig
} from './abac-types.js';

/**
 * ABAC Service class for handling access control decisions
 */
export class AbacService {
  private policyConfig: AbacPolicyConfig;

  /**
   * Create an ABAC service instance with the specified policy configuration
   * @param policyConfig The policy configuration for the service
   */
  constructor(policyConfig: AbacPolicyConfig) {
    this.policyConfig = policyConfig;
  }

  /**
   * Check if a subject has permission to perform an action on a resource
   * 
   * @param subject The subject (user) attributes
   * @param action The action being performed
   * @param resourceType The type of resource being accessed
   * @param resource Optional resource attributes
   * @param context Optional context attributes
   * @returns AccessControlResult with the decision and reasoning
   */
  public checkPermission(
    subject: SubjectAttributes,
    action: ActionType,
    resourceType: ResourceType,
    resource?: ResourceAttributes,
    context?: ContextAttributes
  ): AccessControlResult {
    // If no roles are provided, deny access
    if (!subject.roles || subject.roles.length === 0) {
      return {
        granted: false,
        reason: 'Subject has no roles assigned',
        resource: resourceType,
        action
      };
    }

    // Get the resource policy
    const resourcePolicy = this.policyConfig[resourceType];
    if (!resourcePolicy) {
      return {
        granted: false,
        reason: `No policy defined for resource type: ${resourceType}`,
        resource: resourceType,
        action
      };
    }

    // Check permissions for each role the user has
    for (const role of subject.roles) {
      const rolePermissions = resourcePolicy.rolePermissions[role];
      if (!rolePermissions) {
        continue; // Role has no permissions for this resource
      }

      const permission = rolePermissions[action];
      if (permission === undefined) {
        continue; // Role has no permission for this action
      }

      // If permission is a boolean, use that directly
      if (typeof permission === 'boolean') {
        if (permission === true) {
          return {
            granted: true,
            reason: `Role "${role}" has unconditional permission for ${action} on ${resourceType}`,
            resource: resourceType,
            action
          };
        }
        // If false, continue to check other roles
        continue;
      } 
      // If permission is a function, evaluate it
      else if (typeof permission === 'function') {
        try {
          const permissionGranted = permission(subject, resource, context);
          if (permissionGranted) {
            return {
              granted: true,
              reason: `Role "${role}" has conditional permission for ${action} on ${resourceType}`,
              resource: resourceType,
              action
            };
          }
          // If not granted, continue to check other roles
        } catch (error) {
          console.error(`Error evaluating permission for role "${role}":`, error);
          // On error, continue to check other roles
        }
      }
    }

    // If no roles granted permission, deny access
    return {
      granted: false,
      reason: `None of the subject's roles (${subject.roles.join(', ')}) grant ${action} permission on ${resourceType}`,
      resource: resourceType,
      action
    };
  }

  /**
   * Update the policy configuration used by this service
   * @param policyConfig New policy configuration
   */
  public updatePolicyConfig(policyConfig: AbacPolicyConfig): void {
    this.policyConfig = policyConfig;
  }

  /**
   * Get the current policy configuration
   * @returns The current policy configuration
   */
  public getPolicyConfig(): AbacPolicyConfig {
    return this.policyConfig;
  }
} 