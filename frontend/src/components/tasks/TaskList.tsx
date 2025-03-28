import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  TaskStatus,
  TaskWithUser
} from '../../types/task';
import { taskService } from '../../services/task.service';
import { userService } from '../../services/user.service';
import { webSocketService } from '../../services/websocket.service';
import { TaskForm } from './TaskForm';
import { DraggableTask } from './DraggableTask';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

interface TaskListProps {
  light: string;
  dark: string;
  fontColor: string;
}

export const TaskList: React.FC<TaskListProps> = ({ light, dark, fontColor }) => {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<TaskWithUser | null>(null);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTasks();
    webSocketService.connect();

    const unsubscribeUpdate = webSocketService.onTaskUpdate((updatedTask) => {
      setTasks((prevTasks) => {
        const index = prevTasks.findIndex((t) => t.id === updatedTask.id);
        if (index === -1) {
          return [...prevTasks, updatedTask as TaskWithUser];
        }
        const newTasks = [...prevTasks];
        newTasks[index] = { ...updatedTask, assignedToUser: prevTasks[index].assignedToUser };
        return newTasks;
      });
    });

    const unsubscribeDelete = webSocketService.onTaskDelete((taskId) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeDelete();
      webSocketService.disconnect();
    };
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks();
      const tasksWithUsers = await Promise.all(
        fetchedTasks.map(async (task) => {
          try {
            const user = await userService.getUserByEmail(task.assignedTo);
            return {
              ...task,
              assignedToUser: {
                firstName: user.firstName,
                lastName: user.lastName,
              },
            };
          } catch (error) {
            console.error(`Error fetching user for task ${task.id}:`, error);
            return {
              ...task,
              assignedToUser: {
                firstName: 'Unknown',
                lastName: 'User',
              },
            };
          }
        })
      );
      setTasks(tasksWithUsers);
    } catch (error) {
      toast({
        title: 'Error loading tasks',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        toast({
          title: 'Task deleted successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error deleting task',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleEdit = (task: TaskWithUser) => {
    setSelectedTask(task);
    onOpen();
  };

  const handleFormSubmit = () => {
    onClose();
    setSelectedTask(null);
    loadTasks();
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Get the container (status column) where the task was dropped
    const overId = over.id as string;
    let newStatus: TaskStatus | undefined;

    // Check if dropped on a task or directly in a status column
    const overTask = tasks.find((task) => task.id === overId);
    if (overTask) {
      newStatus = overTask.status;
    } else {
      // If dropped directly in a status column, use that status
      newStatus = overId as TaskStatus;
    }

    if (!newStatus) return;

    // If task status has changed
    if (activeTask.status !== newStatus) {
      try {
        await taskService.updateTask(activeTask.id, {
          ...activeTask,
          status: newStatus
        });

        // Update local state
        setTasks(tasks.map(task => 
          task.id === activeTask.id 
            ? { ...task, status: newStatus }
            : task
        ));

        toast({
          title: 'Task status updated',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error updating task status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        loadTasks(); // Reload tasks to ensure consistency
      }
    } else if (active.id !== over.id) {
      // If tasks are in the same status column, handle reordering
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      try {
        await taskService.updateTaskOrder(active.id as string, newIndex);
      } catch (error) {
        toast({
          title: 'Error updating task order',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        loadTasks(); // Reload tasks to ensure consistency
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const statusColumns = [
    { title: 'To Do', status: TaskStatus.TODO, color: '#C68EFD' },
    { title: 'In Progress', status: TaskStatus.IN_PROGRESS, color: '#EB5B00' },
    { title: 'Completed', status: TaskStatus.DONE, color: '#8AB2A6' },
  ];

  return (
    <Box p={4}>
      <Heading mb={10} fontSize="1.5rem" color={fontColor}>
        Task Management
      </Heading>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {statusColumns.map(({ title, status, color }) => (
            <GridItem
              key={status}
              bg={light}
              p={3}
              borderRadius={5}
              h="70vh"
              id={status} // Add this to make the column droppable
            >
              <Heading mb={3} fontSize="1.2rem" textAlign="center" color={color}>
                {title}
              </Heading>
              <Flex direction="column" gap={5} h="94%" justifyContent="space-between">
                <Box flex="1" overflowY="auto">
                  <SortableContext
                    items={getTasksByStatus(status).map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {getTasksByStatus(status).map((task) => (
                      <DraggableTask
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        dark={dark}
                        fontColor={fontColor}
                      />
                    ))}
                  </SortableContext>
                </Box>
                {status === TaskStatus.TODO && (
                  <IconButton
                    aria-label="Add task"
                    icon={<AddIcon />}
                    onClick={onOpen}
                    colorScheme="teal"
                    variant="outline"
                  />
                )}
              </Flex>
            </GridItem>
          ))}
        </Grid>

        <DragOverlay>
          {activeId ? (
            <Box
              bg={dark}
              p={4}
              borderRadius="md"
              boxShadow="lg"
              opacity={0.8}
            >
              {tasks.find((task) => task.id === activeId)?.title}
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTask ? 'Edit Task' : 'Create Task'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TaskForm
              task={selectedTask || undefined}
              onSubmit={handleFormSubmit}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
