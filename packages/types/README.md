# Types Package

This package serves as the central repository for type definitions in the Supplier Portal application.

## Purpose

The types package provides a unified type system for the application by:

1. Re-exporting database types from the database package
2. Defining application-specific types
3. Preventing direct imports from the database package

This approach ensures:
- **Single Source of Truth**: All types originate from one place, even if they represent database entities
- **Clear Separation of Concerns**: Database types are kept separate from application types
- **Type Safety**: Consistent type definitions across the application
- **Better Organization**: Clear structure for where different types belong

## Usage

### Importing Types

```typescript
// Import all types
import { AppUser, Supplier, ApiResponse } from '@workspace/types';

// Import database-specific types with namespace
import { DB } from '@workspace/types';
const user: DB.AppUser = /* ... */;

// Import only database types
import { AppUser, Supplier } from '@workspace/types/db';

// Import only common types
import { ApiResponse, PaginationParams } from '@workspace/types/common';
```

### Do Not Import Directly from Database

❌ **Incorrect**:
```typescript
// Don't import directly from database
import { AppUser } from '@workspace/database';
```

✅ **Correct**:
```typescript
// Import from types package instead
import { AppUser } from '@workspace/types';
```

## Extending Types

When you need to create new types:

1. Database-related types should be placed in `src/db/`
2. Application-specific types should be placed in `src/common/`

## Development

```bash
# Build the package
pnpm build

# Watch for changes during development
pnpm dev
``` 