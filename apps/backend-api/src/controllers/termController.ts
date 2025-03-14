import {
  appUser,
  supplierFinancialTerm,
  supplierSite,
  supplierSiteTerm,
  supplierSupportTerm,
  supplierTermNote,
  supplierTradeTerm,
} from "@workspace/database/schema";
import {
  ClientFinancialTermSchema,
  ClientSupplierSiteTermSchema,
  ClientSupportTermSchema,
  ClientTradeTermSchema,
  NewSupplierFinancialTermSchema,
  NewSupplierSiteTermSchema,
  NewSupplierSupportTermSchema,
  NewSupplierTermNoteSchema,
  NewSupplierTradeTermSchema,
} from "@workspace/database/zod-schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../../../../packages/database/database.js";
import { handleError } from "../middleware/errorHandler.js";
import { formatDate, generateUUID } from "../utils/helpers.js";

export const termController = {
  // --- SUPPLIER SITE TERMS ---

  // Get all supplier terms
  async getAllTerms(c: Context) {
    try {
      const allTerms = await db
        .select()
        .from(supplierSiteTerm)
        .where(isNull(supplierSiteTerm.deletedAt));

      return c.json(allTerms);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get terms by supplier site
  async getTermsBySite(c: Context) {
    try {
      const siteUid = c.req.param("siteUid");
      const termData = await db
        .select()
        .from(supplierSiteTerm)
        .where(
          and(eq(supplierSiteTerm.supplierSiteUserUid, siteUid), isNull(supplierSiteTerm.deletedAt))
        );

      return c.json(termData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Get term by ID
  async getTermById(c: Context) {
    try {
      const uid = c.req.param("uid");
      const termData = await db
        .select()
        .from(supplierSiteTerm)
        .where(and(eq(supplierSiteTerm.uid, uid), isNull(supplierSiteTerm.deletedAt)));

      if (termData.length === 0) {
        return c.json({ error: "Term not found" }, 404);
      }

      return c.json(termData[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new supplier term
  async createTerm(c: Context) {
    try {
      const data = await c.req.json();
      const validated = ClientSupplierSiteTermSchema.parse(data);

      // Check if supplier site exists
      const existingSite = await db
        .select()
        .from(supplierSite)
        .where(
          and(
            eq(supplierSite.userUid, validated.supplierSiteUserUid),
            isNull(supplierSite.deletedAt)
          )
        );

      if (existingSite.length === 0) {
        return c.json(
          {
            error: "Supplier site does not exist",
          },
          400
        );
      }

      // Prepare the data for the database
      const newTerm = NewSupplierSiteTermSchema.parse({
        uid: data.uid || generateUUID(),
        ...validated,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        createdBy: data.createdBy || null,
        lastUpdatedBy: data.createdBy || null,
      });

      const inserted = await db.insert(supplierSiteTerm).values(newTerm).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a supplier term
  async updateTerm(c: Context) {
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
          updatedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(supplierSiteTerm.uid, uid), isNull(supplierSiteTerm.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Term not found" }, 404);
      }

      return c.json(updated[0]);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a supplier term
  async deleteTerm(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      const updated = await db
        .update(supplierSiteTerm)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(supplierSiteTerm.uid, uid), isNull(supplierSiteTerm.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Term not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },

  // --- FINANCIAL TERMS ---

  // Get financial term by term ID
  async getFinancialTerm(c: Context) {
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
  },

  // Create a new financial term
  async createFinancialTerm(c: Context) {
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
        vendorListingFeesChecked: validated.vendorListingFeesChecked,
      });

      const inserted = await db.insert(supplierFinancialTerm).values(newFinancialTerm).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a financial term
  async updateFinancialTerm(c: Context) {
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
          vendorListingFeesChecked: validated.vendorListingFeesChecked,
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
  },

  // --- TRADE TERMS ---

  // Get trade term by term ID
  async getTradeTerm(c: Context) {
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
  },

  // Create a new trade term
  async createTradeTerm(c: Context) {
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
        shrinkSharingPercent: validated.shrinkSharingPercent,
      });

      const inserted = await db.insert(supplierTradeTerm).values(newTradeTerm).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a trade term
  async updateTradeTerm(c: Context) {
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
          shrinkSharingPercent: validated.shrinkSharingPercent?.toString(),
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
  },

  // --- SUPPORT TERMS ---

  // Get support term by term ID
  async getSupportTerm(c: Context) {
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
  },

  // Create a new support term
  async createSupportTerm(c: Context) {
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
        storeAnniversarySupportMethod: validated.storeAnniversarySupportMethod,
      });

      const inserted = await db.insert(supplierSupportTerm).values(newSupportTerm).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Update a support term
  async updateSupportTerm(c: Context) {
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
          storeAnniversarySupportMethod: validated.storeAnniversarySupportMethod,
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
  },

  // --- TERM NOTES ---

  // Get notes by term
  async getNotesByTerm(c: Context) {
    try {
      const termUid = c.req.param("termUid");
      const noteData = await db
        .select()
        .from(supplierTermNote)
        .where(and(eq(supplierTermNote.termUid, termUid), isNull(supplierTermNote.deletedAt)))
        .orderBy(supplierTermNote.createdAt);

      return c.json(noteData);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Create a new term note
  async createNote(c: Context) {
    try {
      const data = await c.req.json();

      // Check if term exists
      const existingTerm = await db
        .select()
        .from(supplierSiteTerm)
        .where(and(eq(supplierSiteTerm.uid, data.termUid), isNull(supplierSiteTerm.deletedAt)));

      if (existingTerm.length === 0) {
        return c.json(
          {
            error: "Term does not exist",
          },
          400
        );
      }

      // Check if user exists
      const existingUser = await db.select().from(appUser).where(eq(appUser.uid, data.createdBy));

      if (existingUser.length === 0) {
        return c.json(
          {
            error: "User does not exist",
          },
          400
        );
      }

      // Prepare the data for the database
      const newNote = NewSupplierTermNoteSchema.parse({
        uid: data.uid || generateUUID(),
        termUid: data.termUid,
        noteText: data.noteText,
        createdBy: data.createdBy,
        createdAt: formatDate(),
        updatedAt: formatDate(),
        lastUpdatedBy: data.createdBy,
      });

      const inserted = await db.insert(supplierTermNote).values(newNote).returning();
      return c.json(inserted[0], 201);
    } catch (error) {
      return handleError(c, error);
    }
  },

  // Soft delete a term note
  async deleteNote(c: Context) {
    try {
      const uid = c.req.param("uid");
      const data = await c.req.json();

      const updated = await db
        .update(supplierTermNote)
        .set({
          deletedAt: formatDate(),
          lastUpdatedBy: data.lastUpdatedBy || null,
        })
        .where(and(eq(supplierTermNote.uid, uid), isNull(supplierTermNote.deletedAt)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Note not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      return handleError(c, error);
    }
  },
};
