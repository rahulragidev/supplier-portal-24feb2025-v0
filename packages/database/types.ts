/**
 * Type definitions for the supplier management system
 *
 * This file contains TypeScript types derived from the database schema
 * and Zod validation schemas for use throughout the application.
 *
 * Types are organized into categories:
 * 1. Utility Types: Basic types like UUID, TimeStamp, etc.
 * 2. Database Model Types: Types derived from database tables
 * 3. Zod Schema Types: Types derived from Zod validation schemas
 * 4. Enum Types: Types for enum values, both as string literals and derived from enum objects
 * 5. Relation Types: Types for entities with their relations included
 *
 * Related files:
 * - schema.ts: Source of truth for database schema
 * - enums.ts: Source of truth for enum constants
 * - zod-schema.ts: Zod validation schemas
 */

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import type { z } from "zod";
import type * as enums from "./enums.js";
import type * as schema from "./schema.js";
import type * as zodSchema from "./zod-schema.js";

// ===================
// HELPER TYPES
// ===================

// Get table names only (exclude relations and other non-table exports)
type SchemaTableNames = {
  [TableOrRelationName in keyof typeof schema]: (typeof schema)[TableOrRelationName] extends PgTableWithColumns<any>
    ? TableOrRelationName
    : never;
}[keyof typeof schema];

// Type map for SELECT queries
type DBSelectTypeMap = {
  [TableName in SchemaTableNames]: InferSelectModel<(typeof schema)[TableName]>;
};

// Type map for INSERT operations
type DBInsertTypeMap = {
  [TableName in SchemaTableNames]: InferInsertModel<(typeof schema)[TableName]>;
};

/**
 * Get the SELECT type for a table by its name in the schema
 *
 * Example:
 * ```
 * type User = Doc<'users'>;
 * ```
 */
export type Doc<TableName extends SchemaTableNames> = DBSelectTypeMap[TableName];

/**
 * Get the INSERT type for a table by its name in the schema
 *
 * Example:
 * ```
 * type NewUser = NewDoc<'users'>;
 * ```
 */
export type NewDoc<TableName extends SchemaTableNames> = DBInsertTypeMap[TableName];

// ===================
// UTILITY TYPES
// ===================

export type UUID = string;
export type TimeStamp = Date;
export type Json = Record<string, unknown>;

// ===================
// DATABASE MODEL TYPES
// ===================

// Core tables
export type AppUser = InferSelectModel<typeof schema.appUser>;
export type NewAppUser = InferInsertModel<typeof schema.appUser>;

export type Organization = InferSelectModel<typeof schema.organization>;
export type NewOrganization = InferInsertModel<typeof schema.organization>;

export type Employee = InferSelectModel<typeof schema.employee>;
export type NewEmployee = InferInsertModel<typeof schema.employee>;

export type Address = InferSelectModel<typeof schema.address>;
export type NewAddress = InferInsertModel<typeof schema.address>;

export type OrgUnit = InferSelectModel<typeof schema.orgUnit>;
export type NewOrgUnit = InferInsertModel<typeof schema.orgUnit>;

export type Role = InferSelectModel<typeof schema.role>;
export type NewRole = InferInsertModel<typeof schema.role>;

export type EmployeeOrgUnitRole = InferSelectModel<typeof schema.employeeOrgUnitRole>;
export type NewEmployeeOrgUnitRole = InferInsertModel<typeof schema.employeeOrgUnitRole>;

export type Store = InferSelectModel<typeof schema.store>;
export type NewStore = InferInsertModel<typeof schema.store>;

// Supplier tables
export type Supplier = InferSelectModel<typeof schema.supplier>;
export type NewSupplier = InferInsertModel<typeof schema.supplier>;

export type SupplierInvitation = InferSelectModel<typeof schema.supplierInvitation>;
export type NewSupplierInvitation = InferInsertModel<typeof schema.supplierInvitation>;

export type SupplierSite = InferSelectModel<typeof schema.supplierSite>;
export type NewSupplierSite = InferInsertModel<typeof schema.supplierSite>;

export type SupplierSiteDocument = InferSelectModel<typeof schema.supplierSiteDocument>;
export type NewSupplierSiteDocument = InferInsertModel<typeof schema.supplierSiteDocument>;

export type DocumentVerification = InferSelectModel<typeof schema.documentVerification>;
export type NewDocumentVerification = InferInsertModel<typeof schema.documentVerification>;

// Payment & Terms tables
export type SupplierSiteTerm = InferSelectModel<typeof schema.supplierSiteTerm>;
export type NewSupplierSiteTerm = InferInsertModel<typeof schema.supplierSiteTerm>;

export type SupplierFinancialTerm = InferSelectModel<typeof schema.supplierFinancialTerm>;
export type NewSupplierFinancialTerm = InferInsertModel<typeof schema.supplierFinancialTerm>;

export type SupplierTradeTerm = InferSelectModel<typeof schema.supplierTradeTerm>;
export type NewSupplierTradeTerm = InferInsertModel<typeof schema.supplierTradeTerm>;

export type SupplierSupportTerm = InferSelectModel<typeof schema.supplierSupportTerm>;
export type NewSupplierSupportTerm = InferInsertModel<typeof schema.supplierSupportTerm>;

export type SupplierTermNote = InferSelectModel<typeof schema.supplierTermNote>;
export type NewSupplierTermNote = InferInsertModel<typeof schema.supplierTermNote>;

// Approval Workflow tables
export type ApprovalProcess = InferSelectModel<typeof schema.approvalProcess>;
export type NewApprovalProcess = InferInsertModel<typeof schema.approvalProcess>;

export type ApprovalStep = InferSelectModel<typeof schema.approvalStep>;
export type NewApprovalStep = InferInsertModel<typeof schema.approvalStep>;

export type ApprovalResponsibility = InferSelectModel<typeof schema.approvalResponsibility>;
export type NewApprovalResponsibility = InferInsertModel<typeof schema.approvalResponsibility>;

export type ApprovalRequest = InferSelectModel<typeof schema.approvalRequest>;
export type NewApprovalRequest = InferInsertModel<typeof schema.approvalRequest>;

export type ApprovalLog = InferSelectModel<typeof schema.approvalLog>;
export type NewApprovalLog = InferInsertModel<typeof schema.approvalLog>;

export type ApprovalComment = InferSelectModel<typeof schema.approvalComment>;
export type NewApprovalComment = InferInsertModel<typeof schema.approvalComment>;

// ===================
// ZOD SCHEMA TYPES (CLIENT-SIDE)
// ===================

export type ClientAppUserInput = z.infer<typeof zodSchema.ClientAppUserSchema>;
export type ClientOrganizationInput = z.infer<typeof zodSchema.ClientOrganizationSchema>;
export type ClientEmployeeInput = z.infer<typeof zodSchema.ClientEmployeeSchema>;
export type ClientAddressInput = z.infer<typeof zodSchema.ClientAddressSchema>;
export type ClientSupplierInput = z.infer<typeof zodSchema.ClientSupplierSchema>;
export type ClientSupplierSiteInput = z.infer<typeof zodSchema.ClientSupplierSiteSchema>;
export type ClientSupplierSiteTermInput = z.infer<typeof zodSchema.ClientSupplierSiteTermSchema>;
export type ClientFinancialTermInput = z.infer<typeof zodSchema.ClientFinancialTermSchema>;
export type ClientTradeTermInput = z.infer<typeof zodSchema.ClientTradeTermSchema>;
export type ClientSupportTermInput = z.infer<typeof zodSchema.ClientSupportTermSchema>;
export type ClientApprovalRequestInput = z.infer<typeof zodSchema.ClientApprovalRequestSchema>;

// ===================
// ENUM TYPES
// ===================

//// String literal union types
//export type UserType = "EMPLOYEE" | "SUPPLIER" | "SUPPLIER_SITE" | "ADMIN";
//export type AddressType = "BILLING" | "SHIPPING" | "REGISTERED" | "OPERATIONAL";
//export type TradeType = "GOODS" | "SERVICES" | "BOTH";
//export type SupplierStatus = "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "INACTIVE" | "REJECTED";
//export type ApprovalStatus =
//  | "PENDING"
//  | "APPROVED"
//  | "REJECTED"
//  | "CANCELLED"
//  | "ESCALATED"
//  | "DELEGATED";
//export type InvitationStatus = "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED";
//export type DocumentType =
//  | "PAN"
//  | "GST"
//  | "MSME"
//  | "FSSAI"
//  | "CANCELLED_CHEQUE"
//  | "COMPANY_PROFILE"
//  | "TAX_CERTIFICATE"
//  | "INSURANCE_CERTIFICATE"
//  | "TRADE_LICENSE"
//  | "OTHER";
//export type OrgUnitType =
//  | "DIVISION"
//  | "DEPARTMENT"
//  | "TEAM"
//  | "REGION"
//  | "BUSINESS_UNIT"
//  | "SUBSIDIARY";
//export type VerificationStatus =
//  | "PENDING"
//  | "VERIFIED"
//  | "REJECTED"
//  | "EXPIRED"
//  | "REQUIRES_UPDATE";
//export type TermType = "FINANCIAL" | "TRADE" | "SUPPORT";

// Types derived from enum objects
export type UserTypeEnum = (typeof enums.UserType)[keyof typeof enums.UserType];
export type AddressTypeEnum = (typeof enums.AddressType)[keyof typeof enums.AddressType];
export type TradeTypeEnum = (typeof enums.TradeType)[keyof typeof enums.TradeType];
export type SupplierStatusEnum = (typeof enums.SupplierStatus)[keyof typeof enums.SupplierStatus];
export type ApprovalStatusEnum = (typeof enums.ApprovalStatus)[keyof typeof enums.ApprovalStatus];
export type DocumentStatusEnum = (typeof enums.DocumentStatus)[keyof typeof enums.DocumentStatus];
export type TermTypeEnum = (typeof enums.TermType)[keyof typeof enums.TermType];
export type OrgUnitTypeEnum = (typeof enums.OrgUnitType)[keyof typeof enums.OrgUnitType];
export type ApproverTypeEnum = (typeof enums.ApproverType)[keyof typeof enums.ApproverType];
export type InvitationStatusEnum =
  (typeof enums.InvitationStatus)[keyof typeof enums.InvitationStatus];
export type StandardTermTypeEnum =
  (typeof enums.StandardTermType)[keyof typeof enums.StandardTermType];

// ===================
// RELATION TYPES
// ===================

// These are helper types for working with relations

export interface AppUserWithRelations extends AppUser {
  employee?: Employee;
  supplier?: Supplier;
  supplierSite?: SupplierSite;
  comments?: ApprovalComment[];
  approvalLogs?: ApprovalLog[];
  termNotes?: SupplierTermNote[];
}

export interface OrganizationWithRelations extends Organization {
  employees?: Employee[];
  suppliers?: Supplier[];
  orgUnits?: OrgUnit[];
  roles?: Role[];
  stores?: Store[];
  approvalProcesses?: ApprovalProcess[];
}

export interface OrgUnitWithRelations extends OrgUnit {
  parent?: OrgUnit;
  children?: OrgUnit[];
  organization?: Organization;
  employeeOrgUnitRoles?: EmployeeOrgUnitRole[];
  responsibilities?: ApprovalResponsibility[];
  fallbackResponsibilities?: ApprovalResponsibility[];
}

export interface EmployeeWithRelations extends Employee {
  user?: AppUser;
  organization?: Organization;
  orgUnitRoles?: EmployeeOrgUnitRole[];
  responsibilities?: ApprovalResponsibility[];
  fallbackResponsibilities?: ApprovalResponsibility[];
  invitations?: SupplierInvitation[];
}

export interface SupplierInvitationWithRelations extends SupplierInvitation {
  organization?: Organization;
  invitedBy?: AppUser;
}

export interface SupplierWithRelations extends Supplier {
  user?: AppUser;
  organization?: Organization;
  address?: Address;
  sites?: SupplierSite[];
  approvalRequests?: ApprovalRequest[];
  verifications?: DocumentVerification[];
}

export interface SupplierSiteWithRelations extends SupplierSite {
  user?: AppUser;
  supplier?: Supplier;
  address?: Address;
  documents?: SupplierSiteDocument[];
  terms?: SupplierSiteTerm[];
  verifications?: DocumentVerification[];
  approvalRequests?: ApprovalRequest[];
}

export interface SupplierSiteDocumentWithRelations extends SupplierSiteDocument {
  supplierSite?: SupplierSite;
}

export interface DocumentVerificationWithRelations extends DocumentVerification {
  supplier?: Supplier;
  supplierSite?: SupplierSite;
}

export interface SupplierSiteTermWithRelations extends SupplierSiteTerm {
  supplierSite?: SupplierSite;
  financialTerm?: SupplierFinancialTerm;
  tradeTerm?: SupplierTradeTerm;
  supportTerm?: SupplierSupportTerm;
  notes?: SupplierTermNote[];
  approvalRequests?: ApprovalRequest[];
}

export interface SupplierFinancialTermWithRelations extends SupplierFinancialTerm {
  term?: SupplierSiteTerm;
}

export interface SupplierTradeTermWithRelations extends SupplierTradeTerm {
  term?: SupplierSiteTerm;
}

export interface SupplierSupportTermWithRelations extends SupplierSupportTerm {
  term?: SupplierSiteTerm;
}

export interface SupplierTermNoteWithRelations extends SupplierTermNote {
  term?: SupplierSiteTerm;
  creator?: AppUser;
}

export interface ApprovalProcessWithRelations extends ApprovalProcess {
  organization?: Organization;
  steps?: ApprovalStep[];
  requests?: ApprovalRequest[];
}

export interface ApprovalStepWithRelations extends ApprovalStep {
  process?: ApprovalProcess;
  responsibilities?: ApprovalResponsibility[];
  requests?: ApprovalRequest[];
  logs?: ApprovalLog[];
  comments?: ApprovalComment[];
}

export interface ApprovalResponsibilityWithRelations extends ApprovalResponsibility {
  step?: ApprovalStep;
  role?: Role;
  orgUnit?: OrgUnit;
  employee?: Employee;
  fallbackRole?: Role;
  fallbackOrgUnit?: OrgUnit;
  fallbackEmployee?: Employee;
}

export interface ApprovalRequestWithRelations extends ApprovalRequest {
  process?: ApprovalProcess;
  supplier?: Supplier;
  supplierSite?: SupplierSite;
  term?: SupplierSiteTerm;
  currentStep?: ApprovalStep;
  logs?: ApprovalLog[];
  comments?: ApprovalComment[];
}

export interface ApprovalLogWithRelations extends ApprovalLog {
  request?: ApprovalRequest;
  step?: ApprovalStep;
  actionBy?: AppUser;
}

export interface ApprovalCommentWithRelations extends ApprovalComment {
  request?: ApprovalRequest;
  step?: ApprovalStep;
  commentBy?: AppUser;
}

export interface AddressWithRelations extends Address {
  suppliers?: Supplier[];
  supplierSites?: SupplierSite[];
  stores?: Store[];
}

export interface RoleWithRelations extends Role {
  organization?: Organization;
  employeeOrgUnitRoles?: EmployeeOrgUnitRole[];
  approvalResponsibilities?: ApprovalResponsibility[];
  fallbackResponsibilities?: ApprovalResponsibility[];
}

export interface EmployeeOrgUnitRoleWithRelations extends EmployeeOrgUnitRole {
  employee?: Employee;
  orgUnit?: OrgUnit;
  role?: Role;
}

export interface StoreWithRelations extends Store {
  organization?: Organization;
  address?: Address;
}

/**
 * import type * as enums from "@workspace/database/enums";
import type * as schema from "@workspace/database/schema";
import type * as zodSchema from "@workspace/database/zod-schema";
import type * as dbTypes from "@workspace/database/types";

export type {
  AddressType,
  ApprovalStatus,
  ApproverType,
  DocumentStatus,
  InvitationStatus,
  OrgUnitType,
  SupplierStatus,
  StandardTermType,
  TermType,
  TradeType,
  UserType,
} from "@workspace/database/enums";

export * from "@workspace/database/schema";
export * from "@workspace/database/types";
export * from "@workspace/database/zod-schema";

 */
