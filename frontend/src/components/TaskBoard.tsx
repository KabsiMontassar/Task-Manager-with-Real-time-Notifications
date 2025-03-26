import React from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import {  arrayMove } from '@dnd-kit/sortable';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { TaskStatus ,Task} from '@/types/task';

const columns = [
  { id: TaskStatus.TODO, title: 'To Do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.DONE, title: 'Done' },
];

export const TaskBoard = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [activeId, setActiveId] = React.useState(null);

  const handleDragStart = (event :any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event :any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      const overIndex = tasks.findIndex((task) => task.id === over.id);

      setTasks((tasks) => arrayMove(tasks, activeIndex, overIndex));
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <div className="h-full p-4">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-3 gap-4 h-full">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={tasks.find((task) => task.id === activeId) as Task}
              overlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
