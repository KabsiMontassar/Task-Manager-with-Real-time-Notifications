import React, { useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { TaskStatus, Task } from '@/types/task';
import { taskService } from '@/services/task.service';
import { socketService } from '@/services/socket.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTaskDialog } from './tasks/CreateTaskDialog';

const columns = [
  { id: TaskStatus.TODO, title: 'To Do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.DONE, title: 'Done' },
];

export const TaskBoard = () => {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskService.getAllTasks();
      return response.data;
    },
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Listen for task updates
    const handleTaskUpdate = (updatedTask: Task) => {
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return [updatedTask];
        return oldTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
    };

    socketService.onTaskUpdate(handleTaskUpdate);

    return () => {
      socketService.offTaskUpdate(handleTaskUpdate);
      socketService.disconnect();
    };
  }, [queryClient]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const draggedTask = tasks.find((task) => task.id === active.id);
    setActiveTask(draggedTask || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const newStatus = over.data.current?.status as TaskStatus;
      if (newStatus && activeId) {
        updateTaskMutation.mutate({
          taskId: activeId,
          status: newStatus,
        });
      }
    }

    setActiveId(null);
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTask(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading tasks...</div>;
  }

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
        <CreateTaskDialog />
      </div>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex space-x-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 300px)" }}>
          {columns.map((column) => (
            <div key={column.id} className="flex-none w-80">
              <TaskColumn
                id={column.id}
                title={column.title}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
