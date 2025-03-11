# Attribute-Based Access Control (ABAC) Implementation

This document describes the Attribute-Based Access Control (ABAC) system implemented in the Supplier Portal application.

## Overview

ABAC is a dynamic and flexible approach to access control that evaluates attributes (properties) of the user (subject), the resource, the action, and the environment to make authorization decisions. Unlike traditional Role-Based Access Control (RBAC), which assigns permissions based on static roles, ABAC allows for fine-grained and context-aware permission handling.

## Architecture

The ABAC implementation consists of the following components:

1. **Types and Interfaces** (`abac-types.ts`): Defines the core types for the ABAC system, including `SubjectAttributes`, `ResourceAttributes`, `ContextAttributes`, and permission-related types.

2. **ABAC Service** (`abac-service.ts`): Provides the core logic for evaluating access control decisions based on the policy configuration.

3. **Default Policies** (`abac-policies.ts`): Contains the default policy configuration for different resource types in the system.

4. **Utility Functions** (`abac-utils.ts`): Provides helper functions for extracting attributes from users, resources, and creating context objects.

5. **Middleware** (`abacMiddleware.ts`): Implements Hono middleware for enforcing ABAC permissions in API routes.

## Key Concepts

### Subject Attributes

Subject attributes represent the properties of the user making the request. These include:

- User ID
- User type (EMPLOYEE, SUPPLIER, SUPPLIER_SITE, ADMIN)
- Roles
- Organization ID
- Employee code (for employees)
- Org unit IDs (for employees)
- Additional attributes in the `extraData` field

### Resource Attributes

Resource attributes represent the properties of the resource being accessed. These include:

- Resource ID
- Organization ID
- Author/creator ID
- Status
- Type
- Additional resource-specific attributes

### Context Attributes

Context attributes represent the environment in which the access request is made. These include:

- Time of day
- Request IP
- Client type (user agent)
- Additional context-specific attributes

### Actions

Actions represent the operations that can be performed on resources:

- view
- create
- update
- delete
- approve
- reject
- assign
- transfer
- verify

### Resource Types

Resource types represent the different types of resources in the system:

- supplier
- supplier_site
- supplier_term
- approval_request
- document
- organization
- employee
- role
- org_unit

## Usage

### Using the ABAC Middleware

The ABAC middleware can be used to protect API routes:

```typescript
import { abac } from "../middleware/abacMiddleware.js";

// Protect a route with ABAC
app.get("/suppliers", 
  abac({
    resourceType: 'supplier',
    action: 'view'
  }), 
  supplierController.getAllSuppliers
);

// Protect a route with ABAC and resource-specific permissions
app.get("/suppliers/:id", 
  requireResource('supplier', getSupplierById),
  abac({
    resourceType: 'supplier',
    action: 'view',
    getResource: (c) => c.get('resource')
  }), 
  supplierController.getSupplierById
);
```

### Customizing Policies

The default policies can be customized by modifying the `abac-policies.ts` file or by updating the policy configuration at runtime:

```typescript
import { abacService } from "@workspace/database/abac";

// Update a specific policy
const updatedPolicies = { ...abacService.getPolicyConfig() };
updatedPolicies.supplier.rolePermissions.EMPLOYEE.delete = true;
abacService.updatePolicyConfig(updatedPolicies);
```

### Adding New Resource Types

To add a new resource type:

1. Add the new resource type to the `ResourceType` type in `abac-types.ts`
2. Create a policy configuration for the new resource type in `abac-policies.ts`
3. Add the policy to the `defaultAbacPolicyConfig` object

## Best Practices

1. **Keep policies centralized**: Maintain all policy definitions in the `abac-policies.ts` file for easier management.

2. **Use conditional functions for complex rules**: For complex permission logic, create reusable conditional functions.

3. **Provide meaningful denial reasons**: When denying access, provide clear reasons to help with debugging and user feedback.

4. **Cache subject attributes**: For performance, consider caching subject attributes during a request lifecycle.

5. **Test policies thoroughly**: Write unit tests for your permission rules to ensure they behave as expected.

## Examples

### Simple Boolean Permission

```typescript
'ADMIN': {
  'view': true,  // Admins can always view suppliers
  'create': true,
  'update': true,
  'delete': true
}
```

### Conditional Permission

```typescript
'EMPLOYEE': {
  'view': (subject, resource) => {
    // Employees can only view suppliers in their organization
    return subject.organizationUid === resource?.organizationUid;
  },
  'update': (subject, resource) => {
    // Employees can only update suppliers they created and are in DRAFT status
    return subject.uid === resource?.authorId && 
           resource?.status === 'DRAFT';
  }
}
```

### Context-Aware Permission

```typescript
'APPROVER': {
  'approve': (subject, resource, context) => {
    // Approvers can only approve during business hours
    const hour = context?.timeOfDay?.getHours() || 0;
    return hour >= 9 && hour < 17 && 
           resource?.status === 'PENDING_APPROVAL';
  }
}
``` 