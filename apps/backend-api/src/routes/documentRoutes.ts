import { Hono } from "hono";
import { z } from "zod";
import { documentController } from "../controllers/documentController.js";
import { requirePermission } from "../middleware/permissions.js";

// Create a router for document endpoints
const documentRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- DOCUMENTS ---

// Get document by ID - requires the documents:get-by-id permission
documentRoutes.get(
  "/:uid",
  requirePermission("documents:get-by-id"),
  documentController.getDocumentById
);

// Create a new document - requires the documents:create permission
documentRoutes.post("/", requirePermission("documents:create"), documentController.createDocument);

// Update document verification status - requires the documents:update-status permission
documentRoutes.put(
  "/:uid/status",
  requirePermission("documents:update-status"),
  documentController.updateDocumentStatus
);

// Soft delete a document - requires the documents:delete permission
documentRoutes.delete(
  "/:uid",
  requirePermission("documents:delete"),
  documentController.deleteDocument
);

// Get documents by supplier site - requires the documents:get-by-site permission
documentRoutes.get(
  "/site/:siteUid",
  requirePermission("documents:get-by-site"),
  documentController.getDocumentsBySite
);

// --- DOCUMENT VERIFICATIONS ---

// Get all document verifications - requires the document-verifications:list permission
documentRoutes.get(
  "/verifications",
  requirePermission("document-verifications:list"),
  documentController.getAllVerifications
);

// Get verifications by supplier - requires the document-verifications:get-by-supplier permission
documentRoutes.get(
  "/verifications/supplier/:supplierUid",
  requirePermission("document-verifications:get-by-supplier"),
  documentController.getVerificationsBySupplier
);

// Create new document verification - requires the document-verifications:create permission
documentRoutes.post(
  "/verifications",
  requirePermission("document-verifications:create"),
  documentController.createVerification
);

// Update verification status - requires the document-verifications:update-status permission
documentRoutes.put(
  "/verifications/:uid/status",
  requirePermission("document-verifications:update-status"),
  documentController.updateVerificationStatus
);

export default documentRoutes;
