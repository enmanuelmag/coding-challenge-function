import TaskDS from '@api/domain/datasource/taskDS';
import TaskRepo from '@api/domain/repo/taskRepo';
import type {
  TaskCreateType,
  TaskUpdateType,
  TaskDeleteType,
} from '@schemas/task';

export default class TaskRepoImpl extends TaskRepo {
  private ds: TaskDS;

  constructor(ds: TaskDS) {
    super();
    this.ds = ds;
  }

  listTask() {
    return this.ds.listTask();
  }

  addTask(data: TaskCreateType) {
    return this.ds.addTask(data);
  }

  completeTask(data: TaskUpdateType) {
    return this.ds.completeTask(data);
  }

  removeTask(data: TaskDeleteType) {
    return this.ds.removeTask(data);
  }
}
