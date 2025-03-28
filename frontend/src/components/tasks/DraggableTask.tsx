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
  Avatar,
  Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface DraggableTaskProps {
  task: TaskWithUser;
  onEdit: (task: TaskWithUser) => void;
  onDelete: (taskId: string) => void;
  light: string;
  dark: string;
  fontColor: string;
}

export const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  onEdit,
  onDelete,
  light,
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
        <Flex visibility="visible" opacity={1} transition="all 0.2s">
          <Tooltip label="Edit task" placement="top">
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
              _groupHover={{ color: 'blue.400' }}
            />
          </Tooltip>
          <Tooltip label="Delete task" placement="top">
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
              _groupHover={{ color: 'red.400' }}
            />
          </Tooltip>
        </Flex>
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
              size="xs"
              name={`${task.assignedToUser.firstName} ${task.assignedToUser.lastName}`}
              bg={light}
              color={dark}
            />
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
};
