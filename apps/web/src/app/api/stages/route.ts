import { NextResponse } from 'next/server';
import { getDbClient } from '@repo/db';

export async function GET() {
  try {
    const { db } = getDbClient();
    const stages = await db
      .selectFrom('stages')
      .select(['id', 'label'])
      .orderBy('display_order', 'asc')
      .execute();

    return NextResponse.json(stages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
