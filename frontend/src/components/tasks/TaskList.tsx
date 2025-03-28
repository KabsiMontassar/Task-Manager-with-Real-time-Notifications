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
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

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
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
      console.error('Error loading tasks:', error);
      toast({
        title: 'Error loading tasks',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);

   

  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;


  
    if (!over) return;
    console.log(over.id)
    console.log(active.id)
    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
  
    if (!task) return;
  
    if (over.id === 'delete-zone') {
      setTaskToDelete(taskId);
      setIsDeleteAlertOpen(true);
      return;
    }
  
    const newStatus = TASK_STATUSES.find((status) => status === over.id);
    if (!newStatus || task.status === newStatus) return;
  
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
      toast({
        title: 'Task status updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error updating task status',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  
    setActiveId(null);
  };
  

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await taskService.deleteTask(taskToDelete);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskToDelete));
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error deleting task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsDeleteAlertOpen(false);
    setTaskToDelete(null);
  };

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg" color={fontColor}>Tasks</Heading>
        <IconButton
          aria-label="Add task"
          icon={<AddIcon />}
          onClick={() => {
            setSelectedTask(null);
            onOpen();
          }}
          colorScheme="blue"
        />
      </Flex>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={4}>
          {TASK_STATUSES.map((status) => (
            <GridItem
              key={status}
              bg={light}
              p={4}
              borderRadius="lg"
              minH="400px"
              id={status}
            >
              <Heading size="md" mb={4} color={fontColor}>
                {status.replace(/_/g, ' ')}
              </Heading>
              <SortableContext
                items={tasks.filter((t) => t.status === status).map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      light={light}
                      dark={dark}
                      fontColor={fontColor}
                    />
                  ))}
              </SortableContext>
            </GridItem>
          ))}
        </Grid>

        <Box
          bg={useColorModeValue('red.100', 'red.900')}
          p={4}
          borderRadius="lg"
          textAlign="center"
          id="delete-zone"
          border="2px dashed"
          borderColor={useColorModeValue('red.300', 'red.600')}
          _hover={{ bg: useColorModeValue('red.200', 'red.800') }}
        >
          <Flex alignItems="center" justifyContent="center" color={fontColor}>
            <DeleteIcon mr={2} />
            Drop here to delete task
          </Flex>
        </Box>

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
        <ModalContent bg={light}>
          <ModalHeader color={fontColor}>
            {selectedTask ? 'Edit Task' : 'Create Task'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TaskForm
              task={selectedTask}
              onSubmit={() => {
                onClose();
                loadTasks();
              }}
              light={light}
              fontColor={fontColor}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setIsDeleteAlertOpen(false);
          setTaskToDelete(null);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={light}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={fontColor}>
              Delete Task
            </AlertDialogHeader>

            <AlertDialogBody color={fontColor}>
              Are you sure you want to delete this task?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setIsDeleteAlertOpen(false);
                  setTaskToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
