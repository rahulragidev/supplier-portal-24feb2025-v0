import { ClientAddressSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { addressController } from "../controllers/addressController.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for address endpoints
const addressRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all addresses
addressRoutes.get("/", addressController.getAllAddresses);

// Get address by ID
addressRoutes.get("/:uid", addressController.getAddressById);

// Create a new address
addressRoutes.post("/", validateBody(ClientAddressSchema), addressController.createAddress);

// Update an address
addressRoutes.put(
  "/:uid",
  validateBody(ClientAddressSchema.partial()),
  addressController.updateAddress
);

// Soft delete an address
addressRoutes.delete("/:uid", addressController.deleteAddress);

export default addressRoutes;
