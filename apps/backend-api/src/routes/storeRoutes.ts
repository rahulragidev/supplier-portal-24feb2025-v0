import { Hono } from "hono";
import { z } from "zod";
import { storeController } from "../controllers/storeController.js";

// Create a router for store endpoints
const storeRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all stores
storeRoutes.get("/", storeController.getAllStores);

// Get store by ID
storeRoutes.get("/:uid", storeController.getStoreById);

// Create a new store
storeRoutes.post("/", storeController.createStore);

// Update a store
storeRoutes.put("/:uid", storeController.updateStore);

// Soft delete a store
storeRoutes.delete("/:uid", storeController.deleteStore);

// Get stores by organization
storeRoutes.get("/organization/:orgUid", storeController.getStoresByOrganization);

export default storeRoutes;
