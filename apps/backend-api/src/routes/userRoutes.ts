import { ClientAppUserSchema } from "@workspace/database/zod-schema";
import { Hono } from "hono";
import { z } from "zod";
import { userController } from "../controllers/userController.js";
import { requirePermission } from "../middleware/permissions.js";
import { validateBody } from "../middleware/validation.js";

// Create a router for user endpoints
const userRoutes = new Hono();

// Define schema for URL parameter validation
const _UidParamSchema = z.object({
  uid: z.string().uuid(),
});

// Get all users - requires the users:list permission
userRoutes.get("/", requirePermission("users:list"), userController.getAllUsers);

// Get user by ID - requires the users:get-by-id permission
userRoutes.get("/:uid", requirePermission("users:get-by-id"), userController.getUserById);

// Create a new user - requires the users:create permission
userRoutes.post(
  "/",
  requirePermission("users:create"),
  validateBody(ClientAppUserSchema),
  userController.createUser
);

// Update a user - requires the users:update permission
userRoutes.put(
  "/:uid",
  requirePermission("users:update"),
  validateBody(ClientAppUserSchema.partial()),
  userController.updateUser
);

// Soft delete a user - requires the users:delete permission
userRoutes.delete("/:uid", requirePermission("users:delete"), userController.deleteUser);

export default userRoutes;
