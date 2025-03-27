import React, { useState } from 'react';
import { userService } from '../../services/user.service';
import { User } from '../../types/user';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Divider,
  VStack,
  useToast,
  Badge,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast({ title: 'Passwords do not match!', status: 'error', duration: 3000, isClosable: true });
          return;
        }
        await userService.updatePassword(formData.currentPassword, formData.newPassword);
      }

      await userService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      setIsEditing(false);
      toast({ title: 'Profile updated successfully!', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Failed to update profile', status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box  h="70vh" mx="auto" p={6} pt={2}>


      <Flex ml={40} justifyContent="space-between" mb={10}>

        <Box >
          <Badge colorScheme="green">{user?.role}</Badge>
        </Box>

        <Box>
          <IconButton
            aria-label={isEditing ? 'Cancel Edit' : 'Edit Profile'}
            icon={isEditing ? <CloseIcon /> : <EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
            colorScheme="teal"
            variant="outline"
          />
        </Box>

      </Flex>

      {isEditing ? (
        <VStack as="form" spacing={4} onSubmit={handleSubmit} align="stretch">
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormControl>

          <Divider />

          <Heading size="md">Change Password</Heading>

          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" alignSelf="flex-end">
            Save Changes
          </Button>
        </VStack>
      ) : (
        <VStack w={500} spacing={4} align="stretch">

          <Box>
            <Text fontSize="sm" color="gray.500">First Name</Text>
            <Text color="white" fontSize="lg">{user.firstName}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">Last Name</Text>
            <Text color="white" fontSize="lg">{user.lastName}</Text>
          </Box>


          <Box>
            <Text fontSize="sm" color="gray.500">Email</Text>
            <Text color="white" fontSize="lg">{user.email}</Text>
          </Box>


        </VStack>
      )}
    </Box>
  );
};

export default Profile;
