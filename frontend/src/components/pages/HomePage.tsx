import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import Sidebar from '../Sidebar';
import Board from '../Board';
import { Flex,Box } from '@chakra-ui/react'


interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        authService.logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);


  if (loading) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <Flex  bg="#333339" w="100vw"  h="100vh">
      {user && <Sidebar user={user} />}
      <Box flex={1} p={20} overflowY={"auto"} >
        <Board />
      </Box>
    </Flex>
  );
};

export default HomePage;
