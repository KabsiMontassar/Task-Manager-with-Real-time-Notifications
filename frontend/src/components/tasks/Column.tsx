

import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Badge,
  IconButton,
} from "@chakra-ui/react";

import {
  SortableContext,
  
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { AddIcon } from "@chakra-ui/icons";
import { Task as TaskType, TaskStatus } from "../../types/task";
import Task from "./Task"
import { statusColors, statusLabels } from "./Board";


interface ColumnProps {
  status: TaskStatus;
  tasks: TaskType[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (id: string) => void;
}


const Column: React.FC<ColumnProps> = ({ status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
    const { setNodeRef } = useDroppable({ id: status });
    const bgColor = useColorModeValue("gray.100", "gray.800");
  
    return (
      <Box
        ref={setNodeRef}
        flex={1}
        minW="280px"
        mx={2}
        p={4}
        bg={bgColor}
        borderRadius="lg"
      >
        <Flex align="center" mb={4} justify="space-between">
          <Flex align="center">
            <Badge colorScheme={statusColors[status]} fontSize="md" px={3} py={1} borderRadius="full">
              {statusLabels[status]}
            </Badge>
            <Box ml={2} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
              ({tasks.length})
            </Box>
          </Flex>
          <IconButton
            aria-label={`Add task to ${status}`}
            icon={<AddIcon />}
            size="sm"
            onClick={() => onAddTask(status)}
          />
        </Flex>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <Box>
            {tasks.map((task) => (
              <Task key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
          </Box>
        </SortableContext>
      </Box>
    );
  };


export default Column;