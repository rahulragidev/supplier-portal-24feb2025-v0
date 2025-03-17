import { ClientAddressSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { addressController } from "../controllers/addressController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for address endpoints
const addressRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all addresses - requires the addresses:list permission
addressRoutes.get("/", requirePermission("addresses:list"), addressController.getAllAddresses);

// Get address by ID - requires the addresses:get-by-id permission
addressRoutes.get(
  "/:uid",
  requirePermission("addresses:get-by-id"),
  addressController.getAddressById
);

// Create a new address - requires the addresses:create permission
addressRoutes.post(
  "/",
  requirePermission("addresses:create"),
  validateBody(ClientAddressSchema),
  addressController.createAddress
);

// Update an address - requires the addresses:update permission
addressRoutes.put(
  "/:uid",
  requirePermission("addresses:update"),
  validateBody(ClientAddressSchema.partial()),
  addressController.updateAddress
);

// Soft delete an address - requires the addresses:delete permission
addressRoutes.delete(
  "/:uid",
  requirePermission("addresses:delete"),
  addressController.deleteAddress
);

export default addressRoutes;
