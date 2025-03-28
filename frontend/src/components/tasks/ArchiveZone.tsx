// src/components/tasks/dnd/ArchiveZone.tsx
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { Task as TaskType } from "../../types/task";
import { useToast } from "@chakra-ui/react";

interface ArchiveZoneProps {
  onArchive: (id: string) => Promise<void>;
}

export const ArchiveZone: React.FC<ArchiveZoneProps> = ({ onArchive }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "archive-zone" });
  const bgColor = useColorModeValue("orange.100", "orange.900");
  const activeBgColor = useColorModeValue("orange.200", "orange.800");
  const toast = useToast();

  const handleDrop = async (task: TaskType) => {
    try {
      await onArchive(task.id);
      toast({
        title: "Task archived",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error archiving task",
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
      borderColor="orange.500"
      textAlign="center"
    >
      <Text fontWeight="bold" color="orange.500">
        Drop here to archive task
      </Text>
    </Box>
  );
};