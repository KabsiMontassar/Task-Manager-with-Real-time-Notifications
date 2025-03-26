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
  attachments: string[];
  comments: {
    id: string;
    content: string;
    userId: string;
    createdAt: string;
  }[];
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetails extends Task {
  assigneeDetails: {
    id: string;
    name: string;
    avatar?: string;
  };
  creatorDetails: {
    id: string;
    name: string;
    avatar?: string;
  };
  commentDetails: {
    id: string;
    content: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    createdAt: string;
  }[];
}
