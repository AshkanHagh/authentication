import { EventEmitter } from 'node:events';
import { initialPermissions } from '../types';
import { hmget, hmset } from '../database/cache';

export const dashboardEvent = new EventEmitter();

dashboardEvent.on('insert_initial_roles', async () => {
    const checkInitialRole = await hmget('role_permissions', ['admin', 'basic'], 30 * 24 * 60 * 60 * 1000);
    if(!checkInitialRole.includes('admin') || !checkInitialRole.includes('basic')) {
        await Promise.all([hmset('role_permissions', 'basic', [], 30 * 24 * 60 * 60 * 1000),
            hmset('role_permissions', 'admin', initialPermissions, 30 * 24 * 60 * 60 * 1000),
        ]);
    }
});