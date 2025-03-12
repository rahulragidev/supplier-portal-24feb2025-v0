/**
 * Zod validation schemas for database entities
 * 
 * These schemas are used for input validation and type inference
 * with client-side forms and API endpoints.
 */

import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import * as schema from "./schema.js";
import * as enums from "./enums.js";
import { Examples } from "./examples.js";

// Use enum constants from enums.js
const {
  UserType,
  AddressType,
  TradeType,
  SupplierStatus,
  ApprovalStatus,
  DocumentStatus,
  TermType,
  OrgUnitType,
  ApproverType
} = enums;

// ===================
// BASIC SCHEMAS
// ===================

export const UuidSchema = z.string().uuid();

export const EmailSchema = z.string().email("Invalid email address");

export const PhoneSchema = z.string().regex(
  /^[0-9+\- ]{8,20}$/,
  "Phone number must be 8-20 characters containing only digits, +, - or spaces"
);

export const PanSchema = z.string().regex(
  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  "PAN must be 10 characters in format AAAAA9999A"
);

export const GstSchema = z.string().regex(
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/,
  "GST number must be in the correct format"
);

export const PincodeSchema = z.string().regex(
  /^[0-9A-Z-]{4,10}$/,
  "Pincode must be 4-10 alphanumeric characters"
);

// Common field schemas
export const NameSchema = z.string().min(1).max(100);
export const CodeSchema = z.string().min(1).max(50);
export const DescriptionSchema = z.string().max(500);

// ===================
// ENUM SCHEMAS
// ===================

export const UserTypeSchema = z.enum(Object.values(UserType) as [string, ...string[]]);
export const AddressTypeSchema = z.enum(Object.values(AddressType) as [string, ...string[]]);
export const TradeTypeSchema = z.enum(Object.values(TradeType) as [string, ...string[]]);
export const SupplierStatusSchema = z.enum(Object.values(SupplierStatus) as [string, ...string[]]);
export const ApprovalStatusSchema = z.enum(Object.values(ApprovalStatus) as [string, ...string[]]);
export const DocumentStatusSchema = z.enum(Object.values(DocumentStatus) as [string, ...string[]]);
export const TermTypeSchema = z.enum(Object.values(TermType) as [string, ...string[]]);
export const OrgUnitTypeSchema = z.enum(Object.values(OrgUnitType) as [string, ...string[]]);
export const ApproverTypeSchema = z.enum(Object.values(ApproverType) as [string, ...string[]]);

// ===================
// DATABASE SCHEMAS
// ===================

// Core tables
export const AppUserSchema = createSelectSchema(schema.appUser);
export const NewAppUserSchema = createInsertSchema(schema.appUser);

export const OrganizationSchema = createSelectSchema(schema.organization);
export const NewOrganizationSchema = createInsertSchema(schema.organization);

export const EmployeeSchema = createSelectSchema(schema.employee);
export const NewEmployeeSchema = createInsertSchema(schema.employee);

export const AddressSchema = createSelectSchema(schema.address);
export const NewAddressSchema = createInsertSchema(schema.address);

export const OrgUnitSchema = createSelectSchema(schema.orgUnit);
export const NewOrgUnitSchema = createInsertSchema(schema.orgUnit);

export const RoleSchema = createSelectSchema(schema.role);
export const NewRoleSchema = createInsertSchema(schema.role);

export const EmployeeOrgUnitRoleSchema = createSelectSchema(schema.employeeOrgUnitRole);
export const NewEmployeeOrgUnitRoleSchema = createInsertSchema(schema.employeeOrgUnitRole);

export const StoreSchema = createSelectSchema(schema.store);
export const NewStoreSchema = createInsertSchema(schema.store);

// Supplier tables
export const SupplierSchema = createSelectSchema(schema.supplier);
export const NewSupplierSchema = createInsertSchema(schema.supplier);

export const SupplierInvitationSchema = createSelectSchema(schema.supplierInvitation);
export const NewSupplierInvitationSchema = createInsertSchema(schema.supplierInvitation);

export const SupplierSiteSchema = createSelectSchema(schema.supplierSite);
export const NewSupplierSiteSchema = createInsertSchema(schema.supplierSite);

export const SupplierSiteDocumentSchema = createSelectSchema(schema.supplierSiteDocument);
export const NewSupplierSiteDocumentSchema = createInsertSchema(schema.supplierSiteDocument);

export const DocumentVerificationSchema = createSelectSchema(schema.documentVerification);
export const NewDocumentVerificationSchema = createInsertSchema(schema.documentVerification);

// Payment & Terms tables
export const SupplierSiteTermSchema = createSelectSchema(schema.supplierSiteTerm);
export const NewSupplierSiteTermSchema = createInsertSchema(schema.supplierSiteTerm);

export const SupplierFinancialTermSchema = createSelectSchema(schema.supplierFinancialTerm);
export const NewSupplierFinancialTermSchema = createInsertSchema(schema.supplierFinancialTerm);

export const SupplierTradeTermSchema = createSelectSchema(schema.supplierTradeTerm);
export const NewSupplierTradeTermSchema = createInsertSchema(schema.supplierTradeTerm);

export const SupplierSupportTermSchema = createSelectSchema(schema.supplierSupportTerm);
export const NewSupplierSupportTermSchema = createInsertSchema(schema.supplierSupportTerm);

export const SupplierTermNoteSchema = createSelectSchema(schema.supplierTermNote);
export const NewSupplierTermNoteSchema = createInsertSchema(schema.supplierTermNote);

// Approval Workflow tables
export const ApprovalProcessSchema = createSelectSchema(schema.approvalProcess);
export const NewApprovalProcessSchema = createInsertSchema(schema.approvalProcess);

export const ApprovalStepSchema = createSelectSchema(schema.approvalStep);
export const NewApprovalStepSchema = createInsertSchema(schema.approvalStep);

export const ApprovalResponsibilitySchema = createSelectSchema(schema.approvalResponsibility);
export const NewApprovalResponsibilitySchema = createInsertSchema(schema.approvalResponsibility);

export const ApprovalRequestSchema = createSelectSchema(schema.approvalRequest);
export const NewApprovalRequestSchema = createInsertSchema(schema.approvalRequest);

export const ApprovalLogSchema = createSelectSchema(schema.approvalLog);
export const NewApprovalLogSchema = createInsertSchema(schema.approvalLog);

export const ApprovalCommentSchema = createSelectSchema(schema.approvalComment);
export const NewApprovalCommentSchema = createInsertSchema(schema.approvalComment);

// ===================
// CLIENT SCHEMAS (WITH ADDITIONAL VALIDATION)
// ===================

export const ClientAppUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  userType: z.enum(["EMPLOYEE", "SUPPLIER", "SUPPLIER_SITE", "ADMIN"]),
});

export const ClientOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  maxUserCount: z.number().int().positive("User count must be a positive number"),
});

export const ClientEmployeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  employeeCode: z.string().min(2, "Employee code must be at least 2 characters"),
  organizationUid: UuidSchema,
});

export const ClientAddressSchema = z.object({
  line1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  line2: z.string().optional(),
  line3: z.string().optional(),
  line4: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  pincode: PincodeSchema,
  addressType: z.enum(["BILLING", "SHIPPING", "REGISTERED", "OPERATIONAL"]),
  extraData: z.any().optional()
});

export const ClientSupplierSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  pan: PanSchema,
  constitutionOfBusiness: z.string().min(2, "Constitution of business must be at least 2 characters"),
  tradeType: z.enum(["GOODS", "SERVICES", "BOTH"]),
  contactName: z.string().min(2, "Contact name must be at least 2 characters").optional(),
  contactEmail: EmailSchema,
  contactPhone: PhoneSchema,
  organizationUid: UuidSchema,
  supplierCode: z.string().min(2, "Supplier code must be at least 2 characters").optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "ACTIVE", "INACTIVE", "REJECTED"]).default("DRAFT"),
  address: ClientAddressSchema
});

export const ClientSupplierSiteSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters"),
  siteCode: z.string().min(2, "Site code must be at least 2 characters").optional(),
  classification: z.string().min(2, "Classification must be at least 2 characters").optional(),
  businessType: z.string().min(2, "Business type must be at least 2 characters").optional(),
  gstNumber: GstSchema.optional(),
  fssaiNumber: z.string().regex(/^[0-9]{14}$/, "FSSAI number must be 14 digits").optional(),
  msmeNumber: z.string().min(2, "MSME number must be at least 2 characters").optional(),
  supplierUserUid: UuidSchema,
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ESCALATED", "DELEGATED"]),
  isActive: z.boolean().default(true),
  address: ClientAddressSchema
});

export const ClientSupplierSiteTermSchema = z.object({
  supplierSiteUserUid: UuidSchema,
  termType: z.enum(["FINANCIAL", "TRADE", "SUPPORT"]),
  effectiveDate: z.date().optional(),
  expirationDate: z.date().optional(),
  isActive: z.boolean().default(true),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ESCALATED", "DELEGATED"]).optional(),
  versionNumber: z.number().int().positive().optional(),
});

export const ClientFinancialTermSchema = z.object({
  termUid: UuidSchema,
  agreedCreditDays: z.number().int().positive("Credit days must be a positive number").optional(),
  paymentMethod: z.string().min(2, "Payment method must be at least 2 characters").optional(),
  turnoverIncentiveAmount: z.number().optional(),
  turnoverIncentivePercent: z.number().optional(),
  turnoverRealizationFrequency: z.string().optional(),
  turnoverRealizationMethod: z.string().optional(),
  vendorListingFees: z.number().optional(),
  vendorListingFeesChecked: z.boolean().optional(),
});

export const ClientTradeTermSchema = z.object({
  termUid: UuidSchema,
  leadTimeDays: z.number().int().min(0, "Lead time days must be a non-negative number").optional(),
  saleOrReturn: z.boolean().default(false).optional(),
  discountPercent: z.number().optional(),
  daysEarlier: z.number().int().optional(),
  shrinkSharing: z.string().optional(),
  shrinkSharingPercent: z.number().optional(),
});

export const ClientSupportTermSchema = z.object({
  termUid: UuidSchema,
  merchandisingSupportAmount: z.number().optional(),
  merchandisingSupportPersonCount: z.number().int().optional(),
  merchandisingSupportPercent: z.number().optional(),
  merchandisingSupportFrequency: z.string().optional(),
  merchandisingSupportMethod: z.string().optional(),
  barcodeAmount: z.number().optional(),
  barcodePercent: z.number().optional(),
  barcodeFrequency: z.string().optional(),
  barcodeMethod: z.string().optional(),
  newProductIntroFeeAmount: z.number().optional(),
  newProductIntroFeePercent: z.number().optional(),
  newProductIntroFeeFrequency: z.string().optional(),
  newProductIntroFeeMethod: z.string().optional(),
  storeOpeningSupportAmount: z.number().optional(),
  storeOpeningSupportFrequency: z.string().optional(),
  storeOpeningSupportMethod: z.string().optional(),
  storeAnniversarySupportAmount: z.number().optional(),
  storeAnniversarySupportFrequency: z.string().optional(),
  storeAnniversarySupportMethod: z.string().optional(),
});

export const ClientApprovalRequestSchema = z.object({
  approvalProcessUid: UuidSchema,
  supplierUserUid: UuidSchema,
  supplierSiteUserUid: UuidSchema.optional(),
  termUid: UuidSchema.optional(),
  stepUid: UuidSchema,
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ESCALATED", "DELEGATED"]),
});

export const ClientStoreSchema = z.object({
  organizationUid: UuidSchema,
  name: z.string().min(3, "Store name must be at least 3 characters"),
  storeCode: z.string().min(2, "Store code must be at least 2 characters"),
  extraData: z.any().optional(),
  address: ClientAddressSchema
});