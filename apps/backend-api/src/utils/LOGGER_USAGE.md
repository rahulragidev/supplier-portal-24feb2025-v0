# Pino Logger Usage Guide

This application uses [Pino](https://getpino.io/) for logging combined with [hono-pino](https://github.com/honojs/middleware/tree/main/pino) middleware for Hono integration.

## Basic Usage

Import the logger in your file:

```typescript
import logger from "../utils/logger.js";
```

## Log Levels

The logger supports the following log levels (in order of priority):

- `fatal` - The application/system is going to stop
- `error` - Runtime errors that require attention
- `warn` - Warnings that don't necessarily need action
- `info` - General information about the application (default level)
- `debug` - Detailed information for debugging
- `trace` - Very detailed tracing information

## Examples

### Simple logging:

```typescript
logger.info("This is an info message");
logger.error("This is an error message");
```

### Structured logging with context:

```typescript
logger.info({ userId: "123" }, "User logged in");
logger.error({ error, userId: "123" }, "Failed to update user");
```

### Logging in request handlers:

```typescript
export const getSomething = async (c) => {
  try {
    logger.info({ params: c.req.param() }, "Getting resource");
    
    // Your code here
    
    logger.debug("Resource retrieved successfully");
    return c.json({ data });
  } catch (error) {
    logger.error({ error }, "Failed to get resource");
    return c.json({ error: "Something went wrong" }, 500);
  }
};
```

## Configuration

The logging level can be configured via the `LOG_LEVEL` environment variable. If not set, it defaults to `info`.

Valid values for `LOG_LEVEL` are: `fatal`, `error`, `warn`, `info`, `debug`, `trace`.

Example:
```
LOG_LEVEL=debug
```

In production, logs are output as JSON. In development, logs are formatted with `pino-pretty` for better readability.

## HTTP Request Logging

All HTTP requests are automatically logged by the `hono-pino` middleware, which includes:
- Request method
- Path
- Status code
- Response time
- Request ID (for tracing)

## Best Practices

1. Use appropriate log levels
2. Always add context to logs (user IDs, request IDs, etc.)
3. Log the beginning and end of important operations
4. Include error objects in error logs
5. Don't log sensitive information (passwords, tokens, etc.) 