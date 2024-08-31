import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/schema';
import { createClient, type Client } from '@libsql/client';

const client : Client = createClient({
    url : process.env.TURSO_DATABASE_URL,
    authToken : process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, {schema});