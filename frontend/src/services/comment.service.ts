import axios from 'axios';
import { Comment } from '@/types';
import { API_BASE_URL } from '../config/api.config.ts';

interface CreateCommentDto {
  taskId: string;
  content: string;
}

class CommentService {
  async createComment(data: CreateCommentDto): Promise<Comment> {
    const response = await axios.post(`${API_BASE_URL}/comments`, data);
    return response.data;
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    const response = await axios.patch(`${API_BASE_URL}/comments/${id}`, { content });
    return response.data;
  }

  async deleteComment(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/comments/${id}`);
  }
}

export const commentService = new CommentService();
