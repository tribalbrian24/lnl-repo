import Redis from 'ioredis';

export const getRedisClient = () => {
  if (globalThis.redis) {
    return globalThis.redis;
  }
  const connParsed = new URL(process.env.REDIS_URL ?? 'redis://localhost:6379')
  const redisObj = {
      host: connParsed.host?.split(':')[0] ?? 'localhost',
      port: Number(connParsed.port ?? 6379),
      username: connParsed.username ?? undefined,
      password: connParsed.password ?? undefined,
  }

  return new Redis({
    ...redisObj,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });
};

// Singleton — reuse across hot reloads in dev
declare global {
  var redis: Redis | undefined;
}

if (!globalThis.redis) {
  globalThis.redis = getRedisClient();
}

export default globalThis.redis;
