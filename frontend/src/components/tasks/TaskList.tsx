import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  TaskStatus,
  TaskWithUser,
  Task
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

const TASK_STATUSES: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

export const TaskList: React.FC<TaskListProps> = ({ light, dark, fontColor }) => {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const overId = String(over.id);
    const newStatus = TASK_STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((task) => task.id === overId)?.status;

    if (!newStatus || activeTask.status === newStatus) return;

    try {
      await taskService.updateTask(activeTask.id, {
        ...activeTask,
        status: newStatus
      });

      setTasks(tasks.map(task =>
        task.id === activeTask.id
          ? { ...task, status: newStatus }
          : task
      ));

      toast({
        title: 'Task updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating task',
        description: 'Failed to update task status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <Box p={5}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {TASK_STATUSES.map((status) => (
            <GridItem
              key={status}
              bg={light}
              p={4}
              borderRadius="lg"
              minH="70vh"
              id={status}
              data-droppable="true"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md" color={fontColor}>
                  {status.replace('_', ' ')}
                </Heading>
                <IconButton
                  aria-label="Add task"
                  icon={<AddIcon />}
                  onClick={() => {
                    setSelectedTask({ status } as Task);
                    onOpen();
                  }}
                  size="sm"
                  colorScheme="teal"
                />
              </Flex>
              <Box minH="200px">
                <SortableContext
                  items={getTasksByStatus(status).map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {getTasksByStatus(status).map((task) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task.id)}
                      light={light}
                      dark={dark}
                      fontColor={fontColor}
                    />
                  ))}
                </SortableContext>
              </Box>
            </GridItem>
          ))}
        </Grid>

        <DragOverlay>
          {activeId ? (
            <Box
              bg={light}
              p={4}
              borderRadius="md"
              boxShadow="lg"
              opacity={0.8}
            >
              {tasks.find(task => task.id === activeId)?.title}
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={light}>
          <ModalHeader color={fontColor}>
            {selectedTask?.id ? 'Edit Task' : 'New Task'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TaskForm
              task={selectedTask}
              onSubmit={handleFormSubmit}
              light={light}
              fontColor={fontColor}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
