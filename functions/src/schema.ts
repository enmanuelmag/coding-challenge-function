import * as zod from 'zod';

// Base
export const TaskSchema = zod.object({
  id: zod.string(),
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  description: zod.string().min(3, 'Description must be at least 3 characters'),
  status: zod.enum(['not_completed', 'completed']),
});

export type TaskType = zod.infer<typeof TaskSchema>;

// Creation
export const TaskCreateSchema = TaskSchema.omit({ id: true });

export type TaskCreateType = zod.infer<typeof TaskCreateSchema>;

// Update
export const TaskUpdateSchema = TaskSchema;

export type TaskUpdateType = zod.infer<typeof TaskUpdateSchema>;

// Delete
export const TaskDeleteSchema = TaskSchema.pick({ id: true });

export type TaskDeleteType = zod.infer<typeof TaskDeleteSchema>;
