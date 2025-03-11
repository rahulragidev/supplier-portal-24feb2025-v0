/**
 * Attribute-Based Access Control (ABAC) Policies
 * 
 * This file contains default ABAC policies for the supplier management platform.
 */

import type {
  AbacPolicyConfig,
  ResourcePolicy,
  ResourceType,
  SubjectAttributes,
  ResourceAttributes,
  ContextAttributes
} from './abac-types.js';

// Specific resource attribute interfaces
interface SupplierAttributes extends ResourceAttributes {
  status?: string;
}

interface SupplierSiteAttributes extends ResourceAttributes {
  supplierUid?: string;
  status?: string;
}

interface ApprovalRequestAttributes extends ResourceAttributes {
  status?: string;
  requestedByUid?: string;
}

interface DocumentAttributes extends ResourceAttributes {
  ownerUid?: string;
  supplierUid?: string;
  supplierSiteUid?: string;
}

// Common conditional permission functions

/**
 * Checks if the subject belongs to the same organization as the resource
 */
const isSameOrganization = (
  subject: SubjectAttributes,
  resource?: ResourceAttributes
): boolean => {
  if (!subject.organizationUid || !resource?.organizationUid) {
    return false;
  }
  return subject.organizationUid === resource.organizationUid;
};

/**
 * Checks if the subject is the owner/author of the resource
 */
const isResourceOwner = (
  subject: SubjectAttributes,
  resource?: ResourceAttributes
): boolean => {
  if (!subject.uid || !resource?.authorId) {
    return false;
  }
  return subject.uid === resource.authorId;
};

/**
 * Checks if the resource's status is among the allowed statuses
 */
const hasAllowedStatus = (
  allowedStatuses: string[]
) => (
  _subject: SubjectAttributes,
  resource?: ResourceAttributes
): boolean => {
  if (!resource?.status) {
    return false;
  }
  return allowedStatuses.includes(resource.status);
};

// Policy definitions

/**
 * Default supplier policy
 */
const supplierPolicy: ResourcePolicy<SupplierAttributes> = {
  resourceType: 'supplier',
  rolePermissions: {
    'ADMIN': {
      'view': true,
      'create': true,
      'update': true,
      'delete': true,
      'approve': true,
      'reject': true,
      'verify': true,
    },
    'SUPPLIER_MANAGER': {
      'view': true,
      'create': true,
      'update': (subject, resource) => {
        // Can update suppliers that belong to their organization
        return isSameOrganization(subject, resource);
      },
      'delete': (subject, resource) => {
        // Can delete suppliers that belong to their organization and are in DRAFT status
        return isSameOrganization(subject, resource) && 
               resource?.status === 'DRAFT';
      },
      'approve': (subject, resource) => {
        // Can approve suppliers that belong to their organization and are in PENDING_APPROVAL status
        return isSameOrganization(subject, resource) && 
               resource?.status === 'PENDING_APPROVAL';
      },
      'reject': (subject, resource) => {
        // Can reject suppliers that belong to their organization and are in PENDING_APPROVAL status
        return isSameOrganization(subject, resource) && 
               resource?.status === 'PENDING_APPROVAL';
      },
      'verify': (subject, resource) => {
        // Can verify suppliers that belong to their organization
        return isSameOrganization(subject, resource);
      },
    },
    'EMPLOYEE': {
      'view': (subject, resource) => {
        // Can view suppliers that belong to their organization
        return isSameOrganization(subject, resource);
      },
      'create': true,
      'update': (subject, resource) => {
        // Can update suppliers that they created and are in DRAFT status
        return isResourceOwner(subject, resource) && 
               resource?.status === 'DRAFT';
      },
      'delete': false,
      'approve': false,
      'reject': false,
      'verify': false,
    },
    'SUPPLIER': {
      'view': (subject, resource) => {
        // Suppliers can only view their own supplier record
        return subject.uid === resource?.uid;
      },
      'update': (subject, resource) => {
        // Suppliers can update their own supplier record if not INACTIVE or REJECTED
        return subject.uid === resource?.uid && 
               !['INACTIVE', 'REJECTED'].includes(resource?.status || '');
      },
      'create': false,
      'delete': false,
      'approve': false,
      'reject': false,
      'verify': false,
    },
  },
};

/**
 * Default supplier site policy
 */
const supplierSitePolicy: ResourcePolicy<SupplierSiteAttributes> = {
  resourceType: 'supplier_site',
  rolePermissions: {
    'ADMIN': {
      'view': true,
      'create': true,
      'update': true,
      'delete': true,
      'approve': true,
      'reject': true,
    },
    'SUPPLIER_MANAGER': {
      'view': (subject, resource) => isSameOrganization(subject, resource),
      'create': true,
      'update': (subject, resource) => isSameOrganization(subject, resource),
      'delete': (subject, resource) => {
        return isSameOrganization(subject, resource) && 
               resource?.status === 'DRAFT';
      },
      'approve': (subject, resource) => {
        return isSameOrganization(subject, resource) && 
               resource?.status === 'PENDING_APPROVAL';
      },
      'reject': (subject, resource) => {
        return isSameOrganization(subject, resource) && 
               resource?.status === 'PENDING_APPROVAL';
      },
    },
    'EMPLOYEE': {
      'view': (subject, resource) => isSameOrganization(subject, resource),
      'create': (subject, resource) => {
        // Can create supplier sites for suppliers in their organization
        return isSameOrganization(subject, resource);
      },
      'update': (subject, resource) => {
        // Can update supplier sites that they created and are in DRAFT status
        return isResourceOwner(subject, resource) && 
               resource?.status === 'DRAFT';
      },
      'delete': false,
      'approve': false,
      'reject': false,
    },
    'SUPPLIER': {
      'view': (subject, resource) => {
        // Suppliers can view their own supplier sites
        return resource?.supplierUid === subject.uid;
      },
      'update': (subject, resource) => {
        // Suppliers can update their own supplier sites if not INACTIVE or REJECTED
        return resource?.supplierUid === subject.uid && 
               !['INACTIVE', 'REJECTED'].includes(resource?.status || '');
      },
      'create': (subject, resource) => {
        // Suppliers can create sites for themselves
        return resource?.supplierUid === subject.uid;
      },
      'delete': false,
      'approve': false,
      'reject': false,
    },
    'SUPPLIER_SITE': {
      'view': (subject, resource) => {
        // Supplier site users can only view their own site
        return subject.uid === resource?.uid;
      },
      'update': (subject, resource) => {
        // Supplier site users can update their own site if not INACTIVE or REJECTED
        return subject.uid === resource?.uid && 
               !['INACTIVE', 'REJECTED'].includes(resource?.status || '');
      },
      'create': false,
      'delete': false,
      'approve': false,
      'reject': false,
    },
  },
};

/**
 * Default approval request policy
 */
const approvalRequestPolicy: ResourcePolicy<ApprovalRequestAttributes> = {
  resourceType: 'approval_request',
  rolePermissions: {
    'ADMIN': {
      'view': true,
      'create': true,
      'update': true,
      'delete': true,
      'approve': true,
      'reject': true,
    },
    'APPROVER': {
      'view': (subject, resource) => {
        // Approvers can view approval requests in their organization
        return isSameOrganization(subject, resource);
      },
      'approve': (subject, resource) => {
        // Logic for checking if the subject is assigned as an approver would be implemented here
        // For now, just check if the request is in PENDING status and in same organization
        return isSameOrganization(subject, resource) && 
               resource?.status === 'PENDING';
      },
      'reject': (subject, resource) => {
        // Similar to approve logic
        return isSameOrganization(subject, resource) && 
               resource?.status === 'PENDING';
      },
      'create': false,
      'update': false,
      'delete': false,
    },
    'EMPLOYEE': {
      'view': (subject, resource) => {
        // Employees can view approval requests they created
        return isResourceOwner(subject, resource) || 
               subject.uid === resource?.requestedByUid;
      },
      'create': true,
      'update': (subject, resource) => {
        // Can update approval requests they created that are still in PENDING status
        return (isResourceOwner(subject, resource) || 
                subject.uid === resource?.requestedByUid) && 
               resource?.status === 'PENDING';
      },
      'delete': false,
      'approve': false,
      'reject': false,
    },
    'SUPPLIER': {
      'view': (subject, resource) => {
        // Suppliers can view approval requests related to them
        // This would need more complex logic to check the relation
        return subject.uid === resource?.requestedByUid;
      },
      'create': true,
      'update': (subject, resource) => {
        // Can update approval requests they created that are still in PENDING status
        return subject.uid === resource?.requestedByUid && 
               resource?.status === 'PENDING';
      },
      'delete': false,
      'approve': false,
      'reject': false,
    },
  },
};

/**
 * Default document policy
 */
const documentPolicy: ResourcePolicy<DocumentAttributes> = {
  resourceType: 'document',
  rolePermissions: {
    'ADMIN': {
      'view': true,
      'create': true,
      'update': true,
      'delete': true,
      'verify': true,
    },
    'DOCUMENT_VERIFIER': {
      'view': (subject, resource) => isSameOrganization(subject, resource),
      'verify': (subject, resource) => isSameOrganization(subject, resource),
      'create': false,
      'update': false,
      'delete': false,
    },
    'EMPLOYEE': {
      'view': (subject, resource) => isSameOrganization(subject, resource),
      'create': true,
      'update': (subject, resource) => isResourceOwner(subject, resource),
      'delete': (subject, resource) => isResourceOwner(subject, resource),
      'verify': false,
    },
    'SUPPLIER': {
      'view': (subject, resource) => {
        // Suppliers can view documents they own or that are related to them
        return isResourceOwner(subject, resource) || 
               subject.uid === resource?.supplierUid;
      },
      'create': true,
      'update': (subject, resource) => {
        // Can update documents they own
        return isResourceOwner(subject, resource) || 
               subject.uid === resource?.supplierUid;
      },
      'delete': (subject, resource) => {
        // Can delete documents they own
        return isResourceOwner(subject, resource) || 
               subject.uid === resource?.supplierUid;
      },
      'verify': false,
    },
    'SUPPLIER_SITE': {
      'view': (subject, resource) => {
        // Supplier site users can view documents related to their site
        return subject.uid === resource?.supplierSiteUid;
      },
      'create': true,
      'update': (subject, resource) => {
        // Can update documents related to their site
        return subject.uid === resource?.supplierSiteUid;
      },
      'delete': (subject, resource) => {
        // Can delete documents related to their site
        return subject.uid === resource?.supplierSiteUid;
      },
      'verify': false,
    },
  },
};

/**
 * Default organization policy
 */
const organizationPolicy: ResourcePolicy = {
  resourceType: 'organization',
  rolePermissions: {
    'ADMIN': {
      'view': true,
      'create': true,
      'update': true,
      'delete': true,
    },
    'ORGANIZATION_ADMIN': {
      'view': (subject, resource) => {
        // Organization admins can view their own organization
        return subject.organizationUid === resource?.uid;
      },
      'update': (subject, resource) => {
        // Organization admins can update their own organization
        return subject.organizationUid === resource?.uid;
      },
      'create': false,
      'delete': false,
    },
    'EMPLOYEE': {
      'view': (subject, resource) => {
        // Employees can view their own organization
        return subject.organizationUid === resource?.uid;
      },
      'create': false,
      'update': false,
      'delete': false,
    },
  },
};

/**
 * Export the complete ABAC policy configuration
 */
export const defaultAbacPolicyConfig: AbacPolicyConfig = {
  'supplier': supplierPolicy,
  'supplier_site': supplierSitePolicy,
  'approval_request': approvalRequestPolicy,
  'document': documentPolicy,
  'organization': organizationPolicy,
  // Additional policies can be added here
}; 