import { z } from '@hono/zod-openapi';
import * as zodSchema from '@workspace/database/zod-schema';
import * as examples from '@workspace/database/examples';
import * as dbEnums from '@workspace/database/enums';
import type { 
  UserType, 
  AddressType, 
  TradeType, 
  SupplierStatus, 
  ApprovalStatus, 
  DocumentStatusEnum as DocumentStatus, 
  TermType, 
  OrgUnitType, 
  ApproverTypeEnum as ApproverType, 
  InvitationStatus 
} from '@workspace/database/types';

// Destructure for easier access
const {
  UuidSchema,
  EmailSchema,
  PhoneSchema,
  NameSchema,
  CodeSchema,
  DescriptionSchema,
  UserTypeSchema,
  AddressTypeSchema,
  TradeTypeSchema,
  SupplierStatusSchema,
  ApprovalStatusSchema,
  DocumentStatusSchema,
  TermTypeSchema,
  OrgUnitTypeSchema,
  ApproverTypeSchema,
  InvitationStatusSchema,
  StandardTermTypeSchema,
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
} = zodSchema;

const { Examples } = examples;

/**
 * Enum Values for OpenAPI Schemas
 * 
 * We're using the enum values directly from the database package.
 * This ensures consistency across the entire application.
 */
const InvitationStatusValues = Object.values(dbEnums.InvitationStatus) as [string, ...string[]];
const SupplierStatusValues = Object.values(dbEnums.SupplierStatus) as [string, ...string[]];
const ApprovalStatusValues = Object.values(dbEnums.ApprovalStatus) as [string, ...string[]];
const UserTypeValues = Object.values(dbEnums.UserType) as [string, ...string[]];
const TermTypeValues = Object.values(dbEnums.TermType) as [string, ...string[]];
const StandardTermTypeValues = Object.values(dbEnums.StandardTermType) as [string, ...string[]];
const AddressTypeValues = Object.values(dbEnums.AddressType) as [string, ...string[]];
const TradeTypeValues = Object.values(dbEnums.TradeType) as [string, ...string[]];
const ApproverTypeValues = Object.values(dbEnums.ApproverType) as [string, ...string[]];
const OrgUnitTypeValues = Object.values(dbEnums.OrgUnitType) as [string, ...string[]];

/**
 * Helper function to add OpenAPI metadata to a Zod schema
 * @param schema The Zod schema to enhance
 * @param example Example value for OpenAPI documentation
 * @param description Optional description for OpenAPI documentation
 * @returns The enhanced schema with OpenAPI metadata
 */
function enhanceWithOpenAPI<T extends z.ZodType>(
  schema: T, 
  example: any, 
  description?: string
): T {
  return schema.openapi({
    example,
    ...(description ? { description } : {})
  }) as T;
}

/**
 * Helper function to create a path parameter schema
 * @param name Parameter name
 * @param example Example value
 * @param description Optional description
 * @returns A Zod object schema with OpenAPI path parameter metadata
 */
function createPathParam(name: string, example: any, description?: string) {
  return z.object({
    [name]: z.string().openapi({
      param: {
        name,
        in: 'path',
      },
      example,
      ...(description ? { description } : {})
    })
  });
}

// Base schemas with OpenAPI specifications
export const UuidParam = createPathParam('uid', Examples.uuid);
export const OrgUidParam = createPathParam('orgUid', Examples.uuid);
export const UserUidParam = createPathParam('userUid', Examples.uuid);
export const SiteUidParam = createPathParam('siteUid', Examples.uuid);
export const TermUidParam = createPathParam('termUid', Examples.uuid);
export const ProcessUidParam = createPathParam('processUid', Examples.uuid);
export const StepUidParam = createPathParam('stepUid', Examples.uuid);
export const RequestUidParam = createPathParam('requestUid', Examples.uuid);
export const SupplierUserUidParam = createPathParam('supplierUserUid', Examples.uuid);

// Entity params for document routes
export const EntityParams = z.object({
  entityType: z.string().openapi({
    param: {
      name: 'entityType',
      in: 'path',
    },
    example: 'SUPPLIER',
    description: 'Type of entity (SUPPLIER, SUPPLIER_SITE, etc.)'
  }),
  entityUid: z.string().openapi({
    param: {
      name: 'entityUid',
      in: 'path',
    },
    example: Examples.uuid,
    description: 'Unique identifier of the entity'
  }),
});

// Enhanced schemas for OpenAPI

// User schemas
export const UserSchema = z.object({
  uid: enhanceWithOpenAPI(UuidSchema, Examples.uuid),
  clerkId: enhanceWithOpenAPI(UuidSchema, Examples.uuid),
  userName: enhanceWithOpenAPI(ClientAppUserSchema.shape.userName, 'john.doe'),
  userType: enhanceWithOpenAPI(ClientAppUserSchema.shape.userType, 'EMPLOYEE', 
    'Type of user (EMPLOYEE, SUPPLIER, SUPPLIER_SITE, ADMIN)'),
  extraData: enhanceWithOpenAPI(z.any().optional(), { roles: ['admin', 'user'] }),
  createdAt: enhanceWithOpenAPI(z.string().datetime(), '2023-01-01T00:00:00Z'),
  updatedAt: enhanceWithOpenAPI(z.string().datetime(), '2023-01-01T00:00:00Z'),
  deletedAt: enhanceWithOpenAPI(z.string().datetime().nullable(), null),
  createdBy: enhanceWithOpenAPI(UuidSchema.nullable(), Examples.uuid),
  lastUpdatedBy: enhanceWithOpenAPI(UuidSchema.nullable(), Examples.uuid)
}).openapi('User');

export const CreateUserSchema = z.object({
  userName: ClientAppUserSchema.shape.userName.openapi({ example: 'john.doe' }),
  userType: ClientAppUserSchema.shape.userType.openapi({ 
    example: 'EMPLOYEE',
    description: 'Type of user (EMPLOYEE, SUPPLIER, SUPPLIER_SITE, ADMIN)'
  }),
  clerkId: UuidSchema.optional().openapi({ example: Examples.uuid }),
  extraData: z.any().optional().openapi({ example: { roles: ['admin', 'user'] } })
}).openapi('CreateUser');

export const UserListSchema = z.array(UserSchema).openapi('UserList');

// Organization schemas
export const OrganizationSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  name: ClientOrganizationSchema.shape.name.openapi({ example: 'ACME Corporation' }),
  maxUserCount: ClientOrganizationSchema.shape.maxUserCount.openapi({ example: 100 }),
  extraData: z.any().optional().openapi({ example: { industry: 'Technology' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Organization');

export const CreateOrganizationSchema = z.object({
  name: ClientOrganizationSchema.shape.name.openapi({ example: 'ACME Corporation' }),
  maxUserCount: ClientOrganizationSchema.shape.maxUserCount.openapi({ example: 100 }),
  extraData: z.any().optional().openapi({ example: { industry: 'Technology' } })
}).openapi('CreateOrganization');

export const OrganizationListSchema = z.array(OrganizationSchema).openapi('OrganizationList');

// Employee schemas
export const EmployeeSchema = z.object({
  userUid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  employeeCode: ClientEmployeeSchema.shape.employeeCode.openapi({ example: 'EMP001' }),
  firstName: ClientEmployeeSchema.shape.firstName.openapi({ example: 'John' }),
  lastName: ClientEmployeeSchema.shape.lastName.openapi({ example: 'Doe' }),
  email: EmailSchema.openapi({ example: 'john.doe@example.com' }),
  phone: PhoneSchema.optional().openapi({ example: '+1234567890' }),
  extraData: z.any().optional().openapi({ example: { department: 'IT' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Employee');

export const CreateEmployeeSchema = z.object({
  userUid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  employeeCode: ClientEmployeeSchema.shape.employeeCode.openapi({ example: 'EMP001' }),
  firstName: ClientEmployeeSchema.shape.firstName.openapi({ example: 'John' }),
  lastName: ClientEmployeeSchema.shape.lastName.openapi({ example: 'Doe' }),
  email: EmailSchema.openapi({ example: 'john.doe@example.com' }),
  phone: PhoneSchema.optional().openapi({ example: '+1234567890' }),
  extraData: z.any().optional().openapi({ example: { department: 'IT' } })
}).openapi('CreateEmployee');

export const EmployeeListSchema = z.array(EmployeeSchema).openapi('EmployeeList');

// Address schemas
export const AddressSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  line1: ClientAddressSchema.shape.line1.openapi({ example: '123 Main St' }),
  line2: ClientAddressSchema.shape.line2.openapi({ example: 'Apt 4B' }),
  line3: ClientAddressSchema.shape.line3.openapi({ example: undefined }),
  line4: ClientAddressSchema.shape.line4.openapi({ example: undefined }),
  city: ClientAddressSchema.shape.city.openapi({ example: 'New York' }),
  state: ClientAddressSchema.shape.state.openapi({ example: 'NY' }),
  country: ClientAddressSchema.shape.country.openapi({ example: 'USA' }),
  pincode: ClientAddressSchema.shape.pincode.openapi({ example: '10001' }),
  addressType: z.enum(AddressTypeValues).openapi({ 
    example: 'BILLING',
    description: 'Type of address (BILLING, SHIPPING, REGISTERED, OPERATIONAL)'
  }),
  extraData: z.any().optional().openapi({ example: { isDefault: true } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Address');

export const CreateAddressSchema = z.object({
  line1: ClientAddressSchema.shape.line1.openapi({ example: '123 Main St' }),
  line2: ClientAddressSchema.shape.line2.openapi({ example: 'Apt 4B' }),
  line3: ClientAddressSchema.shape.line3.openapi({ example: undefined }),
  line4: ClientAddressSchema.shape.line4.openapi({ example: undefined }),
  city: ClientAddressSchema.shape.city.openapi({ example: 'New York' }),
  state: ClientAddressSchema.shape.state.openapi({ example: 'NY' }),
  country: ClientAddressSchema.shape.country.openapi({ example: 'USA' }),
  pincode: ClientAddressSchema.shape.pincode.openapi({ example: '10001' }),
  addressType: z.enum(AddressTypeValues).openapi({ 
    example: 'BILLING',
    description: 'Type of address (BILLING, SHIPPING, REGISTERED, OPERATIONAL)'
  }),
  extraData: z.any().optional().openapi({ example: { isDefault: true } })
}).openapi('CreateAddress');

export const AddressListSchema = z.array(AddressSchema).openapi('AddressList');

// Supplier schemas
export const SupplierSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: ClientSupplierSchema.shape.name.openapi({ example: 'Acme Supplies Inc.' }),
  supplierCode: ClientSupplierSchema.shape.supplierCode.openapi({ example: 'SUP-001' }),
  pan: ClientSupplierSchema.shape.pan.openapi({ example: 'ABCDE1234F' }),
  constitutionOfBusiness: ClientSupplierSchema.shape.constitutionOfBusiness.openapi({ example: 'Private Limited' }),
  tradeType: ClientSupplierSchema.shape.tradeType.openapi({
    example: 'GOODS',
    description: 'Type of trade (GOODS, SERVICES, BOTH)'
  }),
  contactName: ClientSupplierSchema.shape.contactName.openapi({ example: 'John Smith' }),
  contactEmail: EmailSchema.openapi({ example: 'contact@acmesupplies.com' }),
  contactPhone: PhoneSchema.openapi({ example: '+1-555-123-4567' }),
  status: ClientSupplierSchema.shape.status.openapi({
    example: 'PENDING_APPROVAL',
    description: 'Status of the supplier (DRAFT, PENDING_APPROVAL, ACTIVE, INACTIVE, REJECTED)'
  }),
  extraData: z.any().optional().openapi({ example: { rating: 4.5, preferredPaymentTerms: 'NET30' } }),
  address: AddressSchema.openapi({ 
    description: 'Address details for the supplier',
    example: {
      uid: Examples.uuid,
      line1: Examples.addressLine1,
      line2: Examples.addressLine2,
      city: Examples.city,
      state: Examples.state,
      country: Examples.country,
      pincode: Examples.pincode,
      addressType: 'REGISTERED',
      extraData: null,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      deletedAt: null,
      createdBy: Examples.uuid,
      lastUpdatedBy: Examples.uuid
    }
  }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Supplier');

export const CreateSupplierSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: ClientSupplierSchema.shape.name.openapi({ example: 'Acme Supplies Inc.' }),
  pan: ClientSupplierSchema.shape.pan.openapi({ example: 'ABCDE1234F' }),
  constitutionOfBusiness: ClientSupplierSchema.shape.constitutionOfBusiness.openapi({ example: 'Private Limited' }),
  tradeType: ClientSupplierSchema.shape.tradeType.openapi({
    example: 'GOODS',
    description: 'Type of trade (GOODS, SERVICES, BOTH)'
  }),
  contactName: ClientSupplierSchema.shape.contactName.openapi({ example: 'John Smith' }),
  contactEmail: EmailSchema.openapi({ example: 'contact@acmesupplies.com' }),
  contactPhone: PhoneSchema.openapi({ example: '+1-555-123-4567' }),
  status: ClientSupplierSchema.shape.status.openapi({
    example: 'PENDING_APPROVAL',
    description: 'Status of the supplier (DRAFT, PENDING_APPROVAL, ACTIVE, INACTIVE, REJECTED)'
  }),
  extraData: z.any().optional().openapi({ example: { rating: 4.5, preferredPaymentTerms: 'NET30' } }),
  address: z.object({
    line1: z.string().openapi({ example: Examples.addressLine1 }),
    line2: z.string().optional().openapi({ example: Examples.addressLine2 }),
    line3: z.string().optional().openapi({ example: undefined }),
    line4: z.string().optional().openapi({ example: undefined }),
    city: z.string().openapi({ example: Examples.city }),
    state: z.string().openapi({ example: Examples.state }),
    country: z.string().openapi({ example: Examples.country }),
    pincode: z.string().openapi({ example: Examples.pincode }),
    addressType: z.enum(AddressTypeValues).openapi({
      example: 'REGISTERED',
      description: 'Type of address'
    }),
    extraData: z.any().optional().openapi({ example: undefined })
  }).openapi({ description: 'Address details for the supplier' })
}).openapi('CreateSupplier', {
  example: {
    organizationUid: Examples.uuid,
    name: 'Acme Supplies Inc.',
    pan: 'ABCDE1234F',
    constitutionOfBusiness: 'Private Limited',
    tradeType: 'GOODS',
    contactName: 'John Smith',
    contactEmail: 'contact@acmesupplies.com',
    contactPhone: '+1-555-123-4567',
    status: 'PENDING_APPROVAL',
    extraData: { rating: 4.5, preferredPaymentTerms: 'NET30' },
    address: {
      line1: Examples.addressLine1,
      line2: Examples.addressLine2,
      city: Examples.city,
      state: Examples.state,
      country: Examples.country,
      pincode: Examples.pincode,
      addressType: 'REGISTERED'
    }
  }
});

export const SupplierListSchema = z.array(SupplierSchema).openapi('SupplierList');

// Supplier Site schemas
export const SupplierSiteSchema = z.object({
  userUid: UuidSchema.openapi({ example: Examples.uuid }),
  supplierUserUid: UuidSchema.openapi({ example: Examples.uuid }),
  siteName: ClientSupplierSiteSchema.shape.siteName.openapi({ example: 'Main Office' }),
  siteCode: ClientSupplierSiteSchema.shape.siteCode.openapi({ example: 'SITE001' }),
  classification: ClientSupplierSiteSchema.shape.classification.openapi({ example: 'Manufacturing' }),
  businessType: ClientSupplierSiteSchema.shape.businessType.openapi({ example: 'Production' }),
  gstNumber: ClientSupplierSiteSchema.shape.gstNumber.openapi({ example: '29ABCDE1234F1Z5' }),
  fssaiNumber: ClientSupplierSiteSchema.shape.fssaiNumber.openapi({ example: '12345678901234' }),
  msmeNumber: ClientSupplierSiteSchema.shape.msmeNumber.openapi({ example: 'MSME123456' }),
  status: ClientSupplierSiteSchema.shape.status.openapi({
    example: 'PENDING',
    description: 'Status of the supplier site (PENDING, APPROVED, REJECTED, CANCELLED, ESCALATED, DELEGATED)'
  }),
  isActive: ClientSupplierSiteSchema.shape.isActive.openapi({ example: true }),
  extraData: z.any().optional().openapi({ example: { isPrimary: true } }),
  address: AddressSchema.openapi({ 
    description: 'Address details for the supplier site',
    example: {
      uid: Examples.uuid,
      line1: Examples.addressLine1,
      line2: Examples.addressLine2,
      city: Examples.city,
      state: Examples.state,
      country: Examples.country,
      pincode: Examples.pincode,
      addressType: 'OPERATIONAL',
      extraData: null,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      deletedAt: null,
      createdBy: Examples.uuid,
      lastUpdatedBy: Examples.uuid
    }
  }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('SupplierSite');

export const CreateSupplierSiteSchema = z.object({
  supplierUserUid: UuidSchema.openapi({ example: Examples.uuid }),
  siteName: ClientSupplierSiteSchema.shape.siteName.openapi({ example: 'Main Office' }),
  siteCode: ClientSupplierSiteSchema.shape.siteCode.openapi({ example: 'SITE001' }),
  classification: ClientSupplierSiteSchema.shape.classification.openapi({ example: 'Manufacturing' }),
  businessType: ClientSupplierSiteSchema.shape.businessType.openapi({ example: 'Production' }),
  gstNumber: ClientSupplierSiteSchema.shape.gstNumber.openapi({ example: '29ABCDE1234F1Z5' }),
  fssaiNumber: ClientSupplierSiteSchema.shape.fssaiNumber.openapi({ example: '12345678901234' }),
  msmeNumber: ClientSupplierSiteSchema.shape.msmeNumber.openapi({ example: 'MSME123456' }),
  status: ClientSupplierSiteSchema.shape.status.openapi({
    example: 'PENDING',
    description: 'Status of the supplier site (PENDING, APPROVED, REJECTED, CANCELLED, ESCALATED, DELEGATED)'
  }),
  isActive: ClientSupplierSiteSchema.shape.isActive.openapi({ example: true }),
  extraData: z.any().optional().openapi({ example: { isPrimary: true } }),
  address: z.object({
    line1: z.string().openapi({ example: Examples.addressLine1 }),
    line2: z.string().optional().openapi({ example: Examples.addressLine2 }),
    line3: z.string().optional().openapi({ example: undefined }),
    line4: z.string().optional().openapi({ example: undefined }),
    city: z.string().openapi({ example: Examples.city }),
    state: z.string().openapi({ example: Examples.state }),
    country: z.string().openapi({ example: Examples.country }),
    pincode: z.string().openapi({ example: Examples.pincode }),
    addressType: z.enum(AddressTypeValues).openapi({
      example: 'OPERATIONAL',
      description: 'Type of address'
    }),
    extraData: z.any().optional().openapi({ example: undefined })
  }).openapi({ description: 'Address details for the supplier site' })
}).openapi('CreateSupplierSite', {
  example: {
    supplierUserUid: Examples.uuid,
    siteName: 'Main Office',
    siteCode: 'SITE001',
    classification: 'Manufacturing',
    businessType: 'Production',
    gstNumber: '29ABCDE1234F1Z5',
    fssaiNumber: '12345678901234',
    msmeNumber: 'MSME123456',
    status: 'PENDING',
    isActive: true,
    extraData: { isPrimary: true },
    address: {
      line1: Examples.addressLine1,
      line2: Examples.addressLine2,
      city: Examples.city,
      state: Examples.state,
      country: Examples.country,
      pincode: Examples.pincode,
      addressType: 'OPERATIONAL'
    }
  }
});

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
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Sales Department' }),
  orgUnitCode: z.string().min(1).max(50).openapi({ example: 'SALES-001' }),
  unitType: z.enum(OrgUnitTypeValues).openapi({
    example: 'DEPARTMENT',
    description: 'Type of organizational unit'
  }),
  parentUid: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  extraData: z.any().optional().openapi({ example: { level: 2, headCount: 50 } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('OrgUnit');

export const CreateOrgUnitSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Sales Department' }),
  orgUnitCode: z.string().min(1).max(50).openapi({ example: 'SALES-001' }),
  unitType: z.enum(OrgUnitTypeValues).openapi({
    example: 'DEPARTMENT',
    description: 'Type of organizational unit'
  }),
  parentUid: UuidSchema.optional().openapi({ example: Examples.uuid }),
  extraData: z.any().optional().openapi({ example: { level: 2, headCount: 50 } })
}).openapi('CreateOrgUnit');

export const OrgUnitListSchema = z.array(OrgUnitSchema).openapi('OrgUnitList');

// Role schemas
export const RoleSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Procurement Manager' }),
  roleCode: z.string().max(50).nullable().openapi({ example: 'PROC_MGR' }),
  extraData: z.any().optional().openapi({ example: { permissions: ['CREATE_PO', 'APPROVE_PO'] } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Role');

export const CreateRoleSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Procurement Manager' }),
  roleCode: z.string().max(50).optional().openapi({ example: 'PROC_MGR' }),
  extraData: z.any().optional().openapi({ example: { permissions: ['CREATE_PO', 'APPROVE_PO'] } })
}).openapi('CreateRole');

export const RoleListSchema = z.array(RoleSchema).openapi('RoleList');

// Store schemas
export const StoreSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Downtown Store' }),
  storeCode: z.string().min(1).max(50).openapi({ example: 'STORE001' }),
  addressUid: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  extraData: z.any().optional().openapi({ example: { size: 'LARGE' } }),
  createdAt: z.string().datetime().openapi({ example: Examples.datetime }),
  updatedAt: z.string().datetime().openapi({ example: Examples.datetime }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Store');

export const CreateStoreSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Downtown Store' }),
  storeCode: z.string().min(1).max(50).openapi({ example: 'STORE001' }),
  extraData: z.any().optional().openapi({ example: { size: 'LARGE' } }),
  address: z.object({
    line1: z.string().openapi({ example: '123 Main Street' }),
    line2: z.string().optional().openapi({ example: undefined }),
    line3: z.string().optional().openapi({ example: undefined }),
    line4: z.string().optional().openapi({ example: undefined }),
    city: z.string().openapi({ example: 'New York' }),
    state: z.string().openapi({ example: 'NY' }),
    country: z.string().openapi({ example: 'USA' }),
    pincode: z.string().openapi({ example: '10001' }),
    addressType: z.enum(AddressTypeValues).optional().openapi({
      example: 'OPERATIONAL',
      description: 'Type of address'
    }),
    extraData: z.any().optional().openapi({ example: undefined })
  }).openapi({ description: 'Address details for the store' })
}).openapi('CreateStore');

export const StoreListSchema = z.array(StoreSchema).openapi('StoreList');

// Approval process schemas
export const ApprovalProcessSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(200).openapi({ example: 'Supplier Onboarding Approval' }),
  description: z.string().max(500).nullable().openapi({ example: 'Approval process for new suppliers' }),
  entityType: z.string().min(1).max(50).openapi({ example: 'SUPPLIER' }),
  steps: z.array(z.object({
    step: z.number().int().min(1).openapi({ example: 1 }),
    approverType: z.enum(ApproverTypeValues).openapi({ example: 'ROLE' }),
    approverId: UuidSchema.openapi({ example: Examples.uuid }),
    isParallel: z.boolean().openapi({ example: false }),
    isOptional: z.boolean().openapi({ example: false }),
    timeoutHours: z.number().int().positive().nullable().openapi({ example: 48 })
  })).min(1).openapi({
    example: [{
      step: 1,
      approverType: 'ROLE',
      approverId: Examples.uuid,
      isParallel: false,
      isOptional: false,
      timeoutHours: 48
    }]
  }),
  isActive: z.boolean().openapi({ example: true }),
  extraData: z.any().optional().openapi({ example: { autoApprove: false } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('ApprovalProcess');

export const CreateApprovalProcessSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(200).openapi({ example: 'Supplier Onboarding Approval' }),
  description: z.string().max(500).optional().openapi({ example: 'Approval process for new suppliers' }),
  entityType: z.string().min(1).max(50).openapi({ example: 'SUPPLIER' }),
  steps: z.array(z.object({
    step: z.number().int().min(1).openapi({ example: 1 }),
    approverType: z.enum(ApproverTypeValues).openapi({ example: 'ROLE' }),
    approverId: UuidSchema.openapi({ example: Examples.uuid }),
    isParallel: z.boolean().openapi({ example: false }),
    isOptional: z.boolean().openapi({ example: false }),
    timeoutHours: z.number().int().positive().nullable().openapi({ example: 48 })
  })).min(1).openapi({
    example: [{
      step: 1,
      approverType: 'ROLE',
      approverId: Examples.uuid,
      isParallel: false,
      isOptional: false,
      timeoutHours: 48
    }]
  }),
  isActive: z.boolean().openapi({ example: true }),
  extraData: z.any().optional().openapi({ example: { autoApprove: false } })
}).openapi('CreateApprovalProcess');

export const ApprovalListSchema = z.array(ApprovalProcessSchema).openapi('ApprovalList');

// Approval request schemas
export const ApprovalRequestSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  approvalProcessUid: UuidSchema.openapi({ example: Examples.uuid }),
  requestorUid: UuidSchema.openapi({ example: Examples.uuid }),
  entityType: z.string().openapi({ example: 'SUPPLIER' }),
  entityUid: UuidSchema.openapi({ example: Examples.uuid }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the approval request'
  }),
  currentStep: z.number().openapi({ example: 1 }),
  steps: z.array(z.object({
    step: z.number().int().openapi({ example: 1 }),
    approverUid: UuidSchema.openapi({ example: Examples.uuid }),
    approvalStatus: z.enum(ApprovalStatusValues).openapi({
      example: 'PENDING'
    })
  })).openapi({ 
    example: [
      { step: 1, approverUid: Examples.uuid, approvalStatus: 'PENDING' }
    ]
  }),
  extraData: z.any().optional().openapi({ example: { priority: 'HIGH' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('ApprovalRequest');

export const CreateApprovalRequestSchema = ClientApprovalRequestSchema.openapi('CreateApprovalRequest');

export const UpdateRequestStepSchema = z.object({
  stepUid: UuidSchema.openapi({ example: Examples.uuid }),
  currentStep: z.number().int().openapi({ example: 2 }),
}).openapi('UpdateRequestStep');

export const ApprovalRequestListSchema = z.array(ApprovalRequestSchema).openapi('ApprovalRequestList');

// Approval Log schemas
export const ApprovalLogSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  requestUid: UuidSchema.openapi({ example: Examples.uuid }),
  userUid: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  actionType: z.string().openapi({ example: 'APPROVE' }),
  description: z.string().max(500).openapi({ example: 'Request approved by manager' }),
  timestamp: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  extraData: z.any().optional().openapi({ example: { previousStatus: 'PENDING' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' })
}).openapi('ApprovalLog');

export const CreateApprovalLogSchema = z.object({
  requestUid: UuidSchema.openapi({ example: Examples.uuid }),
  userUid: UuidSchema.openapi({ example: Examples.uuid }),
  actionType: z.string().openapi({ example: 'APPROVE' }),
  description: z.string().max(500).openapi({ example: 'Request approved by manager' }),
  extraData: z.any().optional().openapi({ example: { previousStatus: 'PENDING' } })
}).openapi('CreateApprovalLog');

export const ApprovalLogListSchema = z.array(ApprovalLogSchema).openapi('ApprovalLogList');

// Approval Comment schemas
export const ApprovalCommentSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  requestUid: UuidSchema.openapi({ example: Examples.uuid }),
  userUid: UuidSchema.openapi({ example: Examples.uuid }),
  comment: z.string().max(1000).openapi({ example: 'Please review the attached documents' }),
  extraData: z.any().optional().openapi({ example: { important: true } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' })
}).openapi('ApprovalComment');

export const CreateApprovalCommentSchema = z.object({
  requestUid: UuidSchema.openapi({ example: Examples.uuid }),
  userUid: UuidSchema.openapi({ example: Examples.uuid }),
  comment: z.string().max(1000).openapi({ example: 'Please review the attached documents' }),
  extraData: z.any().optional().openapi({ example: { important: true } })
}).openapi('CreateApprovalComment');

export const ApprovalCommentListSchema = z.array(ApprovalCommentSchema).openapi('ApprovalCommentList');

// Document schemas
export const DocumentSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  entityType: z.string().openapi({ example: 'SUPPLIER' }),
  entityUid: UuidSchema.openapi({ example: Examples.uuid }),
  documentType: z.string().openapi({ example: 'TAX_CERTIFICATE' }),
  name: z.string().min(1).max(200).openapi({ example: 'Tax Certificate 2023' }),
  description: z.string().max(500).nullable().openapi({ example: 'Supplier annual tax certificate' }),
  fileUrl: z.string().url().openapi({ example: 'https://storage.example.com/documents/tax-cert-2023.pdf' }),
  fileSize: z.number().int().positive().openapi({ example: 1024567 }),
  mimeType: z.string().min(1).max(100).openapi({ example: 'application/pdf' }),
  expiryDate: z.string().datetime().nullable().openapi({ example: '2024-01-01T00:00:00Z' }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the document (PENDING, APPROVED, REJECTED, CANCELLED, ESCALATED, DELEGATED)'
  }),
  extraData: z.any().optional().openapi({ example: { verified: true } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Document');

export const CreateDocumentSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  entityType: z.string().openapi({ example: 'SUPPLIER' }),
  entityUid: UuidSchema.openapi({ example: Examples.uuid }),
  documentType: z.string().openapi({ example: 'TAX_CERTIFICATE' }),
  name: z.string().min(1).max(200).openapi({ example: 'Tax Certificate 2023' }),
  description: z.string().max(500).optional().openapi({ example: 'Supplier annual tax certificate' }),
  fileUrl: z.string().url().openapi({ example: 'https://storage.example.com/documents/tax-cert-2023.pdf' }),
  fileSize: z.number().int().positive().openapi({ example: 1024567 }),
  mimeType: z.string().min(1).max(100).openapi({ example: 'application/pdf' }),
  expiryDate: z.string().datetime().optional().openapi({ example: '2024-01-01T00:00:00Z' }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the document (PENDING, APPROVED, REJECTED, CANCELLED, ESCALATED, DELEGATED)'
  }),
  extraData: z.any().optional().openapi({ example: { verified: true } })
}).openapi('CreateDocument');

export const DocumentListSchema = z.array(DocumentSchema).openapi('DocumentList');

// Supplier Term schemas
export const SupplierTermSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  supplierUid: UuidSchema.openapi({ example: Examples.uuid }),
  siteUid: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  termType: ClientSupplierSiteTermSchema.shape.termType.openapi({
    example: 'FINANCIAL',
    description: 'Type of supplier term'
  }),
  status: ClientSupplierSiteTermSchema.shape.approvalStatus.openapi({
    example: 'PENDING',
    description: 'Status of the term (PENDING, APPROVED, REJECTED, CANCELLED, ESCALATED, DELEGATED)'
  }),
  effectiveDate: ClientSupplierSiteTermSchema.shape.effectiveDate.openapi({ example: '2023-01-01T00:00:00Z' }),
  expirationDate: ClientSupplierSiteTermSchema.shape.expirationDate.openapi({ example: '2024-01-01T00:00:00Z' }),
  versionNumber: ClientSupplierSiteTermSchema.shape.versionNumber.openapi({ example: 1 }),
  extraData: z.any().optional().openapi({ example: { gracePeriod: 5, lateFee: 2.5 } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('SupplierTerm');

export const CreateFinancialTermSchema = ClientFinancialTermSchema.openapi('CreateFinancialTerm');
export const CreateTradeTermSchema = ClientTradeTermSchema.openapi('CreateTradeTerm');
export const CreateSupportTermSchema = ClientSupportTermSchema.openapi('CreateSupportTerm');
export const CreateSupplierSiteTermSchema = ClientSupplierSiteTermSchema.openapi('CreateSupplierSiteTerm');

export const SupplierTermListSchema = z.array(SupplierTermSchema).openapi('SupplierTermList');

// Supplier Invitation schemas
export const SupplierInvitationSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  invitedByEmployeeUserUid: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  email: EmailSchema.openapi({ example: 'supplier@example.com' }),
  status: z.enum(InvitationStatusValues).openapi({
    example: InvitationStatusValues[0],
    description: 'Status of the invitation (SENT, ACCEPTED, REJECTED, EXPIRED, REVOKED)'
  }),
  expiresAt: z.string().datetime().openapi({ example: '2023-01-08T00:00:00Z' }),
  extraData: z.any().optional().openapi({ example: { message: 'Please join our supplier network' } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('SupplierInvitation');

export const CreateSupplierInvitationSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  invitedByEmployeeUserUid: UuidSchema.openapi({ example: Examples.uuid }),
  email: EmailSchema.openapi({ example: 'supplier@example.com' }),
  status: z.enum(InvitationStatusValues).optional().openapi({
    example: InvitationStatusValues[0],
    description: 'Status of the invitation (SENT, ACCEPTED, REJECTED, EXPIRED, REVOKED)'
  }),
  expiresAt: z.string().datetime().optional().openapi({ example: '2023-01-08T00:00:00Z' }),
  extraData: z.any().optional().openapi({ example: { message: 'Please join our supplier network' } })
}).openapi('CreateSupplierInvitation');

export const SupplierInvitationListSchema = z.array(SupplierInvitationSchema).openapi('SupplierInvitationList');

export const UpdateInvitationStatusSchema = z.object({
  status: z.enum(InvitationStatusValues).openapi({
    example: InvitationStatusValues[1],
    description: 'New status for the invitation'
  }),
  lastUpdatedBy: UuidSchema.optional().openapi({ example: Examples.uuid })
}).openapi('UpdateInvitationStatus');

// Generic success response
export const SuccessResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
}).openapi('SuccessResponse');

// Generic error response
export const ErrorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
}).openapi('ErrorResponse');

// Term schemas
export const TermSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Net 30' }),
  termCode: z.string().min(1).max(50).openapi({ example: 'TERM-001' }),
  termType: z.enum(StandardTermTypeValues).openapi({
    example: 'PAYMENT',
    description: 'Type of term'
  }),
  description: z.string().max(500).nullable().openapi({ example: 'Payment due within 30 days' }),
  validFrom: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  validTo: z.string().datetime().nullable().openapi({ example: '2024-01-01T00:00:00Z' }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the term (PENDING, APPROVED, REJECTED, CANCELLED, EXPIRED)'
  }),
  extraData: z.any().optional().openapi({ example: { gracePeriod: 5, lateFee: 2.5 } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Term');

export const CreateTermSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  name: z.string().min(1).max(100).openapi({ example: 'Net 30' }),
  termCode: z.string().min(1).max(50).openapi({ example: 'TERM-001' }),
  termType: z.enum(StandardTermTypeValues).openapi({
    example: 'PAYMENT',
    description: 'Type of term'
  }),
  description: z.string().max(500).optional().openapi({ example: 'Payment due within 30 days' }),
  validFrom: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  validTo: z.string().datetime().optional().openapi({ example: '2024-01-01T00:00:00Z' }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the term (PENDING, APPROVED, REJECTED, CANCELLED, EXPIRED)'
  }),
  extraData: z.any().optional().openapi({ example: { gracePeriod: 5, lateFee: 2.5 } })
}).openapi('CreateTerm');

export const TermListSchema = z.array(TermSchema).openapi('TermList');

// Approval schemas
export const ApprovalSchema = z.object({
  uid: UuidSchema.openapi({ example: Examples.uuid }),
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  approvalProcessUid: UuidSchema.openapi({ example: Examples.uuid }),
  entityType: z.string().min(1).max(50).openapi({ example: 'SUPPLIER' }),
  entityUid: UuidSchema.openapi({ example: Examples.uuid }),
  step: z.number().int().min(1).openapi({ example: 1 }),
  approverType: z.enum(ApproverTypeValues).openapi({ example: 'ROLE' }),
  approverId: UuidSchema.openapi({ example: Examples.uuid }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the approval'
  }),
  comments: z.string().max(500).nullable().openapi({ example: 'Approved as per policy' }),
  extraData: z.any().optional().openapi({ example: { level: 1, threshold: 10000 } }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
  deletedAt: z.string().datetime().nullable().openapi({ example: null }),
  createdBy: UuidSchema.nullable().openapi({ example: Examples.uuid }),
  lastUpdatedBy: UuidSchema.nullable().openapi({ example: Examples.uuid })
}).openapi('Approval');

export const CreateApprovalSchema = z.object({
  organizationUid: UuidSchema.openapi({ example: Examples.uuid }),
  approvalProcessUid: UuidSchema.openapi({ example: Examples.uuid }),
  entityType: z.string().min(1).max(50).openapi({ example: 'SUPPLIER' }),
  entityUid: UuidSchema.openapi({ example: Examples.uuid }),
  step: z.number().int().min(1).openapi({ example: 1 }),
  approverType: z.enum(ApproverTypeValues).openapi({ example: 'ROLE' }),
  approverId: UuidSchema.openapi({ example: Examples.uuid }),
  status: z.enum(ApprovalStatusValues).openapi({
    example: 'PENDING',
    description: 'Status of the approval'
  }),
  comments: z.string().max(500).optional().openapi({ example: 'Approved as per policy' }),
  extraData: z.any().optional().openapi({ example: { level: 1, threshold: 10000 } })
}).openapi('CreateApproval'); 