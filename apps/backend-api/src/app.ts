import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orgUnitRoutes from "./routes/orgUnitRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import termRoutes from "./routes/termRoutes.js";

const app = new Hono();

// Add middleware
app.use("*", logger());
app.use("*", timing());
app.use("*", prettyJSON());

// Add CORS middleware
app.use(
  "/*",
  cors({
    origin: "*", // For development, allow all origins
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
  }),
);

// Root route
app.get("/", (c) => {
  return c.text("Supplier Management System API");
});

// Register routes
app.route("/users", userRoutes);
app.route("/organizations", organizationRoutes);
app.route("/employees", employeeRoutes);
app.route("/suppliers", supplierRoutes);
app.route("/addresses", addressRoutes);
app.route("/org-units", orgUnitRoutes);
app.route("/roles", roleRoutes);
app.route("/stores", storeRoutes);
app.route("/approval-processes", approvalRoutes);
app.route("/documents", documentRoutes);
app.route("/supplier-terms", termRoutes);

export default app;