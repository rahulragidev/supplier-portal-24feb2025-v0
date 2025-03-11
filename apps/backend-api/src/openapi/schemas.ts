import { z } from '@hono/zod-openapi';
import {
  UuidSchema,
  EmailSchema,
  PhoneSchema,
  ClientAppUserSchema,
  ClientOrganizationSchema,
  ClientEmployeeSchema,
  ClientAddressSchema,
  ClientSupplierSchema,
  ClientSupplierSiteSchema,
  ClientSupplierSiteTermSchema,
  ClientFinancialTermSchema,
  ClientTradeTermSchema,
  ClientSupportTermSchema,
  ClientApprovalRequestSchema,
} from '@workspace/database/zod-schema';

// Base schemas with OpenAPI specifications
export const UuidParam = z.object({
  uid: z.string().openapi({
    param: {
      name: 'uid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const OrgUidParam = z.object({
  orgUid: z.string().openapi({
    param: {
      name: 'orgUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const UserUidParam = z.object({
  userUid: z.string().openapi({
    param: {
      name: 'userUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const SiteUidParam = z.object({
  siteUid: z.string().openapi({
    param: {
      name: 'siteUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const TermUidParam = z.object({
  termUid: z.string().openapi({
    param: {
      name: 'termUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const ProcessUidParam = z.object({
  processUid: z.string().openapi({
    param: {
      name: 'processUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const StepUidParam = z.object({
  stepUid: z.string().openapi({
    param: {
      name: 'stepUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const RequestUidParam = z.object({
  requestUid: z.string().openapi({
    param: {
      name: 'requestUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export const SupplierUidParam = z.object({
  supplierUid: z.string().openapi({
    param: {
      name: 'supplierUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

// Entity params for document routes
export const EntityParams = z.object({
  entityType: z.string().openapi({
    param: {
      name: 'entityType',
      in: 'path',
    },
    example: 'SUPPLIER',
  }),
  entityUid: z.string().openapi({
    param: {
      name: 'entityUid',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

// Enhanced schemas for OpenAPI

// User schemas
export const UserSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  clerkId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  userName: z.string().openapi({ example: 'john.doe' }),
  userType: z.enum(['EMPLOYEE', 'SUPPLIER', 'SUPPLIER_SITE', 'ADMIN']).openapi({ 
    example: 'EMPLOYEE',
    description: 'Type of user (EMPLOYEE, SUPPLIER, SUPPLIER_SITE, ADMIN)'
  }),
  extraData: z.any().optional().openapi({ example: { roles: ['admin', 'user'] } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('User');

export const CreateUserSchema = ClientAppUserSchema.extend({
  clerkId: z.string().optional().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('CreateUser');

export const UserListSchema = z.array(UserSchema).openapi('UserList');

// Organization schemas
export const OrganizationSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'ACME Corporation' }),
  maxUserCount: z.number().int().openapi({ example: 100 }),
  extraData: z.any().optional().openapi({ example: { industry: 'Technology' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Organization');

export const CreateOrganizationSchema = ClientOrganizationSchema.extend({
}).openapi('CreateOrganization');

export const OrganizationListSchema = z.array(OrganizationSchema).openapi('OrganizationList');

// Employee schemas
export const EmployeeSchema = z.object({
  userUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  employeeCode: z.string().openapi({ example: 'EMP001' }),
  firstName: z.string().openapi({ example: 'John' }),
  lastName: z.string().openapi({ example: 'Doe' }),
  email: z.string().email().openapi({ example: 'john.doe@example.com' }),
  phone: z.string().openapi({ example: '+1234567890' }),
  extraData: z.any().optional().openapi({ example: { department: 'IT' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Employee');

export const CreateEmployeeSchema = ClientEmployeeSchema.openapi('CreateEmployee');

export const EmployeeListSchema = z.array(EmployeeSchema).openapi('EmployeeList');

// Address schemas
export const AddressSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  line1: z.string().openapi({ example: '123 Main St' }),
  line2: z.string().nullable().openapi({ example: 'Apt 4B' }),
  line3: z.string().nullable().openapi({ example: null }),
  line4: z.string().nullable().openapi({ example: null }),
  city: z.string().openapi({ example: 'New York' }),
  state: z.string().openapi({ example: 'NY' }),
  country: z.string().openapi({ example: 'USA' }),
  pincode: z.string().openapi({ example: '10001' }),
  addressType: z.enum(['BILLING', 'SHIPPING', 'REGISTERED', 'OPERATIONAL']).openapi({ 
    example: 'BILLING',
    description: 'Type of address (BILLING, SHIPPING, REGISTERED, OPERATIONAL)'
  }),
  extraData: z.any().optional().openapi({ example: { isDefault: true } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Address');

export const CreateAddressSchema = ClientAddressSchema.openapi('CreateAddress');

export const AddressListSchema = z.array(AddressSchema).openapi('AddressList');

// Supplier schemas
export const SupplierSchema = z.object({
  userUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  supplierCode: z.string().openapi({ example: 'SUP001' }),
  companyName: z.string().openapi({ example: 'Acme Corporation' }),
  contactFirstName: z.string().openapi({ example: 'Jane' }),
  contactLastName: z.string().openapi({ example: 'Smith' }),
  email: z.string().email().openapi({ example: 'jane.smith@acme.com' }),
  phone: z.string().openapi({ example: '+1234567890' }),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).openapi({
    example: 'ACTIVE',
    description: 'Status of the supplier (ACTIVE, PENDING, INACTIVE)'
  }),
  extraData: z.any().optional().openapi({ example: { industryType: 'Manufacturing' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Supplier');

export const CreateSupplierSchema = ClientSupplierSchema.openapi('CreateSupplier');

export const SupplierListSchema = z.array(SupplierSchema).openapi('SupplierList');

// Supplier Site schemas
export const SupplierSiteSchema = z.object({
  userUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  supplierUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  siteName: z.string().openapi({ example: 'Main Office' }),
  siteCode: z.string().openapi({ example: 'SITE001' }),
  contactFirstName: z.string().openapi({ example: 'Robert' }),
  contactLastName: z.string().openapi({ example: 'Johnson' }),
  email: z.string().email().openapi({ example: 'robert.johnson@acme.com' }),
  phone: z.string().openapi({ example: '+1234567890' }),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).openapi({
    example: 'ACTIVE',
    description: 'Status of the supplier site (ACTIVE, PENDING, INACTIVE)'
  }),
  extraData: z.any().optional().openapi({ example: { isPrimary: true } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('SupplierSite');

export const CreateSupplierSiteSchema = ClientSupplierSiteSchema.openapi('CreateSupplierSite');

export const SupplierSiteListSchema = z.array(SupplierSiteSchema).openapi('SupplierSiteList');

// Status update schema
export const StatusUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).openapi({
    example: 'ACTIVE',
    description: 'Status value to set'
  }),
}).openapi('StatusUpdate');

// OrgUnit schemas
export const OrgUnitSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Finance Department' }),
  code: z.string().openapi({ example: 'FIN001' }),
  description: z.string().nullable().openapi({ example: 'Handles financial operations' }),
  parentUid: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  extraData: z.any().optional().openapi({ example: { costCenter: 'CC001' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('OrgUnit');

export const CreateOrgUnitSchema = z.object({
  organizationUid: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Finance Department' }),
  code: z.string().openapi({ example: 'FIN001' }),
  description: z.string().optional().openapi({ example: 'Handles financial operations' }),
  parentUid: z.string().uuid().optional().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  extraData: z.any().optional().openapi({ example: { costCenter: 'CC001' } }),
}).openapi('CreateOrgUnit');

export const OrgUnitListSchema = z.array(OrgUnitSchema).openapi('OrgUnitList');

// Role schemas
export const RoleSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Procurement Manager' }),
  code: z.string().openapi({ example: 'PROC_MGR' }),
  description: z.string().nullable().openapi({ example: 'Manages procurement processes' }),
  permissions: z.array(z.string()).openapi({ example: ['CREATE_PO', 'APPROVE_PO'] }),
  extraData: z.any().optional().openapi({ example: { accessLevel: 3 } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Role');

export const CreateRoleSchema = z.object({
  organizationUid: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Procurement Manager' }),
  code: z.string().openapi({ example: 'PROC_MGR' }),
  description: z.string().optional().openapi({ example: 'Manages procurement processes' }),
  permissions: z.array(z.string()).openapi({ example: ['CREATE_PO', 'APPROVE_PO'] }),
  extraData: z.any().optional().openapi({ example: { accessLevel: 3 } }),
}).openapi('CreateRole');

export const RoleListSchema = z.array(RoleSchema).openapi('RoleList');

// Store schemas
export const StoreSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Downtown Store' }),
  code: z.string().openapi({ example: 'STORE001' }),
  addressUid: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  extraData: z.any().optional().openapi({ example: { size: 'LARGE' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Store');

export const CreateStoreSchema = z.object({
  organizationUid: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Downtown Store' }),
  code: z.string().openapi({ example: 'STORE001' }),
  addressUid: z.string().uuid().optional().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  extraData: z.any().optional().openapi({ example: { size: 'LARGE' } }),
}).openapi('CreateStore');

export const StoreListSchema = z.array(StoreSchema).openapi('StoreList');

// Approval process schemas
export const ApprovalSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Supplier Onboarding Approval' }),
  code: z.string().openapi({ example: 'SUP_ONBOARD' }),
  description: z.string().nullable().openapi({ example: 'Approval process for new suppliers' }),
  steps: z.array(z.any()).openapi({ example: [
    { step: 1, approverRole: 'PROC_MGR', action: 'APPROVE' },
    { step: 2, approverRole: 'FINANCE_DIR', action: 'REVIEW' }
  ] }),
  extraData: z.any().optional().openapi({ example: { priority: 'HIGH' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('ApprovalProcess');

export const CreateApprovalSchema = z.object({
  organizationUid: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  name: z.string().openapi({ example: 'Supplier Onboarding Approval' }),
  code: z.string().openapi({ example: 'SUP_ONBOARD' }),
  description: z.string().optional().openapi({ example: 'Approval process for new suppliers' }),
  steps: z.array(z.any()).openapi({ example: [
    { step: 1, approverRole: 'PROC_MGR', action: 'APPROVE' },
    { step: 2, approverRole: 'FINANCE_DIR', action: 'REVIEW' }
  ] }),
  extraData: z.any().optional().openapi({ example: { priority: 'HIGH' } }),
}).openapi('CreateApprovalProcess');

export const ApprovalListSchema = z.array(ApprovalSchema).openapi('ApprovalProcessList');

// Approval request schemas
export const ApprovalRequestSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  approvalProcessUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  requestorUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  entityType: z.string().openapi({ example: 'SUPPLIER' }),
  entityUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELED']).openapi({
    example: 'PENDING',
    description: 'Status of the approval request'
  }),
  currentStep: z.number().openapi({ example: 1 }),
  steps: z.array(z.any()).openapi({ example: [
    { step: 1, approverUid: '123e4567-e89b-12d3-a456-426614174000', status: 'PENDING' }
  ] }),
  extraData: z.any().optional().openapi({ example: { priority: 'HIGH' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('ApprovalRequest');

export const CreateApprovalRequestSchema = ClientApprovalRequestSchema.openapi('CreateApprovalRequest');

export const ApprovalRequestListSchema = z.array(ApprovalRequestSchema).openapi('ApprovalRequestList');

// Document schemas
export const DocumentSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  entityType: z.string().openapi({ example: 'SUPPLIER' }),
  entityUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  documentType: z.string().openapi({ example: 'TAX_CERTIFICATE' }),
  name: z.string().openapi({ example: 'Tax Certificate 2023' }),
  description: z.string().nullable().openapi({ example: 'Supplier annual tax certificate' }),
  fileUrl: z.string().openapi({ example: 'https://storage.example.com/documents/tax-cert-2023.pdf' }),
  fileSize: z.number().openapi({ example: 1024567 }),
  mimeType: z.string().openapi({ example: 'application/pdf' }),
  expiryDate: z.string().datetime().nullable().openapi({ example: '2024-01-01T00:00:00Z' }),
  status: z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']).openapi({
    example: 'ACTIVE',
    description: 'Status of the document'
  }),
  extraData: z.any().optional().openapi({ example: { verified: true } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('Document');

export const CreateDocumentSchema = z.object({
  organizationUid: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  entityType: z.string().openapi({ example: 'SUPPLIER' }),
  entityUid: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  documentType: z.string().openapi({ example: 'TAX_CERTIFICATE' }),
  name: z.string().openapi({ example: 'Tax Certificate 2023' }),
  description: z.string().optional().openapi({ example: 'Supplier annual tax certificate' }),
  fileUrl: z.string().openapi({ example: 'https://storage.example.com/documents/tax-cert-2023.pdf' }),
  fileSize: z.number().openapi({ example: 1024567 }),
  mimeType: z.string().openapi({ example: 'application/pdf' }),
  expiryDate: z.string().datetime().optional().openapi({ example: '2024-01-01T00:00:00Z' }),
  status: z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']).openapi({
    example: 'ACTIVE',
    description: 'Status of the document'
  }),
  extraData: z.any().optional().openapi({ example: { verified: true } }),
}).openapi('CreateDocument');

export const DocumentListSchema = z.array(DocumentSchema).openapi('DocumentList');

// Supplier Term schemas
export const SupplierTermSchema = z.object({
  uid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  supplierUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  siteUid: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  organizationUid: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  termType: z.enum(['FINANCIAL', 'TRADE', 'SUPPORT']).openapi({
    example: 'FINANCIAL',
    description: 'Type of supplier term'
  }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).openapi({
    example: 'ACTIVE',
    description: 'Status of the term'
  }),
  validFrom: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  validTo: z.string().datetime().nullable().openapi({ example: '2024-01-01T00:00:00Z' }),
  termData: z.any().openapi({ example: { 
    paymentTerms: 'NET30', 
    currency: 'USD',
    creditLimit: 50000
  } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  lastUpdatedBy: z.string().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
}).openapi('SupplierTerm');

export const CreateFinancialTermSchema = ClientFinancialTermSchema.openapi('CreateFinancialTerm');
export const CreateTradeTermSchema = ClientTradeTermSchema.openapi('CreateTradeTerm');
export const CreateSupportTermSchema = ClientSupportTermSchema.openapi('CreateSupportTerm');
export const CreateSupplierSiteTermSchema = ClientSupplierSiteTermSchema.openapi('CreateSupplierSiteTerm');

export const SupplierTermListSchema = z.array(SupplierTermSchema).openapi('SupplierTermList');

// Generic success response
export const SuccessResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
}).openapi('SuccessResponse');

// Generic error response
export const ErrorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
}).openapi('ErrorResponse'); 