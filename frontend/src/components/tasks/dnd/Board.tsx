// src/components/tasks/dnd/Board.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
  IconButton,
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
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { taskService } from "../../../services/task.service";
import { Task as TaskType, TaskStatus } from "../../../types/task";

interface BoardData {
  [status: string]: TaskType[];
}

const statusOrder: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

const statusColors: Record<TaskStatus, string> = {
  TODO: "yellow",
  IN_PROGRESS: "blue",
  DONE: "green",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

interface ColumnProps {
  status: TaskStatus;
  tasks: TaskType[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (id: string) => void;
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
          <Flex justify="space-between" align="center">
            <Text>{task.title}</Text>
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
        </CardBody>
      </Card>
    </Box>
  );
};

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

export const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTask, setCurrentTask] = useState<Partial<TaskType> | null>(null);

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
      
      // Sort tasks by order within each status
      Object.keys(groupedTasks).forEach(status => {
        groupedTasks[status as TaskStatus].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      });

      setBoardData(groupedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source column
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

    // Moving within the same column (sorting)
    if (sourceColumn === destinationColumn) {
      if (!isOverColumn) {
        const oldIndex = boardData[sourceColumn].findIndex(t => t.id === activeId);
        const newIndex = boardData[sourceColumn].findIndex(t => t.id === overId);

        if (oldIndex !== newIndex) {
          const newItems = arrayMove(boardData[sourceColumn], oldIndex, newIndex);
          
          // Update local state first for responsiveness
          setBoardData(prev => ({
            ...prev,
            [sourceColumn]: newItems,
          }));

          // Update order in backend
          await updateTaskOrders(newItems);
        }
      }
      return;
    }

    // Moving to a different column
    const taskToMove = boardData[sourceColumn].find(t => t.id === activeId);
    if (!taskToMove) return;

    // Update local state first for responsiveness
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

    // Update status and order in backend
    try {
      await taskService.updateTaskStatus(activeId, destinationColumn);
      await updateTaskOrders(boardData[destinationColumn]);
    } catch (error) {
      console.error("Failed to update task:", error);
      // Revert on error
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
    setCurrentTask({ status });
    onOpen();
  };

  const handleEditTask = (task: TaskType) => {
    setCurrentTask(task);
    onOpen();
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSaveTask = async () => {
    if (!currentTask?.title) return;

    try {
      if (currentTask.id) {
        await taskService.updateTask(currentTask.id, {
          title: currentTask.title,
          description: currentTask.description,
        });
      } else {
        await taskService.createTask({
          title: currentTask.title,
          description: currentTask.description,
          status: currentTask.status || TaskStatus.TODO,
          order: boardData[currentTask.status || "TODO"].length,
        });
      }
      fetchTasks();
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
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
            <Input
              placeholder="Task title"
              value={currentTask?.title || ""}
              onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
              mb={4}
            />
            <Input
              placeholder="Description (optional)"
              value={currentTask?.description || ""}
              onChange={(e) => setCurrentTask(prev => ({ ...prev, description: e.target.value }))}
            />
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