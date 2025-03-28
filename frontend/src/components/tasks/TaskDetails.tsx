import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Task as ITaskDetails } from '../../types/task';
import { taskService } from '../../services/task.service';

export const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<ITaskDetails | null>(null);

  useEffect(() => {
    if (id) {
      loadTaskDetails();
    }
  }, [id]);

  const loadTaskDetails = async () => {
    try {
      const data = await taskService.getTaskById(id!);
      setTask(data);
    } catch (error) {
      console.error('Error loading task details:', error);
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

    

      
      </div>
    </div>
  );
};
