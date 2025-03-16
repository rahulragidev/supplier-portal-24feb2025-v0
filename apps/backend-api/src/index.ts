import { serve } from "@hono/node-server";
import app from "./app.js";
// Import our logger
import logger from "./utils/logger.js";

// Update port configuration
const port = Number(process.env.PORT) || 3030;
const hostname = "localhost";

// Use this server config instead
const server = serve(
  {
    fetch: app.fetch,
    port,
    hostname,
  },
  (info) => {
    logger.info(`Server running at http://${hostname}:${info.port}`);
  }
);

// Handle server errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    logger.error(`Port ${port} is already in use`);
    process.exit(1);
  }
  logger.error({ err }, "Server error");
});
