import { NextResponse } from 'next/server';
import { getDbClient } from '@repo/db';
import { UpdateTaskRequestSchema } from '@repo/types';
import type { TaskResponse } from '@repo/types';

interface RouteParams {
  params: Promise<{ id: string; taskId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, taskId } = await params;
    const body = await request.json();

    const validation = UpdateTaskRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const updates = validation.data;
    const { db } = getDbClient();

    // Verify task exists and belongs to project
    const existingTask = await db
      .selectFrom('project_tasks')
      .select(['id', 'project_id'])
      .where('id', '=', taskId)
      .where('project_id', '=', projectId)
      .executeTakeFirst();

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask = await db
      .updateTable('project_tasks')
      .set({
        ...updates,
        updated_at: new Date(),
      })
      .where('id', '=', taskId)
      .returningAll()
      .executeTakeFirstOrThrow();

    const response: TaskResponse = {
      id: updatedTask.id,
      project_id: updatedTask.project_id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status as TaskResponse['status'],
      role: updatedTask.role as TaskResponse['role'],
      category: updatedTask.category,
      created_at: updatedTask.created_at.toISOString(),
      updated_at: updatedTask.updated_at.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId, taskId } = await params;
    const { db } = getDbClient();

    // Verify task exists and belongs to project
    const existingTask = await db
      .selectFrom('project_tasks')
      .select(['id', 'project_id'])
      .where('id', '=', taskId)
      .where('project_id', '=', projectId)
      .executeTakeFirst();

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await db
      .deleteFrom('project_tasks')
      .where('id', '=', taskId)
      .execute();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
