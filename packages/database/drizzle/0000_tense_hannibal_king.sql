CREATE TYPE "public"."address_type_enum" AS ENUM('BILLING', 'SHIPPING', 'REGISTERED', 'OPERATIONAL');--> statement-breakpoint
CREATE TYPE "public"."approval_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ESCALATED', 'DELEGATED');--> statement-breakpoint
CREATE TYPE "public"."approver_type_enum" AS ENUM('USER', 'ROLE');--> statement-breakpoint
CREATE TYPE "public"."document_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."invitation_status_enum" AS ENUM('SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."org_unit_type_enum" AS ENUM('DIVISION', 'DEPARTMENT', 'TEAM', 'REGION', 'BUSINESS_UNIT', 'SUBSIDIARY');--> statement-breakpoint
CREATE TYPE "public"."standard_term_type_enum" AS ENUM('PAYMENT', 'DELIVERY', 'WARRANTY', 'SERVICE_LEVEL');--> statement-breakpoint
CREATE TYPE "public"."supplier_status_enum" AS ENUM('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."term_type_enum" AS ENUM('FINANCIAL', 'TRADE', 'SUPPORT');--> statement-breakpoint
CREATE TYPE "public"."trade_type_enum" AS ENUM('GOODS', 'SERVICES', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."user_type_enum" AS ENUM('EMPLOYEE', 'SUPPLIER', 'SUPPLIER_SITE', 'ADMIN');--> statement-breakpoint
CREATE TABLE "address" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"line1" varchar(200) NOT NULL,
	"line2" varchar(200),
	"line3" varchar(200),
	"line4" varchar(200),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"pincode" varchar(20) NOT NULL,
	"address_type" "address_type_enum" NOT NULL,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "address" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "app_user" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"clerk_id" uuid NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"user_type" "user_type_enum" NOT NULL,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid,
	CONSTRAINT "app_user_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "app_user_user_name_unique" UNIQUE("user_name")
);
--> statement-breakpoint
ALTER TABLE "app_user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_comment" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"approval_request_uid" uuid NOT NULL,
	"approval_step_uid" uuid NOT NULL,
	"comment_text" text NOT NULL,
	"comment_by_user_uid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
ALTER TABLE "approval_comment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_log" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"approval_request_uid" uuid NOT NULL,
	"approval_step_uid" uuid NOT NULL,
	"action_by_user_uid" uuid,
	"action_date" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "approval_status_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "approval_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_process" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"organization_uid" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "approval_process" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_request" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"approval_process_uid" uuid NOT NULL,
	"supplier_user_uid" uuid NOT NULL,
	"supplier_site_user_uid" uuid,
	"term_uid" uuid,
	"step_uid" uuid NOT NULL,
	"status" "approval_status_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "approval_request" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_responsibility" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"approval_step_uid" uuid NOT NULL,
	"responsibility_type" varchar(50) NOT NULL,
	"role_uid" uuid,
	"org_unit_uid" uuid,
	"employee_user_uid" uuid,
	"fallback_role_uid" uuid,
	"fallback_org_unit_uid" uuid,
	"fallback_employee_user_uid" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "approval_responsibility" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_step" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"approval_process_uid" uuid NOT NULL,
	"step_name" varchar(100) NOT NULL,
	"step_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "approval_step" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "document_verification" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"supplier_user_uid" uuid NOT NULL,
	"supplier_site_user_uid" uuid NOT NULL,
	"document_type" "document_status_enum" NOT NULL,
	"status" "approval_status_enum" NOT NULL,
	"request_payload" jsonb,
	"response_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "document_verification" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "employee" (
	"user_uid" uuid NOT NULL,
	"organization_uid" uuid NOT NULL,
	"employee_code" varchar(50) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid,
	CONSTRAINT "employee_user_uid_pk" PRIMARY KEY("user_uid"),
	CONSTRAINT "employee_email_unique" UNIQUE("email"),
	CONSTRAINT "employee_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "employee" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "employee_org_unit_role" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"employee_user_uid" uuid NOT NULL,
	"org_unit_uid" uuid NOT NULL,
	"role_uid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "employee_org_unit_role" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "org_unit" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"organization_uid" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"org_unit_code" varchar(50) NOT NULL,
	"unit_type" "org_unit_type_enum" NOT NULL,
	"parent_uid" uuid,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "org_unit" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organization" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"max_user_count" integer NOT NULL,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid,
	CONSTRAINT "organization_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "role" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"organization_uid" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"role_code" varchar(50),
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "role" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"organization_uid" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"store_code" varchar(50) NOT NULL,
	"address_uid" uuid NOT NULL,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "store" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier" (
	"user_uid" uuid PRIMARY KEY NOT NULL,
	"organization_uid" uuid NOT NULL,
	"supplier_code" varchar(50),
	"pan" varchar(10) NOT NULL,
	"name" varchar(200) NOT NULL,
	"constitution_of_business" varchar(100) NOT NULL,
	"trade_type" "trade_type_enum" NOT NULL,
	"contact_name" varchar(100),
	"contact_email" varchar(255) NOT NULL,
	"contact_phone" varchar(20) NOT NULL,
	"address_uid" uuid NOT NULL,
	"status" "supplier_status_enum" NOT NULL,
	"extra_data" jsonb,
	"revision_number" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid,
	CONSTRAINT "supplier_supplier_code_unique" UNIQUE("supplier_code"),
	CONSTRAINT "supplier_pan_unique" UNIQUE("pan"),
	CONSTRAINT "supplier_contact_email_unique" UNIQUE("contact_email"),
	CONSTRAINT "supplier_contact_phone_unique" UNIQUE("contact_phone")
);
--> statement-breakpoint
ALTER TABLE "supplier" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_financial_term" (
	"term_uid" uuid PRIMARY KEY NOT NULL,
	"agreed_credit_days" integer,
	"payment_method" varchar(100),
	"turnover_incentive_amount" numeric(10, 2),
	"turnover_incentive_percent" numeric(5, 2),
	"turnover_realization_frequency" varchar(50),
	"turnover_realization_method" varchar(50),
	"vendor_listing_fees" numeric(10, 2),
	"vendor_listing_fees_checked" boolean
);
--> statement-breakpoint
ALTER TABLE "supplier_financial_term" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_invitation" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"organization_uid" uuid NOT NULL,
	"invited_by_employee_user_uid" uuid,
	"email" varchar(255) NOT NULL,
	"status" "invitation_status_enum" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "supplier_invitation" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_site" (
	"user_uid" uuid PRIMARY KEY NOT NULL,
	"supplier_user_uid" uuid NOT NULL,
	"site_name" varchar(200) NOT NULL,
	"site_code" varchar(50),
	"status" "approval_status_enum" NOT NULL,
	"classification" varchar(100),
	"business_type" varchar(100),
	"gst_number" varchar(15),
	"fssai_number" varchar(20),
	"msme_number" varchar(30),
	"is_active" boolean DEFAULT true NOT NULL,
	"address_uid" uuid NOT NULL,
	"extra_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "supplier_site" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_site_document" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"supplier_site_user_uid" uuid NOT NULL,
	"document_type" "document_status_enum" NOT NULL,
	"file_path" varchar(255) NOT NULL,
	"verification_status" "approval_status_enum" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid,
	CONSTRAINT "supplier_site_document_file_path_unique" UNIQUE("file_path")
);
--> statement-breakpoint
ALTER TABLE "supplier_site_document" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_site_term" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"supplier_site_user_uid" uuid NOT NULL,
	"term_type" "term_type_enum" NOT NULL,
	"effective_date" timestamp with time zone,
	"expiration_date" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"approval_status" "approval_status_enum",
	"version_number" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" uuid,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "supplier_site_term" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_support_term" (
	"term_uid" uuid PRIMARY KEY NOT NULL,
	"merchandising_support_amount" numeric(10, 2),
	"merchandising_support_person_count" integer,
	"merchandising_support_percent" numeric(5, 2),
	"merchandising_support_frequency" varchar(50),
	"merchandising_support_method" varchar(50),
	"barcode_amount" numeric(10, 2),
	"barcode_percent" numeric(5, 2),
	"barcode_frequency" varchar(50),
	"barcode_method" varchar(50),
	"new_product_intro_fee_amount" numeric(10, 2),
	"new_product_intro_fee_percent" numeric(5, 2),
	"new_product_intro_fee_frequency" varchar(50),
	"new_product_intro_fee_method" varchar(50),
	"store_opening_support_amount" numeric(10, 2),
	"store_opening_support_frequency" varchar(50),
	"store_opening_support_method" varchar(50),
	"store_anniversary_support_amount" numeric(10, 2),
	"store_anniversary_support_frequency" varchar(50),
	"store_anniversary_support_method" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "supplier_support_term" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_term_note" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"term_uid" uuid NOT NULL,
	"note_text" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"last_updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "supplier_term_note" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_trade_term" (
	"term_uid" uuid PRIMARY KEY NOT NULL,
	"lead_time_days" integer,
	"sale_or_return" boolean DEFAULT false,
	"discount_percent" numeric(5, 2),
	"days_earlier" integer,
	"shrink_sharing" varchar(100),
	"shrink_sharing_percent" numeric(5, 2)
);
--> statement-breakpoint
ALTER TABLE "supplier_trade_term" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "approval_comment" ADD CONSTRAINT "approval_comment_approval_request_uid_approval_request_uid_fk" FOREIGN KEY ("approval_request_uid") REFERENCES "public"."approval_request"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_comment" ADD CONSTRAINT "approval_comment_approval_step_uid_approval_step_uid_fk" FOREIGN KEY ("approval_step_uid") REFERENCES "public"."approval_step"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_comment" ADD CONSTRAINT "approval_comment_comment_by_user_uid_app_user_uid_fk" FOREIGN KEY ("comment_by_user_uid") REFERENCES "public"."app_user"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_log" ADD CONSTRAINT "approval_log_approval_request_uid_approval_request_uid_fk" FOREIGN KEY ("approval_request_uid") REFERENCES "public"."approval_request"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_log" ADD CONSTRAINT "approval_log_approval_step_uid_approval_step_uid_fk" FOREIGN KEY ("approval_step_uid") REFERENCES "public"."approval_step"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_log" ADD CONSTRAINT "approval_log_action_by_user_uid_app_user_uid_fk" FOREIGN KEY ("action_by_user_uid") REFERENCES "public"."app_user"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_process" ADD CONSTRAINT "approval_process_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_request" ADD CONSTRAINT "approval_request_approval_process_uid_approval_process_uid_fk" FOREIGN KEY ("approval_process_uid") REFERENCES "public"."approval_process"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_request" ADD CONSTRAINT "approval_request_supplier_user_uid_supplier_user_uid_fk" FOREIGN KEY ("supplier_user_uid") REFERENCES "public"."supplier"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_request" ADD CONSTRAINT "approval_request_supplier_site_user_uid_supplier_site_user_uid_fk" FOREIGN KEY ("supplier_site_user_uid") REFERENCES "public"."supplier_site"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_request" ADD CONSTRAINT "approval_request_term_uid_supplier_site_term_uid_fk" FOREIGN KEY ("term_uid") REFERENCES "public"."supplier_site_term"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_request" ADD CONSTRAINT "approval_request_step_uid_approval_step_uid_fk" FOREIGN KEY ("step_uid") REFERENCES "public"."approval_step"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_approval_step_uid_approval_step_uid_fk" FOREIGN KEY ("approval_step_uid") REFERENCES "public"."approval_step"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_role_uid_role_uid_fk" FOREIGN KEY ("role_uid") REFERENCES "public"."role"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_org_unit_uid_org_unit_uid_fk" FOREIGN KEY ("org_unit_uid") REFERENCES "public"."org_unit"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_employee_user_uid_app_user_uid_fk" FOREIGN KEY ("employee_user_uid") REFERENCES "public"."app_user"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_fallback_role_uid_role_uid_fk" FOREIGN KEY ("fallback_role_uid") REFERENCES "public"."role"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_fallback_org_unit_uid_org_unit_uid_fk" FOREIGN KEY ("fallback_org_unit_uid") REFERENCES "public"."org_unit"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_responsibility" ADD CONSTRAINT "approval_responsibility_fallback_employee_user_uid_app_user_uid_fk" FOREIGN KEY ("fallback_employee_user_uid") REFERENCES "public"."app_user"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_step" ADD CONSTRAINT "approval_step_approval_process_uid_approval_process_uid_fk" FOREIGN KEY ("approval_process_uid") REFERENCES "public"."approval_process"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_verification" ADD CONSTRAINT "document_verification_supplier_user_uid_supplier_user_uid_fk" FOREIGN KEY ("supplier_user_uid") REFERENCES "public"."supplier"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_verification" ADD CONSTRAINT "document_verification_supplier_site_user_uid_supplier_site_user_uid_fk" FOREIGN KEY ("supplier_site_user_uid") REFERENCES "public"."supplier_site"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_user_uid_app_user_uid_fk" FOREIGN KEY ("user_uid") REFERENCES "public"."app_user"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_org_unit_role" ADD CONSTRAINT "employee_org_unit_role_employee_user_uid_app_user_uid_fk" FOREIGN KEY ("employee_user_uid") REFERENCES "public"."app_user"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_org_unit_role" ADD CONSTRAINT "employee_org_unit_role_org_unit_uid_org_unit_uid_fk" FOREIGN KEY ("org_unit_uid") REFERENCES "public"."org_unit"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_org_unit_role" ADD CONSTRAINT "employee_org_unit_role_role_uid_role_uid_fk" FOREIGN KEY ("role_uid") REFERENCES "public"."role"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_unit" ADD CONSTRAINT "org_unit_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_address_uid_address_uid_fk" FOREIGN KEY ("address_uid") REFERENCES "public"."address"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_user_uid_app_user_uid_fk" FOREIGN KEY ("user_uid") REFERENCES "public"."app_user"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_address_uid_address_uid_fk" FOREIGN KEY ("address_uid") REFERENCES "public"."address"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_financial_term" ADD CONSTRAINT "supplier_financial_term_term_uid_supplier_site_term_uid_fk" FOREIGN KEY ("term_uid") REFERENCES "public"."supplier_site_term"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_invitation" ADD CONSTRAINT "supplier_invitation_organization_uid_organization_uid_fk" FOREIGN KEY ("organization_uid") REFERENCES "public"."organization"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_invitation" ADD CONSTRAINT "supplier_invitation_invited_by_employee_user_uid_app_user_uid_fk" FOREIGN KEY ("invited_by_employee_user_uid") REFERENCES "public"."app_user"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_site" ADD CONSTRAINT "supplier_site_user_uid_app_user_uid_fk" FOREIGN KEY ("user_uid") REFERENCES "public"."app_user"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_site" ADD CONSTRAINT "supplier_site_supplier_user_uid_supplier_user_uid_fk" FOREIGN KEY ("supplier_user_uid") REFERENCES "public"."supplier"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_site" ADD CONSTRAINT "supplier_site_address_uid_address_uid_fk" FOREIGN KEY ("address_uid") REFERENCES "public"."address"("uid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_site_document" ADD CONSTRAINT "supplier_site_document_supplier_site_user_uid_supplier_site_user_uid_fk" FOREIGN KEY ("supplier_site_user_uid") REFERENCES "public"."supplier_site"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_site_term" ADD CONSTRAINT "supplier_site_term_supplier_site_user_uid_supplier_site_user_uid_fk" FOREIGN KEY ("supplier_site_user_uid") REFERENCES "public"."supplier_site"("user_uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_support_term" ADD CONSTRAINT "supplier_support_term_term_uid_supplier_site_term_uid_fk" FOREIGN KEY ("term_uid") REFERENCES "public"."supplier_site_term"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_term_note" ADD CONSTRAINT "supplier_term_note_term_uid_supplier_site_term_uid_fk" FOREIGN KEY ("term_uid") REFERENCES "public"."supplier_site_term"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_term_note" ADD CONSTRAINT "supplier_term_note_created_by_app_user_uid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."app_user"("uid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_trade_term" ADD CONSTRAINT "supplier_trade_term_term_uid_supplier_site_term_uid_fk" FOREIGN KEY ("term_uid") REFERENCES "public"."supplier_site_term"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_address_city_state" ON "address" USING btree ("city","state","country");--> statement-breakpoint
CREATE INDEX "idx_address_type" ON "address" USING btree ("address_type");--> statement-breakpoint
CREATE INDEX "idx_address_deleted_at" ON "address" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_app_user_type" ON "app_user" USING btree ("user_type");--> statement-breakpoint
CREATE INDEX "idx_app_user_deleted_at" ON "app_user" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_approval_comment_request" ON "approval_comment" USING btree ("approval_request_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_comment_step" ON "approval_comment" USING btree ("approval_step_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_comment_user" ON "approval_comment" USING btree ("comment_by_user_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_comment_created_at" ON "approval_comment" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_approval_log_request" ON "approval_log" USING btree ("approval_request_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_log_step" ON "approval_log" USING btree ("approval_step_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_log_user" ON "approval_log" USING btree ("action_by_user_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_log_date" ON "approval_log" USING btree ("action_date");--> statement-breakpoint
CREATE INDEX "idx_approval_log_status" ON "approval_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_approval_log_deleted_at" ON "approval_log" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_approval_process_org_name_unique" ON "approval_process" USING btree ("organization_uid","name");--> statement-breakpoint
CREATE INDEX "idx_approval_process_org" ON "approval_process" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_process_deleted_at" ON "approval_process" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_approval_request_process" ON "approval_request" USING btree ("approval_process_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_request_supplier" ON "approval_request" USING btree ("supplier_user_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_request_site" ON "approval_request" USING btree ("supplier_site_user_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_request_term" ON "approval_request" USING btree ("term_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_request_step" ON "approval_request" USING btree ("step_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_request_status" ON "approval_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_approval_request_completed_at" ON "approval_request" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "idx_approval_request_deleted_at" ON "approval_request" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_approval_responsibility_step" ON "approval_responsibility" USING btree ("approval_step_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_responsibility_role" ON "approval_responsibility" USING btree ("role_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_responsibility_org_unit" ON "approval_responsibility" USING btree ("org_unit_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_responsibility_employee" ON "approval_responsibility" USING btree ("employee_user_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_responsibility_deleted_at" ON "approval_responsibility" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_approval_step_process_order_unique" ON "approval_step" USING btree ("approval_process_uid","step_order");--> statement-breakpoint
CREATE INDEX "idx_approval_step_process" ON "approval_step" USING btree ("approval_process_uid");--> statement-breakpoint
CREATE INDEX "idx_approval_step_deleted_at" ON "approval_step" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_verification_supplier" ON "document_verification" USING btree ("supplier_user_uid");--> statement-breakpoint
CREATE INDEX "idx_verification_site" ON "document_verification" USING btree ("supplier_site_user_uid");--> statement-breakpoint
CREATE INDEX "idx_verification_type" ON "document_verification" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "idx_verification_status" ON "document_verification" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_document_verification_deleted_at" ON "document_verification" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_employee_org" ON "employee" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_employee_email" ON "employee" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_employee_name" ON "employee" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "idx_employee_deleted_at" ON "employee" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_employee_org_unit_role_employee" ON "employee_org_unit_role" USING btree ("employee_user_uid");--> statement-breakpoint
CREATE INDEX "idx_employee_org_unit_role_org_unit" ON "employee_org_unit_role" USING btree ("org_unit_uid");--> statement-breakpoint
CREATE INDEX "idx_employee_org_unit_role_role" ON "employee_org_unit_role" USING btree ("role_uid");--> statement-breakpoint
CREATE INDEX "idx_employee_org_unit_role_deleted_at" ON "employee_org_unit_role" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_org_unit_org_name_unique" ON "org_unit" USING btree ("organization_uid","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_org_unit_org_code_unique" ON "org_unit" USING btree ("organization_uid","org_unit_code");--> statement-breakpoint
CREATE INDEX "idx_org_unit_org" ON "org_unit" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_org_unit_parent" ON "org_unit" USING btree ("parent_uid");--> statement-breakpoint
CREATE INDEX "idx_org_unit_type" ON "org_unit" USING btree ("unit_type");--> statement-breakpoint
CREATE INDEX "idx_org_unit_deleted_at" ON "org_unit" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_organization_name" ON "organization" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_organization_deleted_at" ON "organization" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_role_org_name_unique" ON "role" USING btree ("organization_uid","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_role_org_code_unique" ON "role" USING btree ("organization_uid","role_code");--> statement-breakpoint
CREATE INDEX "idx_role_org" ON "role" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_role_deleted_at" ON "role" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_store_org_name_unique" ON "store" USING btree ("organization_uid","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_store_org_code_unique" ON "store" USING btree ("organization_uid","store_code");--> statement-breakpoint
CREATE INDEX "idx_store_org" ON "store" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_store_address" ON "store" USING btree ("address_uid");--> statement-breakpoint
CREATE INDEX "idx_store_deleted_at" ON "store" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_supplier_org_name_unique" ON "supplier" USING btree ("organization_uid","name");--> statement-breakpoint
CREATE INDEX "idx_supplier_org" ON "supplier" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_supplier_status" ON "supplier" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_supplier_code" ON "supplier" USING btree ("supplier_code");--> statement-breakpoint
CREATE INDEX "idx_supplier_name" ON "supplier" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_supplier_active" ON "supplier" USING btree ("organization_uid","name","supplier_code") WHERE status = 'ACTIVE' AND deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "idx_supplier_contact" ON "supplier" USING btree ("contact_email","contact_phone");--> statement-breakpoint
CREATE INDEX "idx_supplier_deleted_at" ON "supplier" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_supplier_invitation_org" ON "supplier_invitation" USING btree ("organization_uid");--> statement-breakpoint
CREATE INDEX "idx_supplier_invitation_email" ON "supplier_invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_supplier_invitation_status" ON "supplier_invitation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_supplier_invitation_deleted_at" ON "supplier_invitation" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_supplier_site_name_unique" ON "supplier_site" USING btree ("supplier_user_uid","site_name");--> statement-breakpoint
CREATE INDEX "idx_site_supplier" ON "supplier_site" USING btree ("supplier_user_uid");--> statement-breakpoint
CREATE INDEX "idx_site_status" ON "supplier_site" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_site_address" ON "supplier_site" USING btree ("address_uid");--> statement-breakpoint
CREATE INDEX "idx_site_deleted_at" ON "supplier_site" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_document_site" ON "supplier_site_document" USING btree ("supplier_site_user_uid");--> statement-breakpoint
CREATE INDEX "idx_document_type" ON "supplier_site_document" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "idx_document_status" ON "supplier_site_document" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_document_deleted_at" ON "supplier_site_document" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_site_term_site" ON "supplier_site_term" USING btree ("supplier_site_user_uid");--> statement-breakpoint
CREATE INDEX "idx_site_term_type" ON "supplier_site_term" USING btree ("term_type");--> statement-breakpoint
CREATE INDEX "idx_site_term_status" ON "supplier_site_term" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "idx_site_term_effective_date" ON "supplier_site_term" USING btree ("effective_date");--> statement-breakpoint
CREATE INDEX "idx_site_term_deleted_at" ON "supplier_site_term" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_term_note_term" ON "supplier_term_note" USING btree ("term_uid");--> statement-breakpoint
CREATE INDEX "idx_term_note_created_by" ON "supplier_term_note" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_term_note_deleted_at" ON "supplier_term_note" USING btree ("deleted_at");