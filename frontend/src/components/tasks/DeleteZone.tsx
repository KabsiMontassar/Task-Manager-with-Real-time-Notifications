// src/components/tasks/dnd/DeleteZone.tsx
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { Task as TaskType } from "../../types/task";
import { useToast } from "@chakra-ui/react";

interface DeleteZoneProps {
  onDelete: (id: string) => Promise<void>;
}

export const DeleteZone: React.FC<DeleteZoneProps> = ({ onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "delete-zone" });
  const bgColor = useColorModeValue("red.100", "red.900");
  const activeBgColor = useColorModeValue("red.200", "red.800");
  const toast = useToast();

  const handleDrop = async (task: TaskType) => {
    try {
      await onDelete(task.id);
      toast({
        title: "Task deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      ref={setNodeRef}
      p={4}
      m={4}
      borderRadius="md"
      bg={isOver ? activeBgColor : bgColor}
      border="2px dashed"
      borderColor="red.500"
      textAlign="center"
    >
      <Text fontWeight="bold" color="red.500">
        Drop here to delete task
      </Text>
    </Box>
  );
};