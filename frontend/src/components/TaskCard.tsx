import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Task, TaskPriority } from '@/types/task';

interface TaskCardProps {
  task: Task;
  overlay?: boolean;
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-blue-100 text-blue-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800',
};

export const TaskCard = ({ task, overlay }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        ${overlay ? 'cursor-grabbing shadow-lg' : 'cursor-grab hover:shadow-md'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-all
        hover:border-primary/50
      `}
    >
      <CardHeader className="p-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {task.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
