import { z } from 'zod';

export const ProjectStageSchema = z.string();
export type ProjectStage = string;

export const CreateProjectRequestSchema = z.object({
  label: z.string().min(1, 'Project label is required'),
  crm_link: z.string().url('Invalid CRM link format').nullable().optional().transform(v => v ?? null),
  initial_stage: ProjectStageSchema,
});

export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;

export interface Project {
  id: string | number;

  label: string;
  crm_link: string | null;
  initial_stage: string;
  status: 'active' | 'inactive' | 'archived';
  description?: string;
  created_at: Date;
}

export interface ProjectResponse extends Omit<Project, 'created_at'> {
  created_at: string;
}

// Task schemas and types
export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskRoleSchema = z.enum([
  'Business',
  'Product',
  'Domain Expert',
  'Data Engineer',
  'AI Engineer',
  'ML Specialist',
  'Annotation',
  'MLOps',
  'QA',
  'Security',
  'UX',
]);
export type TaskRole = z.infer<typeof TaskRoleSchema>;

export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().nullable().optional().transform(v => v ?? null),
  role: TaskRoleSchema,
  category: z.string().nullable().optional().transform(v => v ?? null),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

export const UpdateTaskRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: TaskStatusSchema.optional(),
  role: TaskRoleSchema.optional(),
  category: z.string().nullable().optional(),
});

export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  role: TaskRole;
  category: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface TaskResponse extends Omit<Task, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
}
