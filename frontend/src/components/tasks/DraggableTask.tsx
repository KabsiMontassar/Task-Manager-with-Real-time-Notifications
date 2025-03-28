import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskWithUser } from '../../types/task';
import {
  Box,
  Text,
  Badge,
  Flex,
  Avatar,
  Tooltip,
} from '@chakra-ui/react';

interface DraggableTaskProps {
  task: TaskWithUser;
  light: string;
  dark: string;
  fontColor: string;
}

export const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  dark,
  fontColor,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'gray';
      case 'IN_PROGRESS':
        return 'blue';
      case 'DONE':
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
      boxShadow="md"
      cursor="move"
      mb={4}
      _hover={{
        boxShadow: 'lg',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s"
      data-task-id={task.id}
      role="group"
    >
      <Flex justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Text fontWeight="bold" color={fontColor} noOfLines={1} flex="1">
          {task.title}
        </Text>
      </Flex>

      {task.description && (
        <Text color={fontColor} fontSize="sm" noOfLines={2} mb={2} opacity={0.8}>
          {task.description}
        </Text>
      )}

      <Flex justifyContent="space-between" alignItems="center">
        <Flex gap={2}>
          <Badge colorScheme={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Badge colorScheme={getStatusColor(task.status)}>
            {task.status.replace('_', ' ')}
          </Badge>
        </Flex>
        {task.assignedToUser && (
          <Tooltip
            label={`${task.assignedToUser.firstName} ${task.assignedToUser.lastName}`}
            placement="top"
          >
            <Avatar
              size="sm"

              name={`${task.assignedToUser.firstName} ${task.assignedToUser.lastName}`}
              bg={"teal"}
              color={dark}
            />
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
};
