# Supplier Management System API

This is the backend API for the Supplier Management System, offering a comprehensive set of endpoints for managing suppliers, organizations, employees, and related entities.

## API Structure

The API follows a modular, controller-based architecture for better maintainability:

```
apps/backend-api/
├── src/
│   ├── controllers/           # Business logic for each resource
│   ├── routes/                # Route definitions
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Utility functions
│   ├── openapi/               # OpenAPI documentation
│   ├── app.ts                 # Main app configuration
│   └── index.ts               # Server entry point
```

## Available Endpoints

The API provides endpoints for the following resources:

- **Users** - `/users`
- **Organizations** - `/organizations`
- **Employees** - `/employees`
- **Suppliers** - `/suppliers`
- **Addresses** - `/addresses`
- **Organizational Units** - `/org-units`
- **Roles** - `/roles`
- **Stores** - `/stores`
- **Approval Processes** - `/approval-processes`
- **Documents** - `/documents`
- **Supplier Terms** - `/supplier-terms`

## API Documentation

The API is fully documented using OpenAPI/Swagger. You can access the documentation in several ways:

### Interactive Documentation

Visit the Swagger UI to explore and test the API interactively:

```
http://localhost:3030/swagger
```

### OpenAPI Specification

Access the raw OpenAPI specification JSON:

```
http://localhost:3030/api-doc
```

### Documentation Portal

For a user-friendly portal with links to documentation:

```
http://localhost:3030/api
```

## Running the API

Start the API server with the following command:

```bash
# Change to the backend-api directory
cd apps/backend-api

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The API will be available at http://localhost:3030.

## Authentication

The API uses JWT Bearer authentication. Include the JWT token in the Authorization header for authenticated endpoints:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API returns standardized error responses with appropriate HTTP status codes:

```json
{
  "error": "Error message here"
}
```

## Validation

Input validation is performed using Zod schemas. Invalid inputs will result in a 400 Bad Request response with detailed validation errors.

```
open http://localhost:3000
```
