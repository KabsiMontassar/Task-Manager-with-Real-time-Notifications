import React from "react";
import {
  Box,
  Flex,
  Badge,
  Card,
  CardBody,
  Text,
  VStack,
  Tooltip,
  Avatar,
} from "@chakra-ui/react";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task as TaskType } from "../../types/task";
import { format } from "date-fns";

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (id: string) => void;
  fontColor: string;
}

const Task: React.FC<TaskProps> = ({ task, fontColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const priorityColors = {
    LOW: "green",
    MEDIUM: "yellow",
    HIGH: "red",
  };


  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      mb={2}
      role="group"
    >
      <Card
        bg="var(--light-color)"
        boxShadow="sm"
        _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
        transition="all 0.2s"
        position="relative"
        borderLeft="4px solid"
        borderLeftColor={priorityColors[task.priority] + ".500"}
      >
        <CardBody p={3}>
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Tooltip label={task.title} placement="top-start">
                <Text color={fontColor} fontWeight="medium" noOfLines={1}>{task.title}</Text>
              </Tooltip>
           
            </Flex>
            {task.description && (
              <Tooltip label={task.description}>
                <Text fontSize="sm" color="gray.500" noOfLines={2}>
                  {task.description}
                </Text>
              </Tooltip>
            )}
            <Flex justify="space-between" align="center" fontSize="sm">
              <Flex align="center" gap={2}>
                <Badge colorScheme={priorityColors[task.priority]} variant="subtle">
                  {task.priority}
                </Badge>
                {task.dueDate && (
                  <Tooltip label={`Due: ${format(new Date(task.dueDate), 'PPP')}`}>
                    <Text color="gray.500" fontSize="xs">
                      {format(new Date(task.dueDate), 'MMM d')}
                    </Text>
                  </Tooltip>
                )}
              </Flex>
              <Tooltip label={`Assigned to: ${task.assignedTo}`}>
                <Avatar name={task.assignedTo} size="xs" />
              </Tooltip>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Task;