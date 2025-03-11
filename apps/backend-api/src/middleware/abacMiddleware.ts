/**
 * ABAC Middleware for Hono
 * 
 * This middleware enforces Attribute-Based Access Control (ABAC) for API routes.
 */

import type { Context, Next } from "hono";
import { 
  abacService, 
  getSubjectAttributes,
  getResourceAttributes,
  createContextAttributes
} from "@workspace/database/abac";
import type { 
  ActionType, 
  ResourceType, 
  SubjectAttributes
} from "@workspace/database/abac";
import { db } from "@workspace/database/database";
import { appUser, employee } from "@workspace/database/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * ABAC middleware configuration options
 */
export interface AbacOptions {
  resourceType: ResourceType;
  action: ActionType;
  getResource?: (c: Context) => Promise<any | null> | any | null;
  getSubject?: (c: Context) => Promise<SubjectAttributes | null> | SubjectAttributes | null;
  getContext?: (c: Context) => any;
  onDeny?: (c: Context, result: any) => Response;
}

/**
 * Get the current user from the context
 * This would typically use Clerk or another auth provider
 */
async function getCurrentUser(c: Context) {
  // In a real application, this would use the auth info from Clerk or another provider
  // For now, we'll extract the user ID from the Authorization header (if present)
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const userId = authHeader.split(' ')[1];
  if (!userId) {
    return null;
  }

  // Fetch the user from the database
  const user = await db.query.appUser.findFirst({
    where: and(
      eq(appUser.uid, userId),
      isNull(appUser.deletedAt)
    )
  });

  return user;
}

/**
 * Middleware that enforces ABAC permissions
 * @param options ABAC middleware options
 * @returns Hono middleware function
 */
export function abac(options: AbacOptions) {
  return async (c: Context, next: Next) => {
    // Get the current user
    const user = options.getSubject 
      ? await Promise.resolve(options.getSubject(c))
      : await getCurrentUser(c);

    // If user authentication is not available, deny access
    if (!user) {
      return c.json(
        { error: 'Authentication required' },
        401
      );
    }

    // Get the subject attributes (if not already provided)
    const subject = typeof user === 'object' && 'uid' in user && 'roles' in user
      ? user as SubjectAttributes
      : await getSubjectAttributes(user);

    // Get the resource (if applicable)
    const resource = options.getResource
      ? await Promise.resolve(options.getResource(c))
      : null;

    // Convert the resource to resource attributes (if provided)
    const resourceAttributes = resource ? getResourceAttributes(resource) : undefined;

    // Get the context attributes
    const context = options.getContext
      ? options.getContext(c)
      : createContextAttributes({
          requestIp: c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP'),
          clientType: c.req.header('User-Agent'),
        });

    // Check permission
    const result = abacService.checkPermission(
      subject,
      options.action,
      options.resourceType,
      resourceAttributes,
      context
    );

    // If permission is granted, continue
    if (result.granted) {
      // Store the subject and permission result in the context
      c.set('subject', subject);
      c.set('abacResult', result);
      await next();
      return;
    }

    // If permission is denied, handle the denial
    if (options.onDeny) {
      return options.onDeny(c, result);
    }

    // Default denial response
    return c.json(
      { 
        error: 'Access denied',
        reason: result.reason,
        resource: result.resource,
        action: result.action
      },
      403
    );
  };
}

/**
 * Helper function to create middleware that requires resources to exist
 */
export function requireResource<T>(
  resourceType: ResourceType, 
  getResourceFn: (c: Context) => Promise<T | null> | T | null
) {
  return async (c: Context, next: Next) => {
    const resource = await Promise.resolve(getResourceFn(c));
    
    if (!resource) {
      return c.json(
        { error: `${resourceType} not found` },
        404
      );
    }
    
    // Store the resource in the context for later use
    c.set('resource', resource);
    await next();
  };
} 