import type {
  TaskType,
  TaskCreateType,
  TaskUpdateType,
  TaskDeleteType,
  FirebaseResponse,
} from '@schemas/task';

import axios from 'axios';

import TaskDS from '@api/domain/datasource/taskDS';

export default class TaskDSImpl extends TaskDS {
  constructor() {
    super();
  }

  async listTask(): Promise<TaskType[]> {
    try {
      const response = await axios.get<FirebaseResponse<TaskType[]>>(
        'https://listtasks-4mrbwqn5qa-uc.a.run.app'
      );

      return response.data.data as TaskType[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An error occurred while fetching tasks');
    }
  }

  async addTask(data: TaskCreateType): Promise<TaskType | null> {
    try {
      await axios.post('https://addtask-4mrbwqn5qa-uc.a.run.app', data);

      return data as TaskType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An error occurred while adding task');
    }
  }

  async completeTask(data: TaskUpdateType): Promise<TaskType | null> {
    try {
      await axios.patch('https://completetask-4mrbwqn5qa-uc.a.run.app', data);

      return data as TaskType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An error occurred while completing task');
    }
  }

  async removeTask(data: TaskDeleteType): Promise<boolean> {
    try {
      await axios.post('https://removetask-4mrbwqn5qa-uc.a.run.app', data);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An error occurred while removing task');
    }
  }
}
