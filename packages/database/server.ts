/**
 * Server-side database exports
 *
 * This file exports the actual database connection and schema
 * for use in server-side code only. Do not import this in client code.
 */

// Export the schema for query building
export * from "./schema.js";
// Export actual database connection
export * from "./database.js";
// Export enums for server-side use
export * from "./enums.js";
