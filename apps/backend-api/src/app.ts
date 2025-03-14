import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";
import { apiReference } from '@scalar/hono-api-reference';

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

// Import OpenAPI setup
import { setupOpenAPI } from "./openapi/index.js";
import { authenticateToken } from "./middleware/auth.js";

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
  })
);

// Public routes (no authentication required)
app.use("/", (c, next) => next());
app.use("/api", (c, next) => next());
app.use("/api-doc", (c, next) => next());
app.use("/reference", (c, next) => next());

// Protected routes (require authentication)
app.use("/users/*", authenticateToken);
app.use("/organizations/*", authenticateToken);
app.use("/employees/*", authenticateToken);
app.use("/suppliers/*", authenticateToken);
app.use("/addresses/*", authenticateToken);
app.use("/org-units/*", authenticateToken);
app.use("/roles/*", authenticateToken);
app.use("/stores/*", authenticateToken);
app.use("/approval-processes/*", authenticateToken);
app.use("/documents/*", authenticateToken);
app.use("/supplier-terms/*", authenticateToken);

// Add Scalar API Reference
app.get(
  '/reference',
  apiReference({
    url: '/api-doc',
  })
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

// Setup OpenAPI documentation and UI
setupOpenAPI(app);

// Add a direct link to the Swagger UI
app.get("/api", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Supplier Management System API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #0066cc;
          }
          a {
            color: #0066cc;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .card {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <h1>Supplier Management System API</h1>
        <div class="card">
          <h2>API Documentation</h2>
          <p>Interactive API documentation:</p>
          <p><a href="/reference" target="_blank">Open API Reference</a></p>
        </div>
        <div class="card">
          <h2>OpenAPI Specification</h2>
          <p>Raw OpenAPI specification in JSON format:</p>
          <p><a href="/api-doc" target="_blank">View OpenAPI Spec</a></p>
        </div>
      </body>
    </html>
  `);
});

export default app;