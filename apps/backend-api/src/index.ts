import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";
import { z } from "zod";
import { db } from "../../../packages/database/database.js";
import { 
  appUser, 
  organization, 
  employee, 
  supplier, 
  supplierSite, 
  address, 
  orgUnit, 
  role,
  employeeOrgUnitRole,
  store,
  supplierInvitation,
  supplierSiteDocument,
  documentVerification,
  supplierSiteTerm,
  supplierFinancialTerm,
  supplierTradeTerm,
  supplierSupportTerm,
  supplierTermNote,
  approvalProcess,
  approvalStep,
  approvalResponsibility,
  approvalRequest,
  approvalLog,
  approvalComment
} from "@workspace/database/schema";

import {
  NewAppUserSchema,
  NewOrganizationSchema,
  NewEmployeeSchema,
  NewSupplierSchema,
  NewAddressSchema,
  NewOrgUnitSchema,
  NewRoleSchema,
  NewEmployeeOrgUnitRoleSchema,
  NewStoreSchema,
  NewSupplierInvitationSchema,
  NewSupplierSiteSchema,
  NewSupplierSiteDocumentSchema,
  NewDocumentVerificationSchema,
  NewSupplierSiteTermSchema,
  NewSupplierFinancialTermSchema,
  NewSupplierTradeTermSchema,
  NewSupplierSupportTermSchema,
  NewSupplierTermNoteSchema,
  NewApprovalProcessSchema,
  NewApprovalStepSchema,
  NewApprovalResponsibilitySchema,
  NewApprovalRequestSchema,
  NewApprovalLogSchema,
  NewApprovalCommentSchema,
  
  // Client-side schemas with additional validation
  ClientAppUserSchema,
  ClientOrganizationSchema,
  ClientEmployeeSchema,
  ClientAddressSchema,
  ClientSupplierSchema,
  ClientSupplierSiteSchema,
  ClientSupplierSiteTermSchema,
  ClientFinancialTermSchema,
  ClientTradeTermSchema,
  ClientSupportTermSchema,
  ClientApprovalRequestSchema
} from "@workspace/database/zod-schema";

import { eq, and, isNull } from "drizzle-orm";
import crypto from "crypto";

const app = new Hono();

// Add middleware
app.use("*", logger());
app.use("*", timing());
app.use("*", prettyJSON());

// Add CORS middleware
app.use(
  "/*",
  cors({
    origin: "*", // For development, allow all origins
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
  }),
);

// Get port from command line argument or use default
//const port = 3030;

// Root route
app.get("/", (c) => {
  return c.text("Supplier Management System API");
});

// ===================
// HELPER FUNCTIONS
// ===================
// Standard error handling
const handleError = (c: Context, error: unknown) => {
  if (error instanceof z.ZodError) {
    return c.json({ error: error.format() }, 400);
  }
  if (error instanceof Error) {
    return c.json({ error: error.message }, 500);
  }
  return c.json({ error: "An unknown error occurred" }, 500);
};

// Generate a new UUID
const generateUUID = () => crypto.randomUUID();

// ===================
// USER ENDPOINTS
// ===================

// Get all users (non-deleted)
app.get("/users", async (c) => {
  try {
    const allUsers = await db
      .select()
      .from(appUser)
      .where(isNull(appUser.deletedAt));
    
    return c.json(allUsers);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get user by ID
app.get("/users/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const userData = await db
      .select()
      .from(appUser)
      .where(and(
        eq(appUser.uid, uid),
        isNull(appUser.deletedAt)
      ));
    
    if (userData.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json(userData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new user
app.post("/users", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientAppUserSchema.parse(data);
    
    // Prepare the data for the database
    const newUser = NewAppUserSchema.parse({
      uid: data.uid || generateUUID(),
      clerkId: data.clerkId || generateUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(appUser).values(newUser).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a user
app.put("/users/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientAppUserSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(appUser)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(appUser.uid, uid),
        isNull(appUser.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a user
app.delete("/users/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(appUser)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(appUser.uid, uid),
        isNull(appUser.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// ORGANIZATION ENDPOINTS
// ===================

// Get all organizations (non-deleted)
app.get("/organizations", async (c) => {
  try {
    const allOrganizations = await db
      .select()
      .from(organization)
      .where(isNull(organization.deletedAt));
    
    return c.json(allOrganizations);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get organization by ID
app.get("/organizations/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const orgData = await db
      .select()
      .from(organization)
      .where(and(
        eq(organization.uid, uid),
        isNull(organization.deletedAt)
      ));
    
    if (orgData.length === 0) {
      return c.json({ error: "Organization not found" }, 404);
    }
    
    return c.json(orgData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new organization
app.post("/organizations", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientOrganizationSchema.parse(data);
    
    // Prepare the data for the database
    const newOrg = NewOrganizationSchema.parse({
      uid: data.uid || generateUUID(),
      licenseKey: data.licenseKey || generateUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(organization).values(newOrg).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an organization
app.put("/organizations/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientOrganizationSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(organization)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(organization.uid, uid),
        isNull(organization.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Organization not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an organization
app.delete("/organizations/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(organization)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(organization.uid, uid),
        isNull(organization.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Organization not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// EMPLOYEE ENDPOINTS
// ===================

// Get all employees (non-deleted)
app.get("/employees", async (c) => {
  try {
    const allEmployees = await db
      .select()
      .from(employee)
      .where(isNull(employee.deletedAt));
    
    return c.json(allEmployees);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get employees by organization
app.get("/organizations/:orgUid/employees", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const employeeData = await db
      .select()
      .from(employee)
      .where(and(
        eq(employee.organizationUid, orgUid),
        isNull(employee.deletedAt)
      ));
    
    return c.json(employeeData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get employee by ID
app.get("/employees/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const employeeData = await db
      .select()
      .from(employee)
      .where(and(
        eq(employee.userUid, userUid),
        isNull(employee.deletedAt)
      ));
    
    if (employeeData.length === 0) {
      return c.json({ error: "Employee not found" }, 404);
    }
    
    return c.json(employeeData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new employee
app.post("/employees", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientEmployeeSchema.parse(data);
    
    // Prepare the data for the database
    const newEmployee = NewEmployeeSchema.parse({
      ...validated,
      userUid: data.userUid || generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(employee).values(newEmployee).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an employee
app.put("/employees/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientEmployeeSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(employee)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(employee.userUid, userUid),
        isNull(employee.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Employee not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an employee
app.delete("/employees/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    const updated = await db
      .update(employee)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(employee.userUid, userUid),
        isNull(employee.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Employee not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// SUPPLIER ENDPOINTS
// ===================

// Get all suppliers (non-deleted)
app.get("/suppliers", async (c) => {
  try {
    const allSuppliers = await db
      .select()
      .from(supplier)
      .where(isNull(supplier.deletedAt));
    
    return c.json(allSuppliers);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get suppliers by organization
app.get("/organizations/:orgUid/suppliers", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const supplierData = await db
      .select()
      .from(supplier)
      .where(and(
        eq(supplier.organizationUid, orgUid),
        isNull(supplier.deletedAt)
      ));
    
    return c.json(supplierData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get supplier by ID
app.get("/suppliers/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const supplierData = await db
      .select()
      .from(supplier)
      .where(and(
        eq(supplier.userUid, userUid),
        isNull(supplier.deletedAt)
      ));
    
    if (supplierData.length === 0) {
      return c.json({ error: "Supplier not found" }, 404);
    }
    
    return c.json(supplierData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new supplier
app.post("/suppliers", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientSupplierSchema.parse(data);
    
    // Prepare the data for the database
    const newSupplier = NewSupplierSchema.parse({
      ...validated,
      userUid: data.userUid || generateUUID(),
      status: data.status || "DRAFT", // Default status
      revisionNumber: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(supplier).values(newSupplier).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a supplier
app.put("/suppliers/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientSupplierSchema.partial().parse(data);
    
    // Get the current supplier to increment revision number
    const currentSupplier = await db
      .select()
      .from(supplier)
      .where(and(
        eq(supplier.userUid, userUid),
        isNull(supplier.deletedAt)
      ));
    
    if (currentSupplier.length === 0) {
      return c.json({ error: "Supplier not found" }, 404);
    }
    
    // Increment revision number
    const revisionNumber = currentSupplier[0]?.revisionNumber ? currentSupplier[0].revisionNumber + 1 : 1;
    
    // Update with the validated data
    const updated = await db
      .update(supplier)
      .set({
        ...validated,
        revisionNumber,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplier.userUid, userUid),
        isNull(supplier.deletedAt)
      ))
      .returning();
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update supplier status
app.put("/suppliers/:userUid/status", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    if (!data.status) {
      return c.json({ error: "Status is required" }, 400);
    }
    
    // Update the status
    const updated = await db
      .update(supplier)
      .set({
        status: data.status,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplier.userUid, userUid),
        isNull(supplier.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Supplier not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a supplier
app.delete("/suppliers/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    const updated = await db
      .update(supplier)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplier.userUid, userUid),
        isNull(supplier.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Supplier not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// SUPPLIER INVITATION ENDPOINTS
// ===================

// Get all supplier invitations
app.get("/supplier-invitations", async (c) => {
  try {
    const allInvitations = await db
      .select()
      .from(supplierInvitation)
      .where(isNull(supplierInvitation.deletedAt));
    
    return c.json(allInvitations);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get supplier invitations by organization
app.get("/organizations/:orgUid/supplier-invitations", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const invitationData = await db
      .select()
      .from(supplierInvitation)
      .where(and(
        eq(supplierInvitation.organizationUid, orgUid),
        isNull(supplierInvitation.deletedAt)
      ));
    
    return c.json(invitationData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new supplier invitation
app.post("/supplier-invitations", async (c) => {
  try {
    const data = await c.req.json();
    
    // Set expiry date (e.g., 7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Prepare the data for the database
    const newInvitation = NewSupplierInvitationSchema.parse({
      uid: data.uid || generateUUID(),
      organizationUid: data.organizationUid,
      invitedByEmployeeUserUid: data.invitedByEmployeeUserUid,
      email: data.email,
      status: data.status || "SENT",
      expiresAt: data.expiresAt || expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUpdatedBy: data.lastUpdatedBy || null
    });
    
    const inserted = await db.insert(supplierInvitation).values(newInvitation).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update invitation status
app.put("/supplier-invitations/:uid/status", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    if (!data.status) {
      return c.json({ error: "Status is required" }, 400);
    }
    
    // Update the status
    const updated = await db
      .update(supplierInvitation)
      .set({
        status: data.status,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierInvitation.uid, uid),
        isNull(supplierInvitation.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Invitation not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// SUPPLIER SITE ENDPOINTS
// ===================

// Get all supplier sites
app.get("/supplier-sites", async (c) => {
  try {
    const allSites = await db
      .select()
      .from(supplierSite)
      .where(isNull(supplierSite.deletedAt));
    
    return c.json(allSites);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get supplier sites by supplier
app.get("/suppliers/:supplierUid/sites", async (c) => {
  try {
    const supplierUid = c.req.param("supplierUid");
    const siteData = await db
      .select()
      .from(supplierSite)
      .where(and(
        eq(supplierSite.supplierUserUid, supplierUid),
        isNull(supplierSite.deletedAt)
      ));
    
    return c.json(siteData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get supplier site by ID
app.get("/supplier-sites/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const siteData = await db
      .select()
      .from(supplierSite)
      .where(and(
        eq(supplierSite.userUid, userUid),
        isNull(supplierSite.deletedAt)
      ));
    
    if (siteData.length === 0) {
      return c.json({ error: "Supplier site not found" }, 404);
    }
    
    return c.json(siteData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new supplier site
app.post("/supplier-sites", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientSupplierSiteSchema.parse(data);
    
    // Prepare the data for the database
    const newSite = NewSupplierSiteSchema.parse({
      ...validated,
      userUid: data.userUid || generateUUID(),
      status: data.status || "PENDING", // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(supplierSite).values(newSite).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a supplier site
app.put("/supplier-sites/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientSupplierSiteSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(supplierSite)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSite.userUid, userUid),
        isNull(supplierSite.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Supplier site not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update supplier site status
app.put("/supplier-sites/:userUid/status", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    if (!data.status) {
      return c.json({ error: "Status is required" }, 400);
    }
    
    // Update the status
    const updated = await db
      .update(supplierSite)
      .set({
        status: data.status,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSite.userUid, userUid),
        isNull(supplierSite.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Supplier site not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a supplier site
app.delete("/supplier-sites/:userUid", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const data = await c.req.json();
    
    const updated = await db
      .update(supplierSite)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSite.userUid, userUid),
        isNull(supplierSite.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Supplier site not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// ADDRESS ENDPOINTS
// ===================

// Get all addresses
app.get("/addresses", async (c) => {
  try {
    const allAddresses = await db
      .select()
      .from(address)
      .where(isNull(address.deletedAt));
    
    return c.json(allAddresses);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get address by ID
app.get("/addresses/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const addressData = await db
      .select()
      .from(address)
      .where(and(
        eq(address.uid, uid),
        isNull(address.deletedAt)
      ));
    
    if (addressData.length === 0) {
      return c.json({ error: "Address not found" }, 404);
    }
    
    return c.json(addressData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new address
app.post("/addresses", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientAddressSchema.parse(data);
    
    // Prepare the data for the database
    const newAddress = NewAddressSchema.parse({
      uid: data.uid || generateUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(address).values(newAddress).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an address
app.put("/addresses/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientAddressSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(address)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(address.uid, uid),
        isNull(address.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Address not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an address
app.delete("/addresses/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(address)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(address.uid, uid),
        isNull(address.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Address not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// SUPPLIER SITE DOCUMENT ENDPOINTS
// ===================

// Get documents by supplier site
app.get("/supplier-sites/:siteUid/documents", async (c) => {
  try {
    const siteUid = c.req.param("siteUid");
    const documentData = await db
      .select()
      .from(supplierSiteDocument)
      .where(and(
        eq(supplierSiteDocument.supplierSiteUserUid, siteUid),
        isNull(supplierSiteDocument.deletedAt)
      ));
    
    return c.json(documentData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get document by ID
app.get("/documents/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const documentData = await db
      .select()
      .from(supplierSiteDocument)
      .where(and(
        eq(supplierSiteDocument.uid, uid),
        isNull(supplierSiteDocument.deletedAt)
      ));
    
    if (documentData.length === 0) {
      return c.json({ error: "Document not found" }, 404);
    }
    
    return c.json(documentData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new document
app.post("/documents", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newDocument = NewSupplierSiteDocumentSchema.parse({
      uid: data.uid || generateUUID(),
      supplierSiteUserUid: data.supplierSiteUserUid,
      documentType: data.documentType,
      filePath: data.filePath,
      verificationStatus: data.verificationStatus || "PENDING", // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(supplierSiteDocument).values(newDocument).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update document verification status
app.put("/documents/:uid/status", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    if (!data.verificationStatus) {
      return c.json({ error: "Verification status is required" }, 400);
    }
    
    // Update the status
    const updated = await db
      .update(supplierSiteDocument)
      .set({
        verificationStatus: data.verificationStatus,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSiteDocument.uid, uid),
        isNull(supplierSiteDocument.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Document not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a document
app.delete("/documents/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(supplierSiteDocument)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSiteDocument.uid, uid),
        isNull(supplierSiteDocument.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Document not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// DOCUMENT VERIFICATION ENDPOINTS
// ===================

// Get all document verifications
app.get("/document-verifications", async (c) => {
  try {
    const allVerifications = await db
      .select()
      .from(documentVerification)
      .where(isNull(documentVerification.deletedAt));
    
    return c.json(allVerifications);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get verifications by supplier
app.get("/suppliers/:supplierUid/document-verifications", async (c) => {
  try {
    const supplierUid = c.req.param("supplierUid");
    const verificationData = await db
      .select()
      .from(documentVerification)
      .where(and(
        eq(documentVerification.supplierUserUid, supplierUid),
        isNull(documentVerification.deletedAt)
      ));
    
    return c.json(verificationData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create new document verification
app.post("/document-verifications", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newVerification = NewDocumentVerificationSchema.parse({
      uid: data.uid || generateUUID(),
      supplierUserUid: data.supplierUserUid,
      supplierSiteUserUid: data.supplierSiteUserUid,
      documentType: data.documentType,
      status: data.status || "PENDING",
      requestPayload: data.requestPayload || {},
      responsePayload: data.responsePayload || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(documentVerification).values(newVerification).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update verification status
app.put("/document-verifications/:uid/status", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    if (!data.status) {
      return c.json({ error: "Status is required" }, 400);
    }
    
    // Update the status
    const updated = await db
      .update(documentVerification)
      .set({
        status: data.status,
        responsePayload: data.responsePayload || {},
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(documentVerification.uid, uid),
        isNull(documentVerification.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Verification not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// SUPPLIER TERM ENDPOINTS
// ===================

// Get all supplier terms
app.get("/supplier-terms", async (c) => {
  try {
    const allTerms = await db
      .select()
      .from(supplierSiteTerm)
      .where(isNull(supplierSiteTerm.deletedAt));
    
    return c.json(allTerms);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get terms by supplier site
app.get("/supplier-sites/:siteUid/terms", async (c) => {
  try {
    const siteUid = c.req.param("siteUid");
    const termData = await db
      .select()
      .from(supplierSiteTerm)
      .where(and(
        eq(supplierSiteTerm.supplierSiteUserUid, siteUid),
        isNull(supplierSiteTerm.deletedAt)
      ));
    
    return c.json(termData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get term by ID
app.get("/supplier-terms/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const termData = await db
      .select()
      .from(supplierSiteTerm)
      .where(and(
        eq(supplierSiteTerm.uid, uid),
        isNull(supplierSiteTerm.deletedAt)
      ));
    
    if (termData.length === 0) {
      return c.json({ error: "Term not found" }, 404);
    }
    
    return c.json(termData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new supplier term
app.post("/supplier-terms", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientSupplierSiteTermSchema.parse(data);
    
    // Prepare the data for the database
    const newTerm = NewSupplierSiteTermSchema.parse({
      uid: data.uid || generateUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(supplierSiteTerm).values(newTerm).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a supplier term
app.put("/supplier-terms/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientSupplierSiteTermSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(supplierSiteTerm)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSiteTerm.uid, uid),
        isNull(supplierSiteTerm.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Term not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a supplier term
app.delete("/supplier-terms/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(supplierSiteTerm)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierSiteTerm.uid, uid),
        isNull(supplierSiteTerm.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Term not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// FINANCIAL TERM ENDPOINTS
// ===================

// Get financial term by term ID
app.get("/supplier-terms/:termUid/financial", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const financialTermData = await db
      .select()
      .from(supplierFinancialTerm)
      .where(eq(supplierFinancialTerm.termUid, termUid));
    
    if (financialTermData.length === 0) {
      return c.json({ error: "Financial term not found" }, 404);
    }
    
    return c.json(financialTermData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new financial term
app.post("/financial-terms", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientFinancialTermSchema.parse(data);
    
    // Prepare the data for the database
    const newFinancialTerm = NewSupplierFinancialTermSchema.parse({
      termUid: validated.termUid,
      agreedCreditDays: validated.agreedCreditDays,
      paymentMethod: validated.paymentMethod,
      turnoverIncentiveAmount: validated.turnoverIncentiveAmount,
      turnoverIncentivePercent: validated.turnoverIncentivePercent,
      turnoverRealizationFrequency: validated.turnoverRealizationFrequency,
      turnoverRealizationMethod: validated.turnoverRealizationMethod,
      vendorListingFees: validated.vendorListingFees,
      vendorListingFeesChecked: validated.vendorListingFeesChecked
    });
    
    const inserted = await db.insert(supplierFinancialTerm).values(newFinancialTerm).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a financial term
app.put("/financial-terms/:termUid", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientFinancialTermSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
  .update(supplierFinancialTerm)
  .set({
    termUid: validated.termUid,
    agreedCreditDays: validated.agreedCreditDays,
    paymentMethod: validated.paymentMethod,
    turnoverIncentiveAmount: validated.turnoverIncentiveAmount?.toString(),
    turnoverIncentivePercent: validated.turnoverIncentivePercent?.toString(),
    turnoverRealizationFrequency: validated.turnoverRealizationFrequency,
    turnoverRealizationMethod: validated.turnoverRealizationMethod,
    vendorListingFees: validated.vendorListingFees?.toString(),
    vendorListingFeesChecked: validated.vendorListingFeesChecked
  })
  .where(eq(supplierFinancialTerm.termUid, termUid))
  .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Financial term not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// TRADE TERM ENDPOINTS
// ===================

// Get trade term by term ID
app.get("/supplier-terms/:termUid/trade", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const tradeTermData = await db
      .select()
      .from(supplierTradeTerm)
      .where(eq(supplierTradeTerm.termUid, termUid));
    
    if (tradeTermData.length === 0) {
      return c.json({ error: "Trade term not found" }, 404);
    }
    
    return c.json(tradeTermData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new trade term
app.post("/trade-terms", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientTradeTermSchema.parse(data);
    
    // Prepare the data for the database
    const newTradeTerm = NewSupplierTradeTermSchema.parse({
      termUid: validated.termUid,
      leadTimeDays: validated.leadTimeDays,
      saleOrReturn: validated.saleOrReturn,
      discountPercent: validated.discountPercent,
      daysEarlier: validated.daysEarlier,
      shrinkSharing: validated.shrinkSharing,
      shrinkSharingPercent: validated.shrinkSharingPercent
    });
    
    const inserted = await db.insert(supplierTradeTerm).values(newTradeTerm).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a trade term
app.put("/trade-terms/:termUid", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientTradeTermSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
  .update(supplierTradeTerm)
  .set({
    termUid: validated.termUid,
    leadTimeDays: validated.leadTimeDays,
    saleOrReturn: validated.saleOrReturn,
    discountPercent: validated.discountPercent?.toString(),
    daysEarlier: validated.daysEarlier,
    shrinkSharing: validated.shrinkSharing,
    shrinkSharingPercent: validated.shrinkSharingPercent?.toString()
  })
  .where(eq(supplierTradeTerm.termUid, termUid))
  .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Trade term not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// SUPPORT TERM ENDPOINTS
// ===================

// Get support term by term ID
app.get("/supplier-terms/:termUid/support", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const supportTermData = await db
      .select()
      .from(supplierSupportTerm)
      .where(eq(supplierSupportTerm.termUid, termUid));
    
    if (supportTermData.length === 0) {
      return c.json({ error: "Support term not found" }, 404);
    }
    
    return c.json(supportTermData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new support term
app.post("/support-terms", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientSupportTermSchema.parse(data);
    
    // Prepare the data for the database
    const newSupportTerm = NewSupplierSupportTermSchema.parse({
      termUid: validated.termUid,
      merchandisingSupportAmount: validated.merchandisingSupportAmount,
      merchandisingSupportPersonCount: validated.merchandisingSupportPersonCount,
      merchandisingSupportPercent: validated.merchandisingSupportPercent,
      merchandisingSupportFrequency: validated.merchandisingSupportFrequency,
      merchandisingSupportMethod: validated.merchandisingSupportMethod,
      barcodeAmount: validated.barcodeAmount,
      barcodePercent: validated.barcodePercent,
      barcodeFrequency: validated.barcodeFrequency,
      barcodeMethod: validated.barcodeMethod,
      newProductIntroFeeAmount: validated.newProductIntroFeeAmount,
      newProductIntroFeePercent: validated.newProductIntroFeePercent,
      newProductIntroFeeFrequency: validated.newProductIntroFeeFrequency,
      newProductIntroFeeMethod: validated.newProductIntroFeeMethod,
      storeOpeningSupportAmount: validated.storeOpeningSupportAmount,
      storeOpeningSupportFrequency: validated.storeOpeningSupportFrequency,
      storeOpeningSupportMethod: validated.storeOpeningSupportMethod,
      storeAnniversarySupportAmount: validated.storeAnniversarySupportAmount,
      storeAnniversarySupportFrequency: validated.storeAnniversarySupportFrequency,
      storeAnniversarySupportMethod: validated.storeAnniversarySupportMethod
    });
    
    const inserted = await db.insert(supplierSupportTerm).values(newSupportTerm).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a support term
app.put("/support-terms/:termUid", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const data = await c.req.json();
    
    // Validate the input with client schema
    const validated = ClientSupportTermSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
  .update(supplierSupportTerm)
  .set({
    termUid: validated.termUid,
    merchandisingSupportAmount: validated.merchandisingSupportAmount?.toString(),
    merchandisingSupportPersonCount: validated.merchandisingSupportPersonCount,
    merchandisingSupportPercent: validated.merchandisingSupportPercent?.toString(),
    merchandisingSupportFrequency: validated.merchandisingSupportFrequency,
    merchandisingSupportMethod: validated.merchandisingSupportMethod,
    barcodeAmount: validated.barcodeAmount?.toString(),
    barcodePercent: validated.barcodePercent?.toString(),
    barcodeFrequency: validated.barcodeFrequency,
    barcodeMethod: validated.barcodeMethod,
    newProductIntroFeeAmount: validated.newProductIntroFeeAmount?.toString(),
    newProductIntroFeePercent: validated.newProductIntroFeePercent?.toString(),
    newProductIntroFeeFrequency: validated.newProductIntroFeeFrequency,
    newProductIntroFeeMethod: validated.newProductIntroFeeMethod,
    storeOpeningSupportAmount: validated.storeOpeningSupportAmount?.toString(),
    storeOpeningSupportFrequency: validated.storeOpeningSupportFrequency,
    storeOpeningSupportMethod: validated.storeOpeningSupportMethod,
    storeAnniversarySupportAmount: validated.storeAnniversarySupportAmount?.toString(),
    storeAnniversarySupportFrequency: validated.storeAnniversarySupportFrequency,
    storeAnniversarySupportMethod: validated.storeAnniversarySupportMethod
  })
  .where(eq(supplierSupportTerm.termUid, termUid))
  .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Support term not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// TERM NOTE ENDPOINTS
// ===================

// Get notes by term
app.get("/supplier-terms/:termUid/notes", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const noteData = await db
      .select()
      .from(supplierTermNote)
      .where(and(
        eq(supplierTermNote.termUid, termUid),
        isNull(supplierTermNote.deletedAt)
      ))
      .orderBy(supplierTermNote.createdAt);
    
    return c.json(noteData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new term note
app.post("/term-notes", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newNote = NewSupplierTermNoteSchema.parse({
      uid: data.uid || generateUUID(),
      termUid: data.termUid,
      noteText: data.noteText,
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(supplierTermNote).values(newNote).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a term note
app.delete("/term-notes/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(supplierTermNote)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierTermNote.uid, uid),
        isNull(supplierTermNote.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Note not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// ORG UNIT ENDPOINTS
// ===================

// Get all org units
app.get("/org-units", async (c) => {
  try {
    const allOrgUnits = await db
      .select()
      .from(orgUnit)
      .where(isNull(orgUnit.deletedAt));
    
    return c.json(allOrgUnits);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get org units by organization
app.get("/organizations/:orgUid/org-units", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const orgUnitData = await db
      .select()
      .from(orgUnit)
      .where(and(
        eq(orgUnit.organizationUid, orgUid),
        isNull(orgUnit.deletedAt)
      ));
    
    return c.json(orgUnitData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get org unit by ID
app.get("/org-units/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const orgUnitData = await db
      .select()
      .from(orgUnit)
      .where(and(
        eq(orgUnit.uid, uid),
        isNull(orgUnit.deletedAt)
      ));
    
    if (orgUnitData.length === 0) {
      return c.json({ error: "Org unit not found" }, 404);
    }
    
    return c.json(orgUnitData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new org unit
app.post("/org-units", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newOrgUnit = NewOrgUnitSchema.parse({
      uid: data.uid || generateUUID(),
      organizationUid: data.organizationUid,
      name: data.name,
      orgUnitCode: data.orgUnitCode,
      unitType: data.unitType,
      parentUid: data.parentUid || null,
      extraData: data.extraData || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(orgUnit).values(newOrgUnit).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an org unit
app.put("/org-units/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(orgUnit)
      .set({
        name: data.name,
        orgUnitCode: data.orgUnitCode,
        unitType: data.unitType,
        parentUid: data.parentUid,
        extraData: data.extraData,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(orgUnit.uid, uid),
        isNull(orgUnit.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Org unit not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an org unit
app.delete("/org-units/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(orgUnit)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(orgUnit.uid, uid),
        isNull(orgUnit.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Org unit not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// ROLE ENDPOINTS
// ===================

// Get all roles
app.get("/roles", async (c) => {
  try {
    const allRoles = await db
      .select()
      .from(role)
      .where(isNull(role.deletedAt));
    
    return c.json(allRoles);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get roles by organization
app.get("/organizations/:orgUid/roles", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const roleData = await db
      .select()
      .from(role)
      .where(and(
        eq(role.organizationUid, orgUid),
        isNull(role.deletedAt)
      ));
    
    return c.json(roleData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get role by ID
app.get("/roles/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const roleData = await db
      .select()
      .from(role)
      .where(and(
        eq(role.uid, uid),
        isNull(role.deletedAt)
      ));
    
    if (roleData.length === 0) {
      return c.json({ error: "Role not found" }, 404);
    }
    
    return c.json(roleData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new role
app.post("/roles", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newRole = NewRoleSchema.parse({
      uid: data.uid || generateUUID(),
      organizationUid: data.organizationUid,
      name: data.name,
      roleCode: data.roleCode,
      extraData: data.extraData || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(role).values(newRole).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a role
app.put("/roles/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(role)
      .set({
        name: data.name,
        roleCode: data.roleCode,
        extraData: data.extraData,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(role.uid, uid),
        isNull(role.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Role not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a role
app.delete("/roles/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(role)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(role.uid, uid),
        isNull(role.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Role not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// EMPLOYEE ORG UNIT ROLE ENDPOINTS
// ===================

// Get employee's org unit roles
app.get("/employees/:userUid/org-unit-roles", async (c) => {
  try {
    const userUid = c.req.param("userUid");
    const orgUnitRoleData = await db
      .select()
      .from(employeeOrgUnitRole)
      .where(and(
        eq(employeeOrgUnitRole.employeeUserUid, userUid),
        isNull(employeeOrgUnitRole.deletedAt)
      ));
    
    return c.json(orgUnitRoleData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new employee org unit role
app.post("/employee-org-unit-roles", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newOrgUnitRole = NewEmployeeOrgUnitRoleSchema.parse({
      uid: data.uid || generateUUID(),
      employeeUserUid: data.employeeUserUid,
      orgUnitUid: data.orgUnitUid,
      roleUid: data.roleUid,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(employeeOrgUnitRole).values(newOrgUnitRole).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Delete an employee org unit role
app.delete("/employee-org-unit-roles/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(employeeOrgUnitRole)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(employeeOrgUnitRole.uid, uid),
        isNull(employeeOrgUnitRole.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Employee org unit role not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// STORE ENDPOINTS
// ===================

// Get all stores
app.get("/stores", async (c) => {
  try {
    const allStores = await db
      .select()
      .from(store)
      .where(isNull(store.deletedAt));
    
    return c.json(allStores);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get stores by organization
app.get("/organizations/:orgUid/stores", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const storeData = await db
      .select()
      .from(store)
      .where(and(
        eq(store.organizationUid, orgUid),
        isNull(store.deletedAt)
      ));
    
    return c.json(storeData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get store by ID
app.get("/stores/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const storeData = await db
      .select()
      .from(store)
      .where(and(
        eq(store.uid, uid),
        isNull(store.deletedAt)
      ));
    
    if (storeData.length === 0) {
      return c.json({ error: "Store not found" }, 404);
    }
    
    return c.json(storeData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new store
app.post("/stores", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newStore = NewStoreSchema.parse({
      uid: data.uid || generateUUID(),
      organizationUid: data.organizationUid,
      name: data.name,
      storeCode: data.storeCode,
      addressUid: data.addressUid,
      extraData: data.extraData || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(store).values(newStore).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a store
app.put("/stores/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(store)
      .set({
        name: data.name,
        storeCode: data.storeCode,
        addressUid: data.addressUid,
        extraData: data.extraData,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(store.uid, uid),
        isNull(store.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Store not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a store
app.delete("/stores/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(store)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(store.uid, uid),
        isNull(store.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Store not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// APPROVAL PROCESS ENDPOINTS
// ===================

// Get all approval processes
app.get("/approval-processes", async (c) => {
  try {
    const allProcesses = await db
      .select()
      .from(approvalProcess)
      .where(isNull(approvalProcess.deletedAt));
    
    return c.json(allProcesses);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get approval processes by organization
app.get("/organizations/:orgUid/approval-processes", async (c) => {
  try {
    const orgUid = c.req.param("orgUid");
    const processData = await db
      .select()
      .from(approvalProcess)
      .where(and(
        eq(approvalProcess.organizationUid, orgUid),
        isNull(approvalProcess.deletedAt)
      ));
    
    return c.json(processData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get approval process by ID
app.get("/approval-processes/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const processData = await db
      .select()
      .from(approvalProcess)
      .where(and(
        eq(approvalProcess.uid, uid),
        isNull(approvalProcess.deletedAt)
      ));
    
    if (processData.length === 0) {
      return c.json({ error: "Approval process not found" }, 404);
    }
    
    return c.json(processData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new approval process
app.post("/approval-processes", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newProcess = NewApprovalProcessSchema.parse({
      uid: data.uid || generateUUID(),
      organizationUid: data.organizationUid,
      name: data.name,
      extraData: data.extraData || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(approvalProcess).values(newProcess).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an approval process
app.put("/approval-processes/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(approvalProcess)
      .set({
        name: data.name,
        extraData: data.extraData,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalProcess.uid, uid),
        isNull(approvalProcess.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval process not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an approval process
app.delete("/approval-processes/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(approvalProcess)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalProcess.uid, uid),
        isNull(approvalProcess.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval process not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// APPROVAL STEP ENDPOINTS
// ===================

// Get approval steps by process
app.get("/approval-processes/:processUid/steps", async (c) => {
  try {
    const processUid = c.req.param("processUid");
    const stepData = await db
      .select()
      .from(approvalStep)
      .where(and(
        eq(approvalStep.approvalProcessUid, processUid),
        isNull(approvalStep.deletedAt)
      ))
      .orderBy(approvalStep.stepOrder);
    
    return c.json(stepData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get approval step by ID
app.get("/approval-steps/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const stepData = await db
      .select()
      .from(approvalStep)
      .where(and(
        eq(approvalStep.uid, uid),
        isNull(approvalStep.deletedAt)
      ));
    
    if (stepData.length === 0) {
      return c.json({ error: "Approval step not found" }, 404);
    }
    
    return c.json(stepData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new approval step
app.post("/approval-steps", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newStep = NewApprovalStepSchema.parse({
      uid: data.uid || generateUUID(),
      approvalProcessUid: data.approvalProcessUid,
      stepName: data.stepName,
      stepOrder: data.stepOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(approvalStep).values(newStep).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an approval step
app.put("/approval-steps/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(approvalStep)
      .set({
        stepName: data.stepName,
        stepOrder: data.stepOrder,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalStep.uid, uid),
        isNull(approvalStep.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval step not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an approval step
app.delete("/approval-steps/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(approvalStep)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalStep.uid, uid),
        isNull(approvalStep.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval step not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// APPROVAL RESPONSIBILITY ENDPOINTS
// ===================

// Get responsibilities by step
app.get("/approval-steps/:stepUid/responsibilities", async (c) => {
  try {
    const stepUid = c.req.param("stepUid");
    const responsibilityData = await db
      .select()
      .from(approvalResponsibility)
      .where(and(
        eq(approvalResponsibility.approvalStepUid, stepUid),
        isNull(approvalResponsibility.deletedAt)
      ));
    
    return c.json(responsibilityData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new approval responsibility
app.post("/approval-responsibilities", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newResponsibility = NewApprovalResponsibilitySchema.parse({
      uid: data.uid || generateUUID(),
      approvalStepUid: data.approvalStepUid,
      responsibilityType: data.responsibilityType,
      roleUid: data.roleUid || null,
      orgUnitUid: data.orgUnitUid || null,
      employeeUserUid: data.employeeUserUid || null,
      fallbackRoleUid: data.fallbackRoleUid || null,
      fallbackOrgUnitUid: data.fallbackOrgUnitUid || null,
      fallbackEmployeeUserUid: data.fallbackEmployeeUserUid || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(approvalResponsibility).values(newResponsibility).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update an approval responsibility
app.put("/approval-responsibilities/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(approvalResponsibility)
      .set({
        responsibilityType: data.responsibilityType,
        roleUid: data.roleUid || null,
        orgUnitUid: data.orgUnitUid || null,
        employeeUserUid: data.employeeUserUid || null,
        fallbackRoleUid: data.fallbackRoleUid || null,
        fallbackOrgUnitUid: data.fallbackOrgUnitUid || null,
        fallbackEmployeeUserUid: data.fallbackEmployeeUserUid || null,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalResponsibility.uid, uid),
        isNull(approvalResponsibility.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval responsibility not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete an approval responsibility
app.delete("/approval-responsibilities/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(approvalResponsibility)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalResponsibility.uid, uid),
        isNull(approvalResponsibility.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval responsibility not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// APPROVAL REQUEST ENDPOINTS
// ===================

// Get all approval requests
app.get("/approval-requests", async (c) => {
  try {
    const allRequests = await db
      .select()
      .from(approvalRequest)
      .where(isNull(approvalRequest.deletedAt));
    
    return c.json(allRequests);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get approval requests by supplier
app.get("/suppliers/:supplierUid/approval-requests", async (c) => {
  try {
    const supplierUid = c.req.param("supplierUid");
    const requestData = await db
      .select()
      .from(approvalRequest)
      .where(and(
        eq(approvalRequest.supplierUserUid, supplierUid),
        isNull(approvalRequest.deletedAt)
      ));
    
    return c.json(requestData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Get approval request by ID
app.get("/approval-requests/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const requestData = await db
      .select()
      .from(approvalRequest)
      .where(and(
        eq(approvalRequest.uid, uid),
        isNull(approvalRequest.deletedAt)
      ));
    
    if (requestData.length === 0) {
      return c.json({ error: "Approval request not found" }, 404);
    }
    
    return c.json(requestData[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new approval request
app.post("/approval-requests", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientApprovalRequestSchema.parse(data);
    
    // Prepare the data for the database
    const newRequest = NewApprovalRequestSchema.parse({
      uid: data.uid || generateUUID(),
      ...validated,
      createdAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(approvalRequest).values(newRequest).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update approval request status
app.put("/approval-requests/:uid/status", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    if (!data.status) {
      return c.json({ error: "Status is required" }, 400);
    }
    
    // Prepare update data based on status
    const updateData: any = {
      status: data.status,
      lastUpdatedBy: data.lastUpdatedBy || null
    };
    
    // If status is final (approved or rejected), set the completion date
    if (data.status === "APPROVED" || data.status === "REJECTED") {
      updateData.completedAt = new Date();
    }
    
    // Update the status
    const updated = await db
      .update(approvalRequest)
      .set(updateData)
      .where(and(
        eq(approvalRequest.uid, uid),
        isNull(approvalRequest.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval request not found" }, 404);
    }
    
    // Create an approval log for this action
    if (data.actionByUserUid) {
      await db.insert(approvalLog).values({
        uid: generateUUID(),
        approvalRequestUid: uid,
        approvalStepUid: updated[0]?.stepUid || "",
        actionByUserUid: data.actionByUserUid,
        actionDate: new Date(),
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: data.actionByUserUid,
        lastUpdatedBy: data.actionByUserUid
      });
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update approval request step
app.put("/approval-requests/:uid/step", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    if (!data.stepUid) {
      return c.json({ error: "Step UID is required" }, 400);
    }
    
    // Update the step
    const updated = await db
      .update(approvalRequest)
      .set({
        stepUid: data.stepUid,
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(approvalRequest.uid, uid),
        isNull(approvalRequest.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Approval request not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// APPROVAL LOG ENDPOINTS
// ===================

// Get logs by approval request
app.get("/approval-requests/:requestUid/logs", async (c) => {
  try {
    const requestUid = c.req.param("requestUid");
    const logData = await db
      .select()
      .from(approvalLog)
      .where(and(
        eq(approvalLog.approvalRequestUid, requestUid),
        isNull(approvalLog.deletedAt)
      ))
      .orderBy(approvalLog.actionDate);
    
    return c.json(logData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new approval log
app.post("/approval-logs", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newLog = NewApprovalLogSchema.parse({
      uid: data.uid || generateUUID(),
      approvalRequestUid: data.approvalRequestUid,
      approvalStepUid: data.approvalStepUid,
      actionByUserUid: data.actionByUserUid,
      actionDate: data.actionDate || new Date(),
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(approvalLog).values(newLog).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// APPROVAL COMMENT ENDPOINTS
// ===================

// Get comments by approval request
app.get("/approval-requests/:requestUid/comments", async (c) => {
  try {
    const requestUid = c.req.param("requestUid");
    const commentData = await db
      .select()
      .from(approvalComment)
      .where(eq(approvalComment.approvalRequestUid, requestUid))
      .orderBy(approvalComment.createdAt);
    
    return c.json(commentData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Add a comment to an approval request
app.post("/approval-comments", async (c) => {
  try {
    const data = await c.req.json();
    
    if (!data.commentText || !data.commentByUserUid || !data.approvalRequestUid || !data.approvalStepUid) {
      return c.json({ error: "Comment text, user ID, request ID, and step ID are required" }, 400);
    }
    
    // Create the comment
    const newComment = NewApprovalCommentSchema.parse({
      uid: data.uid || generateUUID(),
      approvalRequestUid: data.approvalRequestUid,
      approvalStepUid: data.approvalStepUid,
      commentText: data.commentText,
      commentByUserUid: data.commentByUserUid,
      createdAt: new Date(),
      createdBy: data.commentByUserUid
    });
    
    const inserted = await db.insert(approvalComment).values(newComment).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});