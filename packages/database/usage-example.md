# Database Package Usage Examples

This file contains examples of how to use the database package with the new type separation pattern.

## Frontend Usage Examples

### React Component with Types

```tsx
import { useState } from 'react';
import type { Doc } from '@workspace/database';
import { userSchema } from '@workspace/database/zod-schema';

// Use the Doc helper to get the User type
type User = Doc<'users'>;

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const [name, setName] = useState(user.firstName);
  
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Form Validation with Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NewDoc } from '@workspace/database';
import { newUserSchema } from '@workspace/database/zod-schema';

// Use the NewDoc helper to get the type for creating a new user
type NewUser = NewDoc<'users'>;

export function UserCreateForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<NewUser>({
    resolver: zodResolver(newUserSchema)
  });
  
  const onSubmit = async (data: NewUser) => {
    // Send data to API
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First Name" />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      
      <input {...register('lastName')} placeholder="Last Name" />
      {errors.lastName && <p>{errors.lastName.message}</p>}
      
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      <button type="submit">Create User</button>
    </form>
  );
}
```

## Backend Usage Examples

### API Route Handler

```ts
// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db, users } from '@workspace/database/server';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user[0]);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Data Access Layer

```ts
// lib/users.ts
import { db, users, suppliers } from '@workspace/database/server';
import { eq, and } from 'drizzle-orm';
import type { Doc, NewDoc } from '@workspace/database';

export async function getUserById(id: string): Promise<Doc<'users'> | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function createUser(data: NewDoc<'users'>): Promise<Doc<'users'>> {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function getUserSuppliers(userId: string) {
  return db.select()
    .from(suppliers)
    .where(eq(suppliers.ownerId, userId));
}
```

## Benefits of This Approach

1. **Type Safety**: Full type safety across your application
2. **No Runtime Leakage**: Database connection code never appears in client bundles
3. **Single Source of Truth**: Schema is the only place where the database structure is defined
4. **Developer Experience**: Intellisense and autocomplete work perfectly
5. **Clear Boundaries**: Server and client code separation is enforced through imports 