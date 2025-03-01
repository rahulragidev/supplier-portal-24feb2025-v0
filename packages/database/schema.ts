/**
 * Enterprise-Grade Supplier Management System
 * Database Schema Definition
 */

import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
  jsonb,
  index,
  decimal,
  primaryKey
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ===================
// ENUMS DEFINITIONS
// ===================

export const userTypeEnum = pgEnum("user_type_enum", [
  "EMPLOYEE",
  "SUPPLIER",
  "SUPPLIER_SITE",
  "ADMIN"
]);

export const addressTypeEnum = pgEnum("address_type_enum", [
  "BILLING",
  "SHIPPING",
  "REGISTERED",
  "OPERATIONAL"
]);

export const tradeTypeEnum = pgEnum("trade_type_enum", [
  "GOODS",
  "SERVICES",
  "BOTH"
]);

export const supplierStatusEnum = pgEnum("supplier_status_enum", [
  "DRAFT",
  "PENDING_APPROVAL",
  "ACTIVE",
  "INACTIVE",
  "REJECTED"
]);

export const approvalStatusEnum = pgEnum("approval_status_enum", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "ESCALATED",
  "DELEGATED"
]);

export const invitationStatusEnum = pgEnum("invitation_status_enum", [
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "REVOKED"
]);

export const documentTypeEnum = pgEnum("document_type_enum", [
  "PAN",
  "GST",
  "MSME",
  "FSSAI",
  "CANCELLED_CHEQUE",
  "COMPANY_PROFILE",
  "TAX_CERTIFICATE",
  "INSURANCE_CERTIFICATE",
  "TRADE_LICENSE",
  "OTHER"
]);

export const orgUnitTypeEnum = pgEnum("org_unit_type_enum", [
  "DIVISION",
  "DEPARTMENT",
  "TEAM",
  "REGION",
  "BUSINESS_UNIT",
  "SUBSIDIARY"
]);

export const verificationStatusEnum = pgEnum("verification_status_enum", [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
  "REQUIRES_UPDATE"
]);

// ===================
// CORE TABLES
// ===================

export const user = pgTable("user", {
  uid: uuid("uid").primaryKey().notNull(),
  clerkId: uuid("clerk_id").notNull().unique(),
  userName: varchar("user_name", { length: 100 }).notNull().unique(),
  userType: userTypeEnum("user_type").notNull(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_user_type").on(table.userType),
  index("idx_user_deleted_at").on(table.deletedAt),
]);

export const organization = pgTable("organization", {
  uid: uuid("uid").primaryKey().notNull(),
  name: varchar("name", { length: 200 }).notNull().unique(),
  licenseKey: uuid("license_key").notNull().unique(),
  maxUserCount: integer("max_user_count").notNull(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_organization_name").on(table.name),
  index("idx_organization_deleted_at").on(table.deletedAt),
]);

export const employee = pgTable("employee", {
  userUid: uuid("user_uid")
    .references(() => user.uid, { onDelete: "cascade" })
    .notNull(),
  organizationUid: uuid("organization_uid")
    .references(() => organization.uid, { onDelete: "cascade" })
    .notNull(),
  employeeCode: varchar("employee_code", { length: 50 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  primaryKey({ columns: [table.userUid, table.employeeCode] }),
  index("idx_employee_org").on(table.organizationUid),
  index("idx_employee_email").on(table.email),
  index("idx_employee_name").on(table.firstName, table.lastName),
  index("idx_employee_deleted_at").on(table.deletedAt),
]);

export const address = pgTable("address", {
  uid: uuid("uid").primaryKey().notNull(),
  line1: varchar("line1", { length: 200 }).notNull(),
  line2: varchar("line2", { length: 200 }),
  line3: varchar("line3", { length: 200 }),
  line4: varchar("line4", { length: 200 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 20 }).notNull(),
  addressType: addressTypeEnum("address_type").notNull(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_address_city_state").on(table.city, table.state, table.country),
  index("idx_address_type").on(table.addressType),
  index("idx_address_deleted_at").on(table.deletedAt),
]);

// Define orgUnit table with forward reference to avoid circular dependency
export const orgUnit = pgTable("org_unit", {
  uid: uuid("uid").primaryKey().notNull(),
  organizationUid: uuid("organization_uid")
    .references(() => organization.uid, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  orgUnitCode: varchar("org_unit_code", { length: 50 }).notNull(),
  unitType: orgUnitTypeEnum("unit_type").notNull(),
  parentUid: uuid("parent_uid"),  // Remove self-reference here
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("org_unit_org_name_unique").on(table.organizationUid, table.name),
  uniqueIndex("org_unit_org_code_unique").on(table.organizationUid, table.orgUnitCode),
  index("idx_org_unit_org").on(table.organizationUid),
  index("idx_org_unit_parent").on(table.parentUid),
  index("idx_org_unit_type").on(table.unitType),
  index("idx_org_unit_deleted_at").on(table.deletedAt),
]);

// Add the foreign key constraint after table definition
export const orgUnitRelations = relations(orgUnit, ({ one, many }) => ({
  parent: one(orgUnit, {
    relationName: "parentChild",
    fields: [orgUnit.parentUid],
    references: [orgUnit.uid]
  }),
  children: many(orgUnit, {
    relationName: "parentChild"
  }),
  organization: one(organization, {
    fields: [orgUnit.organizationUid],
    references: [organization.uid]
  })
}));

export const role = pgTable("role", {
  uid: uuid("uid").primaryKey().notNull(),
  organizationUid: uuid("organization_uid")
    .references(() => organization.uid, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  roleCode: varchar("role_code", { length: 50 }),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("role_org_name_unique").on(table.organizationUid, table.name),
  uniqueIndex("role_org_code_unique").on(table.organizationUid, table.roleCode),
  index("idx_role_org").on(table.organizationUid),
  index("idx_role_deleted_at").on(table.deletedAt),
]);

export const employeeOrgUnitRole = pgTable("employee_org_unit_role", {
  uid: uuid("uid").primaryKey().notNull(),
  employeeUserUid: uuid("employee_user_uid")
    .references(() => employee.userUid, { onDelete: "cascade" })
    .notNull(),
  orgUnitUid: uuid("org_unit_uid")
    .references(() => orgUnit.uid, { onDelete: "cascade" })
    .notNull(),
  roleUid: uuid("role_uid")
    .references(() => role.uid, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("employee_org_unit_role_unique").on(
    table.employeeUserUid, 
    table.orgUnitUid, 
    table.roleUid
  ),
  index("idx_employee_role_emp").on(table.employeeUserUid),
  index("idx_employee_role_unit").on(table.orgUnitUid),
  index("idx_employee_role_role").on(table.roleUid),
  index("idx_employee_org_unit_role_deleted_at").on(table.deletedAt),
]);

export const store = pgTable("store", {
  uid: uuid("uid").primaryKey().notNull(),
  organizationUid: uuid("organization_uid")
    .references(() => organization.uid, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  storeCode: varchar("store_code", { length: 50 }).notNull(),
  addressUid: uuid("address_uid")
    .references(() => address.uid, { onDelete: "restrict" })
    .notNull(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("store_org_name_unique").on(table.organizationUid, table.name),
  uniqueIndex("store_org_code_unique").on(table.organizationUid, table.storeCode),
  index("idx_store_org").on(table.organizationUid),
  index("idx_store_address").on(table.addressUid),
  index("idx_store_deleted_at").on(table.deletedAt),
]);

// ===================
// SUPPLIER TABLES
// ===================

export const supplier = pgTable("supplier", {
  userUid: uuid("user_uid")
    .references(() => user.uid, { onDelete: "cascade" })
    .primaryKey()
    .notNull(),
  organizationUid: uuid("organization_uid")
    .references(() => organization.uid, { onDelete: "cascade" })
    .notNull(),
  supplierCode: varchar("supplier_code", { length: 50 }).unique(),
  pan: varchar("pan", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  constitutionOfBusiness: varchar("constitution_of_business", { length: 100 }).notNull(),
  tradeType: tradeTypeEnum("trade_type").notNull(),
  contactName: varchar("contact_name", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 }).notNull().unique(),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull().unique(),
  addressUid: uuid("address_uid")
    .references(() => address.uid, { onDelete: "restrict" })
    .notNull(),
  status: supplierStatusEnum("status").notNull(),
  extraData: jsonb("extra_data"),
  revisionNumber: integer("revision_number").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("supplier_org_name_unique").on(table.organizationUid, table.name),
  index("idx_supplier_org").on(table.organizationUid),
  index("idx_supplier_status").on(table.status),
  index("idx_supplier_code").on(table.supplierCode),
  index("idx_supplier_name").on(table.name),
  // Partial index for active suppliers
  index("idx_supplier_active").on(
    table.organizationUid, 
    table.name, 
    table.supplierCode
  ).where(sql`status = 'ACTIVE' AND deleted_at IS NULL`),
  // Covering index for supplier lookups by contact info
  index("idx_supplier_contact").on(
    table.contactEmail, 
    table.contactPhone
  ),
  index("idx_supplier_deleted_at").on(table.deletedAt),
]);

export const supplierInvitation = pgTable("supplier_invitation", {
  uid: uuid("uid").primaryKey().notNull(),
  invitedSupplierUserUid: uuid("invited_supplier_user_uid")
    .references(() => supplier.userUid, { onDelete: "cascade" })
    .notNull(),
  invitedByEmployeeUserUid: uuid("invited_by_employee_user_uid")
    .references(() => employee.userUid, { onDelete: "set null" }),
  invitationLink: text("invitation_link").notNull().unique(),
  status: invitationStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_invitation_supplier").on(table.invitedSupplierUserUid),
  index("idx_invitation_employee").on(table.invitedByEmployeeUserUid),
  index("idx_invitation_status").on(table.status),
  index("idx_invitation_deleted_at").on(table.deletedAt),
]);

export const supplierSite = pgTable("supplier_site", {
  userUid: uuid("user_uid")
    .references(() => user.uid, { onDelete: "cascade" })
    .primaryKey()
    .notNull(),
  supplierUserUid: uuid("supplier_user_uid")
    .references(() => supplier.userUid, { onDelete: "cascade" })
    .notNull(),
  siteName: varchar("site_name", { length: 200 }).notNull(),
  siteCode: varchar("site_code", { length: 50 }),
  status: verificationStatusEnum("status").notNull(),
  classification: varchar("classification", { length: 100 }).notNull(),
  gstNumber: varchar("gst_number", { length: 15 }).notNull().unique(),
  fssaiNumber: varchar("fssai_number", { length: 20 }),
  msmeNumber: varchar("msme_number", { length: 30 }),
  addressUid: uuid("address_uid")
    .references(() => address.uid, { onDelete: "restrict" })
    .notNull(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("supplier_site_name_unique").on(table.supplierUserUid, table.siteName),
  index("idx_site_supplier").on(table.supplierUserUid),
  index("idx_site_status").on(table.status),
  index("idx_site_address").on(table.addressUid),
  index("idx_site_deleted_at").on(table.deletedAt),
]);

export const supplierSiteDocument = pgTable("supplier_site_document", {
  uid: uuid("uid").primaryKey().notNull(),
  supplierSiteUserUid: uuid("supplier_site_user_uid")
    .references(() => supplierSite.userUid, { onDelete: "cascade" })
    .notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  filePath: varchar("file_path", { length: 255 }).notNull().unique(),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_document_site").on(table.supplierSiteUserUid),
  index("idx_document_type").on(table.documentType),
  index("idx_document_status").on(table.verificationStatus),
  index("idx_document_deleted_at").on(table.deletedAt),
]);

export const documentVerification = pgTable("document_verification", {
  uid: uuid("uid").primaryKey().notNull(),
  supplierUserUid: uuid("supplier_user_uid")
    .references(() => supplier.userUid, { onDelete: "cascade" })
    .notNull(),
  supplierSiteUserUid: uuid("supplier_site_user_uid")
    .references(() => supplierSite.userUid, { onDelete: "cascade" })
    .notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  status: verificationStatusEnum("status").notNull(),
  requestPayload: jsonb("request_payload"),
  responsePayload: jsonb("response_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_verification_supplier").on(table.supplierUserUid),
  index("idx_verification_site").on(table.supplierSiteUserUid),
  index("idx_verification_type").on(table.documentType),
  index("idx_verification_status").on(table.status),
  index("idx_document_verification_deleted_at").on(table.deletedAt),
]);

// ===================
// PAYMENT & TERMS TABLES
// ===================

export const paymentTermType = pgTable("payment_term_type", {
  uid: uuid("uid").primaryKey().notNull(),
  termCode: varchar("term_code", { length: 50 }).notNull().unique(),
  termName: varchar("term_name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
});

export const supplierSiteTerm = pgTable("supplier_site_term", {
  uid: uuid("uid").primaryKey().notNull(),
  supplierSiteUserUid: uuid("supplier_site_user_uid")
    .references(() => supplierSite.userUid, { onDelete: "cascade" })
    .notNull(),
  effectiveDate: timestamp("effective_date", { withTimezone: true }),
  agreedCreditDays: integer("agreed_credit_days").notNull(),
  leadTimeDays: integer("lead_time_days").notNull().default(0),
  saleOrReturn: boolean("sale_or_return").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_term_site").on(table.supplierSiteUserUid),
  index("idx_term_effective_date").on(table.effectiveDate),
  index("idx_supplier_site_term_deleted_at").on(table.deletedAt),
]);

export const supplierCommercialTerm = pgTable("supplier_commercial_term", {
  uid: uuid("uid").primaryKey().notNull(),
  supplierSiteTermUid: uuid("supplier_site_term_uid")
    .references(() => supplierSiteTerm.uid, { onDelete: "cascade" })
    .notNull(),
  termType: varchar("term_type", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  frequency: varchar("frequency", { length: 50 }),
  method: varchar("method", { length: 50 }),
  personCount: integer("person_count"),
  additionalDetails: jsonb("additional_details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_commercial_term_site_term").on(table.supplierSiteTermUid),
  index("idx_commercial_term_type").on(table.termType),
  index("idx_supplier_commercial_term_deleted_at").on(table.deletedAt),
]);

export const supplierTermNote = pgTable("supplier_term_note", {
  uid: uuid("uid").primaryKey().notNull(),
  supplierSiteTermUid: uuid("supplier_site_term_uid")
    .references(() => supplierSiteTerm.uid, { onDelete: "cascade" })
    .notNull(),
  noteText: text("note_text").notNull(),
  createdBy: uuid("created_by")
    .references(() => user.uid, { onDelete: "set null" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_term_note_term").on(table.supplierSiteTermUid),
  index("idx_term_note_created_by").on(table.createdBy),
  index("idx_supplier_term_note_deleted_at").on(table.deletedAt),
]);

// ===================
// APPROVAL WORKFLOW TABLES
// ===================

export const approvalProcess = pgTable("approval_process", {
  uid: uuid("uid").primaryKey().notNull(),
  organizationUid: uuid("organization_uid")
    .references(() => organization.uid, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("approval_process_org_name_unique").on(table.organizationUid, table.name),
  index("idx_approval_process_org").on(table.organizationUid),
  index("idx_approval_process_deleted_at").on(table.deletedAt),
]);

export const approvalStep = pgTable("approval_step", {
  uid: uuid("uid").primaryKey().notNull(),
  approvalProcessUid: uuid("approval_process_uid")
    .references(() => approvalProcess.uid, { onDelete: "cascade" })
    .notNull(),
  stepName: varchar("step_name", { length: 100 }).notNull(),
  stepOrder: integer("step_order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  uniqueIndex("approval_step_process_order_unique").on(table.approvalProcessUid, table.stepOrder),
  index("idx_approval_step_process").on(table.approvalProcessUid),
  index("idx_approval_step_deleted_at").on(table.deletedAt),
]);

export const approvalResponsibility = pgTable("approval_responsibility", {
  uid: uuid("uid").primaryKey().notNull(),
  approvalStepUid: uuid("approval_step_uid")
    .references(() => approvalStep.uid, { onDelete: "cascade" })
    .notNull(),
  responsibilityType: varchar("responsibility_type", { length: 50 }).notNull(),
  roleUid: uuid("role_uid")
    .references(() => role.uid, { onDelete: "set null" }),
  orgUnitUid: uuid("org_unit_uid")
    .references(() => orgUnit.uid, { onDelete: "set null" }),
  employeeUserUid: uuid("employee_user_uid")
    .references(() => employee.userUid, { onDelete: "set null" }),
  fallbackRoleUid: uuid("fallback_role_uid")
    .references(() => role.uid, { onDelete: "set null" }),
  fallbackOrgUnitUid: uuid("fallback_org_unit_uid")
    .references(() => orgUnit.uid, { onDelete: "set null" }),
  fallbackEmployeeUserUid: uuid("fallback_employee_user_uid")
    .references(() => employee.userUid, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_responsibility_step").on(table.approvalStepUid),
  index("idx_responsibility_role").on(table.roleUid),
  index("idx_responsibility_org_unit").on(table.orgUnitUid),
  index("idx_responsibility_employee").on(table.employeeUserUid),
  index("idx_approval_responsibility_deleted_at").on(table.deletedAt),
]);

export const approvalRequest = pgTable("approval_request", {
  uid: uuid("uid").primaryKey().notNull(),
  approvalProcessUid: uuid("approval_process_uid")
    .references(() => approvalProcess.uid, { onDelete: "restrict" })
    .notNull(),
  supplierUserUid: uuid("supplier_user_uid")
    .references(() => supplier.userUid, { onDelete: "cascade" })
    .notNull(),
  supplierSiteUserUid: uuid("supplier_site_user_uid")
    .references(() => supplierSite.userUid, { onDelete: "cascade" }),
  stepUid: uuid("step_uid")
    .references(() => approvalStep.uid, { onDelete: "restrict" })
    .notNull(),
  status: approvalStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => [
  index("idx_approval_request_process").on(table.approvalProcessUid),
  index("idx_approval_request_supplier").on(table.supplierUserUid),
  index("idx_approval_request_site").on(table.supplierSiteUserUid),
  index("idx_approval_request_step").on(table.stepUid),
  index("idx_approval_request_status").on(table.status),
  index("idx_approval_request_completed_at").on(table.completedAt),
  index("idx_approval_request_deleted_at").on(table.deletedAt),
]);

export const approvalLog = pgTable("approval_log", {
  uid: uuid("uid").primaryKey().notNull(),
  approvalRequestUid: uuid("approval_request_uid")
    .references(() => approvalRequest.uid, { onDelete: "cascade" })
    .notNull(),
  approvalStepUid: uuid("approval_step_uid")
    .references(() => approvalStep.uid, { onDelete: "restrict" })
    .notNull(),
  actionByUserUid: uuid("action_by_user_uid")
    .references(() => user.uid, { onDelete: "set null" }),
  actionDate: timestamp("action_date", { withTimezone: true }).notNull().defaultNow(),
  status: approvalStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  lastUpdatedBy: uuid("last_updated_by")
}, (table) => {
  return [
    index("idx_approval_log_request").on(table.approvalRequestUid),
    index("idx_approval_log_step").on(table.approvalStepUid),
    index("idx_approval_log_user").on(table.actionByUserUid),
    index("idx_approval_log_date").on(table.actionDate),
    index("idx_approval_log_status").on(table.status),
    index("idx_approval_log_deleted_at").on(table.deletedAt),
  ];
});

export const approvalComment = pgTable("approval_comment", {
  uid: uuid("uid").primaryKey().notNull(),
  approvalRequestUid: uuid("approval_request_uid")
    .references(() => approvalRequest.uid, { onDelete: "cascade" })
    .notNull(),
  approvalStepUid: uuid("approval_step_uid")
    .references(() => approvalStep.uid, { onDelete: "restrict" })
    .notNull(),
  commentText: text("comment_text").notNull(),
  commentByUserUid: uuid("comment_by_user_uid")
    .references(() => user.uid, { onDelete: "set null" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by")
}, (table) => {
  return [
    index("idx_approval_comment_request").on(table.approvalRequestUid),
    index("idx_approval_comment_step").on(table.approvalStepUid),
    index("idx_approval_comment_user").on(table.commentByUserUid),
    index("idx_approval_comment_created_at").on(table.createdAt),
  ];
});

// ===================
// RELATIONSHIPS
// ===================

export const userRelations = relations(user, ({ one, many }) => ({
  employee: one(employee, {
    fields: [user.uid],
    references: [employee.userUid],
  }),
  supplier: one(supplier, {
    fields: [user.uid],
    references: [supplier.userUid],
  }),
  supplierSite: one(supplierSite, {
    fields: [user.uid],
    references: [supplierSite.userUid],
  }),
  comments: many(approvalComment, {
    relationName: "userComments"
  }),
  approvalLogs: many(approvalLog, {
    relationName: "userApprovalLogs"
  }),
  termNotes: many(supplierTermNote, {
    relationName: "userTermNotes"
  })
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  employees: many(employee, {
    relationName: "organizationEmployees"
  }),
  suppliers: many(supplier, {
    relationName: "organizationSuppliers"
  }),
  orgUnits: many(orgUnit, {
    relationName: "organizationOrgUnits"
  }),
  roles: many(role, {
    relationName: "organizationRoles"
  }),
  stores: many(store, {
    relationName: "organizationStores"
  }),
  approvalProcesses: many(approvalProcess, {
    relationName: "organizationApprovalProcesses"
  }),
}));

export const supplierRelations = relations(supplier, ({ one, many }) => ({
  user: one(user, {
    fields: [supplier.userUid],
    references: [user.uid],
  }),
  organization: one(organization, {
    fields: [supplier.organizationUid],
    references: [organization.uid],
  }),
  address: one(address, {
    fields: [supplier.addressUid],
    references: [address.uid],
  }),
  sites: many(supplierSite, {
    relationName: "supplierSites"
  }),
  invitations: many(supplierInvitation, {
    relationName: "supplierInvitations"
  }),
  approvalRequests: many(approvalRequest, {
    relationName: "supplierApprovalRequests"
  }),
  verifications: many(documentVerification, {
    relationName: "supplierVerifications"
  }),
}));

export const supplierSiteRelations = relations(supplierSite, ({ one, many }) => ({
  user: one(user, {
    fields: [supplierSite.userUid],
    references: [user.uid],
  }),
  supplier: one(supplier, {
    fields: [supplierSite.supplierUserUid],
    references: [supplier.userUid],
  }),
  address: one(address, {
    fields: [supplierSite.addressUid],
    references: [address.uid],
  }),
  documents: many(supplierSiteDocument, {
    relationName: "siteDocuments"
  }),
  terms: many(supplierSiteTerm, {
    relationName: "siteTerms"
  }),
  verifications: many(documentVerification, {
    relationName: "siteVerifications"
  }),
  approvalRequests: many(approvalRequest, {
    relationName: "siteApprovalRequests"
  }),
}));