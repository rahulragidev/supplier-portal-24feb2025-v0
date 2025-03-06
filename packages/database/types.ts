/**
 * Type definitions for the supplier management system
 * 
 * This file contains TypeScript types derived from the database schema
 * and Zod validation schemas for use throughout the application.
 */

import { z } from "zod";
import * as zodSchema from "./zod-schema.js";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "./schema.js";

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

export type UserType = "EMPLOYEE" | "SUPPLIER" | "SUPPLIER_SITE" | "ADMIN";
export type AddressType = "BILLING" | "SHIPPING" | "REGISTERED" | "OPERATIONAL";
export type TradeType = "GOODS" | "SERVICES" | "BOTH";
export type SupplierStatus = "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "INACTIVE" | "REJECTED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ESCALATED" | "DELEGATED";
export type InvitationStatus = "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "REVOKED";
export type DocumentType = "PAN" | "GST" | "MSME" | "FSSAI" | "CANCELLED_CHEQUE" | "COMPANY_PROFILE" | 
  "TAX_CERTIFICATE" | "INSURANCE_CERTIFICATE" | "TRADE_LICENSE" | "OTHER";
export type OrgUnitType = "DIVISION" | "DEPARTMENT" | "TEAM" | "REGION" | "BUSINESS_UNIT" | "SUBSIDIARY";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED" | "REQUIRES_UPDATE";
export type TermType = "FINANCIAL" | "TRADE" | "SUPPORT";

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