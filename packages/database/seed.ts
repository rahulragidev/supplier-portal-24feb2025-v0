import { sql } from "drizzle-orm";
import { seed } from "drizzle-seed";
import { db } from "./database.js";
import * as schema from "./schema.js";

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
    // Shut down after all operations are complete
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
      const count = Number.parseInt(result[0]?.count || "0", 10);
      return count > 0;
    }

    // Alternative format some drivers might return
    if (result && typeof result === "object") {
      if (result.rows) {
        const count = Number.parseInt(result.rows[0]?.count || "0", 10);
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
