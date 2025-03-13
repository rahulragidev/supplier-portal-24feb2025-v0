/**
 * TypeScript declarations for enums.js
 * This provides type safety for the JavaScript enums
 */

// User types
export declare const UserType: {
  readonly EMPLOYEE: "EMPLOYEE";
  readonly SUPPLIER: "SUPPLIER";
  readonly SUPPLIER_SITE: "SUPPLIER_SITE";
  readonly ADMIN: "ADMIN";
};
export type UserType = typeof UserType[keyof typeof UserType];

// Address types
export declare const AddressType: {
  readonly BILLING: "BILLING";
  readonly SHIPPING: "SHIPPING";
  readonly REGISTERED: "REGISTERED";
  readonly OPERATIONAL: "OPERATIONAL";
};
export type AddressType = typeof AddressType[keyof typeof AddressType];

// Trade types
export declare const TradeType: {
  readonly GOODS: "GOODS";
  readonly SERVICES: "SERVICES";
  readonly BOTH: "BOTH";
};
export type TradeType = typeof TradeType[keyof typeof TradeType];

// Supplier status
export declare const SupplierStatus: {
  readonly DRAFT: "DRAFT";
  readonly PENDING_APPROVAL: "PENDING_APPROVAL";
  readonly ACTIVE: "ACTIVE";
  readonly INACTIVE: "INACTIVE";
  readonly REJECTED: "REJECTED";
};
export type SupplierStatus = typeof SupplierStatus[keyof typeof SupplierStatus];

// Generic approval status
export declare const ApprovalStatus: {
  readonly PENDING: "PENDING";
  readonly APPROVED: "APPROVED";
  readonly REJECTED: "REJECTED";
  readonly CANCELLED: "CANCELLED";
  readonly ESCALATED: "ESCALATED";
  readonly DELEGATED: "DELEGATED";
};
export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus];

// Document status
export declare const DocumentStatus: {
  readonly PENDING: "PENDING";
  readonly APPROVED: "APPROVED";
  readonly REJECTED: "REJECTED";
  readonly CANCELLED: "CANCELLED";
  readonly ESCALATED: "ESCALATED";
  readonly DELEGATED: "DELEGATED";
};
export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus];

// Term types
export declare const TermType: {
  readonly FINANCIAL: "FINANCIAL";
  readonly TRADE: "TRADE";
  readonly SUPPORT: "SUPPORT";
};
export type TermType = typeof TermType[keyof typeof TermType];

// Organization unit types
export declare const OrgUnitType: {
  readonly DIVISION: "DIVISION";
  readonly DEPARTMENT: "DEPARTMENT";
  readonly TEAM: "TEAM";
  readonly REGION: "REGION";
  readonly BUSINESS_UNIT: "BUSINESS_UNIT";
  readonly SUBSIDIARY: "SUBSIDIARY";
};
export type OrgUnitType = typeof OrgUnitType[keyof typeof OrgUnitType];

// Approver types
export declare const ApproverType: {
  readonly USER: "USER";
  readonly ROLE: "ROLE";
};
export type ApproverType = typeof ApproverType[keyof typeof ApproverType];

// Invitation status
export declare const InvitationStatus: {
  readonly SENT: "SENT";
  readonly ACCEPTED: "ACCEPTED";
  readonly REJECTED: "REJECTED";
  readonly EXPIRED: "EXPIRED";
  readonly REVOKED: "REVOKED";
};
export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];

// Standard term types
export declare const StandardTermType: {
  readonly PAYMENT: "PAYMENT";
  readonly DELIVERY: "DELIVERY";
  readonly WARRANTY: "WARRANTY";
  readonly SERVICE_LEVEL: "SERVICE_LEVEL";
};
export type StandardTermType = typeof StandardTermType[keyof typeof StandardTermType]; 