import { Hono } from "hono";
import { z } from "zod";
import { documentController } from "../controllers/documentController.js";

// Create a router for document endpoints
const documentRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- DOCUMENTS ---

// Get document by ID
documentRoutes.get("/:uid", documentController.getDocumentById);

// Create a new document
documentRoutes.post("/", documentController.createDocument);

// Update document verification status
documentRoutes.put("/:uid/status", documentController.updateDocumentStatus);

// Soft delete a document
documentRoutes.delete("/:uid", documentController.deleteDocument);

// Get documents by supplier site
documentRoutes.get("/site/:siteUid", documentController.getDocumentsBySite);

// --- DOCUMENT VERIFICATIONS ---

// Get all document verifications
documentRoutes.get("/verifications", documentController.getAllVerifications);

// Get verifications by supplier
documentRoutes.get(
  "/verifications/supplier/:supplierUid",
  documentController.getVerificationsBySupplier
);

// Create new document verification
documentRoutes.post("/verifications", documentController.createVerification);

// Update verification status
documentRoutes.put("/verifications/:uid/status", documentController.updateVerificationStatus);

export default documentRoutes;
