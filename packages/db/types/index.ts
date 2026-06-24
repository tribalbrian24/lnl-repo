export interface Stage {
  id: string;
  label: string;
  display_order: number;
}

export interface Project {
  id: string;
  label: string;
  crm_link: string | null;
  initial_stage_id: string;
  project_status_id: string;
  created_at: Date;
  modified_at: Date;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  task_id: string;
  task_status_id: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Database {
  stages: Stage;
  projects_statuses: {
    id: string;
    label: string;
  };
  projects: Project;
  task_categories: {
    id: string;
    label: string;
    description: string | null;
  };
  task_statuses: {
    id: string;
    label: string;
  };
  task_types: {
    id: string;
    label: string;
    description: string | null;
  };
  tasks: {
    id: string;
    task_type_id: string;
    stage_id: string;
    label: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
  };
  task_items: {
    id: string;
    task_id: string;
    task_category_id: string | null;
    label: string;
    public_label: string;
    exec_rule: string;
    exec_params_json: string;
  };
  task_item_properties: {
    id: string;
    task_items_id: string;
    label: string;
    exec_rule: string;
    exec_params_json: string;
    is_skippable: boolean;
  };
  project_tasks: ProjectTask;
}
