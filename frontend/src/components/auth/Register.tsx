import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  Spinner,
  Text,
  Link,
  VStack
} from '@chakra-ui/react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      await authService.register(formData);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Type-safe error handling
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to register');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" bg="gray.100">
      <Box bg="white" p={6} boxShadow="lg" borderRadius="md" width="100%" maxW="400px">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Register
        </Text>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </FormControl>

       

            <Button type="submit" colorScheme="teal" width="100%" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Register'}
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" mt={4}>
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="teal.500">
            Login
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
