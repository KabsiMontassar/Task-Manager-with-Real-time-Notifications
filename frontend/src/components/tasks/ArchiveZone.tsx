// src/components/tasks/dnd/ArchiveZone.tsx
import { Box, Text, useColorModeValue, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { Task as TaskType } from "../../types/task";
import { useState } from "react";

interface ArchiveZoneProps {
  onArchive: (id: string) => Promise<void>;
}

export const ArchiveZone: React.FC<ArchiveZoneProps> = ({ onArchive }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "archive-zone" });
  const bgColor = useColorModeValue("orange.100", "orange.900");
  const activeBgColor = useColorModeValue("orange.200", "orange.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskToArchive, setTaskToArchive] = useState<TaskType | null>(null);

  const handleDrop = (task: TaskType) => {
    setTaskToArchive(task);
    onOpen();
  };

  const confirmArchive = async () => {
    if (taskToArchive) {
      await onArchive(taskToArchive.id);
      setTaskToArchive(null);
      onClose();
    }
  };

  return (
    <>
      <Box
        ref={setNodeRef}
        p={4}
        m={4}
        borderRadius="md"
        bg={isOver ? activeBgColor : bgColor}
        border="2px dashed"
        borderColor="orange.500"
        textAlign="center"
        onDrop={(e) => {
          const task = JSON.parse(e.dataTransfer.getData("application/json")) as TaskType;
          handleDrop(task);
        }}
      >
        <Text fontWeight="bold" color="orange.500">
          Drop here to archive task
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Archive</ModalHeader>
          <ModalBody>Are you sure you want to archive this task?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="orange" onClick={confirmArchive}>
              Archive
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};