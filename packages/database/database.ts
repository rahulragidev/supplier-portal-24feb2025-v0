import pg from "pg";
const { Pool } = pg;

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the database package directory
config({ path: join(__dirname, ".env") });

// Also try to load from parent directory
config({ path: join(__dirname, "../../../.env") });

// Check for DATABASE_URL in environment
if (!process.env.DATABASE_URL) {
  console.error("WARNING: DATABASE_URL environment variable is not set");

  // Only throw in strict production mode
  if (process.env.NODE_ENV === "production" && process.env.STRICT_ENV_CHECK === "true") {
    throw new Error("DATABASE_URL environment variable is required in production");
  }
}

// Use a default development database URL if not provided
const connectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";

console.log(`Connecting to database with ${process.env.NODE_ENV} configuration`);

// Configure SSL based on environment
const sslConfig =
  connectionString.includes("render.com") || process.env.NODE_ENV === "production"
    ? { ssl: { rejectUnauthorized: false } }
    : {};

const pool = new Pool({
  connectionString,
  ...sslConfig,
  // Add some reasonable defaults for better error handling
  connectionTimeoutMillis: 5000, // 5 seconds
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Add error handling for the pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
