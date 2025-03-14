import { type Context, type Next } from "hono";
import * as jose from 'jose';  // You'll need to install this package

interface JWTPayload {
  userId: string;
  // Add other JWT claims as needed
}

export const authenticateToken = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid authorization header' }, 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Replace these with your actual JWT secret and configuration
    const secret = new TextEncoder().encode("5be6d556d83dd53176452f90aeb00ab03e550283748e57f52818386c87285231");
    const { payload } = await jose.jwtVerify(token as string, secret);
    
    // Validate and type-cast the payload
    const jwtPayload = payload as unknown as JWTPayload;
    if (!jwtPayload.userId) {
      return c.json({ error: 'Invalid token payload' }, 401);
    }

    // Add the userId to the context for use in route handlers
    c.set('userId', jwtPayload.userId);
    
    await next()
  } catch (error: unknown) {
    if (error instanceof jose.errors.JOSEError) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
    throw error;
  }
}