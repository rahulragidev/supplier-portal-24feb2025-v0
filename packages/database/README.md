# Database Package

This package contains the database schema, types, and validation schemas for the application.

## Structure

- `schema.ts`: Source of truth for the database schema using Drizzle ORM
- `types.ts`: TypeScript types derived from the schema
- `zod-schema.ts`: Zod validation schemas derived from the schema
- `enums.ts`: Enum constants used throughout the application
- `examples.ts`: Example values for documentation and testing

## DrizzleKit Compatibility

DrizzleKit requires JavaScript files for imports. To ensure compatibility, we've added a script that generates a JavaScript version of the enums file before running DrizzleKit commands.

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

If you encounter the error `Cannot find module './enums.js'` when running DrizzleKit commands, make sure to use the `db:generate:safe` script instead of `db:generate` directly. 