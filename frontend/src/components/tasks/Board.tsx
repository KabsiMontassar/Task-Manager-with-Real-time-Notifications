import React, { useState, useEffect, useCallback } from "react";
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
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
} from "@dnd-kit/sortable";
import { taskService } from "../../services/task.service";
import { Task as TaskType, TaskStatus, TaskPriority } from "../../types/task";
import Column from "./Column";
import { ArchiveZone } from "./ArchiveZone";
import { DeleteZone } from "./DeleteZone";
import { statusOrder } from "./Task.constants";
interface BoardData {
  [status: string]: TaskType[];
}




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
  const fetchTasks = useCallback(async () => {
    try {
      const tasks = await taskService.getAllTasks();
      const activeonly = tasks.filter(task => task.active == true);
      const groupedTasks = activeonly.reduce((acc, task) => {
        acc[task.status] = [...(acc[task.status] || []), task];
        return acc;
      }, { TODO: [], IN_PROGRESS: [], DONE: [] } as BoardData);

      setBoardData(groupedTasks);
    } catch (error) {
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
  }, [toast]);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);



  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = Object.values(boardData)
      .flat()
      .find((t) => t.id === active.id);
    if (task) {
      console.log("Task data for drag start:", task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (over.id === "delete-zone") {

      const confirmDelete = window.confirm("Are you sure you want to delete this task?");
      if (!confirmDelete) return;
      await handleDeleteTask(active.id as string);


      return;
    }

    if (over.id === "archive-zone") {
      const confirmArchive = window.confirm("Are you sure you want to archive this task?");
      if (!confirmArchive) return;
      await handleArchiveTask(active.id as string);
      return;
    }

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

      const newDestinationItems = [...prev[destinationColumn]];
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
      console.log("Moving task from", activeId, "to", destinationColumn);
      await taskService.updateTaskStatus(activeId, destinationColumn);
      await updateTaskOrders(boardData[destinationColumn]);
    } catch (error) {
      toast({
        title: "Error updating task",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      assignedTo: '',
      createdBy: '',
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

  const handleArchiveTask = async (id: string) => {
    try {
      await taskService.updateTaskActive(id);
      toast({
        title: "Task archived",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to archive task:", error);
      toast({
        title: "Error archiving task",
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
          dueDate: currentTask.dueDate ? new Date(currentTask.dueDate) : undefined,
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
          assignedTo: currentTask.assignedTo || '',
          order: boardData[currentTask.status || TaskStatus.TODO].length,
          dueDate: currentTask.dueDate ? new Date(currentTask.dueDate) : undefined,
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
      <Heading color="var(--font-color)" size="lg" mb={6} textAlign="center">
        Task Board
      </Heading>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
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
        <Flex direction="row" justify="space-around" mt={6}>
          <ArchiveZone onArchive={handleArchiveTask} />
          <DeleteZone onDelete={handleDeleteTask} />
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

              <Input
                type="date"
                value={currentTask?.dueDate ? new Date(currentTask.dueDate).toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setCurrentTask((prev) => ({
                    ...prev,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined,
                  }))
                }
                placeholder="Due Date"
                width="100%"
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