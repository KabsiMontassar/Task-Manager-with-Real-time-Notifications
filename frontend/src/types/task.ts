export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}



export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo: string;
  createdBy: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskWithUser extends Task {
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
  creatorDetails?: {
    id: string;
    name: string;
  };
}
