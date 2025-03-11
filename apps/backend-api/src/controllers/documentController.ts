import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../../../packages/database/database.js";
import { supplierSiteDocument, documentVerification, supplierSite, supplier } from "@workspace/database/schema";
import { 
  NewSupplierSiteDocumentSchema,
  NewDocumentVerificationSchema
} from "@workspace/database/zod-schema";
import { eq, and, isNull } from "drizzle-orm";
import { handleError } from "../middleware/errorHandler.js";
import { generateUUID, formatDate } from "../utils/helpers.js";

export const documentController = {
  // --- SUPPLIER SITE DOCUMENTS ---

  // Get documents by supplier site
  async getDocumentsBySite(c: Context) {
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
  },

  // Get document by ID
  async getDocumentById(c: Context) {
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
  },

  // Create a new document
  async createDocument(c: Context) {
    try {
      const data = await c.req.json();
      
      // Check if supplier site exists
      const existingSite = await db
        .select()
        .from(supplierSite)
        .where(and(
          eq(supplierSite.userUid, data.supplierSiteUserUid),
          isNull(supplierSite.deletedAt)
        ));
      
      if (existingSite.length === 0) {
        return c.json({ 
          error: "Supplier site does not exist" 
        }, 400);
      }
      
      // Prepare the data for the database
      const newDocument = NewSupplierSiteDocumentSchema.parse({
        uid: data.uid || generateUUID(),
        supplierSiteUserUid: data.supplierSiteUserUid,
        documentType: data.documentType,
        filePath: data.filePath,
        verificationStatus: data.verificationStatus || "PENDING", // Default status
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(supplierSiteDocument).values(newDocument).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update document verification status
  async updateDocumentStatus(c: Context) {
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
          updatedAt: formatDate(),
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
  },

  // Soft delete a document
  async deleteDocument(c: Context) {
    try {
      const uid = c.req.param("uid");
      
      const updated = await db
        .update(supplierSiteDocument)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: null
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
  },

  // --- DOCUMENT VERIFICATIONS ---

  // Get all document verifications
  async getAllVerifications(c: Context) {
    try {
      const allVerifications = await db
        .select()
        .from(documentVerification)
        .where(isNull(documentVerification.deletedAt));
      
      return c.json(allVerifications);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get verifications by supplier
  async getVerificationsBySupplier(c: Context) {
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
  },

  // Create new document verification
  async createVerification(c: Context) {
    try {
      const data = await c.req.json();
      
      // Check if supplier exists
      const existingSupplier = await db
        .select()
        .from(supplier)
        .where(and(
          eq(supplier.userUid, data.supplierUserUid),
          isNull(supplier.deletedAt)
        ));
      
      if (existingSupplier.length === 0) {
        return c.json({ 
          error: "Supplier does not exist" 
        }, 400);
      }

      // Check if supplier site exists
      const existingSite = await db
        .select()
        .from(supplierSite)
        .where(and(
          eq(supplierSite.userUid, data.supplierSiteUserUid),
          isNull(supplierSite.deletedAt)
        ));
      
      if (existingSite.length === 0) {
        return c.json({ 
          error: "Supplier site does not exist" 
        }, 400);
      }
      
      // Prepare the data for the database
      const newVerification = NewDocumentVerificationSchema.parse({
        uid: data.uid || generateUUID(),
        supplierUserUid: data.supplierUserUid,
        supplierSiteUserUid: data.supplierSiteUserUid,
        documentType: data.documentType,
        status: data.status || "PENDING",
        requestPayload: data.requestPayload || {},
        responsePayload: data.responsePayload || {},
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null
      });
      
      const inserted = await db.insert(documentVerification).values(newVerification).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update verification status
  async updateVerificationStatus(c: Context) {
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
          updatedAt: formatDate(),
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
  }
}; 