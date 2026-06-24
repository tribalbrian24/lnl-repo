import { NextResponse } from 'next/server';
import { getDbClient, Project } from '@repo/db';
import { PROJECT_STATUSES } from '@repo/constants';
import { CreateProjectRequestSchema } from '@repo/types';
import type { CreateProjectRequest, ProjectResponse } from '@repo/types';

export async function GET() {
  try {
    const { db } = getDbClient();
    const projects = await db
      .selectFrom('projects')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();

    const mappedProjects = projects.map((row) => ({
      id: row.id,
      label: row.label,
      crm_link: row.crm_link,
      initial_stage: row.initial_stage_id,
      created_at: row.created_at,
      // Map to our frontend expectation
      status: 'active',
      description: 'Project from database'
    }));

    return NextResponse.json(mappedProjects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CreateProjectRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { label, crm_link, initial_stage } = validation.data;
    const { db } = getDbClient();

    if (crm_link) {
      const existing = await db
        .selectFrom('projects')
        .select('id')
        .where('crm_link', '=', crm_link)
        .executeTakeFirst();

      if (existing) {
        return NextResponse.json(
          { error: 'A project with this CRM link already exists.' },
          { status: 409 }
        );
      }
    }

    const newProject = await db.transaction().execute(async (trx) => {
      const project = await trx
        .insertInto('projects')
        .values({
          label,
          crm_link,
          initial_stage_id: initial_stage,
          project_status_id: PROJECT_STATUSES.INITIALIZED,

        } as Pick<Project, 'project_status_id' | 'project_status_id' | 'crm_link' | 'label'>)
        .returningAll()
        .executeTakeFirstOrThrow();

      // Find tasks in the initial stage and clone them to project_tasks
      // We need to find task_statuses for the tasks being cloned.
      // Since the schema doesn't explicitly link tasks to statuses in 'tasks' table,
      // but 'project_tasks' has 'task_status_id', we'll need a default status.
      // Let's find the 'Initialized' status.
      const statusResult = await trx
        .selectFrom('task_statuses')
        .select('id')
        .where('label', '=', 'Initialized')
        .executeTakeFirst();

      if (!statusResult) {
        throw new Error('Task status "Initialized" not found');
      }

      const tasksToClone = await trx
        .selectFrom('tasks')
        .select(['id'])
        .where('stage_id', '=', initial_stage)
        .execute();

      if (tasksToClone.length > 0) {
        await trx
          .insertInto('project_tasks')
          .values(
            tasksToClone.map((t) => ({
              project_id: project.id,
              task_id: t.id,
              task_status_id: statusResult.id,
              display_order: 1,
            }))
          )
          .execute();
      }

      return project;
    });

    const response: ProjectResponse = {
      id: newProject.id,
      label: newProject.label,
      crm_link: newProject.crm_link,
      initial_stage: newProject.initial_stage_id as ProjectResponse['initial_stage'],
      status: 'active',
      description: 'Newly created project',
      created_at: newProject.created_at.toISOString()
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : (error && typeof error === 'object' && 'message' in error ? String((error as any).message) : null);
    return NextResponse.json({ error: message ?? 'Something unexpected went wrong' }, { status: 503 });
  }
}
