import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { taskService } from '../../services/task.service';
import { userService } from '../../services/user.service';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Box,
  InputGroup,
  InputRightElement,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

interface TaskFormProps {
  task: Task | null;
  onSubmit: () => void;
  light: string;
  fontColor: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSubmit,
  light,
  fontColor
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    id: task?.id || '',
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task?.priority || TaskPriority.MEDIUM,
    status: task?.status || TaskStatus.TODO,
    assignedTo: task?.assignedTo || '',
    createdBy: task?.createdBy || '',
    attachments: task?.attachments || [],
    comments: task?.comments || [],
    createdAt: task?.createdAt || new Date().toISOString(),
    updatedAt: task?.updatedAt || new Date().toISOString(),
  });

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        setFormData(prev => ({
          ...prev,
          createdBy: prev.createdBy || currentUser.email
        }));
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (!task) {
      initializeUser();
    }
  }, [task]);

  const [error, setError] = useState<string>('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [userCheckTimeout, setUserCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (formData.assignedTo) {
      validateUser(formData.assignedTo);
    }
  }, []);

  const validateUser = async (email: string) => {
    if (!email) {
      setIsValidUser(false);
      return;
    }

    setIsCheckingUser(true);
    try {
      const user = await userService.getUserByEmail(email);
      setIsValidUser(user && user.email === email);
    } catch (error) {
      setIsValidUser(false);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'assignedTo') {
      setIsValidUser(false);
      if (userCheckTimeout) {
        clearTimeout(userCheckTimeout);
      }
      const timeoutId = setTimeout(() => validateUser(value), 500);
      setUserCheckTimeout(timeoutId);
    }

    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.assignedTo?.trim()) {
      setError('Assigned user is required');
      return;
    }

    if (!isValidUser) {
      setError('Please enter a valid user email');
      return;
    }

    try {
      const taskData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      } as Task;

      if (task?.id) {
        await taskService.updateTask(task.id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      onSubmit();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel color={fontColor}>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            bg={light}
            color={fontColor}
          />
        </FormControl>

        <FormControl>
          <FormLabel color={fontColor}>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            bg={light}
            color={fontColor}
          />
        </FormControl>

        <FormControl>
          <FormLabel color={fontColor}>Due Date</FormLabel>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            bg={light}
            color={fontColor}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color={fontColor}>Priority</FormLabel>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            bg={light}
            color={fontColor}
          >
            {Object.values(TaskPriority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel color={fontColor}>Status</FormLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            bg={light}
            color={fontColor}
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel color={fontColor}>Assign To (Email)</FormLabel>
          <InputGroup>
            <Input
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              bg={light}
              color={fontColor}
            />
            <InputRightElement>
              {isCheckingUser ? (
                <Spinner size="sm" />
              ) : formData.assignedTo ? (
                isValidUser ? (
                  <Tooltip label="Valid user">
                    <CheckIcon color="green.500" />
                  </Tooltip>
                ) : (
                  <Tooltip label="Invalid user">
                    <CloseIcon color="red.500" />
                  </Tooltip>
                )
              ) : null}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button type="submit" colorScheme="teal" isLoading={isCheckingUser}>
          {task?.id ? 'Update Task' : 'Create Task'}
        </Button>
      </VStack>
    </Box>
  );
};
