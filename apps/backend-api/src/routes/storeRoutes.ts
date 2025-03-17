import { Hono } from "hono";
import { z } from "zod";
import { storeController } from "../controllers/storeController.js";
import { requirePermission } from "../middleware/permissions.js";

// Create a router for store endpoints
const storeRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all stores - requires the stores:list permission
storeRoutes.get("/", requirePermission("stores:list"), storeController.getAllStores);

// Get store by ID - requires the stores:get-by-id permission
storeRoutes.get("/:uid", requirePermission("stores:get-by-id"), storeController.getStoreById);

// Create a new store - requires the stores:create permission
storeRoutes.post("/", requirePermission("stores:create"), storeController.createStore);

// Update a store - requires the stores:update permission
storeRoutes.put("/:uid", requirePermission("stores:update"), storeController.updateStore);

// Soft delete a store - requires the stores:delete permission
storeRoutes.delete("/:uid", requirePermission("stores:delete"), storeController.deleteStore);

// Get stores by organization - requires the stores:get-by-organization permission
storeRoutes.get(
  "/organization/:orgUid",
  requirePermission("stores:get-by-organization"),
  storeController.getStoresByOrganization
);

export default storeRoutes;
