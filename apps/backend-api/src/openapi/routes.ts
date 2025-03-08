import { createRoute } from '@hono/zod-openapi';
import * as schemas from './schemas.js';

// User routes
export const getUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  summary: 'Get all users',
  description: 'Retrieve a list of all non-deleted users',
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: schemas.UserListSchema,
        },
      },
    },
  },
});

export const getUserByIdRoute = createRoute({
  method: 'get',
  path: '/users/{uid}',
  tags: ['Users'],
  summary: 'Get user by ID',
  description: 'Retrieve a specific user by their unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'User details',
      content: {
        'application/json': {
          schema: schemas.UserSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  summary: 'Create a new user',
  description: 'Create a new user with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: schemas.UserSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{uid}',
  tags: ['Users'],
  summary: 'Update a user',
  description: 'Update an existing user with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateUserSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: schemas.UserSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/users/{uid}',
  tags: ['Users'],
  summary: 'Delete a user',
  description: 'Soft delete a user by their unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'User deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Organization routes
export const getOrganizationsRoute = createRoute({
  method: 'get',
  path: '/organizations',
  tags: ['Organizations'],
  summary: 'Get all organizations',
  description: 'Retrieve a list of all non-deleted organizations',
  responses: {
    200: {
      description: 'List of organizations',
      content: {
        'application/json': {
          schema: schemas.OrganizationListSchema,
        },
      },
    },
  },
});

export const getOrganizationByIdRoute = createRoute({
  method: 'get',
  path: '/organizations/{uid}',
  tags: ['Organizations'],
  summary: 'Get organization by ID',
  description: 'Retrieve a specific organization by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Organization details',
      content: {
        'application/json': {
          schema: schemas.OrganizationSchema,
        },
      },
    },
    404: {
      description: 'Organization not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createOrganizationRoute = createRoute({
  method: 'post',
  path: '/organizations',
  tags: ['Organizations'],
  summary: 'Create a new organization',
  description: 'Create a new organization with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateOrganizationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Organization created successfully',
      content: {
        'application/json': {
          schema: schemas.OrganizationSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateOrganizationRoute = createRoute({
  method: 'put',
  path: '/organizations/{uid}',
  tags: ['Organizations'],
  summary: 'Update an organization',
  description: 'Update an existing organization with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateOrganizationSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Organization updated successfully',
      content: {
        'application/json': {
          schema: schemas.OrganizationSchema,
        },
      },
    },
    404: {
      description: 'Organization not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteOrganizationRoute = createRoute({
  method: 'delete',
  path: '/organizations/{uid}',
  tags: ['Organizations'],
  summary: 'Delete an organization',
  description: 'Soft delete an organization by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Organization deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Organization not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Employee routes
export const getEmployeesRoute = createRoute({
  method: 'get',
  path: '/employees',
  tags: ['Employees'],
  summary: 'Get all employees',
  description: 'Retrieve a list of all non-deleted employees',
  responses: {
    200: {
      description: 'List of employees',
      content: {
        'application/json': {
          schema: schemas.EmployeeListSchema,
        },
      },
    },
  },
});

export const getEmployeeByIdRoute = createRoute({
  method: 'get',
  path: '/employees/{userUid}',
  tags: ['Employees'],
  summary: 'Get employee by ID',
  description: 'Retrieve a specific employee by their unique identifier',
  request: {
    params: schemas.UserUidParam,
  },
  responses: {
    200: {
      description: 'Employee details',
      content: {
        'application/json': {
          schema: schemas.EmployeeSchema,
        },
      },
    },
    404: {
      description: 'Employee not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getEmployeesByOrganizationRoute = createRoute({
  method: 'get',
  path: '/organizations/{orgUid}/employees',
  tags: ['Employees'],
  summary: 'Get employees by organization',
  description: 'Retrieve all employees belonging to a specific organization',
  request: {
    params: schemas.OrgUidParam,
  },
  responses: {
    200: {
      description: 'List of employees in the organization',
      content: {
        'application/json': {
          schema: schemas.EmployeeListSchema,
        },
      },
    },
  },
});

export const createEmployeeRoute = createRoute({
  method: 'post',
  path: '/employees',
  tags: ['Employees'],
  summary: 'Create a new employee',
  description: 'Create a new employee with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateEmployeeSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Employee created successfully',
      content: {
        'application/json': {
          schema: schemas.EmployeeSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateEmployeeRoute = createRoute({
  method: 'put',
  path: '/employees/{userUid}',
  tags: ['Employees'],
  summary: 'Update an employee',
  description: 'Update an existing employee with the provided data',
  request: {
    params: schemas.UserUidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateEmployeeSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Employee updated successfully',
      content: {
        'application/json': {
          schema: schemas.EmployeeSchema,
        },
      },
    },
    404: {
      description: 'Employee not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteEmployeeRoute = createRoute({
  method: 'delete',
  path: '/employees/{userUid}',
  tags: ['Employees'],
  summary: 'Delete an employee',
  description: 'Soft delete an employee by their unique identifier',
  request: {
    params: schemas.UserUidParam,
  },
  responses: {
    200: {
      description: 'Employee deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Employee not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Supplier routes
export const getSuppliersRoute = createRoute({
  method: 'get',
  path: '/suppliers',
  tags: ['Suppliers'],
  summary: 'Get all suppliers',
  description: 'Retrieve a list of all suppliers',
  responses: {
    200: {
      description: 'List of suppliers',
      content: {
        'application/json': {
          schema: schemas.SupplierListSchema,
        },
      },
    },
  },
});

export const getSupplierByIdRoute = createRoute({
  method: 'get',
  path: '/suppliers/{userUid}',
  tags: ['Suppliers'],
  summary: 'Get supplier by ID',
  description: 'Retrieve a specific supplier by their unique identifier',
  request: {
    params: schemas.UserUidParam,
  },
  responses: {
    200: {
      description: 'Supplier details',
      content: {
        'application/json': {
          schema: schemas.SupplierSchema,
        },
      },
    },
    404: {
      description: 'Supplier not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createSupplierRoute = createRoute({
  method: 'post',
  path: '/suppliers',
  tags: ['Suppliers'],
  summary: 'Create a new supplier',
  description: 'Create a new supplier with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateSupplierSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Supplier created successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateSupplierRoute = createRoute({
  method: 'put',
  path: '/suppliers/{userUid}',
  tags: ['Suppliers'],
  summary: 'Update a supplier',
  description: 'Update an existing supplier with the provided data',
  request: {
    params: schemas.UserUidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateSupplierSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Supplier updated successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierSchema,
        },
      },
    },
    404: {
      description: 'Supplier not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateSupplierStatusRoute = createRoute({
  method: 'put',
  path: '/suppliers/{userUid}/status',
  tags: ['Suppliers'],
  summary: 'Update supplier status',
  description: 'Update the status of an existing supplier',
  request: {
    params: schemas.UserUidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.StatusUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Supplier status updated successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierSchema,
        },
      },
    },
    404: {
      description: 'Supplier not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteSupplierRoute = createRoute({
  method: 'delete',
  path: '/suppliers/{userUid}',
  tags: ['Suppliers'],
  summary: 'Delete a supplier',
  description: 'Soft delete a supplier by their unique identifier',
  request: {
    params: schemas.UserUidParam,
  },
  responses: {
    200: {
      description: 'Supplier deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Supplier not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getSuppliersByOrganizationRoute = createRoute({
  method: 'get',
  path: '/suppliers/organization/{orgUid}',
  tags: ['Suppliers'],
  summary: 'Get suppliers by organization',
  description: 'Retrieve a list of suppliers belonging to a specific organization',
  request: {
    params: schemas.OrgUidParam,
  },
  responses: {
    200: {
      description: 'List of suppliers',
      content: {
        'application/json': {
          schema: schemas.SupplierListSchema,
        },
      },
    },
  },
});

// Supplier Sites routes
export const getAllSitesRoute = createRoute({
  method: 'get',
  path: '/suppliers/sites',
  tags: ['Suppliers'],
  summary: 'Get all supplier sites',
  description: 'Retrieve a list of all supplier sites',
  responses: {
    200: {
      description: 'List of supplier sites',
      content: {
        'application/json': {
          schema: schemas.SupplierSiteListSchema,
        },
      },
    },
  },
});

export const getSitesBySupplierRoute = createRoute({
  method: 'get',
  path: '/suppliers/{supplierUid}/sites',
  tags: ['Suppliers'],
  summary: 'Get sites by supplier',
  description: 'Retrieve all sites for a specific supplier',
  request: {
    params: schemas.SupplierUidParam,
  },
  responses: {
    200: {
      description: 'List of supplier sites',
      content: {
        'application/json': {
          schema: schemas.SupplierSiteListSchema,
        },
      },
    },
  },
});

export const getSiteByIdRoute = createRoute({
  method: 'get',
  path: '/suppliers/sites/{userUid}',
  tags: ['Suppliers'],
  summary: 'Get supplier site by ID',
  description: 'Retrieve a specific supplier site by its unique identifier',
  request: {
    params: schemas.UserUidParam,
  },
  responses: {
    200: {
      description: 'Supplier site details',
      content: {
        'application/json': {
          schema: schemas.SupplierSiteSchema,
        },
      },
    },
    404: {
      description: 'Supplier site not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createSiteRoute = createRoute({
  method: 'post',
  path: '/suppliers/sites',
  tags: ['Suppliers'],
  summary: 'Create a new supplier site',
  description: 'Create a new supplier site with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateSupplierSiteSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Supplier site created successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierSiteSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateSiteRoute = createRoute({
  method: 'put',
  path: '/suppliers/sites/{userUid}',
  tags: ['Suppliers'],
  summary: 'Update a supplier site',
  description: 'Update an existing supplier site with the provided data',
  request: {
    params: schemas.UserUidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateSupplierSiteSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Supplier site updated successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierSiteSchema,
        },
      },
    },
    404: {
      description: 'Supplier site not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateSiteStatusRoute = createRoute({
  method: 'put',
  path: '/suppliers/sites/{userUid}/status',
  tags: ['Suppliers'],
  summary: 'Update supplier site status',
  description: 'Update the status of an existing supplier site',
  request: {
    params: schemas.UserUidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.StatusUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Supplier site status updated successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierSiteSchema,
        },
      },
    },
    404: {
      description: 'Supplier site not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteSiteRoute = createRoute({
  method: 'delete',
  path: '/suppliers/sites/{userUid}',
  tags: ['Suppliers'],
  summary: 'Delete a supplier site',
  description: 'Soft delete a supplier site by its unique identifier',
  request: {
    params: schemas.UserUidParam,
  },
  responses: {
    200: {
      description: 'Supplier site deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Supplier site not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Address routes
export const getAddressesRoute = createRoute({
  method: 'get',
  path: '/addresses',
  tags: ['Addresses'],
  summary: 'Get all addresses',
  description: 'Retrieve a list of all addresses',
  responses: {
    200: {
      description: 'List of addresses',
      content: {
        'application/json': {
          schema: schemas.AddressListSchema,
        },
      },
    },
  },
});

export const getAddressByIdRoute = createRoute({
  method: 'get',
  path: '/addresses/{uid}',
  tags: ['Addresses'],
  summary: 'Get address by ID',
  description: 'Retrieve a specific address by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Address details',
      content: {
        'application/json': {
          schema: schemas.AddressSchema,
        },
      },
    },
    404: {
      description: 'Address not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createAddressRoute = createRoute({
  method: 'post',
  path: '/addresses',
  tags: ['Addresses'],
  summary: 'Create a new address',
  description: 'Create a new address with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateAddressSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Address created successfully',
      content: {
        'application/json': {
          schema: schemas.AddressSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateAddressRoute = createRoute({
  method: 'put',
  path: '/addresses/{uid}',
  tags: ['Addresses'],
  summary: 'Update an address',
  description: 'Update an existing address with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateAddressSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Address updated successfully',
      content: {
        'application/json': {
          schema: schemas.AddressSchema,
        },
      },
    },
    404: {
      description: 'Address not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteAddressRoute = createRoute({
  method: 'delete',
  path: '/addresses/{uid}',
  tags: ['Addresses'],
  summary: 'Delete an address',
  description: 'Soft delete an address by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Address deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Address not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Org Unit routes
export const getOrgUnitsRoute = createRoute({
  method: 'get',
  path: '/org-units',
  tags: ['OrgUnits'],
  summary: 'Get all org units',
  description: 'Retrieve a list of all organizational units',
  responses: {
    200: {
      description: 'List of org units',
      content: {
        'application/json': {
          schema: schemas.OrgUnitListSchema,
        },
      },
    },
  },
});

export const getOrgUnitByIdRoute = createRoute({
  method: 'get',
  path: '/org-units/{uid}',
  tags: ['OrgUnits'],
  summary: 'Get org unit by ID',
  description: 'Retrieve a specific organizational unit by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Org unit details',
      content: {
        'application/json': {
          schema: schemas.OrgUnitSchema,
        },
      },
    },
    404: {
      description: 'Org unit not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getOrgUnitsByOrganizationRoute = createRoute({
  method: 'get',
  path: '/org-units/organization/{orgUid}',
  tags: ['OrgUnits'],
  summary: 'Get org units by organization',
  description: 'Retrieve all organizational units for a specific organization',
  request: {
    params: schemas.OrgUidParam,
  },
  responses: {
    200: {
      description: 'List of org units',
      content: {
        'application/json': {
          schema: schemas.OrgUnitListSchema,
        },
      },
    },
  },
});

export const createOrgUnitRoute = createRoute({
  method: 'post',
  path: '/org-units',
  tags: ['OrgUnits'],
  summary: 'Create a new org unit',
  description: 'Create a new organizational unit with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateOrgUnitSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Org unit created successfully',
      content: {
        'application/json': {
          schema: schemas.OrgUnitSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateOrgUnitRoute = createRoute({
  method: 'put',
  path: '/org-units/{uid}',
  tags: ['OrgUnits'],
  summary: 'Update an org unit',
  description: 'Update an existing organizational unit with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateOrgUnitSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Org unit updated successfully',
      content: {
        'application/json': {
          schema: schemas.OrgUnitSchema,
        },
      },
    },
    404: {
      description: 'Org unit not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteOrgUnitRoute = createRoute({
  method: 'delete',
  path: '/org-units/{uid}',
  tags: ['OrgUnits'],
  summary: 'Delete an org unit',
  description: 'Soft delete an organizational unit by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Org unit deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Org unit not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Role routes
export const getRolesRoute = createRoute({
  method: 'get',
  path: '/roles',
  tags: ['Roles'],
  summary: 'Get all roles',
  description: 'Retrieve a list of all roles',
  responses: {
    200: {
      description: 'List of roles',
      content: {
        'application/json': {
          schema: schemas.RoleListSchema,
        },
      },
    },
  },
});

export const getRoleByIdRoute = createRoute({
  method: 'get',
  path: '/roles/{uid}',
  tags: ['Roles'],
  summary: 'Get role by ID',
  description: 'Retrieve a specific role by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Role details',
      content: {
        'application/json': {
          schema: schemas.RoleSchema,
        },
      },
    },
    404: {
      description: 'Role not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getRolesByOrganizationRoute = createRoute({
  method: 'get',
  path: '/roles/organization/{orgUid}',
  tags: ['Roles'],
  summary: 'Get roles by organization',
  description: 'Retrieve all roles for a specific organization',
  request: {
    params: schemas.OrgUidParam,
  },
  responses: {
    200: {
      description: 'List of roles',
      content: {
        'application/json': {
          schema: schemas.RoleListSchema,
        },
      },
    },
  },
});

export const createRoleRoute = createRoute({
  method: 'post',
  path: '/roles',
  tags: ['Roles'],
  summary: 'Create a new role',
  description: 'Create a new role with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateRoleSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Role created successfully',
      content: {
        'application/json': {
          schema: schemas.RoleSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateRoleRoute = createRoute({
  method: 'put',
  path: '/roles/{uid}',
  tags: ['Roles'],
  summary: 'Update a role',
  description: 'Update an existing role with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateRoleSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Role updated successfully',
      content: {
        'application/json': {
          schema: schemas.RoleSchema,
        },
      },
    },
    404: {
      description: 'Role not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteRoleRoute = createRoute({
  method: 'delete',
  path: '/roles/{uid}',
  tags: ['Roles'],
  summary: 'Delete a role',
  description: 'Soft delete a role by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Role deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Role not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Store routes
export const getStoresRoute = createRoute({
  method: 'get',
  path: '/stores',
  tags: ['Stores'],
  summary: 'Get all stores',
  description: 'Retrieve a list of all stores',
  responses: {
    200: {
      description: 'List of stores',
      content: {
        'application/json': {
          schema: schemas.StoreListSchema,
        },
      },
    },
  },
});

export const getStoreByIdRoute = createRoute({
  method: 'get',
  path: '/stores/{uid}',
  tags: ['Stores'],
  summary: 'Get store by ID',
  description: 'Retrieve a specific store by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Store details',
      content: {
        'application/json': {
          schema: schemas.StoreSchema,
        },
      },
    },
    404: {
      description: 'Store not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getStoresByOrganizationRoute = createRoute({
  method: 'get',
  path: '/stores/organization/{orgUid}',
  tags: ['Stores'],
  summary: 'Get stores by organization',
  description: 'Retrieve all stores for a specific organization',
  request: {
    params: schemas.OrgUidParam,
  },
  responses: {
    200: {
      description: 'List of stores',
      content: {
        'application/json': {
          schema: schemas.StoreListSchema,
        },
      },
    },
  },
});

export const createStoreRoute = createRoute({
  method: 'post',
  path: '/stores',
  tags: ['Stores'],
  summary: 'Create a new store',
  description: 'Create a new store with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateStoreSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Store created successfully',
      content: {
        'application/json': {
          schema: schemas.StoreSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateStoreRoute = createRoute({
  method: 'put',
  path: '/stores/{uid}',
  tags: ['Stores'],
  summary: 'Update a store',
  description: 'Update an existing store with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateStoreSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Store updated successfully',
      content: {
        'application/json': {
          schema: schemas.StoreSchema,
        },
      },
    },
    404: {
      description: 'Store not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteStoreRoute = createRoute({
  method: 'delete',
  path: '/stores/{uid}',
  tags: ['Stores'],
  summary: 'Delete a store',
  description: 'Soft delete a store by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Store deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Store not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Approval process routes
export const getApprovalProcessesRoute = createRoute({
  method: 'get',
  path: '/approval-processes',
  tags: ['Approvals'],
  summary: 'Get all approval processes',
  description: 'Retrieve a list of all approval process definitions',
  responses: {
    200: {
      description: 'List of approval processes',
      content: {
        'application/json': {
          schema: schemas.ApprovalListSchema,
        },
      },
    },
  },
});

export const getApprovalProcessByIdRoute = createRoute({
  method: 'get',
  path: '/approval-processes/{uid}',
  tags: ['Approvals'],
  summary: 'Get approval process by ID',
  description: 'Retrieve a specific approval process by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Approval process details',
      content: {
        'application/json': {
          schema: schemas.ApprovalSchema,
        },
      },
    },
    404: {
      description: 'Approval process not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getApprovalProcessesByOrganizationRoute = createRoute({
  method: 'get',
  path: '/approval-processes/organization/{orgUid}',
  tags: ['Approvals'],
  summary: 'Get approval processes by organization',
  description: 'Retrieve all approval processes for a specific organization',
  request: {
    params: schemas.OrgUidParam,
  },
  responses: {
    200: {
      description: 'List of approval processes',
      content: {
        'application/json': {
          schema: schemas.ApprovalListSchema,
        },
      },
    },
  },
});

export const createApprovalProcessRoute = createRoute({
  method: 'post',
  path: '/approval-processes',
  tags: ['Approvals'],
  summary: 'Create a new approval process',
  description: 'Create a new approval process with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateApprovalSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Approval process created successfully',
      content: {
        'application/json': {
          schema: schemas.ApprovalSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateApprovalProcessRoute = createRoute({
  method: 'put',
  path: '/approval-processes/{uid}',
  tags: ['Approvals'],
  summary: 'Update an approval process',
  description: 'Update an existing approval process with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateApprovalSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Approval process updated successfully',
      content: {
        'application/json': {
          schema: schemas.ApprovalSchema,
        },
      },
    },
    404: {
      description: 'Approval process not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteApprovalProcessRoute = createRoute({
  method: 'delete',
  path: '/approval-processes/{uid}',
  tags: ['Approvals'],
  summary: 'Delete an approval process',
  description: 'Soft delete an approval process by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Approval process deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Approval process not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Document routes
export const getDocumentsRoute = createRoute({
  method: 'get',
  path: '/documents',
  tags: ['Documents'],
  summary: 'Get all documents',
  description: 'Retrieve a list of all documents',
  responses: {
    200: {
      description: 'List of documents',
      content: {
        'application/json': {
          schema: schemas.DocumentListSchema,
        },
      },
    },
  },
});

export const getDocumentByIdRoute = createRoute({
  method: 'get',
  path: '/documents/{uid}',
  tags: ['Documents'],
  summary: 'Get document by ID',
  description: 'Retrieve a specific document by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Document details',
      content: {
        'application/json': {
          schema: schemas.DocumentSchema,
        },
      },
    },
    404: {
      description: 'Document not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getDocumentsByEntityRoute = createRoute({
  method: 'get',
  path: '/documents/entity/{entityType}/{entityUid}',
  tags: ['Documents'],
  summary: 'Get documents by entity',
  description: 'Retrieve all documents for a specific entity',
  request: {
    params: schemas.EntityParams,
  },
  responses: {
    200: {
      description: 'List of documents',
      content: {
        'application/json': {
          schema: schemas.DocumentListSchema,
        },
      },
    },
  },
});

export const createDocumentRoute = createRoute({
  method: 'post',
  path: '/documents',
  tags: ['Documents'],
  summary: 'Create a new document',
  description: 'Create a new document with the provided data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateDocumentSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Document created successfully',
      content: {
        'application/json': {
          schema: schemas.DocumentSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateDocumentRoute = createRoute({
  method: 'put',
  path: '/documents/{uid}',
  tags: ['Documents'],
  summary: 'Update a document',
  description: 'Update an existing document with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateDocumentSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Document updated successfully',
      content: {
        'application/json': {
          schema: schemas.DocumentSchema,
        },
      },
    },
    404: {
      description: 'Document not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteDocumentRoute = createRoute({
  method: 'delete',
  path: '/documents/{uid}',
  tags: ['Documents'],
  summary: 'Delete a document',
  description: 'Soft delete a document by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Document deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Document not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

// Supplier Terms routes
export const getSupplierTermsRoute = createRoute({
  method: 'get',
  path: '/supplier-terms',
  tags: ['Terms'],
  summary: 'Get all supplier terms',
  description: 'Retrieve a list of all supplier terms',
  responses: {
    200: {
      description: 'List of supplier terms',
      content: {
        'application/json': {
          schema: schemas.SupplierTermListSchema,
        },
      },
    },
  },
});

export const getSupplierTermByIdRoute = createRoute({
  method: 'get',
  path: '/supplier-terms/{uid}',
  tags: ['Terms'],
  summary: 'Get supplier term by ID',
  description: 'Retrieve a specific supplier term by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Supplier term details',
      content: {
        'application/json': {
          schema: schemas.SupplierTermSchema,
        },
      },
    },
    404: {
      description: 'Supplier term not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const getSupplierTermsBySupplierRoute = createRoute({
  method: 'get',
  path: '/supplier-terms/supplier/{supplierUid}',
  tags: ['Terms'],
  summary: 'Get terms by supplier',
  description: 'Retrieve all terms for a specific supplier',
  request: {
    params: schemas.SupplierUidParam,
  },
  responses: {
    200: {
      description: 'List of supplier terms',
      content: {
        'application/json': {
          schema: schemas.SupplierTermListSchema,
        },
      },
    },
  },
});

export const createFinancialTermRoute = createRoute({
  method: 'post',
  path: '/supplier-terms/financial',
  tags: ['Terms'],
  summary: 'Create a new financial term',
  description: 'Create a new financial term for a supplier',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateFinancialTermSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Financial term created successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierTermSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createTradeTermRoute = createRoute({
  method: 'post',
  path: '/supplier-terms/trade',
  tags: ['Terms'],
  summary: 'Create a new trade term',
  description: 'Create a new trade term for a supplier',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateTradeTermSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Trade term created successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierTermSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const createSupportTermRoute = createRoute({
  method: 'post',
  path: '/supplier-terms/support',
  tags: ['Terms'],
  summary: 'Create a new support term',
  description: 'Create a new support term for a supplier',
  request: {
    body: {
      content: {
        'application/json': {
          schema: schemas.CreateSupportTermSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Support term created successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierTermSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const updateTermRoute = createRoute({
  method: 'put',
  path: '/supplier-terms/{uid}',
  tags: ['Terms'],
  summary: 'Update a supplier term',
  description: 'Update an existing supplier term with the provided data',
  request: {
    params: schemas.UuidParam,
    body: {
      content: {
        'application/json': {
          schema: schemas.SupplierTermSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Supplier term updated successfully',
      content: {
        'application/json': {
          schema: schemas.SupplierTermSchema,
        },
      },
    },
    404: {
      description: 'Supplier term not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
});

export const deleteTermRoute = createRoute({
  method: 'delete',
  path: '/supplier-terms/{uid}',
  tags: ['Terms'],
  summary: 'Delete a supplier term',
  description: 'Soft delete a supplier term by its unique identifier',
  request: {
    params: schemas.UuidParam,
  },
  responses: {
    200: {
      description: 'Supplier term deleted successfully',
      content: {
        'application/json': {
          schema: schemas.SuccessResponseSchema,
        },
      },
    },
    404: {
      description: 'Supplier term not found',
      content: {
        'application/json': {
          schema: schemas.ErrorResponseSchema,
        },
      },
    },
  },
}); 