export const UUID_0 = '00000000-0000-0000-0000-000000000000';
export const UUID_1 = '00000000-0000-0000-0000-000000000001';
export const UUID_2 = '00000000-0000-0000-0000-000000000002';
export const UUID_3 = '00000000-0000-0000-0000-000000000003';
export const UUID_4 = '00000000-0000-0000-0000-000000000004';
export const UUID_5 = '00000000-0000-0000-0000-000000000005';
export const UUID_6 = '00000000-0000-0000-0000-000000000006';
export const UUID_7 = '00000000-0000-0000-0000-000000000007';
export const UUID_8 = '00000000-0000-0000-0000-000000000008';
export const UUID_9 = '00000000-0000-0000-0000-000000000009';
export const UUID_10 = '00000000-0000-0000-0000-000000000010';
export const UUID_11 = '00000000-0000-0000-0000-000000000011';
export const UUID_12 = '00000000-0000-0000-0000-000000000012';

export const STAGE_SLUGS = {
  SALES: 'sales',
  PRODUCT: 'product',
  ENGINEERING: 'engineering',
  AUTOMATION: 'automation',
} as const;

export const STAGES = {
  SALES: UUID_0,
  PRODUCT: UUID_1,
  ENGINEERING: UUID_2,
  AUTOMATION: UUID_3,
} as const;

export const PROJECT_STATUS_SLUGS = {
  INITIALIZED: 'initialized',
  IN_PIPELINE: 'in-pipeline',
  ACTIVE: 'active',
  REMOVED: 'removed',
  HIDDEN: 'hidden',
  EXEC: 'exec',
  ARCHIVE: 'archive',
} as const;

export const PROJECT_STATUSES = {
  INITIALIZED: UUID_0,
  IN_PIPELINE: UUID_1,
  ACTIVE: UUID_2,
  REMOVED: UUID_3,
  HIDDEN: UUID_4,
  EXEC: UUID_5,
  ARCHIVE: UUID_6,
} as const;

export const TASK_CATEGORIES = {
  MEASURABLE: UUID_0,
  INFORMAL: UUID_1,
  ACTIONABLE: UUID_2,
} as const;

export const TASK_STATUS_SLUGS = {
  NONE: 'none',
  INITIAL_STATUS: 'initialized',
  ACTIVE: 'active',
  REMOVED: 'removed',
  HIDDEN: 'hidden',
  EXEC: 'exec',
  COMPLETE_WITH_SKIPPED: 'complete-with-skipped',
  COMPLETE: 'complete',
} as const;

export const TASK_STATUSES = {
  NONE: UUID_0,
  INITIALIZED: UUID_1,
  ACTIVE: UUID_2,
  REMOVED: UUID_3,
  HIDDEN: UUID_4,
  EXEC: UUID_5,
  COMPLETE_WITH_SKIPPED: UUID_6,
  COMPLETE: UUID_7,
} as const;

export const TASK_TYPES = {
  PRE_WORK_SETUP: UUID_0,
  SURVEY_QUESTIONNAIRE: UUID_1,
  PRESENTATION: UUID_2,
  COLLABORATION_MEETING: UUID_3,
  COMMUNICATION_SEND_MATERIALS: UUID_4,
  PLANNING: UUID_5,
  RESOLVE_DEPENDENCY: UUID_6,
  DELIVERY: UUID_7,
  OTHER_ENGINEERING: UUID_8,
  AUTOMATION: UUID_9,
} as const;

export const TASK_TYPE_SLUGS = {
  PRE_WORK_SETUP: 'pre-work-setup',
  SURVEY_QUESTIONNAIRE: 'survey-questionnaire',
  PRESENTATION: 'presentation',
  COLLABORATION_MEETING: 'collaboration-meeting',
  COMMUNICATION_SEND_MATERIALS: 'communication-send-materials',
  PLANNING: 'planning',
  RESOLVE_DEPENDENCY: 'resolve-dependency',
  DELIVERY: 'delivery',
  OTHER_ENGINEERING: 'other-engineering',
  AUTOMATION: 'automation',
} as const;
