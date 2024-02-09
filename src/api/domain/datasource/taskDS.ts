import type {
  TaskType,
  TaskCreateType,
  TaskUpdateType,
  TaskDeleteType,
} from '@schemas/task';

export default abstract class TaskDS {
  abstract listTask(): Promise<TaskType[]>;

  abstract addTask(data: TaskCreateType): Promise<TaskType | null>;

  abstract completeTask(data: TaskUpdateType): Promise<TaskType | null>;

  abstract removeTask(data: TaskDeleteType): Promise<boolean>;
}
