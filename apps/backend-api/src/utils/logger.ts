// Using require for pino to fix the import issue with v9
import pinoModule from "pino";
const pino = pinoModule as unknown as (options?: pinoModule.LoggerOptions) => pinoModule.Logger;

// Configure Pino logger
const logger = pino({
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
  level: process.env.LOG_LEVEL || "info",
  // Add additional base fields
  base: {
    env: process.env.NODE_ENV || "development",
  },
});

export default logger;
