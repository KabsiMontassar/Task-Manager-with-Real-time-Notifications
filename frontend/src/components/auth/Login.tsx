import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Alert,
  AlertIcon,
  Text,
  useToast,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setError("");
    setLoading(true);

    try {
      console.log('Attempting login with:', formData);
      const response = await authService.login(formData);
      console.log('Login response:', response);

      // Verify we have both token and user
      if (!response.access_token || !response.user) {
        throw new Error("Invalid response from server");
      }

      // Verify token is stored and valid
      const token = localStorage.getItem('token');
      console.log('Stored token:', token);
      
      if (!token || !authService.isAuthenticated()) {
        throw new Error("Authentication verification failed");
      }

      toast({
        title: "Login successful!",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Use replace to prevent going back to login page
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to login. Please check your credentials."
      );
      
      // Clear any invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        p={8}
        borderRadius="md"
        boxShadow="lg"
        w="100%"
        maxW="400px"
      >
        <Heading mb={6} textAlign="center" size="lg">
          Login
        </Heading>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isDisabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isDisabled={loading}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={loading}
              loadingText="Logging in..."
            >
              Login
            </Button>

            <Text>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "teal" }}>
                Register here
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
