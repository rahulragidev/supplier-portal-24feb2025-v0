import { sql } from "drizzle-orm";
import { seed } from "drizzle-seed";
import { v4 as uuidv4 } from "uuid";
import { db } from "./database.js";
import { UserType } from "./enums.js";
import * as schema from "./schema.js";

// Check if this module is being executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

// List of all available permissions in the system
const ALL_PERMISSIONS = [
  // User permissions
  "users:list",
  "users:get-by-id",
  "users:create",
  "users:update",
  "users:delete",

  // Organization permissions
  "organizations:list",
  "organizations:get-by-id",
  "organizations:create",
  "organizations:update",
  "organizations:delete",

  // Employee permissions
  "employees:list",
  "employees:get-by-id",
  "employees:create",
  "employees:update",
  "employees:delete",
  "employees:get-by-organization",

  // Role permissions
  "roles:list",
  "roles:get-by-id",
  "roles:create",
  "roles:update",
  "roles:delete",
  "roles:get-by-organization",
  "employee-roles:list",
  "employee-roles:assign",
  "employee-roles:remove",

  // Supplier permissions
  "suppliers:list",
  "suppliers:get-by-id",
  "suppliers:create",
  "suppliers:update",
  "suppliers:update-status",
  "suppliers:delete",
  "suppliers:get-by-organization",

  // Supplier site permissions
  "supplier-sites:list",
  "supplier-sites:get-by-id",
  "supplier-sites:create",
  "supplier-sites:update",
  "supplier-sites:update-status",
  "supplier-sites:delete",
  "supplier-sites:get-by-supplier",

  // Supplier invitation permissions
  "supplier-invitations:list",
  "supplier-invitations:get-by-organization",
  "supplier-invitations:create",
  "supplier-invitations:update-status",

  // Document permissions
  "documents:get-by-id",
  "documents:create",
  "documents:update-status",
  "documents:delete",
  "documents:get-by-site",

  // Document verification permissions
  "document-verifications:list",
  "document-verifications:get-by-supplier",
  "document-verifications:create",
  "document-verifications:update-status",

  // Terms permissions
  "terms:list",
  "terms:get-by-id",
  "terms:create",
  "terms:update",
  "terms:delete",
  "terms:get-by-site",
  "financial-terms:get-by-term",
  "financial-terms:create",
  "financial-terms:update",
  "trade-terms:get-by-term",
  "trade-terms:create",
  "trade-terms:update",
  "support-terms:get-by-term",
  "support-terms:create",
  "support-terms:update",
  "term-notes:get-by-term",
  "term-notes:create",
  "term-notes:delete",

  // Store permissions
  "stores:list",
  "stores:get-by-id",
  "stores:create",
  "stores:update",
  "stores:delete",
  "stores:get-by-organization",

  // Approval permissions
  "approval-processes:list",
  "approval-processes:get-by-organization",
  "approval-processes:create",
  "approval-processes:get-by-id",
  "approval-processes:update",
  "approval-processes:delete",
  "approval-steps:get-by-process",
  "approval-steps:get-by-id",
  "approval-steps:create",
  "approval-steps:update",
  "approval-steps:delete",
  "approval-responsibilities:get-by-step",
  "approval-responsibilities:create",
  "approval-responsibilities:update",
  "approval-responsibilities:delete",
  "approval-requests:list",
  "approval-requests:get-by-supplier",
  "approval-requests:get-by-id",
  "approval-requests:create",
  "approval-requests:update-status",
  "approval-requests:update-step",
  "approval-logs:get-by-request",
  "approval-logs:create",
  "approval-comments:get-by-request",

  // Org unit permissions
  "org-units:list",
  "org-units:get-by-id",
  "org-units:create",
  "org-units:update",
  "org-units:delete",
  "org-units:get-by-organization",
];

/**
 * Seed script to populate the database with test data
 *
 * This is useful for:
 * - Testing environments
 * - Development environments
 * - Setting up a demo instance
 */
async function main() {
  console.log("Checking database state...");

  try {
    // First, check if tables exist (we need tables to seed data)
    const tablesExist = await checkTablesExist();

    if (!tablesExist) {
      console.error("No tables found in database. Please run migrations first.");
      process.exit(1);
    }

    console.log("Seeding database...");

    // Create the admin user first
    await createAdminUser();

    // Basic seeding with defaults (creates 10 records per table)
    await seed(db, schema);

    // For more advanced seeding with custom data, you can use:
    /* 
    await seed(db, schema).refine((f) => ({
      users: {
        columns: {
          name: f.fullName(),
          email: f.email(),
        },
        count: 20,
        with: {
          posts: 5 // Create 5 posts for each user
        }
      }
    }));
    */

    console.log("Database seeding successful!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    // Only exit the process if this script is run directly
    // If it's being imported for reset-and-seed, we don't want to exit
    if (isMainModule) {
      // Shut down after all operations are complete
      console.log("Shutting down...");
      setTimeout(() => {
        process.exit(0);
      }, 500);
    }
  }
}

/**
 * Create an admin user with all permissions
 */
async function createAdminUser() {
  try {
    console.log("Creating admin user with all permissions...");

    // Check if admin user already exists
    const existingAdmin = await db.execute(sql`
      SELECT * FROM app_user 
      WHERE user_type = 'ADMIN' AND user_name = 'admin'
    `);

    const adminExists =
      (Array.isArray(existingAdmin) && existingAdmin.length > 0) ||
      (existingAdmin?.rows && existingAdmin.rows.length > 0);

    if (adminExists) {
      console.log("Admin user already exists, skipping creation");
      return;
    }

    // Create the admin user with all permissions
    const adminUser = {
      uid: uuidv4(),
      clerkId: uuidv4(), // This would normally come from your auth provider
      userName: "admin",
      userType: UserType.ADMIN,
      permissions: ALL_PERMISSIONS,
      extraData: { isSystemAdmin: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(schema.appUser).values(adminUser);

    console.log("Admin user created successfully");

    // Create a default organization for the admin
    await createDefaultOrganization(adminUser.uid);
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

/**
 * Create a default organization for the admin
 */
async function createDefaultOrganization(adminUid: string) {
  try {
    console.log("Creating default organization...");

    // Check if default org already exists
    const existingOrg = await db.execute(sql`
      SELECT * FROM organization 
      WHERE name = 'Admin Organization'
    `);

    const orgExists =
      (Array.isArray(existingOrg) && existingOrg.length > 0) ||
      (existingOrg?.rows && existingOrg.rows.length > 0);

    if (orgExists) {
      console.log("Default organization already exists, skipping creation");
      return;
    }

    // Create the organization
    const organizationUid = uuidv4();
    await db.insert(schema.organization).values({
      uid: organizationUid,
      name: "Admin Organization",
      maxUserCount: 100,
      extraData: { isDefault: true },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminUid,
    });

    // Create admin role with all permissions
    const roleUid = uuidv4();
    await db.insert(schema.role).values({
      uid: roleUid,
      organizationUid: organizationUid,
      name: "Admin Role",
      roleCode: "ADMIN_ROLE",
      permissions: ALL_PERMISSIONS,
      extraData: { isDefaultAdminRole: true },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminUid,
    });

    console.log("Default organization and admin role created successfully");
  } catch (error) {
    console.error("Error creating default organization:", error);
    throw error;
  }
}

/**
 * Check if any tables exist in the database
 * @returns Promise<boolean> - true if tables exist, false otherwise
 */
async function checkTablesExist(): Promise<boolean> {
  try {
    // This PostgreSQL query checks for any user-created tables
    const result = await db.execute(sql`
      SELECT count(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `);

    // Handle different possible result formats
    if (Array.isArray(result) && result.length > 0) {
      const countValue = result[0]?.count;
      const count = Number.parseInt(String(countValue || "0"), 10);
      return count > 0;
    }

    // Alternative format some drivers might return
    if (result && typeof result === "object") {
      if (result.rows) {
        const countValue = result.rows[0]?.count;
        const count = Number.parseInt(String(countValue || "0"), 10);
        return count > 0;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  }
}

// If this script is run directly, call the main function
if (isMainModule) {
  main();
}

// Export the seed function for use in other scripts
export { main as seedDatabase };
