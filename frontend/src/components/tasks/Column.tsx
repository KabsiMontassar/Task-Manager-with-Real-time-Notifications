import React from "react";
import {
  Box,
  Flex,
  Badge,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { AddIcon } from "@chakra-ui/icons";
import { Task as TaskType, TaskStatus } from "../../types/task";
import Task from "./Task";
import { statusColors, statusLabels } from "./Board";

interface ColumnProps {
  status: TaskStatus;
  tasks: TaskType[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (id: string) => void;
  dark: string;
  light: string;
  fontColor: string;
}

const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  dark,
  light,
  fontColor
}) => {
  const { setNodeRef } = useDroppable({ id: status });
  

  return (
    <Box
      ref={setNodeRef}
      flex={1}
      minW="280px"

      mx={2}
      p={4}
      bg={dark}
      borderRadius="lg"
      boxShadow="md"
      
      transition="all 0.2s"
      position="relative"
      height="fit-content"
      maxH="calc(100vh - 200px)"
      overflowY="auto"
      
    >
      <Flex align="center" mb={4} justify="space-between">
        <Flex align="center">
          <Badge
            colorScheme={statusColors[status]}
            fontSize="md"
            px={3}
            py={1}
            borderRadius="full"
          >
            {statusLabels[status]}
          </Badge>
          <Text
            ml={2}
            fontSize="sm"
            color={fontColor}
          >
            ({tasks.length})
          </Text>
        </Flex>
        <Tooltip label={`Add task to ${statusLabels[status]}`}>
          <IconButton
            aria-label={`Add task to ${status}`}
            icon={<AddIcon />}
            size="sm"
            onClick={() => onAddTask(status)}
            colorScheme={statusColors[status]}
            variant="ghost"
           
          />
        </Tooltip>
      </Flex>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <Box minH="50px">
          {tasks.map((task) => (
            <Task

              dark={dark}
              light={light}
              fontColor={fontColor}


              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <Box
              p={4}
              textAlign="center"
              color={fontColor}
              bg={light}
              
              boxShadow="sm"
              borderRadius="md"
              fontSize="sm"
            >
              Drop tasks here
            </Box>
          )}
        </Box>
      </SortableContext>
    </Box>
  );
};

export default Column;