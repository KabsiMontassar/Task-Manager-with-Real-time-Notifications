// task.constants.ts
import { TaskStatus } from "../../types/task";

export const statusOrder: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];

export const statusColors: Record<TaskStatus, string> = {
  TODO: "yellow",
  IN_PROGRESS: "blue",
  DONE: "green",
};

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};