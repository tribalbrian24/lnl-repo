import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({
        user: {
          role: 'guest',
          stageAccessList: [],
        },
      });
    }

    return NextResponse.json({
      user: {
        role: session.role,
        stageAccessList: session.stageAccessList || [],
      },
    });
  } catch (error) {
    console.error('Error fetching user session info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
