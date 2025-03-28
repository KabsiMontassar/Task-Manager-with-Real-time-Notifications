import { Heading, Grid, GridItem, Flex, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Task from './Task'
import { Task as TaskType, TaskStatus } from '../types/task'
import { taskService } from '../services/task.service'
import { userService } from '../services/user.service'

interface BoardProps {
  light: string;
  dark: string;
  fontColor: string;
}

interface TaskWithUser extends TaskType {
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
}

const Board = ({ light, dark, fontColor }: BoardProps) => {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks();
      
      // Fetch user data for all tasks in parallel
      const tasksWithUsers = await Promise.all(
        fetchedTasks.map(async (task) => {
          try {
            const user = await userService.getUser(task.assignedTo);
            return {
              ...task,
              assignedToUser: {
                firstName: user.firstName,
                lastName: user.lastName
              }
            };
          } catch (error) {
            console.error(`Error fetching user for task ${task.id}:`, error);
            return {
              ...task,
              assignedToUser: {
                firstName: 'Unknown',
                lastName: 'User'
              }
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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      // Preserve the user data when updating the task
      const existingTask = tasks.find(t => t.id === taskId);
      if (existingTask) {
        const updatedTaskWithUser = {
          ...updatedTask,
          assignedToUser: existingTask.assignedToUser
        };
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? updatedTaskWithUser : task
          )
        );
      }
    } catch (error) {
      toast({
        title: 'Error updating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filterTasksByStatus = (status: TaskStatus) => 
    tasks.filter(task => task.status === status);

  return (
    <>
      <Heading mb={10} fontSize="1.5rem" color={fontColor}>Task Management</Heading>
      
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        <GridItem 
          w='100%' 
          h='70vh' 
          bg={light} 
          p={3} 
          borderRadius={5}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, TaskStatus.TODO)}
        >
          <Heading mb={3} fontSize="1.2rem" textAlign={"center"} color={"#C68EFD"}>Todos</Heading>
          <Flex direction="column" gap={5} h="100%">
            {filterTasksByStatus(TaskStatus.TODO).map(task => (
              <Task 
                key={task.id}
                dark={dark} 
                fontColor={fontColor}
                task={task}
                onDragStart={handleDragStart}
              />
            ))}
          </Flex>
        </GridItem>
        
        <GridItem 
          w='100%' 
          h='70vh' 
          bg={light} 
          p={3} 
          borderRadius={5}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, TaskStatus.IN_PROGRESS)}
        >
          <Heading mb={3} fontSize="1.2rem" textAlign={"center"} color={"#EB5B00"}>In Progress</Heading>
          <Flex direction="column" gap={5} h="100%">
            {filterTasksByStatus(TaskStatus.IN_PROGRESS).map(task => (
              <Task 
                key={task.id}
                dark={dark} 
                fontColor={fontColor}
                task={task}
                onDragStart={handleDragStart}
              />
            ))}
          </Flex>
        </GridItem>
        
        <GridItem 
          gap={50}  
          w='100%' 
          h='70vh' 
          bg={light} 
          p={3} 
          borderRadius={5}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, TaskStatus.DONE)}
        >
          <Heading mb={3} fontSize="1.2rem" textAlign={"center"} color={"#8AB2A6"}>Completed</Heading>
          <Flex direction="column" gap={5} h="100%">
            {filterTasksByStatus(TaskStatus.DONE).map(task => (
              <Task 
                key={task.id}
                dark={dark} 
                fontColor={fontColor}
                task={task}
                onDragStart={handleDragStart}
              />
            ))}
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default Board;
