# Database Package

This package contains the database schema, types, and validation schemas for the application.

## Structure

- `schema.ts`: Source of truth for the database schema using Drizzle ORM
- `types.ts`: TypeScript types derived from the schema
- `zod-schema.ts`: Zod validation schemas derived from the schema
- `enums.js`: JavaScript enum constants for use throughout the application
- `enums.ts`: TypeScript enum constants with type safety
- `enums.d.ts`: TypeScript declarations for enum constants
- `examples.ts`: Example values for documentation and testing

## Enum Management

The application uses a centralized approach to manage enums across the codebase. This ensures consistency between the database, backend API, and frontend.

### Enum Files Explained

- **enums.js**: The source of truth for all enum values. This file is in JavaScript format because it needs to be imported by Drizzle ORM, which runs before TypeScript compilation.

- **enums.ts**: TypeScript version with the same enum definitions but with TypeScript's `as const` for type safety.

- **enums.d.ts**: TypeScript declarations for the enums defined in enums.js. This provides type safety when importing enums in TypeScript files.

### Best Practices for Using Enums

1. **Always import from the central enum files**:
   ```typescript
   import { UserType, ApprovalStatus } from "@workspace/database/enums";
   ```

2. **Never hardcode enum values**:
   - ❌ `status: "PENDING"` 
   - ✅ `status: ApprovalStatus.PENDING`

3. **Use Zod enum schemas for validation**:
   - ❌ `z.enum(["PENDING", "APPROVED"])`
   - ✅ `z.enum(Object.values(ApprovalStatus))`
   - ✅ `ApprovalStatusSchema` (imported from zod-schema.ts)

4. **For OpenAPI schemas, use enum arrays derived from central enum objects**:
   ```typescript
   const ApprovalStatusValues = Object.values(dbEnums.ApprovalStatus) as [string, ...string[]];
   ```

### When Adding or Modifying Enums

When adding or modifying enums, update these files:

1. **enums.js**: Add/modify the enum object
2. **enums.ts**: Add/modify the same enum with TypeScript's `as const`
3. **enums.d.ts**: Add/modify the TypeScript declaration
4. **schema.ts**: If needed, create a new PostgreSQL enum type
5. **types.ts**: Update any related types
6. **zod-schema.ts**: Update any related Zod schemas

## DrizzleKit Compatibility

DrizzleKit requires JavaScript files for imports. To ensure compatibility, we've:

1. Created `enums.js` for DrizzleKit to use
2. Set up TypeScript declarations to provide type safety

### Usage

Instead of running `npm run db:generate` directly, use:

```bash
npm run db:generate:safe
```

This will:
1. Generate a JavaScript version of the enums file (`enums.js`)
2. Run the DrizzleKit generate command

## Development

When making changes to the schema:

1. Update the schema in `schema.ts`
2. Run `npm run db:generate:safe` to generate migrations
3. Run `npm run db:migrate` to apply migrations to the database
4. Run `npm run build` to compile TypeScript files

## Troubleshooting

If you encounter TypeScript errors with enum imports, check:

1. Make sure you're importing from "@workspace/database/enums"
2. When using enums.js with schema.ts, use the `@ts-ignore` comment if needed
3. For OpenAPI schemas, use the `as [string, ...string[]]` assertion for Zod enum compatibility 

## Usage Guide

### Importing Types (Client and Server)

When you need only types for your forms, components, or API definitions, import from the main package or specific type exports:

```typescript
// Import specific types
import type { User, Supplier } from "@workspace/database/types";

// Import type helpers for more flexibility
import type { Doc, NewDoc } from "@workspace/database";

// Use type helpers (preferred approach)
type User = Doc<'users'>;
type NewUser = NewDoc<'users'>;

// Import validation schemas
import { userSchema } from "@workspace/database/zod-schema";
```

### Importing Database Runtime (Server Only)

For server-side code that needs to interact with the database, import from the `/server` subpath:

```typescript
// Server-side code only
import { db } from "@workspace/database/server";
import { users, suppliers } from "@workspace/database/server";
import { eq } from "drizzle-orm";

// Now you can query the database
async function getUser(id: string) {
  return await db.select().from(users).where(eq(users.id, id));
}
```

### Best Practices

1. **Frontend Code**: Only import types, never the database connection
2. **Backend Code**: Import from `/server` to access the database
3. **Use Type Helpers**: Prefer `Doc<'tableName'>` over direct type imports for better maintainability

This pattern ensures:
- Type safety across your application
- No database connection code in your frontend bundles
- Single source of truth for your database schema 