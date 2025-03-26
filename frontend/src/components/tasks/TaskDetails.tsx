import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Paperclip, MessageSquare, Users } from 'lucide-react';
import { taskService } from '@/services/task.service';
import { commentService } from '@/services/comment.service';
import { Task, TaskPriority } from '@/types';
import { format } from 'date-fns';
import { UserSelect } from './UserSelect';
import { showToast } from '@/lib/toast';
import { TaskStatus } from '@/types';
interface TaskDetailsProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-blue-100 text-blue-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800',
};

export const TaskDetails = ({ taskId, isOpen, onClose }: TaskDetailsProps) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await taskService.getTaskDetails(taskId);
      return response.data;
    },
    enabled: isOpen,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: Partial<Task>) => taskService.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(false);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: commentService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      setComment('');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
      showToast({
        title: 'Task deleted',
        description: 'The task has been successfully deleted.',
      });
    },
  });

  const handleUpdateTask = () => {
    if (task) {
      updateTaskMutation.mutate(editData);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && task) {
      addCommentMutation.mutate({
        taskId: task.id,
        content: comment,
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate();
    }
  };

  const handleAssign = (userId: string) => {
    updateTaskMutation.mutate({ assignedTo: userId });
  };

  const handleComplete = () => {
    updateTaskMutation.mutate({ status: TaskStatus.COMPLETED });
  };

  if (!isOpen) return null;
  if (isLoading || !task) return <div>Loading...</div>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteTaskMutation.isPending}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={handleComplete}
                disabled={updateTaskMutation.isPending}
              >
                Mark Complete
              </Button>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTask}>Save</Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              {isEditing ? (
                <Textarea
                  defaultValue={task.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="mt-2"
                />
              ) : (
                <p className="mt-2 text-gray-700">{task.description}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Due: {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Created: {format(new Date(task.createdAt), 'PPP')}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Label>Assigned To</Label>
              <UserSelect
                value={task.assignedTo}
                onChange={handleAssign}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Attachments
              </Label>
              <div className="mt-2">
                {task.attachments.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {task.attachments.map((attachment) => (
                      <div
                        key={attachment}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm truncate">{attachment}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attachments</p>
                )}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </Label>
              <div className="mt-4 space-y-4">
                {task.commentDetails.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {comment.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'PPp')}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <form onSubmit={handleAddComment} className="mt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit" disabled={!comment.trim()}>
                      Add Comment
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
