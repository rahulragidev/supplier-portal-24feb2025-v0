import {
  ClientFinancialTermSchema,
  ClientSupplierSiteTermSchema,
  ClientSupportTermSchema,
  ClientTradeTermSchema,
} from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { termController } from "../controllers/termController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for supplier term endpoints
const termRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// --- SUPPLIER TERMS ---

// Get all supplier terms - requires the terms:list permission
termRoutes.get("/", requirePermission("terms:list"), termController.getAllTerms);

// Get term by ID - requires the terms:get-by-id permission
termRoutes.get("/:uid", requirePermission("terms:get-by-id"), termController.getTermById);

// Create a new supplier term - requires the terms:create permission
termRoutes.post(
  "/",
  requirePermission("terms:create"),
  validateBody(ClientSupplierSiteTermSchema),
  termController.createTerm
);

// Update a supplier term - requires the terms:update permission
termRoutes.put(
  "/:uid",
  requirePermission("terms:update"),
  validateBody(ClientSupplierSiteTermSchema.partial()),
  termController.updateTerm
);

// Soft delete a supplier term - requires the terms:delete permission
termRoutes.delete("/:uid", requirePermission("terms:delete"), termController.deleteTerm);

// Get terms by supplier site - requires the terms:get-by-site permission
termRoutes.get(
  "/site/:siteUid",
  requirePermission("terms:get-by-site"),
  termController.getTermsBySite
);

// --- FINANCIAL TERMS ---

// Get financial term by term ID - requires the financial-terms:get-by-term permission
termRoutes.get(
  "/:termUid/financial",
  requirePermission("financial-terms:get-by-term"),
  termController.getFinancialTerm
);

// Create a new financial term - requires the financial-terms:create permission
termRoutes.post(
  "/financial",
  requirePermission("financial-terms:create"),
  validateBody(ClientFinancialTermSchema),
  termController.createFinancialTerm
);

// Update a financial term - requires the financial-terms:update permission
termRoutes.put(
  "/financial/:termUid",
  requirePermission("financial-terms:update"),
  validateBody(ClientFinancialTermSchema.partial()),
  termController.updateFinancialTerm
);

// --- TRADE TERMS ---

// Get trade term by term ID - requires the trade-terms:get-by-term permission
termRoutes.get(
  "/:termUid/trade",
  requirePermission("trade-terms:get-by-term"),
  termController.getTradeTerm
);

// Create a new trade term - requires the trade-terms:create permission
termRoutes.post(
  "/trade",
  requirePermission("trade-terms:create"),
  validateBody(ClientTradeTermSchema),
  termController.createTradeTerm
);

// Update a trade term - requires the trade-terms:update permission
termRoutes.put(
  "/trade/:termUid",
  requirePermission("trade-terms:update"),
  validateBody(ClientTradeTermSchema.partial()),
  termController.updateTradeTerm
);

// --- SUPPORT TERMS ---

// Get support term by term ID - requires the support-terms:get-by-term permission
termRoutes.get(
  "/:termUid/support",
  requirePermission("support-terms:get-by-term"),
  termController.getSupportTerm
);

// Create a new support term - requires the support-terms:create permission
termRoutes.post(
  "/support",
  requirePermission("support-terms:create"),
  validateBody(ClientSupportTermSchema),
  termController.createSupportTerm
);

// Update a support term - requires the support-terms:update permission
termRoutes.put(
  "/support/:termUid",
  requirePermission("support-terms:update"),
  validateBody(ClientSupportTermSchema.partial()),
  termController.updateSupportTerm
);

// --- TERM NOTES ---

// Get notes by term - requires the term-notes:get-by-term permission
termRoutes.get(
  "/:termUid/notes",
  requirePermission("term-notes:get-by-term"),
  termController.getNotesByTerm
);

// Create a new term note - requires the term-notes:create permission
termRoutes.post("/notes", requirePermission("term-notes:create"), termController.createNote);

// Delete a term note - requires the term-notes:delete permission
termRoutes.delete("/notes/:uid", requirePermission("term-notes:delete"), termController.deleteNote);

export default termRoutes;
