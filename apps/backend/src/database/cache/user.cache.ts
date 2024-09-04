import redis from '../../configs/redis.config';

export const findRolePermission = async (roles : string[]) : Promise<string[]> => {
    const permissions : (string | null)[] = await redis.hmget('role_permissions', ...roles);
    const uniquePermissions : Set<string[]> = new Set<string[]>();

    permissions.forEach(permission => {
        if(permission) {
            const parsedPermission : string = JSON.parse(permission);
            if(Array.isArray(parsedPermission)) {
                parsedPermission.forEach(permission => uniquePermissions.add(permission));
            }
        }
    });
    return Array.from(uniquePermissions).flat();
}