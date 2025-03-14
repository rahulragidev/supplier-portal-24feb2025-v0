import { OpenAPIHono } from "@hono/zod-openapi";
import type { Hono } from "hono";
import type { Context } from "hono";
import * as routes from "./routes.js";

// Define environment interfaces
declare module "hono" {
  interface Bindings {
    origApp: Hono;
  }
}

// Create a OpenAPIHono instance for API documentation
export const openAPIApp = new OpenAPIHono();

// Register user routes using proxy to original app
const proxyToApp = (c: Context) =>
  c.env?.origApp?.fetch(c.req.raw) || new Response("Missing original app", { status: 500 });

// Register user routes
openAPIApp.openapi(routes.getUsersRoute, proxyToApp);
openAPIApp.openapi(routes.getUserByIdRoute, proxyToApp);
openAPIApp.openapi(routes.createUserRoute, proxyToApp);
openAPIApp.openapi(routes.updateUserRoute, proxyToApp);
openAPIApp.openapi(routes.deleteUserRoute, proxyToApp);

// Register organization routes
openAPIApp.openapi(routes.getOrganizationsRoute, proxyToApp);
openAPIApp.openapi(routes.getOrganizationByIdRoute, proxyToApp);
openAPIApp.openapi(routes.createOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.updateOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.deleteOrganizationRoute, proxyToApp);

// Register employee routes
openAPIApp.openapi(routes.getEmployeesRoute, proxyToApp);
openAPIApp.openapi(routes.getEmployeeByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getEmployeesByOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.createEmployeeRoute, proxyToApp);
openAPIApp.openapi(routes.updateEmployeeRoute, proxyToApp);
openAPIApp.openapi(routes.deleteEmployeeRoute, proxyToApp);

// Register supplier routes
openAPIApp.openapi(routes.getSuppliersRoute, proxyToApp);
openAPIApp.openapi(routes.getSupplierByIdRoute, proxyToApp);
openAPIApp.openapi(routes.createSupplierRoute, proxyToApp);
openAPIApp.openapi(routes.updateSupplierRoute, proxyToApp);
openAPIApp.openapi(routes.updateSupplierStatusRoute, proxyToApp);
openAPIApp.openapi(routes.deleteSupplierRoute, proxyToApp);
openAPIApp.openapi(routes.getSuppliersByOrganizationRoute, proxyToApp);

// Register supplier invitation routes
openAPIApp.openapi(routes.getSupplierInvitationsRoute, proxyToApp);
openAPIApp.openapi(routes.getSupplierInvitationsByOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.createSupplierInvitationRoute, proxyToApp);
openAPIApp.openapi(routes.updateSupplierInvitationStatusRoute, proxyToApp);

// Register supplier site routes
openAPIApp.openapi(routes.getAllSitesRoute, proxyToApp);
openAPIApp.openapi(routes.getSitesBySupplierRoute, proxyToApp);
openAPIApp.openapi(routes.getSiteByIdRoute, proxyToApp);
openAPIApp.openapi(routes.createSiteRoute, proxyToApp);
openAPIApp.openapi(routes.updateSiteRoute, proxyToApp);
openAPIApp.openapi(routes.updateSiteStatusRoute, proxyToApp);
openAPIApp.openapi(routes.deleteSiteRoute, proxyToApp);

// Register address routes
openAPIApp.openapi(routes.getAddressesRoute, proxyToApp);
openAPIApp.openapi(routes.getAddressByIdRoute, proxyToApp);
openAPIApp.openapi(routes.createAddressRoute, proxyToApp);
openAPIApp.openapi(routes.updateAddressRoute, proxyToApp);
openAPIApp.openapi(routes.deleteAddressRoute, proxyToApp);

// Register org unit routes
openAPIApp.openapi(routes.getOrgUnitsRoute, proxyToApp);
openAPIApp.openapi(routes.getOrgUnitByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getOrgUnitsByOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.createOrgUnitRoute, proxyToApp);
openAPIApp.openapi(routes.updateOrgUnitRoute, proxyToApp);
openAPIApp.openapi(routes.deleteOrgUnitRoute, proxyToApp);

// Register role routes
openAPIApp.openapi(routes.getRolesRoute, proxyToApp);
openAPIApp.openapi(routes.getRoleByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getRolesByOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.createRoleRoute, proxyToApp);
openAPIApp.openapi(routes.updateRoleRoute, proxyToApp);
openAPIApp.openapi(routes.deleteRoleRoute, proxyToApp);

// Register store routes
openAPIApp.openapi(routes.getStoresRoute, proxyToApp);
openAPIApp.openapi(routes.getStoreByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getStoresByOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.createStoreRoute, proxyToApp);
openAPIApp.openapi(routes.updateStoreRoute, proxyToApp);
openAPIApp.openapi(routes.deleteStoreRoute, proxyToApp);

// Register approval process routes
openAPIApp.openapi(routes.getApprovalProcessesRoute, proxyToApp);
openAPIApp.openapi(routes.getApprovalProcessByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getApprovalProcessesByOrganizationRoute, proxyToApp);
openAPIApp.openapi(routes.createApprovalProcessRoute, proxyToApp);
openAPIApp.openapi(routes.updateApprovalProcessRoute, proxyToApp);
openAPIApp.openapi(routes.deleteApprovalProcessRoute, proxyToApp);

// Register approval step routes
openAPIApp.openapi(routes.getStepsByProcessRoute, proxyToApp);
openAPIApp.openapi(routes.getStepByIdRoute, proxyToApp);
openAPIApp.openapi(routes.createStepRoute, proxyToApp);
openAPIApp.openapi(routes.updateStepRoute, proxyToApp);
openAPIApp.openapi(routes.deleteStepRoute, proxyToApp);

// Register approval responsibility routes
openAPIApp.openapi(routes.getResponsibilitiesByStepRoute, proxyToApp);
openAPIApp.openapi(routes.createResponsibilityRoute, proxyToApp);
openAPIApp.openapi(routes.updateResponsibilityRoute, proxyToApp);
openAPIApp.openapi(routes.deleteResponsibilityRoute, proxyToApp);

// Register approval request routes
openAPIApp.openapi(routes.getApprovalRequestsRoute, proxyToApp);
openAPIApp.openapi(routes.getApprovalRequestByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getApprovalRequestsBySupplierRoute, proxyToApp);
openAPIApp.openapi(routes.createApprovalRequestRoute, proxyToApp);
openAPIApp.openapi(routes.updateRequestStatusRoute, proxyToApp);
openAPIApp.openapi(routes.updateRequestStepRoute, proxyToApp);

// Register approval log routes
openAPIApp.openapi(routes.getLogsByRequestRoute, proxyToApp);
openAPIApp.openapi(routes.createLogRoute, proxyToApp);

// Register approval comment routes
openAPIApp.openapi(routes.getCommentsByRequestRoute, proxyToApp);
openAPIApp.openapi(routes.createCommentRoute, proxyToApp);

// Register document routes
openAPIApp.openapi(routes.getDocumentsRoute, proxyToApp);
openAPIApp.openapi(routes.getDocumentByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getDocumentsByEntityRoute, proxyToApp);
openAPIApp.openapi(routes.createDocumentRoute, proxyToApp);
openAPIApp.openapi(routes.updateDocumentRoute, proxyToApp);
openAPIApp.openapi(routes.deleteDocumentRoute, proxyToApp);

// Register supplier term routes
openAPIApp.openapi(routes.getSupplierTermsRoute, proxyToApp);
openAPIApp.openapi(routes.getSupplierTermByIdRoute, proxyToApp);
openAPIApp.openapi(routes.getSupplierTermsBySupplierRoute, proxyToApp);
openAPIApp.openapi(routes.createFinancialTermRoute, proxyToApp);
openAPIApp.openapi(routes.createTradeTermRoute, proxyToApp);
openAPIApp.openapi(routes.createSupportTermRoute, proxyToApp);
openAPIApp.openapi(routes.updateTermRoute, proxyToApp);
openAPIApp.openapi(routes.deleteTermRoute, proxyToApp);

// Generate the OpenAPI documentation
openAPIApp.doc("/api-doc", {
  openapi: "3.0.0",
  info: {
    title: "Supplier Management System API",
    version: "1.0.0",
    description: "REST API for the Supplier Management System",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3030",
      description: "Development server",
    },
    {
      url: "https://api.suppliermgmt.example.com",
      description: "Production server",
    },
  ],
  tags: [
    { name: "Users", description: "User management operations" },
    { name: "Organizations", description: "Organization management operations" },
    { name: "Employees", description: "Employee management operations" },
    { name: "Suppliers", description: "Supplier management operations" },
    { name: "Invitations", description: "Supplier invitation operations" },
    { name: "Addresses", description: "Address management operations" },
    { name: "OrgUnits", description: "Organizational units management operations" },
    { name: "Roles", description: "Role management operations" },
    { name: "Stores", description: "Store management operations" },
    { name: "Approvals", description: "Approval process operations" },
    { name: "Documents", description: "Document management operations" },
    { name: "Terms", description: "Supplier terms management operations" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token with userId in payload",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
} as any);

// This middleware integrates the OpenAPI app with the main app
export const setupOpenAPI = (app: Hono) => {
  // Mount the OpenAPI app on the main app
  app.get("/api-doc", (c: Context) => {
    return openAPIApp.fetch(c.req.raw, { origApp: app });
  });

  return app;
};
