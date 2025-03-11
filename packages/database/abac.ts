/**
 * Attribute-Based Access Control (ABAC) Index
 * 
 * This file is the main entry point for the ABAC implementation.
 * It exports all the necessary components for using ABAC in the application.
 */

// Export types
export * from './abac-types.js';

// Export service
export { AbacService } from './abac-service.js';

// Export default policies
export { defaultAbacPolicyConfig } from './abac-policies.js';

// Export utilities
export { 
  getSubjectAttributes, 
  getResourceAttributes, 
  createContextAttributes 
} from './abac-utils.js';

// Create and export a singleton instance of the ABAC service with default policies
import { AbacService } from './abac-service.js';
import { defaultAbacPolicyConfig } from './abac-policies.js';

// Create the singleton ABAC service instance
export const abacService = new AbacService(defaultAbacPolicyConfig); 