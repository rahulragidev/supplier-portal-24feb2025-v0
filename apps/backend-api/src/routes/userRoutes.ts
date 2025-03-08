import { Hono } from "hono";
import { userController } from "../controllers/userController.js";
import { validateBody } from "../middleware/validation.js";
import { ClientAppUserSchema } from "@workspace/database/zod-schema";
import { z } from "zod";

// Create a router for user endpoints
const userRoutes = new Hono();

// Define schema for URL parameter validation
const UidParamSchema = z.object({
  uid: z.string().uuid()
});

// Get all users
userRoutes.get("/", userController.getAllUsers);

// Get user by ID 
userRoutes.get("/:uid", userController.getUserById);

// Create a new user
userRoutes.post("/", validateBody(ClientAppUserSchema), userController.createUser);

// Update a user
userRoutes.put("/:uid", validateBody(ClientAppUserSchema.partial()), userController.updateUser);

// Soft delete a user
userRoutes.delete("/:uid", userController.deleteUser);

export default userRoutes; 