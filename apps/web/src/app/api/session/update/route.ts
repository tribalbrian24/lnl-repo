import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRedisClient } from '@/lib/redis';
import { cookies as nextCookies } from 'next/headers';
import { z } from 'zod';

// Define the schema for the patch request.
// We use .strict() to ensure only 'role' and 'stageId' are allowed.
const updateSchema = z.object({
  role: z.enum(['admin', 'user', 'viewer', 'guest']).optional(),
  stageId: z.string().optional(),
}).strict();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid update parameters', details: result.error.format() },
        { status: 400 }
      );
    }

    const { role, stageId } = result.data;

    const session = await getSession();

    if (!session) {
      const sessionId = (await nextCookies()).get('session_id')?.value;
      if (!sessionId) {
        return NextResponse.json({ error: 'No session ID found in cookies' }, { status: 400 });
      }

      const redis = getRedisClient();
      const updatedSession: SessionData = {
        role: role ?? 'guest',
        stageAccessList: stageId ? [stageId] : [],
      };

      await redis.set(`session:${sessionId}`, JSON.stringify(updatedSession), 'EX', 60 * 60 * 24 * 7);
      return NextResponse.json({ message: 'Session initialized and updated' });
    }

    const redis = getRedisClient();
    const updatesApplied: string[] = [];

    if (role !== undefined) {
      session.role = role;
      updatesApplied.push(`role to ${role}`);
    }

    if (stageId !== undefined) {
      if (stageId === "") {
        session.stageAccessList = [];
      } else {
        session.stageAccessList = [stageId];
      }
      updatesApplied.push(`stageAccessList to [${stageId}]`);
    }

    if (updatesApplied.length > 0) {
      const cookieStore = await nextCookies();
      const sessionId = cookieStore.get('session_id')?.value;
      if (sessionId) {
        await redis.set(`session:${sessionId}`, JSON.stringify(session), 'KEEPTTL');
      }
      return NextResponse.json({ message: `Session updated: ${updatesApplied.join(', ')}` });
    } else {
      return NextResponse.json({ message: 'No changes requested' });
    }
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
