'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RegistryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/projects`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Project Registry</h1>
        <p className="text-foreground/60">Manage and monitor all lifecycle projects.</p>
      </header>

      <div className="rounded-xl border border-foreground/10 bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Active Projects</h2>
          <button
            onClick={fetchProjects}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-50/50 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-foreground/10 text-foreground/60">
              <tr>
                <th className="pb-4 font-medium">Project Name</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">CRM Link</th>
                <th className="pb-4 font-medium">Created At</th>
                <th className="pb-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((project: any) => (
                  <tr key={project.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{project.label}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {project.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4">
                      {project.crm_link ? (
                        <a
                          href={project.crm_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View CRM
                        </a>
                      ) : (
                        <span className="text-foreground/40">N/A</span>
                      )}
                    </td>
                    <td className="py-4 text-foreground/60">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-foreground/40 italic">
                    No projects found in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
