import { NextResponse } from 'next/server';
import { getDbClient } from '@repo/db';
import { CreateTaskRequestSchema } from '@repo/types';
import type { TaskResponse } from '@repo/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId } = await params;
    const { db } = getDbClient();

    // Verify project exists
    const project = await db
      .selectFrom('projects')
      .select('id')
      .where('id', '=', projectId)
      .executeTakeFirst();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const tasks = await db
      .selectFrom('project_tasks')
      .innerJoin('tasks', 'project_tasks.task_id', 'tasks.id')
      .innerJoin('task_statuses', 'project_tasks.task_status_id', 'task_statuses.id')
      .select([
        'project_tasks.id',
        'project_tasks.project_id',
        'tasks.id as task_id',
        'tasks.label as task_label',
        'tasks.description as task_description',
        'project_tasks.created_at',
        'project_tasks.updated_at',
        'task_statuses.slug as status_slug'
      ])
      .where('project_tasks.project_id', '=', projectId)
      .orderBy('project_tasks.created_at', 'asc')
      .execute();

    const mappedTasks = tasks.map((task) => ({
      id: task.id,
      project_id: task.project_id,
      taskId: task.task_id,
      taskLabel: task.task_label,
      taskDescription: task.task_description,
      statusSlug: task.statusSlug,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
    }));

    return NextResponse.json(mappedTasks);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();

    const validation = CreateTaskRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, description, role, category } = validation.data;
    const { db } = getDbClient();

    // Verify project exists
    const project = await db
      .selectFrom('projects')
      .select('id')
      .where('id', '=', projectId)
      .executeTakeFirst();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const newTask = await db
      .insertInto('project_tasks')
      .values({
        project_id: projectId,
        title,
        description,
        role,
        category,
        status: 'todo',
      } as any)
      .returningAll()
      .executeTakeFirstOrThrow();

    const response: TaskResponse = {
      id: newTask.id,
      project_id: newTask.project_id,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as TaskResponse['status'],
      role: newTask.role as TaskResponse['role'],
      category: newTask.category,
      created_at: newTask.created_at.toISOString(),
      updated_at: newTask.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
