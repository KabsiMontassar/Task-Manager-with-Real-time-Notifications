import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import Board from '../Board';
import {
  Flex, IconButton, Button, Avatar, Text, Box,
  Drawer, DrawerBody, VStack, DrawerOverlay,
  DrawerContent, useDisclosure
} from '@chakra-ui/react';
import { NotAllowedIcon } from '@chakra-ui/icons';
import { User } from '../../types/user';
import { Profile } from '../profile/Profile';
import Breezycherryblossoms from '../design/Breezycherrybossoms';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const Capitalize = (str?: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Flex bg="#333339" w="100vw" h="100vh">
      {user && (
        <Flex w={250} p={25} flexDirection={"column"} bg="#28282D" position="relative">
          <Flex mb={4} gap={2} alignItems="center">
            <Button w={"lg"} _hover={{ bg: 'teal.400', color: "white" }}
              onClick={onOpen} colorScheme='teal' variant='outline'>
              View Profile
            </Button>
            <IconButton
              aria-label='Logout'
              variant='outline' colorScheme='teal'
              _hover={{ bg: 'teal.400', color: "white" }}
              onClick={handleLogout} icon={<NotAllowedIcon />} />
          </Flex>

          <Flex alignItems="center" justifyContent="center" gap={2} position="absolute" top="15vh" left="50%" transform="translateX(-50%)">
            <Avatar bg='green.500' name={user?.firstName + ' ' + user?.lastName} />
            <Text color="#FCFCFC" fontSize="lg">{Capitalize(user?.firstName) + ' ' + Capitalize(user?.lastName)}</Text>
          </Flex>
        </Flex>
      )}
      <Box flex={1} p={20} overflowY={"auto"}>
        <Board />
      </Box>

      <Drawer onClose={onClose} placement='left' isOpen={isOpen} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0} bg="#333339">
            <VStack gap={0} align='stretch'>
              <Box w={"100%"} h={"30vh"} position={"relative"} bg='tomato'>
                <Breezycherryblossoms />

                <Box ml={5} bg="#333339" position="absolute" top="22vh" p={2} borderRadius="full">
                  <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                
                </Box>
              </Box>
              <Box>
                {user && <Profile user={user} />}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default HomePage;
