import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export const TaskColumn = ({ id, title, tasks }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      status: id,
      accepts: 'task'
    }
  });

  return (
    <Card className={`h-full ${isOver ? 'ring-2 ring-primary/50' : ''}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div
          ref={setNodeRef}
          className="h-full space-y-2"
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};
