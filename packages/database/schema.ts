/**
 * Database Schema Definition
 *
 * This file serves as the source of truth for the database schema.
 * It defines all tables, columns, relationships, and constraints using Drizzle ORM.
 *
 * The schema defined here is used to:
 * 1. Generate SQL migrations
 * 2. Create TypeScript types (via types.ts)
 * 3. Generate Zod validation schemas (via zod-schema.ts)
 *
 * Related files:
 * - enums.ts: Contains enum constants used in this schema
 * - types.ts: Contains TypeScript types derived from this schema
 * - zod-schema.ts: Contains Zod validation schemas derived from this schema
 * - examples.ts: Contains example values for documentation
 */

import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Import from JavaScript file for DrizzleKit compatibility
// @ts-ignore - Ignore TypeScript error for missing type definitions
import * as enums from "./enums.js";

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
  ApproverType,
  InvitationStatus,
  StandardTermType,
} = enums;

// ===================
// ENUMS DEFINITIONS
// ===================

export const userTypeEnum = pgEnum(
  "user_type_enum",
  Object.values(UserType) as [string, ...string[]]
);
export const addressTypeEnum = pgEnum(
  "address_type_enum",
  Object.values(AddressType) as [string, ...string[]]
);
export const tradeTypeEnum = pgEnum(
  "trade_type_enum",
  Object.values(TradeType) as [string, ...string[]]
);
export const supplierStatusEnum = pgEnum(
  "supplier_status_enum",
  Object.values(SupplierStatus) as [string, ...string[]]
);
export const approvalStatusEnum = pgEnum(
  "approval_status_enum",
  Object.values(ApprovalStatus) as [string, ...string[]]
);
export const documentStatusEnum = pgEnum(
  "document_status_enum",
  Object.values(DocumentStatus) as [string, ...string[]]
);
export const termTypeEnum = pgEnum(
  "term_type_enum",
  Object.values(TermType) as [string, ...string[]]
);
export const orgUnitTypeEnum = pgEnum(
  "org_unit_type_enum",
  Object.values(OrgUnitType) as [string, ...string[]]
);
export const approverTypeEnum = pgEnum(
  "approver_type_enum",
  Object.values(ApproverType) as [string, ...string[]]
);
export const invitationStatusEnum = pgEnum(
  "invitation_status_enum",
  Object.values(InvitationStatus) as [string, ...string[]]
);
export const standardTermTypeEnum = pgEnum(
  "standard_term_type_enum",
  Object.values(StandardTermType) as [string, ...string[]]
);

// ===================
// CORE TABLES
// ===================

export const appUser = pgTable(
  "app_user",
  {
    uid: uuid("uid").primaryKey().notNull(),
    clerkId: uuid("clerk_id").notNull().unique(),
    userName: varchar("user_name", { length: 100 }).notNull().unique(),
    userType: userTypeEnum("user_type").notNull(),
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_app_user_type").on(table.userType),
    index("idx_app_user_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const organization = pgTable(
  "organization",
  {
    uid: uuid("uid").primaryKey().notNull(),
    name: varchar("name", { length: 200 }).notNull().unique(),
    maxUserCount: integer("max_user_count").notNull(),
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_organization_name").on(table.name),
    index("idx_organization_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const employee = pgTable(
  "employee",
  {
    userUid: uuid("user_uid")
      .notNull()
      .references(() => appUser.uid, { onDelete: "cascade" }),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
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
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    primaryKey({ columns: [table.userUid] }),
    index("idx_employee_org").on(table.organizationUid),
    index("idx_employee_email").on(table.email),
    index("idx_employee_name").on(table.firstName, table.lastName),
    index("idx_employee_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const address = pgTable(
  "address",
  {
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
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_address_city_state").on(table.city, table.state, table.country),
    index("idx_address_type").on(table.addressType),
    index("idx_address_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

// Define orgUnit table
export const orgUnit = pgTable(
  "org_unit",
  {
    uid: uuid("uid").primaryKey().notNull(),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    orgUnitCode: varchar("org_unit_code", { length: 50 }).notNull(),
    unitType: orgUnitTypeEnum("unit_type").notNull(),
    parentUid: uuid("parent_uid"), // Self-reference handled in relations
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_org_unit_org_name_unique").on(table.organizationUid, table.name),
    uniqueIndex("idx_org_unit_org_code_unique").on(table.organizationUid, table.orgUnitCode),
    index("idx_org_unit_org").on(table.organizationUid),
    index("idx_org_unit_parent").on(table.parentUid),
    index("idx_org_unit_type").on(table.unitType),
    index("idx_org_unit_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const role = pgTable(
  "role",
  {
    uid: uuid("uid").primaryKey().notNull(),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    roleCode: varchar("role_code", { length: 50 }),
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_role_org_name_unique").on(table.organizationUid, table.name),
    uniqueIndex("idx_role_org_code_unique").on(table.organizationUid, table.roleCode),
    index("idx_role_org").on(table.organizationUid),
    index("idx_role_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const employeeOrgUnitRole = pgTable(
  "employee_org_unit_role",
  {
    uid: uuid("uid").primaryKey().notNull(),
    employeeUserUid: uuid("employee_user_uid")
      .notNull()
      .references(() => appUser.uid, { onDelete: "cascade" }),
    orgUnitUid: uuid("org_unit_uid")
      .notNull()
      .references(() => orgUnit.uid, { onDelete: "cascade" }),
    roleUid: uuid("role_uid")
      .notNull()
      .references(() => role.uid, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_employee_org_unit_role_employee").on(table.employeeUserUid),
    index("idx_employee_org_unit_role_org_unit").on(table.orgUnitUid),
    index("idx_employee_org_unit_role_role").on(table.roleUid),
    index("idx_employee_org_unit_role_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const store = pgTable(
  "store",
  {
    uid: uuid("uid").primaryKey().notNull(),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    storeCode: varchar("store_code", { length: 50 }).notNull(),
    addressUid: uuid("address_uid")
      .notNull()
      .references(() => address.uid, { onDelete: "restrict" }),
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_store_org_name_unique").on(table.organizationUid, table.name),
    uniqueIndex("idx_store_org_code_unique").on(table.organizationUid, table.storeCode),
    index("idx_store_org").on(table.organizationUid),
    index("idx_store_address").on(table.addressUid),
    index("idx_store_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

// ===================
// SUPPLIER TABLES
// ===================

export const supplier = pgTable(
  "supplier",
  {
    userUid: uuid("user_uid")
      .primaryKey()
      .notNull()
      .references(() => appUser.uid, { onDelete: "cascade" }),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
    supplierCode: varchar("supplier_code", { length: 50 }).unique(),
    pan: varchar("pan", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    constitutionOfBusiness: varchar("constitution_of_business", { length: 100 }).notNull(),
    tradeType: tradeTypeEnum("trade_type").notNull(),
    contactName: varchar("contact_name", { length: 100 }),
    contactEmail: varchar("contact_email", { length: 255 }).notNull().unique(),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull().unique(),
    addressUid: uuid("address_uid")
      .notNull()
      .references(() => address.uid, { onDelete: "restrict" }),
    status: supplierStatusEnum("status").notNull(),
    extraData: jsonb("extra_data"),
    revisionNumber: integer("revision_number").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_supplier_org_name_unique").on(table.organizationUid, table.name),
    index("idx_supplier_org").on(table.organizationUid),
    index("idx_supplier_status").on(table.status),
    index("idx_supplier_code").on(table.supplierCode),
    index("idx_supplier_name").on(table.name),
    // Partial index for active suppliers
    index("idx_supplier_active")
      .on(table.organizationUid, table.name, table.supplierCode)
      .where(sql`status = 'ACTIVE' AND deleted_at IS NULL`),
    // Covering index for supplier lookups by contact info
    index("idx_supplier_contact").on(table.contactEmail, table.contactPhone),
    index("idx_supplier_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const supplierInvitation = pgTable(
  "supplier_invitation",
  {
    uid: uuid("uid").primaryKey().notNull(),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
    invitedByEmployeeUserUid: uuid("invited_by_employee_user_uid").references(() => appUser.uid, {
      onDelete: "set null",
    }),
    email: varchar("email", { length: 255 }).notNull(),
    status: invitationStatusEnum("status").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_supplier_invitation_org").on(table.organizationUid),
    index("idx_supplier_invitation_email").on(table.email),
    index("idx_supplier_invitation_status").on(table.status),
    index("idx_supplier_invitation_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const supplierSite = pgTable(
  "supplier_site",
  {
    userUid: uuid("user_uid")
      .primaryKey()
      .notNull()
      .references(() => appUser.uid, { onDelete: "cascade" }),
    supplierUserUid: uuid("supplier_user_uid")
      .notNull()
      .references(() => supplier.userUid, { onDelete: "cascade" }),
    siteName: varchar("site_name", { length: 200 }).notNull(),
    siteCode: varchar("site_code", { length: 50 }),
    status: approvalStatusEnum("status").notNull(),
    classification: varchar("classification", { length: 100 }),
    businessType: varchar("business_type", { length: 100 }),
    gstNumber: varchar("gst_number", { length: 15 }),
    fssaiNumber: varchar("fssai_number", { length: 20 }),
    msmeNumber: varchar("msme_number", { length: 30 }),
    isActive: boolean("is_active").notNull().default(true),
    addressUid: uuid("address_uid")
      .notNull()
      .references(() => address.uid, { onDelete: "restrict" }),
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_supplier_site_name_unique").on(table.supplierUserUid, table.siteName),
    index("idx_site_supplier").on(table.supplierUserUid),
    index("idx_site_status").on(table.status),
    index("idx_site_address").on(table.addressUid),
    index("idx_site_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const supplierSiteDocument = pgTable(
  "supplier_site_document",
  {
    uid: uuid("uid").primaryKey().notNull(),
    supplierSiteUserUid: uuid("supplier_site_user_uid")
      .notNull()
      .references(() => supplierSite.userUid, { onDelete: "cascade" }),
    documentType: documentStatusEnum("document_type").notNull(),
    filePath: varchar("file_path", { length: 255 }).notNull().unique(),
    verificationStatus: approvalStatusEnum("verification_status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_document_site").on(table.supplierSiteUserUid),
    index("idx_document_type").on(table.documentType),
    index("idx_document_status").on(table.verificationStatus),
    index("idx_document_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const documentVerification = pgTable(
  "document_verification",
  {
    uid: uuid("uid").primaryKey().notNull(),
    supplierUserUid: uuid("supplier_user_uid")
      .notNull()
      .references(() => supplier.userUid, { onDelete: "cascade" }),
    supplierSiteUserUid: uuid("supplier_site_user_uid")
      .notNull()
      .references(() => supplierSite.userUid, { onDelete: "cascade" }),
    documentType: documentStatusEnum("document_type").notNull(),
    status: approvalStatusEnum("status").notNull(),
    requestPayload: jsonb("request_payload"),
    responsePayload: jsonb("response_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_verification_supplier").on(table.supplierUserUid),
    index("idx_verification_site").on(table.supplierSiteUserUid),
    index("idx_verification_type").on(table.documentType),
    index("idx_verification_status").on(table.status),
    index("idx_document_verification_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

// ===================
// PAYMENT & TERMS TABLES
// ===================

// Parent term table
export const supplierSiteTerm = pgTable(
  "supplier_site_term",
  {
    uid: uuid("uid").primaryKey().notNull(),
    supplierSiteUserUid: uuid("supplier_site_user_uid")
      .notNull()
      .references(() => supplierSite.userUid, { onDelete: "cascade" }),
    termType: termTypeEnum("term_type").notNull(),
    effectiveDate: timestamp("effective_date", { withTimezone: true }),
    expirationDate: timestamp("expiration_date", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    approvalStatus: approvalStatusEnum("approval_status"),
    versionNumber: integer("version_number").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_site_term_site").on(table.supplierSiteUserUid),
    index("idx_site_term_type").on(table.termType),
    index("idx_site_term_status").on(table.approvalStatus),
    index("idx_site_term_effective_date").on(table.effectiveDate),
    index("idx_site_term_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

// Financial terms
export const supplierFinancialTerm = pgTable("supplier_financial_term", {
  termUid: uuid("term_uid")
    .primaryKey()
    .notNull()
    .references(() => supplierSiteTerm.uid, { onDelete: "cascade" }),
  agreedCreditDays: integer("agreed_credit_days"),
  paymentMethod: varchar("payment_method", { length: 100 }),
  turnoverIncentiveAmount: decimal("turnover_incentive_amount", { precision: 10, scale: 2 }),
  turnoverIncentivePercent: decimal("turnover_incentive_percent", { precision: 5, scale: 2 }),
  turnoverRealizationFrequency: varchar("turnover_realization_frequency", { length: 50 }),
  turnoverRealizationMethod: varchar("turnover_realization_method", { length: 50 }),
  vendorListingFees: decimal("vendor_listing_fees", { precision: 10, scale: 2 }),
  vendorListingFeesChecked: boolean("vendor_listing_fees_checked"),
}).enableRLS();

// Trade terms
export const supplierTradeTerm = pgTable("supplier_trade_term", {
  termUid: uuid("term_uid")
    .primaryKey()
    .notNull()
    .references(() => supplierSiteTerm.uid, { onDelete: "cascade" }),
  leadTimeDays: integer("lead_time_days"),
  saleOrReturn: boolean("sale_or_return").default(false),
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }),
  daysEarlier: integer("days_earlier"),
  shrinkSharing: varchar("shrink_sharing", { length: 100 }),
  shrinkSharingPercent: decimal("shrink_sharing_percent", { precision: 5, scale: 2 }),
}).enableRLS();

// Support terms
export const supplierSupportTerm = pgTable("supplier_support_term", {
  termUid: uuid("term_uid")
    .primaryKey()
    .notNull()
    .references(() => supplierSiteTerm.uid, { onDelete: "cascade" }),
  merchandisingSupportAmount: decimal("merchandising_support_amount", { precision: 10, scale: 2 }),
  merchandisingSupportPersonCount: integer("merchandising_support_person_count"),
  merchandisingSupportPercent: decimal("merchandising_support_percent", { precision: 5, scale: 2 }),
  merchandisingSupportFrequency: varchar("merchandising_support_frequency", { length: 50 }),
  merchandisingSupportMethod: varchar("merchandising_support_method", { length: 50 }),
  barcodeAmount: decimal("barcode_amount", { precision: 10, scale: 2 }),
  barcodePercent: decimal("barcode_percent", { precision: 5, scale: 2 }),
  barcodeFrequency: varchar("barcode_frequency", { length: 50 }),
  barcodeMethod: varchar("barcode_method", { length: 50 }),
  newProductIntroFeeAmount: decimal("new_product_intro_fee_amount", { precision: 10, scale: 2 }),
  newProductIntroFeePercent: decimal("new_product_intro_fee_percent", { precision: 5, scale: 2 }),
  newProductIntroFeeFrequency: varchar("new_product_intro_fee_frequency", { length: 50 }),
  newProductIntroFeeMethod: varchar("new_product_intro_fee_method", { length: 50 }),
  storeOpeningSupportAmount: decimal("store_opening_support_amount", { precision: 10, scale: 2 }),
  storeOpeningSupportFrequency: varchar("store_opening_support_frequency", { length: 50 }),
  storeOpeningSupportMethod: varchar("store_opening_support_method", { length: 50 }),
  storeAnniversarySupportAmount: decimal("store_anniversary_support_amount", {
    precision: 10,
    scale: 2,
  }),
  storeAnniversarySupportFrequency: varchar("store_anniversary_support_frequency", { length: 50 }),
  storeAnniversarySupportMethod: varchar("store_anniversary_support_method", { length: 50 }),
}).enableRLS();

export const supplierTermNote = pgTable(
  "supplier_term_note",
  {
    uid: uuid("uid").primaryKey().notNull(),
    termUid: uuid("term_uid")
      .notNull()
      .references(() => supplierSiteTerm.uid, { onDelete: "cascade" }),
    noteText: text("note_text").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => appUser.uid, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_term_note_term").on(table.termUid),
    index("idx_term_note_created_by").on(table.createdBy),
    index("idx_term_note_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

// ===================
// APPROVAL WORKFLOW TABLES
// ===================

export const approvalProcess = pgTable(
  "approval_process",
  {
    uid: uuid("uid").primaryKey().notNull(),
    organizationUid: uuid("organization_uid")
      .notNull()
      .references(() => organization.uid, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    extraData: jsonb("extra_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_approval_process_org_name_unique").on(table.organizationUid, table.name),
    index("idx_approval_process_org").on(table.organizationUid),
    index("idx_approval_process_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const approvalStep = pgTable(
  "approval_step",
  {
    uid: uuid("uid").primaryKey().notNull(),
    approvalProcessUid: uuid("approval_process_uid")
      .notNull()
      .references(() => approvalProcess.uid, { onDelete: "cascade" }),
    stepName: varchar("step_name", { length: 100 }).notNull(),
    stepOrder: integer("step_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    uniqueIndex("idx_approval_step_process_order_unique").on(
      table.approvalProcessUid,
      table.stepOrder
    ),
    index("idx_approval_step_process").on(table.approvalProcessUid),
    index("idx_approval_step_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const approvalResponsibility = pgTable(
  "approval_responsibility",
  {
    uid: uuid("uid").primaryKey().notNull(),
    approvalStepUid: uuid("approval_step_uid")
      .notNull()
      .references(() => approvalStep.uid, { onDelete: "cascade" }),
    responsibilityType: varchar("responsibility_type", { length: 50 }).notNull(),
    roleUid: uuid("role_uid").references(() => role.uid, { onDelete: "set null" }),
    orgUnitUid: uuid("org_unit_uid").references(() => orgUnit.uid, { onDelete: "set null" }),
    employeeUserUid: uuid("employee_user_uid").references(() => appUser.uid, {
      onDelete: "set null",
    }),
    fallbackRoleUid: uuid("fallback_role_uid").references(() => role.uid, { onDelete: "set null" }),
    fallbackOrgUnitUid: uuid("fallback_org_unit_uid").references(() => orgUnit.uid, {
      onDelete: "set null",
    }),
    fallbackEmployeeUserUid: uuid("fallback_employee_user_uid").references(() => appUser.uid, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_approval_responsibility_step").on(table.approvalStepUid),
    index("idx_approval_responsibility_role").on(table.roleUid),
    index("idx_approval_responsibility_org_unit").on(table.orgUnitUid),
    index("idx_approval_responsibility_employee").on(table.employeeUserUid),
    index("idx_approval_responsibility_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const approvalRequest = pgTable(
  "approval_request",
  {
    uid: uuid("uid").primaryKey().notNull(),
    approvalProcessUid: uuid("approval_process_uid")
      .notNull()
      .references(() => approvalProcess.uid, { onDelete: "restrict" }),
    supplierUserUid: uuid("supplier_user_uid")
      .notNull()
      .references(() => supplier.userUid, { onDelete: "cascade" }),
    supplierSiteUserUid: uuid("supplier_site_user_uid").references(() => supplierSite.userUid, {
      onDelete: "cascade",
    }),
    termUid: uuid("term_uid").references(() => supplierSiteTerm.uid, { onDelete: "cascade" }),
    stepUid: uuid("step_uid")
      .notNull()
      .references(() => approvalStep.uid, { onDelete: "restrict" }),
    status: approvalStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_approval_request_process").on(table.approvalProcessUid),
    index("idx_approval_request_supplier").on(table.supplierUserUid),
    index("idx_approval_request_site").on(table.supplierSiteUserUid),
    index("idx_approval_request_term").on(table.termUid),
    index("idx_approval_request_step").on(table.stepUid),
    index("idx_approval_request_status").on(table.status),
    index("idx_approval_request_completed_at").on(table.completedAt),
    index("idx_approval_request_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const approvalLog = pgTable(
  "approval_log",
  {
    uid: uuid("uid").primaryKey().notNull(),
    approvalRequestUid: uuid("approval_request_uid")
      .notNull()
      .references(() => approvalRequest.uid, { onDelete: "cascade" }),
    approvalStepUid: uuid("approval_step_uid")
      .notNull()
      .references(() => approvalStep.uid, { onDelete: "restrict" }),
    actionByUserUid: uuid("action_by_user_uid").references(() => appUser.uid, {
      onDelete: "set null",
    }),
    actionDate: timestamp("action_date", { withTimezone: true }).notNull().defaultNow(),
    status: approvalStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    lastUpdatedBy: uuid("last_updated_by"),
  },
  (table) => [
    index("idx_approval_log_request").on(table.approvalRequestUid),
    index("idx_approval_log_step").on(table.approvalStepUid),
    index("idx_approval_log_user").on(table.actionByUserUid),
    index("idx_approval_log_date").on(table.actionDate),
    index("idx_approval_log_status").on(table.status),
    index("idx_approval_log_deleted_at").on(table.deletedAt),
  ]
).enableRLS();

export const approvalComment = pgTable(
  "approval_comment",
  {
    uid: uuid("uid").primaryKey().notNull(),
    approvalRequestUid: uuid("approval_request_uid")
      .notNull()
      .references(() => approvalRequest.uid, { onDelete: "cascade" }),
    approvalStepUid: uuid("approval_step_uid")
      .notNull()
      .references(() => approvalStep.uid, { onDelete: "restrict" }),
    commentText: text("comment_text").notNull(),
    commentByUserUid: uuid("comment_by_user_uid")
      .notNull()
      .references(() => appUser.uid, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid("created_by"),
  },
  (table) => [
    index("idx_approval_comment_request").on(table.approvalRequestUid),
    index("idx_approval_comment_step").on(table.approvalStepUid),
    index("idx_approval_comment_user").on(table.commentByUserUid),
    index("idx_approval_comment_created_at").on(table.createdAt),
  ]
).enableRLS();

// ===================
// RELATIONSHIPS
// ===================

// Define relations for appUser
export const appUserRelations = relations(appUser, ({ one, many }) => ({
  employee: one(employee, {
    relationName: "userToEmployee",
    fields: [appUser.uid],
    references: [employee.userUid],
  }),
  supplier: one(supplier, {
    relationName: "userToSupplier",
    fields: [appUser.uid],
    references: [supplier.userUid],
  }),
  supplierSite: one(supplierSite, {
    relationName: "userToSupplierSite",
    fields: [appUser.uid],
    references: [supplierSite.userUid],
  }),
  comments: many(approvalComment, {
    relationName: "userToComments",
  }),
  approvalLogs: many(approvalLog, {
    relationName: "userToApprovalLogs",
  }),
  termNotes: many(supplierTermNote, {
    relationName: "userToTermNotes",
  }),
}));

// Define relations for organization
export const organizationRelations = relations(organization, ({ many }) => ({
  employees: many(employee, {
    relationName: "organizationToEmployees",
  }),
  suppliers: many(supplier, {
    relationName: "organizationToSuppliers",
  }),
  orgUnits: many(orgUnit, {
    relationName: "organizationToOrgUnits",
  }),
  roles: many(role, {
    relationName: "organizationToRoles",
  }),
  stores: many(store, {
    relationName: "organizationToStores",
  }),
  approvalProcesses: many(approvalProcess, {
    relationName: "organizationToApprovalProcesses",
  }),
}));

// Define relations for orgUnit (including self-reference)
export const orgUnitRelations = relations(orgUnit, ({ one, many }) => ({
  parent: one(orgUnit, {
    relationName: "parentChild",
    fields: [orgUnit.parentUid],
    references: [orgUnit.uid],
  }),
  children: many(orgUnit, {
    relationName: "parentChild",
  }),
  organization: one(organization, {
    relationName: "organizationToOrgUnits",
    fields: [orgUnit.organizationUid],
    references: [organization.uid],
  }),
  employeeOrgUnitRoles: many(employeeOrgUnitRole, {
    relationName: "orgUnitToEmployeeRoles",
  }),
  responsibilities: many(approvalResponsibility, {
    relationName: "orgUnitToResponsibilities",
  }),
  fallbackResponsibilities: many(approvalResponsibility, {
    relationName: "fallbackOrgUnitToResponsibilities",
  }),
}));

// Define relations for employee
export const employeeRelations = relations(employee, ({ one, many }) => ({
  user: one(appUser, {
    relationName: "userToEmployee",
    fields: [employee.userUid],
    references: [appUser.uid],
  }),
  organization: one(organization, {
    relationName: "organizationToEmployees",
    fields: [employee.organizationUid],
    references: [organization.uid],
  }),
  orgUnitRoles: many(employeeOrgUnitRole, {
    relationName: "employeeToOrgUnitRoles",
  }),
  responsibilities: many(approvalResponsibility, {
    relationName: "employeeToResponsibilities",
  }),
  fallbackResponsibilities: many(approvalResponsibility, {
    relationName: "fallbackEmployeeToResponsibilities",
  }),
  invitations: many(supplierInvitation, {
    relationName: "employeeToInvitations",
  }),
}));

// Define relations for supplierInvitation
export const supplierInvitationRelations = relations(supplierInvitation, ({ one }) => ({
  organization: one(organization, {
    relationName: "organizationToInvitations",
    fields: [supplierInvitation.organizationUid],
    references: [organization.uid],
  }),
  invitedBy: one(appUser, {
    relationName: "employeeToInvitations",
    fields: [supplierInvitation.invitedByEmployeeUserUid],
    references: [appUser.uid],
  }),
}));

// Define relations for supplier
export const supplierRelations = relations(supplier, ({ one, many }) => ({
  user: one(appUser, {
    relationName: "userToSupplier",
    fields: [supplier.userUid],
    references: [appUser.uid],
  }),
  organization: one(organization, {
    relationName: "organizationToSuppliers",
    fields: [supplier.organizationUid],
    references: [organization.uid],
  }),
  address: one(address, {
    relationName: "addressToSuppliers",
    fields: [supplier.addressUid],
    references: [address.uid],
  }),
  sites: many(supplierSite, {
    relationName: "supplierToSites",
  }),
  approvalRequests: many(approvalRequest, {
    relationName: "supplierToApprovalRequests",
  }),
  verifications: many(documentVerification, {
    relationName: "supplierToVerifications",
  }),
}));

// Define relations for supplierSite
export const supplierSiteRelations = relations(supplierSite, ({ one, many }) => ({
  user: one(appUser, {
    relationName: "userToSupplierSite",
    fields: [supplierSite.userUid],
    references: [appUser.uid],
  }),
  supplier: one(supplier, {
    relationName: "supplierToSites",
    fields: [supplierSite.supplierUserUid],
    references: [supplier.userUid],
  }),
  address: one(address, {
    relationName: "addressToSupplierSites",
    fields: [supplierSite.addressUid],
    references: [address.uid],
  }),
  documents: many(supplierSiteDocument, {
    relationName: "siteToDocuments",
  }),
  terms: many(supplierSiteTerm, {
    relationName: "siteToTerms",
  }),
  verifications: many(documentVerification, {
    relationName: "siteToVerifications",
  }),
  approvalRequests: many(approvalRequest, {
    relationName: "siteToApprovalRequests",
  }),
}));

// Define relations for supplierSiteDocument
export const supplierSiteDocumentRelations = relations(supplierSiteDocument, ({ one }) => ({
  supplierSite: one(supplierSite, {
    relationName: "siteToDocuments",
    fields: [supplierSiteDocument.supplierSiteUserUid],
    references: [supplierSite.userUid],
  }),
}));

// Define relations for documentVerification
export const documentVerificationRelations = relations(documentVerification, ({ one }) => ({
  supplier: one(supplier, {
    relationName: "supplierToVerifications",
    fields: [documentVerification.supplierUserUid],
    references: [supplier.userUid],
  }),
  supplierSite: one(supplierSite, {
    relationName: "siteToVerifications",
    fields: [documentVerification.supplierSiteUserUid],
    references: [supplierSite.userUid],
  }),
}));

// Define relations for supplierSiteTerm
export const supplierSiteTermRelations = relations(supplierSiteTerm, ({ one, many }) => ({
  supplierSite: one(supplierSite, {
    relationName: "siteToTerms",
    fields: [supplierSiteTerm.supplierSiteUserUid],
    references: [supplierSite.userUid],
  }),
  financialTerm: one(supplierFinancialTerm, {
    relationName: "termToFinancialTerm",
    fields: [supplierSiteTerm.uid],
    references: [supplierFinancialTerm.termUid],
  }),
  tradeTerm: one(supplierTradeTerm, {
    relationName: "termToTradeTerm",
    fields: [supplierSiteTerm.uid],
    references: [supplierTradeTerm.termUid],
  }),
  supportTerm: one(supplierSupportTerm, {
    relationName: "termToSupportTerm",
    fields: [supplierSiteTerm.uid],
    references: [supplierSupportTerm.termUid],
  }),
  notes: many(supplierTermNote, {
    relationName: "termToNotes",
  }),
  approvalRequests: many(approvalRequest, {
    relationName: "termToApprovalRequests",
  }),
}));

// Define relations for child term tables
export const supplierFinancialTermRelations = relations(supplierFinancialTerm, ({ one }) => ({
  term: one(supplierSiteTerm, {
    relationName: "termToFinancialTerm",
    fields: [supplierFinancialTerm.termUid],
    references: [supplierSiteTerm.uid],
  }),
}));

export const supplierTradeTermRelations = relations(supplierTradeTerm, ({ one }) => ({
  term: one(supplierSiteTerm, {
    relationName: "termToTradeTerm",
    fields: [supplierTradeTerm.termUid],
    references: [supplierSiteTerm.uid],
  }),
}));

export const supplierSupportTermRelations = relations(supplierSupportTerm, ({ one }) => ({
  term: one(supplierSiteTerm, {
    relationName: "termToSupportTerm",
    fields: [supplierSupportTerm.termUid],
    references: [supplierSiteTerm.uid],
  }),
}));

// Define relations for supplierTermNote
export const supplierTermNoteRelations = relations(supplierTermNote, ({ one }) => ({
  term: one(supplierSiteTerm, {
    relationName: "termToNotes",
    fields: [supplierTermNote.termUid],
    references: [supplierSiteTerm.uid],
  }),
  creator: one(appUser, {
    relationName: "userToTermNotes",
    fields: [supplierTermNote.createdBy],
    references: [appUser.uid],
  }),
}));

// Define relations for approvalProcess
export const approvalProcessRelations = relations(approvalProcess, ({ one, many }) => ({
  organization: one(organization, {
    relationName: "organizationToApprovalProcesses",
    fields: [approvalProcess.organizationUid],
    references: [organization.uid],
  }),
  steps: many(approvalStep, {
    relationName: "processToSteps",
  }),
  requests: many(approvalRequest, {
    relationName: "processToRequests",
  }),
}));

// Define relations for approvalStep
export const approvalStepRelations = relations(approvalStep, ({ one, many }) => ({
  process: one(approvalProcess, {
    relationName: "processToSteps",
    fields: [approvalStep.approvalProcessUid],
    references: [approvalProcess.uid],
  }),
  responsibilities: many(approvalResponsibility, {
    relationName: "stepToResponsibilities",
  }),
  requests: many(approvalRequest, {
    relationName: "stepToRequests",
  }),
  logs: many(approvalLog, {
    relationName: "stepToLogs",
  }),
  comments: many(approvalComment, {
    relationName: "stepToComments",
  }),
}));

// Define relations for approvalResponsibility
export const approvalResponsibilityRelations = relations(approvalResponsibility, ({ one }) => ({
  step: one(approvalStep, {
    relationName: "stepToResponsibilities",
    fields: [approvalResponsibility.approvalStepUid],
    references: [approvalStep.uid],
  }),
  role: one(role, {
    relationName: "roleResponsibilities",
    fields: [approvalResponsibility.roleUid],
    references: [role.uid],
  }),
  orgUnit: one(orgUnit, {
    relationName: "orgUnitToResponsibilities",
    fields: [approvalResponsibility.orgUnitUid],
    references: [orgUnit.uid],
  }),
  employee: one(employee, {
    relationName: "employeeToResponsibilities",
    fields: [approvalResponsibility.employeeUserUid],
    references: [employee.userUid],
  }),
  fallbackRole: one(role, {
    relationName: "fallbackRoleResponsibilities",
    fields: [approvalResponsibility.fallbackRoleUid],
    references: [role.uid],
  }),
  fallbackOrgUnit: one(orgUnit, {
    relationName: "fallbackOrgUnitToResponsibilities",
    fields: [approvalResponsibility.fallbackOrgUnitUid],
    references: [orgUnit.uid],
  }),
  fallbackEmployee: one(employee, {
    relationName: "fallbackEmployeeToResponsibilities",
    fields: [approvalResponsibility.fallbackEmployeeUserUid],
    references: [employee.userUid],
  }),
}));

// Define relations for approvalRequest
export const approvalRequestRelations = relations(approvalRequest, ({ one, many }) => ({
  process: one(approvalProcess, {
    relationName: "processToRequests",
    fields: [approvalRequest.approvalProcessUid],
    references: [approvalProcess.uid],
  }),
  supplier: one(supplier, {
    relationName: "supplierToApprovalRequests",
    fields: [approvalRequest.supplierUserUid],
    references: [supplier.userUid],
  }),
  supplierSite: one(supplierSite, {
    relationName: "siteToApprovalRequests",
    fields: [approvalRequest.supplierSiteUserUid],
    references: [supplierSite.userUid],
  }),
  term: one(supplierSiteTerm, {
    relationName: "termToApprovalRequests",
    fields: [approvalRequest.termUid],
    references: [supplierSiteTerm.uid],
  }),
  currentStep: one(approvalStep, {
    relationName: "stepToRequests",
    fields: [approvalRequest.stepUid],
    references: [approvalStep.uid],
  }),
  logs: many(approvalLog, {
    relationName: "requestToLogs",
  }),
  comments: many(approvalComment, {
    relationName: "requestToComments",
  }),
}));

// Define relations for approvalLog
export const approvalLogRelations = relations(approvalLog, ({ one }) => ({
  request: one(approvalRequest, {
    relationName: "requestToLogs",
    fields: [approvalLog.approvalRequestUid],
    references: [approvalRequest.uid],
  }),
  step: one(approvalStep, {
    relationName: "stepToLogs",
    fields: [approvalLog.approvalStepUid],
    references: [approvalStep.uid],
  }),
  actionBy: one(appUser, {
    relationName: "userToApprovalLogs",
    fields: [approvalLog.actionByUserUid],
    references: [appUser.uid],
  }),
}));

// Define relations for approvalComment
export const approvalCommentRelations = relations(approvalComment, ({ one }) => ({
  request: one(approvalRequest, {
    relationName: "requestToComments",
    fields: [approvalComment.approvalRequestUid],
    references: [approvalRequest.uid],
  }),
  step: one(approvalStep, {
    relationName: "stepToComments",
    fields: [approvalComment.approvalStepUid],
    references: [approvalStep.uid],
  }),
  user: one(appUser, {
    relationName: "userToComments",
    fields: [approvalComment.commentByUserUid],
    references: [appUser.uid],
  }),
}));

// Define relations for role
export const roleRelations = relations(role, ({ one, many }) => ({
  organization: one(organization, {
    relationName: "organizationToRoles",
    fields: [role.organizationUid],
    references: [organization.uid],
  }),
  employeeOrgUnitRoles: many(employeeOrgUnitRole, {
    relationName: "roleToEmployeeOrgUnitRoles",
  }),
  approvalResponsibilities: many(approvalResponsibility, {
    relationName: "roleResponsibilities",
  }),
  fallbackResponsibilities: many(approvalResponsibility, {
    relationName: "fallbackRoleResponsibilities",
  }),
}));

// Define relations for store
export const storeRelations = relations(store, ({ one }) => ({
  organization: one(organization, {
    relationName: "organizationToStores",
    fields: [store.organizationUid],
    references: [organization.uid],
  }),
  address: one(address, {
    relationName: "addressToStores",
    fields: [store.addressUid],
    references: [address.uid],
  }),
}));

// Define relations for employeeOrgUnitRole
export const employeeOrgUnitRoleRelations = relations(employeeOrgUnitRole, ({ one }) => ({
  employee: one(employee, {
    relationName: "employeeToOrgUnitRoles",
    fields: [employeeOrgUnitRole.employeeUserUid],
    references: [employee.userUid],
  }),
  orgUnit: one(orgUnit, {
    relationName: "orgUnitToEmployeeRoles",
    fields: [employeeOrgUnitRole.orgUnitUid],
    references: [orgUnit.uid],
  }),
  role: one(role, {
    relationName: "roleToEmployeeOrgUnitRoles",
    fields: [employeeOrgUnitRole.roleUid],
    references: [role.uid],
  }),
}));

// Define relations for address
export const addressRelations = relations(address, ({ many }) => ({
  suppliers: many(supplier, {
    relationName: "addressToSuppliers",
  }),
  supplierSites: many(supplierSite, {
    relationName: "addressToSupplierSites",
  }),
  stores: many(store, {
    relationName: "addressToStores",
  }),
}));
