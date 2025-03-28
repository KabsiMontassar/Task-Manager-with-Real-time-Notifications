
import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
} from "@chakra-ui/react";

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {  DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Task as TaskType } from "../../types/task";


interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (id: string) => void;
}



const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete }) => {
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
    >
      <Card
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="sm"
        _hover={{ boxShadow: "md" }}
      >
        <CardBody p={3}>
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Text fontWeight="medium">{task.title}</Text>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Task actions"
                  icon={<EditIcon />}
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList>
                  <MenuItem icon={<EditIcon />} onClick={() => onEdit(task)}>
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={() => onDelete(task.id)}
                    color="red.500"
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            {task.description && (
              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                {task.description}
              </Text>
            )}
            <Flex justify="space-between" align="center" fontSize="sm">
              <Badge colorScheme={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Text color="gray.500">
                Assigned to: {task.assignedTo}
              </Text>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Task;