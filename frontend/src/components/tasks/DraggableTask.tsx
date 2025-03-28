import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskWithUser } from '../../types/task';
import {
  Box,
  Text,
  Badge,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface DraggableTaskProps {
  task: TaskWithUser;
  onEdit: (task: TaskWithUser) => void;
  onDelete: (taskId: string) => void;
  dark: string;
  fontColor: string;
}

export const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  onEdit,
  onDelete,
  dark,
  fontColor,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'red';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      bg={dark}
      p={4}
      borderRadius="md"
      boxShadow="sm"
      cursor="move"
      mb={4}
    >
      <Flex justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Text fontWeight="bold" color={fontColor} noOfLines={1}>
          {task.title}
        </Text>
        <Flex>
          <IconButton
            aria-label="Edit task"
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          />
          <IconButton
            aria-label="Delete task"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          />
        </Flex>
      </Flex>

      <Text color={fontColor} fontSize="sm" noOfLines={2} mb={2}>
        {task.description}
      </Text>

      <Flex justifyContent="space-between" alignItems="center">
        <Badge colorScheme={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
        {task.assignedToUser && (
          <Text fontSize="xs" color={fontColor}>
            {task.assignedToUser.firstName} {task.assignedToUser.lastName}
          </Text>
        )}
      </Flex>

      {task.dueDate && (
        <Text fontSize="xs" color={fontColor} mt={2}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Text>
      )}
    </Box>
  );
};
