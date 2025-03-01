import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";
import { z } from "zod";
import { db } from "../../../packages/database/database.js";
import { 
  user, 
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
  paymentTermType,
  supplierSiteTerm,
  supplierCommercialTerm,
  supplierTermNote,
  approvalProcess,
  approvalStep,
  approvalResponsibility,
  approvalRequest,
  approvalLog,
  approvalComment
} from "@workspace/database/schema";

import {
  NewUserSchema,
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
  NewPaymentTermTypeSchema,
  NewSupplierSiteTermSchema,
  NewSupplierCommercialTermSchema,
  NewSupplierTermNoteSchema,
  NewApprovalProcessSchema,
  NewApprovalStepSchema,
  NewApprovalResponsibilitySchema,
  NewApprovalRequestSchema,
  NewApprovalLogSchema,
  NewApprovalCommentSchema,
  
  // Client-side schemas with additional validation
  ClientUserSchema,
  ClientOrganizationSchema,
  ClientEmployeeSchema,
  ClientAddressSchema,
  ClientSupplierSchema,
  ClientSupplierSiteSchema,
  ClientSupplierSiteTermSchema,
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
const port = 3030;

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

// ===================
// USER ENDPOINTS
// ===================

// Get all users (non-deleted)
app.get("/users", async (c) => {
  try {
    const allUsers = await db
      .select()
      .from(user)
      .where(isNull(user.deletedAt));
    
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
      .from(user)
      .where(and(
        eq(user.uid, uid),
        isNull(user.deletedAt)
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
    const validated = ClientUserSchema.parse(data);
    
    // Prepare the data for the database
    const newUser = NewUserSchema.parse({
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(user).values(newUser).returning();
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
    const validated = ClientUserSchema.partial().parse(data);
    
    // Update with the validated data
    const updated = await db
      .update(user)
      .set({
        ...validated,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(user.uid, uid),
        isNull(user.deletedAt)
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
      .update(user)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(user.uid, uid),
        isNull(user.deletedAt)
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
// SUPPLIER TERM ENDPOINTS
// ===================

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
// COMMERCIAL TERM ENDPOINTS
// ===================

// Get commercial terms by supplier site term
app.get("/supplier-terms/:termUid/commercial-terms", async (c) => {
  try {
    const termUid = c.req.param("termUid");
    const commercialTermData = await db
      .select()
      .from(supplierCommercialTerm)
      .where(and(
        eq(supplierCommercialTerm.supplierSiteTermUid, termUid),
        isNull(supplierCommercialTerm.deletedAt)
      ));
    
    return c.json(commercialTermData);
  } catch (error) {
    return handleError(c, error);
  }
});

// Create a new commercial term
app.post("/commercial-terms", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newCommercialTerm = NewSupplierCommercialTermSchema.parse({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy || null,
      lastUpdatedBy: data.createdBy || null
    });
    
    const inserted = await db.insert(supplierCommercialTerm).values(newCommercialTerm).returning();
    return c.json(inserted[0], 201);
  } catch (error) {
    return handleError(c, error);
  }
});

// Update a commercial term
app.put("/commercial-terms/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    // Update with the validated data
    const updated = await db
      .update(supplierCommercialTerm)
      .set({
        ...data,
        updatedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierCommercialTerm.uid, uid),
        isNull(supplierCommercialTerm.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Commercial term not found" }, 404);
    }
    
    return c.json(updated[0]);
  } catch (error) {
    return handleError(c, error);
  }
});

// Soft delete a commercial term
app.delete("/commercial-terms/:uid", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    const updated = await db
      .update(supplierCommercialTerm)
      .set({
        deletedAt: new Date(),
        lastUpdatedBy: data.lastUpdatedBy || null
      })
      .where(and(
        eq(supplierCommercialTerm.uid, uid),
        isNull(supplierCommercialTerm.deletedAt)
      ))
      .returning();
    
    if (updated.length === 0) {
      return c.json({ error: "Commercial term not found" }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// DOCUMENT ENDPOINTS
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

// Create a new document
app.post("/documents", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newDocument = NewSupplierSiteDocumentSchema.parse({
      ...data,
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
// APPROVAL PROCESS ENDPOINTS
// ===================

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

// Create a new approval process
app.post("/approval-processes", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newProcess = NewApprovalProcessSchema.parse({
      ...data,
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

// Create a new approval step
app.post("/approval-steps", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newStep = NewApprovalStepSchema.parse({
      ...data,
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

// ===================
// APPROVAL REQUEST ENDPOINTS
// ===================

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

// Create a new approval request
app.post("/approval-requests", async (c) => {
  try {
    const data = await c.req.json();
    const validated = ClientApprovalRequestSchema.parse(data);
    
    // Prepare the data for the database
    const newRequest = NewApprovalRequestSchema.parse({
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
        uid: crypto.randomUUID(),
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

// Add a comment to an approval request
app.post("/approval-requests/:uid/comments", async (c) => {
  try {
    const uid = c.req.param("uid");
    const data = await c.req.json();
    
    if (!data.commentText || !data.commentByUserUid || !data.approvalStepUid) {
      return c.json({ error: "Comment text, user ID, and step ID are required" }, 400);
    }
    
    // Create the comment
    const newComment = NewApprovalCommentSchema.parse({
      approvalRequestUid: uid,
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

// Get comments for an approval request
app.get("/approval-requests/:uid/comments", async (c) => {
  try {
    const uid = c.req.param("uid");
    const commentData = await db
      .select()
      .from(approvalComment)
      .where(eq(approvalComment.approvalRequestUid, uid))
      .orderBy(approvalComment.createdAt);
    
    return c.json(commentData);
  } catch (error) {
    return handleError(c, error);
  }
});

// ===================
// ORG UNIT ENDPOINTS
// ===================

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

// Create a new org unit
app.post("/org-units", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newOrgUnit = NewOrgUnitSchema.parse({
      ...data,
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

// ===================
// ROLE ENDPOINTS
// ===================

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

// Create a new role
app.post("/roles", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newRole = NewRoleSchema.parse({
      ...data,
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

// ===================
// STORE ENDPOINTS
// ===================

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

// Create a new store
app.post("/stores", async (c) => {
  try {
    const data = await c.req.json();
    
    // Prepare the data for the database
    const newStore = NewStoreSchema.parse({
      ...data,
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

// ===================
// DATABASE CONNECTION & SERVER STARTUP
// ===================

// Test database connection
async function testDbConnection() {
  try {
    // Test query to verify connection
    await db.select().from(user).limit(1);
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Start the server
const startServer = async () => {
  const isDbConnected = await testDbConnection();
  if (!isDbConnected) {
    process.exit(1);
  }

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Supplier Management System API is running on http://${info.address}:${info.port}`);
    },
  );
};

startServer();