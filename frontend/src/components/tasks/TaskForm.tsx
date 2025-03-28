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
  task?: Task;
  onSubmit: () => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    assignedTo: '',
    createdBy: 'montassar@example.com',
  });

  const [error, setError] = useState<string>('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [userCheckTimeout, setUserCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate?.split('T')[0] || '',
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo || '',
        createdBy: task.createdBy,
      });
      // Validate the assigned user when editing
      if (task.assignedTo) {
        checkUserExists(task.assignedTo);
      }
    }
  }, [task]);

  const checkUserExists = async (email: string) => {
    if (!email) {
      setIsValidUser(false);
      return;
    }

    try {
      setIsCheckingUser(true);
      await userService.getUserByEmail(email);
      setIsValidUser(true);
    } catch (error) {
      setIsValidUser(false);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, assignedTo: email });

    // Clear any existing timeout
    if (userCheckTimeout) {
      clearTimeout(userCheckTimeout);
    }

    // Set a new timeout to check user after typing stops
    const timeout = setTimeout(() => {
      checkUserExists(email);
    }, 500);

    setUserCheckTimeout(timeout);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.assignedTo || !isValidUser) {
      setError('Please enter a valid user email');
      return false;
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      setError('Due date cannot be in the past');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (task) {
        await taskService.updateTask(task.id, formData);
      } else {
        await taskService.createTask(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setError('');
            }}
            placeholder="Enter task title"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description"
            rows={3}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Assigned To</FormLabel>
          <InputGroup>
            <Input
              type="email"
              value={formData.assignedTo}
              onChange={handleAssignedToChange}
              placeholder="Enter user email"
            />
            <InputRightElement>
              {isCheckingUser ? (
                <Spinner size="sm" />
              ) : formData.assignedTo ? (
                isValidUser ? (
                  <Tooltip label="User found">
                    <CheckIcon color="green.500" />
                  </Tooltip>
                ) : (
                  <Tooltip label="User not found">
                    <CloseIcon color="red.500" />
                  </Tooltip>
                )
              ) : null}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Due Date</FormLabel>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Priority</FormLabel>
          <Select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
          >
            {Object.values(TaskPriority).map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Status</FormLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
          >
            {Object.values(TaskStatus).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="flex-end" gap={4}>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue">
            {task ? 'Update' : 'Create'} Task
          </Button>
        </Box>
      </VStack>
    </form>
  );
};
