export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt: string;
}
