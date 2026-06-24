import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import getDefaultClient, { Project } from '@repo/db';
import { ExternalLink } from 'lucide-react';
import ProjectTasks from '@/components/projects/ProjectTasks';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  const { query } = getDefaultClient();

  try {
    const result = await query<Project>(`
      SELECT p.*, s.label as stage_label
      FROM projects p
      LEFT JOIN stages s ON p.initial_stage_id = s.id
      WHERE p.id = $1
    `, [id]);
    if (!result) {return null;}
    const [project] = result;
    return project;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.label} | Project Details`,
    description: `Details for ${project.label} project.`,
  };
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8">
        <header>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            {project.label}
          </h1>
          <p className="mt-2 text-lg text-foreground/60">
            Project Overview & Lifecycle Status
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-4">
              General Information
            </h2>
            <dl className="space-y-4">
              <div className="mt-1 flex items-center gap-2 text-sm text-blue-600 break-all">
                <a href={project.crmLink} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  {project.crmLink ? "View in CRM" : 'No link provided'}
                  <ExternalLink size={14} className="opacity-70" />
                </a>
              </div>
              <div className="mt-4">
                <dt className="text-sm font-medium text-foreground">Initial Stage</dt>
                <dd className="mt-1 text-sm text-foreground/80">{project.stageName || 'Unknown'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-4">
              Lifecycle Metadata
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-foreground">Created At</dt>
                <dd className="mt-1 text-sm text-foreground/80">
                  {new Date(project.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-foreground">Internal ID</dt>
                <dd className="mt-1 text-xs font-mono text-foreground/60 break-all">
                  {project.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Project Status</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-foreground/10 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: '35%' }}
              />
            </div>
            <span className="text-sm font-medium text-foreground/80">35% Complete</span>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Tasks</h2>
          <ProjectTasks projectId={id} projectStageId={project.initialStageId} />
        </div>
      </div>
    </div>
  );
}
