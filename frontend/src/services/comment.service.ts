import axios from 'axios';
import { Comment } from '@/types';
import { API_URL } from '@/config';

interface CreateCommentDto {
  taskId: string;
  content: string;
}

class CommentService {
  async createComment(data: CreateCommentDto): Promise<Comment> {
    const response = await axios.post(`${API_URL}/comments`, data);
    return response.data;
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    const response = await axios.patch(`${API_URL}/comments/${id}`, { content });
    return response.data;
  }

  async deleteComment(id: string): Promise<void> {
    await axios.delete(`${API_URL}/comments/${id}`);
  }
}

export const commentService = new CommentService();
