// utils/logger.ts
import { pinoLogger as pinoMiddleware } from "hono-pino";
import pinoModule from "pino";
import prettyModule from "pino-pretty";

// TypeScript workaround for Pino v9
const pino = pinoModule as unknown as (options?: any, destination?: any) => any;
// Different workaround for pretty - no params needed
const pretty = prettyModule as unknown as () => any;

export function pinoLogger() {
  return pinoMiddleware({
    pino: pino(
      {
        level: process.env.LOG_LEVEL || "info",
        base: {
          env: process.env.NODE_ENV || "development",
        },
      },
      process.env.NODE_ENV === "production" ? undefined : pretty()
    ),
  });
}

// Main logger instance for use throughout the application
const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: {
      env: process.env.NODE_ENV || "development",
    },
  },
  process.env.NODE_ENV === "production" ? undefined : pretty()
);

export default logger;
