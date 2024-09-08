import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../../models/schema';
import postgres from 'postgres';
import { type InsertUser } from '../../types';
import jwt from 'jsonwebtoken';
import redis from '../../configs/redis.config';

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, {schema});

const seedDatabase = async () => {
    try {
        console.log('database seeding started');

        const usersDetail : InsertUser[] = Array.from({length : 500}).map(() => ({
            name : faker.person.fullName(), email : faker.internet.email(), 
            role : [faker.helpers.arrayElement(['basic', 'admin'])],
            image : faker.image.avatar()
        }));
        const users = await db.insert(schema.userTable).values(usersDetail).returning();
        const pipeline = redis.pipeline();

        users.forEach(async user => {
            const refreshToken : string = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : '2d'});
            redis.hset(`user:${user.id}`, user), 
            redis.expire(`user:${user.id}`, 604800), 
            redis.hset(`user:${user.email}`, user)
            redis.expire(`user:${user.email}`, 604800);
            pipeline.set(`refresh_token:${user.id}`, refreshToken ?? '');
            pipeline.expire(`refresh_token:${user.id}`, 2 * 24 * 60 * 60 * 1000);
        })
        await pipeline.exec();

        console.log('database seeding ended');
        process.exit(0);
        
    } catch (error) {
        console.log(error.message);
        process.exit(0);
    }
}
await seedDatabase()