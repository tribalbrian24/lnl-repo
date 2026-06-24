import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ALCP Dashboard',
  description: 'Executive progress overview',
};

async function getProjects() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/projects`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const projects = await getProjects();

  // Mocking some calculation logic for the KPI cards based on fetched data
  const activeProjectsCount = projects.length;
  const totalStages = 4; // Sales, Product, Engineering, Deployment

  // Placeholder for completion logic until Task Engine is implemented
  const avgCompletion = activeProjectsCount > 0 ? 10 : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Executive Overview</h1>
        <p className="text-foreground/60">Real-time progress of the AI project lifecycle.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground/60">Active Projects</p>
          <p className="text-2xl font-bold text-foreground">{activeProjectsCount}</p>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground/60">Avg. Completion</p>
          <p className="text-2xl font-bold text-blue-600">{avgCompletion}%</p>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground/60">System Health</p>
          <p className="text-2xl font-bold text-green-600">99.9%</p>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground/60">Critical Alerts</p>
          <p className="text-2xl font	bold text-red-600">0</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Project Progress Bars</h2>
        <div className="space-y-6">
          {projects.length > 0 ? (
            projects.map((project: any) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{project.label}</span>
                  <span className="text-foreground/60">{project.completion_percentage}%</span>
                  <span className="text-foreground/60 uppercase text-[10	px] font-bold tracking-wider">
                    {project.initial_stage}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-foreground/10">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${project.completion_percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground/60 text-sm italic">No active projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
