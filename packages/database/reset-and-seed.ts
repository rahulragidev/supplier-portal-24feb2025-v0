import { resetDatabase } from "./reset.js";
import { seedDatabase } from "./seed.js";

/**
 * Reset and seed script to clear all tables in the database and populate with fresh data
 *
 * This is useful for:
 * - Testing environments
 * - Development environments
 * - Setting up a fresh demo instance
 *
 * The script:
 * 1. Resets the database (clears all tables)
 * 2. Seeds the database with fresh data, including an admin user with all permissions
 */
async function main() {
  try {
    console.log("--- Starting Database Reset ---");
    await resetDatabase();

    console.log("\n--- Starting Database Seeding ---");
    await seedDatabase();

    console.log("\n--- Reset and Seed Complete ---");
  } catch (error) {
    console.error("Error performing reset and seed:", error);
    process.exit(1);
  } finally {
    // Shut down after all operations are complete
    console.log("Shutting down...");
    setTimeout(() => {
      process.exit(0);
    }, 500);
  }
}

main();
