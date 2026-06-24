"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProjectTask {
  id: string;
  taskId: string;
  taskStatusId: string;
  statusSlug?: string;
  displayOrder: number;
  // These will be populated via join in the actual API
  taskLabel?: string;
  taskCategoryLabel?: string;
}

interface ProjectTasksProps {
  projectId: string;
  projectStageId: string;
}

export default function ProjectTasks({ projectId, projectStageId }: ProjectTasksProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  if (loading) {
    return <div className="text-sm text-foreground/60">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">Error: {error}</div>;
  }
  const hasAccess = user?.stageAccessList?.includes(projectStageId);

  if (!hasAccess) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
        You do not have permission to view tasks for this project stage.
      </div>
    );
  }

  // Note: In a real implementation, we'd filter tasks based on whether
  // the project's stage is in the user's stageAccessList.
  // For now, we show all tasks fetched for this project.

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-foreground/60">No tasks found for this project.</p>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/projects/${projectId}/tasks/${task.taskId}`}
              className="group flex items-center justify-between p-4 rounded-xl border border-foreground/10 bg-background hover:bg-foreground/5 transition-all"
            >
              <div className="flex items-center gap-3">
                {task.statusSlug === 'complete' ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <Circle className="text-foreground/30 group-hover:text-foreground/60" size={20} />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {task.taskLabel || 'Unnamed Task'}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {task.taskCategoryLabel || 'No category'}
                  </p>
                </div>
              </div>
              <ArrowRight className="text-foreground/20 group-hover:text-foreground/60 transition-colors" size={18} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
