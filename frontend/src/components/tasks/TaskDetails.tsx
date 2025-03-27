import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TaskDetails as ITaskDetails } from '../../types/task';
import { taskService } from '../../services/task.service';

export const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<ITaskDetails | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      loadTaskDetails();
    }
  }, [id]);

  const loadTaskDetails = async () => {
    try {
      const data = await taskService.getTaskDetails(id!);
      setTask(data);
    } catch (error) {
      console.error('Error loading task details:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await taskService.addComment(id!, comment);
      setComment('');
      loadTaskDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await taskService.addAttachment(id!, file);
      loadTaskDetails();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
        <div className="mb-6">
          <p className="text-gray-600">{task.description}</p>
          <div className="mt-4 flex gap-4">
            <span className="text-sm text-gray-500">
              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
            </span>
            <span className="text-sm text-gray-500">Priority: {task.priority}</span>
            <span className="text-sm text-gray-500">Status: {task.status}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Attachments</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
            >
              Add Attachment
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {task.attachments?.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                className="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                {attachment.filename}
              </a>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </form>
          <div className="space-y-4">
            {task.commentDetails?.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
