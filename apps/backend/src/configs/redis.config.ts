import Redis from 'ioredis';

const redis : Redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest : 3,
    reconnectOnError : (err) => {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
        if (targetErrors.some(e => err.message.includes(e))) return true;
        return false;
    },
    enableAutoPipelining : true,
    connectTimeout : 5000,
    lazyConnect : false,
});

export default redis;
