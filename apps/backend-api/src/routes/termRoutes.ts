import { Hono } from "hono";
import { termController } from "../controllers/termController.js";
import { validateBody } from "../middleware/validation.js";
import { 
  ClientSupplierSiteTermSchema, 
  ClientFinancialTermSchema,
  ClientTradeTermSchema,
  ClientSupportTermSchema
} from "@workspace/database/zod-schema";
import { z } from "zod";

// Create a router for supplier term endpoints
const termRoutes = new Hono();

// Define schema for URL parameter validation
const UidParamSchema = z.object({
  uid: z.string().uuid()
});

// --- SUPPLIER TERMS ---

// Get all supplier terms
termRoutes.get("/", termController.getAllTerms);

// Get term by ID 
termRoutes.get("/:uid", termController.getTermById);

// Create a new supplier term
termRoutes.post("/", validateBody(ClientSupplierSiteTermSchema), termController.createTerm);

// Update a supplier term
termRoutes.put("/:uid", validateBody(ClientSupplierSiteTermSchema.partial()), termController.updateTerm);

// Soft delete a supplier term
termRoutes.delete("/:uid", termController.deleteTerm);

// Get terms by supplier site
termRoutes.get("/site/:siteUid", termController.getTermsBySite);

// --- FINANCIAL TERMS ---

// Get financial term by term ID
termRoutes.get("/:termUid/financial", termController.getFinancialTerm);

// Create a new financial term
termRoutes.post("/financial", validateBody(ClientFinancialTermSchema), termController.createFinancialTerm);

// Update a financial term
termRoutes.put("/financial/:termUid", validateBody(ClientFinancialTermSchema.partial()), termController.updateFinancialTerm);

// --- TRADE TERMS ---

// Get trade term by term ID
termRoutes.get("/:termUid/trade", termController.getTradeTerm);

// Create a new trade term
termRoutes.post("/trade", validateBody(ClientTradeTermSchema), termController.createTradeTerm);

// Update a trade term
termRoutes.put("/trade/:termUid", validateBody(ClientTradeTermSchema.partial()), termController.updateTradeTerm);

// --- SUPPORT TERMS ---

// Get support term by term ID
termRoutes.get("/:termUid/support", termController.getSupportTerm);

// Create a new support term
termRoutes.post("/support", validateBody(ClientSupportTermSchema), termController.createSupportTerm);

// Update a support term
termRoutes.put("/support/:termUid", validateBody(ClientSupportTermSchema.partial()), termController.updateSupportTerm);

// --- TERM NOTES ---

// Get notes by term
termRoutes.get("/:termUid/notes", termController.getNotesByTerm);

// Create a new term note
termRoutes.post("/notes", termController.createNote);

// Delete a term note
termRoutes.delete("/notes/:uid", termController.deleteNote);

export default termRoutes; 