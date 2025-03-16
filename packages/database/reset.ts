import { sql } from "drizzle-orm";
import { reset } from "drizzle-seed";
import pg from "pg";
import { db } from "./database.js";
import * as schema from "./schema.js";

/**
 * Reset script to clear all tables in the database
 *
 * This is useful for:
 * - Testing environments
 * - Development environments
 * - Resetting to a clean state before seeding
 *
 * The reset function:
 * - PostgreSQL: Uses TRUNCATE tableName CASCADE
 * - MySQL: Disables foreign key checks, truncates, re-enables checks
 * - SQLite: Disables foreign keys, deletes from tables, re-enables foreign keys
 */
async function main() {
  console.log("Checking database state...");

  try {
    // First, check if we have any tables in the database
    const tablesExist = await checkTablesExist();

    if (!tablesExist) {
      console.log("No tables found - database is already empty.");
      return;
    }

    console.log("Resetting database...");
    await reset(db, schema);
    console.log("Database reset successful!");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    // In drizzle-orm, we need to end the underlying pool
    // The pool is available via the driver property, but it might not be exposed
    // directly. Instead, we'll use a timeout to ensure all queries are done.
    console.log("Shutting down...");
    setTimeout(() => {
      process.exit(0);
    }, 500);
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

main();
