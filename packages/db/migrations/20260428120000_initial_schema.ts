import { Kysely, sql } from 'kysely';

import {
  UUID_0, UUID_1, UUID_2, UUID_3, UUID_4, UUID_5,
  UUID_6, UUID_7, UUID_8, UUID_9, UUID_10, UUID_11, UUID_12,
  STAGE_SLUGS, PROJECT_STATUS_SLUGS, TASK_STATUS_SLUGS, TASK_TYPE_SLUGS
} from '@repo/constants';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('stages')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull())
    .addColumn('display_order', 'integer', (col) => col.notNull().defaultTo(1))
    .execute();

  await db.schema
    .createTable('projects_statuses')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('label', 'text', (col) => col.notNull().unique())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable('projects')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('crm_link', 'text')
    .addColumn('initial_stage_id', 'uuid', (col) =>
      col.notNull().references('stages.id').onDelete('restrict')
    )
    .addColumn('project_status_id', 'uuid', (col) =>
      col.notNull().references('projects_statuses.id').onDelete('restrict')
    )
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('modified_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable('task_categories')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

  await db.schema
    .createTable('task_statuses')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('label', 'text', (col) => col.notNull().unique())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable('task_types')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

  await db.schema
    .createTable('tasks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('task_type_id', 'uuid', (col) => col.notNull().references('task_types.id').onDelete('restrict'))
    .addColumn('stage_id', 'uuid', (col) => col.notNull().references('stages.id').onDelete('restrict'))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable('task_items')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('task_id', 'uuid', (col) => col.notNull().references('tasks.id').onDelete('restrict'))
    .addColumn('task_category_id', 'uuid', (col) => col.references('task_categories.id').onDelete('restrict'))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('public_label', 'text')
    .addColumn('exec_rule', 'text')
    .addColumn('exec_params_json', 'text')
    .execute();

  await db.schema
    .createTable('task_item_properties')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('task_item_id', 'uuid', (col) => col.notNull().references('task_items.id').onDelete('restrict'))
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('exec_rule', 'text')
    .addColumn('exec_params_json', 'text')
    .addColumn('is_skippable', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();

  await db.schema
    .createTable('project_tasks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('project_id', 'uuid', (col) => col.notNull().references('projects.id').onDelete('cascade'))
    .addColumn('task_id', 'uuid', (col) => col.notNull().references('tasks.id').onDelete('restrict'))
    .addColumn('task_status_id', 'uuid', (col) => col.notNull().references('task_statuses.id').onDelete('restrict'))
    .addColumn('display_order', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createIndex('idx_project_tasks_project_id')
    .on('project_tasks')
    .column('project_id')
    .execute();

  await db
    .insertInto('stages')
    .values([
      { id: UUID_0, label: 'Sales', slug: STAGE_SLUGS.SALES, display_order: 1 },
      { id: UUID_1, label: 'Product', slug: STAGE_SLUGS.PRODUCT, display_order: 2 },
      { id: UUID_2, label: 'Engineering', slug: STAGE_SLUGS.ENGINEERING, display_order: 3 },
      { id: UUID_3, label: 'Deployments/Automations', slug: STAGE_SLUGS.AUTOMATION, display_order: 4 },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('projects_statuses')
    .values([
      { id: UUID_0, label: 'Initialized', slug: PROJECT_STATUS_SLUGS.INITIALIZED },
      { id: UUID_1, label: 'In-Pipeline', slug: PROJECT_STATUS_SLUGS.IN_PIPELINE },
      { id: UUID_2, label: 'Active', slug: PROJECT_STATUS_SLUGS.ACTIVE },
      { id: UUID_3, label: 'Removed', slug: PROJECT_STATUS_SLUGS.REMOVED },
      { id: UUID_4, label: 'Hidden', slug: PROJECT_STATUS_SLUGS.HIDDEN },
      { id: UUID_5, label: 'Exec', slug: PROJECT_STATUS_SLUGS.EXEC },
      { id: UUID_6, label: 'Archive', slug: PROJECT_STATUS_SLUGS.ARCHIVE },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('task_categories')
    .values([
      { id: UUID_0, label: 'Measurable', slug: 'measurable', description: null },
      { id: UUID_1, label: 'Informal', slug: 'informal', description: null },
      { id: UUID_2, label: 'Actionable', slug: 'actionable', description: null },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('task_statuses')
    .values([
      { id: UUID_0, label: 'None', slug: TASK_STATUS_SLUGS.NONE },
      { id: UUID_1, label: 'Initialized', slug: TASK_STATUS_SLUGS.INITIAL_STATUS },
      { id: UUID_2, label: 'Active', slug: TASK_STATUS_SLUGS.ACTIVE },
      { id: UUID_3, label: 'Removed', slug: TASK_STATUS_SLUGS.REMOVED },
      { id: UUID_4, label: 'Hidden', slug: TASK_STATUS_SLUGS.HIDDEN },
      { id: UUID_5, label: 'Exec', slug: TASK_STATUS_SLUGS.EXEC },
      { id: UUID_6, label: 'Complete (Contains Skipped)', slug: TASK_STATUS_SLUGS.COMPLETE_WITH_SKIPPED },
      { id: UUID_7, label: 'Complete', slug: TASK_STATUS_SLUGS.COMPLETE },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('task_types')
    .values([
      { id: UUID_0, label: 'Pre-Work/Setup', slug: TASK_TYPE_SLUGS.PRE_WORK_SETUP },
      { id: UUID_1, label: 'Survey/Questionelse', slug: TASK_TYPE_SLUGS.SURVEY_QUESTIONNAIRE },
      { id: UUID_2, label: 'Presentation', slug: TASK_TYPE_SLUGS.PRESENTATION },
      { id: UUID_3, label: 'Collaboration/Meeting', slug: TASK_TYPE_SLUGS.COLLABORATION_MEETING },
      { id: UUID_4, label: 'Communication/Send-Materials', slug: TASK_TYPE_SLUGS.COMMUNICATION_SEND_MATERIALS },
      { id: UUID_5, label: 'Planning', slug: TASK_TYPE_SLUGS.PLANNING },
      { id: UUID_6, label: 'Resolve Dependancy', slug: TASK_TYPE_SLUGS.RESOLVE_DEPENDENCY },
      { id: UUID_7, label: 'Delivery', slug: TASK_TYPE_SLUGS.DELIVERY },
      { id: UUID_8, label: 'Other Engineering', slug: TASK_TYPE_SLUGS.OTHER_ENGINEERING },
      { id: UUID_9, label: 'Automation', slug: TASK_TYPE_SLUGS.AUTOMATION },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('tasks')
    .values([
      { id: UUID_0, task_type_id: UUID_0, stage_id: UUID_0, label: 'Make Introduction(s)' },
      { id: UUID_1, task_type_id: UUID_1, stage_id: UUID_0, label: 'AI Survey/Questionnaire' },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('task_items')
    .values([
      { id: UUID_0, task_id: UUID_0, label: 'Validate Contact' },
      { id: UUID_1, task_id: UUID_0, label: 'Make Inital Contact' },
      { id: UUID_2, task_id: UUID_0, label: 'Schedule Meeting/Presentation' },
      { id: UUID_3, task_id: UUID_1, label: 'Section No. 1', public_label: 'Define the business problem & ROI' },
      { id: UUID_4, task_id: UUID_1, label: 'Section No. 2', public_label: 'Understand their awareness (AI education)' },
      { id: UUID_5, task_id: UUID_1, label: 'Section No. 3', public_label: 'Set expectations' },
      { id: UUID_6, task_id: UUID_1, label: 'Section No. 4', public_label: 'Identify KPIs / success metrics' },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto('task_item_properties')
    .values([
      { task_item_id: UUID_3, label: 'What problem are you hoping to solve with this project?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_3, label: 'How is this problem currently impacting your business (time, cost, revenue)?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_3, label: 'What would a successful outcome look like financially or operationally?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_4, label: 'Have you previously used AI or automation tools in your business?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_4, label: 'How familiar are you with what AI can and cannot do?', exec_rule: 'question_select_one', exec_params_json: '{ "fields": [{ "label": "Beginner", "value": 0 }, { "label": "Intermediate", "value": 1 }, { "label": "Advanced", "value": 2 }] }' },
      { task_item_id: UUID_5, label: 'What is your expected timeline for this project?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_5, label: 'Do you have a budget range in mind?', exec_rule: 'question_number_range', exec_params_json: '{ "range": { "min": 0 } }' },
      { task_item_id: UUID_5, label: 'What level of accuracy or performance are you expecting?', exec_rule: 'question_number_range', exec_params_json: '{ "range": { "min": 0, "max": 100 } }' },
      { task_item_id: UUID_6, label: 'How will you measure success for this project?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_6, label: 'Which metrics matter most to you?', exec_rule: 'question_free_text', exec_params_json: null },
      { task_item_id: UUID_6, label: 'What would make this project a ‘no-brainer success’ for you?', exec_rule: 'question_free_text', exec_params_json: null },
    ])
    .onConflict((oc) => oc.doNothing())
    .execute();

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('task_item_properties').ifExists().execute();
  await db.schema.dropTable('project_tasks').ifExists().execute();
  await db.schema.dropTable('task_items').ifExists().execute();
  await db.schema.dropTable('tasks').ifExists().execute();
  await db.schema.dropTable('task_types').ifExists().execute();
  await db.schema.dropTable('task_statuses').ifExists().execute();
  await db.schema.dropTable('task_categories').ifExists().execute();
  await db.schema.dropTable('projects').ifExists().execute();
  await db.schema.dropTable('projects_statuses').ifExists().execute();
  await db.schema.dropTable('stages').ifExists().execute();
}
