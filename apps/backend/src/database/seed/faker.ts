import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../../models/schema';
import postgres from 'postgres';
import { initialPermissions, type InsertUser } from '../../types';
import type ErrorHandler from '../../utils/errorHandler';
import jwt from 'jsonwebtoken';
import { hmget, hmset, hset, sset } from '../cache';

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, {schema});

const seedDatabase = async () => {
    try {
        console.log('database seeding started');
        const usersDetail : InsertUser[] = Array.from({length : 300}).map(() => ({
            name : faker.person.fullName(), email : `${faker.person.fullName()}${faker.number.int()}${faker.internet.email()}`, 
            role : [faker.helpers.arrayElement(['basic', 'admin'])],
            image : faker.image.avatar()
        }));
        const users = await db.insert(schema.userTable).values(usersDetail).returning();
        await Promise.all(users.map(async user => {
            const refreshToken : string = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : '2d'});

            const checkInitialRole = await hmget('role_permissions', ['admin', 'basic'], 30 * 24 * 60 * 60 * 1000);
            if(!checkInitialRole.includes('admin') || !checkInitialRole.includes('basic')) {
                await Promise.all([hmset('role_permissions', 'basic', [], 30 * 24 * 60 * 60 * 1000),
                    hmset('role_permissions', 'admin', initialPermissions, 30 * 24 * 60 * 60 * 1000),
                ]);
            }

            await Promise.all([hset(`user:${user.id}`, user, 604800), hset(`user:${user.email}`, user, 604800)]);
            await sset(`refresh_token:${user.id}`, refreshToken ?? '', 2 * 24 * 60 * 60 * 1000);
        }))
        console.log('database seeding ended');
        process.exit(0);
        
    } catch (err) {
        const error = err as ErrorHandler
        console.log(error.message, error.statusCode);
        process.exit(0);
    }
}
await seedDatabase()