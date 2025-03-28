// src/components/tasks/dnd/DeleteZone.tsx
import { Box, Text, useColorModeValue, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { Task as TaskType } from "../../types/task";
import { useState } from "react";

interface DeleteZoneProps {
  onDelete: (id: string) => Promise<void>;
}

export const DeleteZone: React.FC<DeleteZoneProps> = ({ onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "delete-zone" });
  const bgColor = useColorModeValue("red.100", "red.900");
  const activeBgColor = useColorModeValue("red.200", "red.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);

  const handleDrop = (task: TaskType) => {
    setTaskToDelete(task);
    onOpen();
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await onDelete(taskToDelete.id);
      setTaskToDelete(null);
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
        borderColor="red.500"
        textAlign="center"
        onDrop={(e) => {
          const task = JSON.parse(e.dataTransfer.getData("application/json")) as TaskType;
          handleDrop(task);
        }}
      >
        <Text fontWeight="bold" color="red.500">
          Drop here to delete task
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this task?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};