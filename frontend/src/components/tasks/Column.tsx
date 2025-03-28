import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
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
}

const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const hoverBgColor = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      ref={setNodeRef}
      flex={1}
      minW="280px"
      mx={2}
      p={4}
      bg={isOver ? hoverBgColor : bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderStyle="solid"
      borderColor={borderColor}
      transition="all 0.2s"
      position="relative"
      height="fit-content"
      maxH="calc(100vh - 200px)"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: useColorModeValue("gray.300", "gray.600"),
          borderRadius: "24px",
        },
      }}
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
            color={useColorModeValue("gray.500", "gray.400")}
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
            _hover={{
              bg: useColorModeValue(
                `${statusColors[status]}.100`,
                `${statusColors[status]}.800`
              ),
            }}
          />
        </Tooltip>
      </Flex>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <Box minH="50px">
          {tasks.map((task) => (
            <Task
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
              color={useColorModeValue("gray.400", "gray.500")}
              bg={useColorModeValue("gray.50", "gray.900")}
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