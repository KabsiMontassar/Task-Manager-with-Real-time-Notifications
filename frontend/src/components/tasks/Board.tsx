import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
} from "@dnd-kit/sortable";
import { taskService } from "../../services/task.service";
import { Task as TaskType, TaskStatus, TaskPriority } from "../../types/task";
import { useAuth } from "../../hooks/useAuth";
import Column from "./Column"
interface BoardData {
  [status: string]: TaskType[];
}

const statusOrder: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

export const statusColors: Record<TaskStatus, string> = {
  TODO: "yellow",
  IN_PROGRESS: "blue",
  DONE: "green",
};

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};


export const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTask, setCurrentTask] = useState<Partial<TaskType> | null>(null);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasks = await taskService.getAllTasks();
      const groupedTasks = tasks.reduce((acc, task) => {
        acc[task.status] = [...(acc[task.status] || []), task];
        return acc;
      }, { TODO: [], IN_PROGRESS: [], DONE: [] } as BoardData);

      Object.keys(groupedTasks).forEach(status => {
        groupedTasks[status as TaskStatus].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      });

      setBoardData(groupedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast({
        title: "Error fetching tasks",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = Object.keys(boardData).find(status =>
      boardData[status as TaskStatus].some(t => t.id === activeId)
    ) as TaskStatus;

    if (!sourceColumn) return;

    const isOverColumn = Object.keys(boardData).includes(overId);
    const destinationColumn = (isOverColumn ? overId :
      Object.keys(boardData).find(status =>
        boardData[status as TaskStatus].some(t => t.id === overId))
    ) as TaskStatus;

    if (!destinationColumn) return;

    if (sourceColumn === destinationColumn) {
      if (!isOverColumn) {
        const oldIndex = boardData[sourceColumn].findIndex(t => t.id === activeId);
        const newIndex = boardData[sourceColumn].findIndex(t => t.id === overId);

        if (oldIndex !== newIndex) {
          const newItems = arrayMove(boardData[sourceColumn], oldIndex, newIndex);

          setBoardData(prev => ({
            ...prev,
            [sourceColumn]: newItems,
          }));

          try {
            await updateTaskOrders(newItems);
          } catch (error) {
            console.error("Failed to update task order:", error);
            toast({
              title: "Error updating task order",
              description: error instanceof Error ? error.message : "An error occurred",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            fetchTasks();
          }
        }
      }
      return;
    }

    const taskToMove = boardData[sourceColumn].find(t => t.id === activeId);
    if (!taskToMove) return;

    setBoardData(prev => {
      const newSourceItems = prev[sourceColumn].filter(t => t.id !== activeId);

      let newDestinationItems = [...prev[destinationColumn]];
      if (!isOverColumn) {
        const overIndex = prev[destinationColumn].findIndex(t => t.id === overId);
        newDestinationItems.splice(overIndex, 0, {
          ...taskToMove,
          status: destinationColumn,
        });
      } else {
        newDestinationItems.push({
          ...taskToMove,
          status: destinationColumn,
        });
      }

      return {
        ...prev,
        [sourceColumn]: newSourceItems,
        [destinationColumn]: newDestinationItems,
      };
    });

    try {
      await taskService.updateTaskStatus(activeId, destinationColumn);
      await updateTaskOrders(boardData[destinationColumn]);
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Error updating task",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      fetchTasks();
    }
  };

  const updateTaskOrders = async (tasks: TaskType[]) => {
    const updatePromises = tasks.map((task, index) =>
      taskService.updateTaskOrder(task.id, index)
    );
    await Promise.all(updatePromises);
  };

  const handleAddTask = (status: TaskStatus) => {
    setCurrentTask({
      status,
      priority: TaskPriority.MEDIUM,
      assignedTo: user?.email || '',
      createdBy: user?.email || '',
    });
    onOpen();
  };

  const handleEditTask = (task: TaskType) => {
    setCurrentTask(task);
    onOpen();
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      toast({
        title: "Task deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error deleting task",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSaveTask = async () => {
    if (!currentTask?.title) {
      toast({
        title: "Title is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (currentTask.id) {
        await taskService.updateTask(currentTask.id, {
          title: currentTask.title,
          description: currentTask.description,
          priority: currentTask.priority as TaskPriority,
          assignedTo: currentTask.assignedTo,
        });
        toast({
          title: "Task updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await taskService.createTask({
          title: currentTask.title,
          description: currentTask.description,
          status: currentTask.status || TaskStatus.TODO,
          priority: currentTask.priority as TaskPriority,
          assignedTo: currentTask.assignedTo,
          order: boardData[currentTask.status || TaskStatus.TODO].length,
        });
        toast({
          title: "Task created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      fetchTasks();
      onClose();
      setCurrentTask(null);
    } catch (error) {
      console.error("Failed to save task:", error);
      toast({
        title: "Error saving task",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Box p={4}>Loading tasks...</Box>;
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6} textAlign="center">
        Task Board
      </Heading>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "flex-start" }}
          overflowX="auto"
          pb={4}
        >
          {statusOrder.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={boardData[status]}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </Flex>
      </DndContext>

      {/* Task Edit/Create Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentTask?.id ? "Edit Task" : "Create Task"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Task title"
                value={currentTask?.title || ""}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)"
                value={currentTask?.description || ""}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, description: e.target.value }))}
              />
              <Select
                value={currentTask?.priority || TaskPriority.MEDIUM}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              >
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Assigned to (email)"
                value={currentTask?.assignedTo || ""}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, assignedTo: e.target.value }))}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveTask}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Board;