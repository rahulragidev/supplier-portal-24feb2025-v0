/**
 * Zod validation schemas for database entities
 * 
 * These schemas are used for input validation and type inference
 * with client-side forms and API endpoints.
 */

import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import * as schema from "./schema.js";

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

// ===================
// DATABASE SCHEMAS
// ===================

// Core tables
export const UserSchema = createSelectSchema(schema.user);
export const NewUserSchema = createInsertSchema(schema.user);

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
export const PaymentTermTypeSchema = createSelectSchema(schema.paymentTermType);
export const NewPaymentTermTypeSchema = createInsertSchema(schema.paymentTermType);

export const SupplierSiteTermSchema = createSelectSchema(schema.supplierSiteTerm);
export const NewSupplierSiteTermSchema = createInsertSchema(schema.supplierSiteTerm);

export const SupplierCommercialTermSchema = createSelectSchema(schema.supplierCommercialTerm);
export const NewSupplierCommercialTermSchema = createInsertSchema(schema.supplierCommercialTerm);

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

export const ClientUserSchema = z.object({
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
});

export const ClientSupplierSiteSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters"),
  siteCode: z.string().min(2, "Site code must be at least 2 characters").optional(),
  classification: z.string().min(2, "Classification must be at least 2 characters"),
  gstNumber: GstSchema,
  fssaiNumber: z.string().regex(/^[0-9]{14}$/, "FSSAI number must be 14 digits").optional(),
  msmeNumber: z.string().min(2, "MSME number must be at least 2 characters").optional(),
  supplierUserUid: UuidSchema,
});

export const ClientSupplierSiteTermSchema = z.object({
  supplierSiteUserUid: UuidSchema,
  effectiveDate: z.date().optional(),
  agreedCreditDays: z.number().int().positive("Credit days must be a positive number"),
  leadTimeDays: z.number().int().min(0, "Lead time days must be a non-negative number"),
  saleOrReturn: z.boolean().default(false),
});

export const ClientApprovalRequestSchema = z.object({
  approvalProcessUid: UuidSchema,
  supplierUserUid: UuidSchema,
  supplierSiteUserUid: UuidSchema.optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ESCALATED", "DELEGATED"]),
});