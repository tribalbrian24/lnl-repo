import { cookies } from 'next/headers';
import { getRedisClient } from './redis';

/**
 * Redis client instance is managed in ./redis.ts to avoid Edge runtime issues.
 */

export type UserRole = 'admin' | 'user' | 'viewer' | 'guest';

interface SessionData {
  role: UserRole;
  stageAccessList: string[];
}

/**
 * Retrieves the user role from the Redis session.
 * It reads the 'session_id' from the browser cookies and fetches the corresponding
 * data from Redis.
 */
export async function getUserRole(): Promise<UserRole> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    return 'guest'; // Default fallback
  }

  try {
    const redisClient = getRedisClient();
    const data = await redisClient.get(`session:${sessionId}`);
    if (!data) {
      const sessionData: SessionData = { role: 'guest', stageAccessList: [] };
      await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        'EX',
        60 * 60 * 24 * 7
      );
      return sessionData.role;
    }

    const session: SessionData = JSON.parse(data);
    return session.role;
  } catch (error) {
    console.error('Error fetching session from Redis:', error);
    return 'guest';
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const redisClient = getRedisClient();
    const data = await redisClient.get(`session:${sessionId}`);
    if (!data) {
      const sessionData: SessionData = { role: 'guest', stageAccessList: [] };
      await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        'EX',
        60 * 60 * 24 * 7
      );
      return sessionData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching session from Redis:', error);
    return null;
  }
}

/**
 * Helper to initialize a session in Redis and set the cookie in the browser.
 * This is typically called during a "login" or "session creation" event.
 *
 * @param role The role to assign to the new session
 * @returns The generated session ID
 */
export async function createSession(role: UserRole): Promise<string> {
  const sessionId = crypto.randomUUID();
  const sessionData: SessionData = { role, stageAccessList: [] };

  // Store session in Redis with a 7-day TTL
  const redisClient = getRedisClient();
  await redisClient.set(
    `session:${sessionId}`,
    JSON.stringify(sessionData),
    'EX',
    60 * 60 * 24 * 7
  );

  return sessionId;
}

/**
 * Note: Since Next.js Server Actions and Middleware have different access levels
 * to the 'cookies' API, use the 'cookies' API directly in Middleware
 * to set the 'session_id' cookie.
 */
