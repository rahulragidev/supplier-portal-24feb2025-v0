/**
 * Enum Constants
 * 
 * This file contains constant objects for all enums used in the application.
 * These enums are used in:
 * 1. Database schema (schema.ts) for PostgreSQL enum types
 * 2. Zod validation schemas (zod-schema.ts) for input validation
 * 3. TypeScript types (types.ts) for type checking
 * 
 * The corresponding TypeScript types are defined in types.ts.
 */

export const UserType = {
  EMPLOYEE: 'EMPLOYEE',
  SUPPLIER: 'SUPPLIER',
  SUPPLIER_SITE: 'SUPPLIER_SITE',
  ADMIN: 'ADMIN'
} as const;

export const AddressType = {
  BILLING: 'BILLING',
  SHIPPING: 'SHIPPING',
  REGISTERED: 'REGISTERED',
  OPERATIONAL: 'OPERATIONAL'
} as const;

export const TradeType = {
  GOODS: 'GOODS',
  SERVICES: 'SERVICES',
  BOTH: 'BOTH'
} as const;

export const SupplierStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  REJECTED: 'REJECTED'
} as const;

export const ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  ESCALATED: 'ESCALATED',
  DELEGATED: 'DELEGATED'
} as const;

export const DocumentStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
} as const;

export const TermType = {
  FINANCIAL: 'FINANCIAL',
  TRADE: 'TRADE',
  SUPPORT: 'SUPPORT'
} as const;

export const OrgUnitType = {
  DIVISION: 'DIVISION',
  DEPARTMENT: 'DEPARTMENT',
  TEAM: 'TEAM',
  REGION: 'REGION',
  BUSINESS_UNIT: 'BUSINESS_UNIT',
  SUBSIDIARY: 'SUBSIDIARY'
} as const;

export const ApproverType = {
  USER: 'USER',
  ROLE: 'ROLE'
} as const;

export const InvitationStatus = {
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED'
} as const;

export const StandardTermType = {
  PAYMENT: 'PAYMENT',
  DELIVERY: 'DELIVERY',
  WARRANTY: 'WARRANTY',
  SERVICE_LEVEL: 'SERVICE_LEVEL'
} as const; 