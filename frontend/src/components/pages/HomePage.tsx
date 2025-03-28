import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import {
  Flex, IconButton, Button, Avatar, Text, Box,
  Drawer, DrawerBody, VStack, DrawerOverlay,
  DrawerContent, useDisclosure, Tooltip
} from '@chakra-ui/react';
import { NotAllowedIcon } from '@chakra-ui/icons';
import { User } from '../../types/user';
import { Profile } from '../profile/Profile';
import Breezycherryblossoms from '../design/Breezycherrybossoms';
import Particles from '../design/particles';
import Pattern from '../design/Pattern';
import Hexagon from '../design/Hexagon';
import ThemeSelector from '../selectors/ThemeSelector';
import BannerSelector from '../selectors/BannerSelector';

import Board from '../tasks/Board';

type BannerType = "Breezy" | "Particles" | "Pattern" | "Hexagon";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const [Banner, setBanner] = useState<BannerType>("Particles");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);

        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        authService.logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const storedBanner = localStorage.getItem('Banner') as BannerType;
    setBanner(storedBanner || 'Particles');
  }, [navigate]);

  const handleProfileSave = async (updatedUser: User) => {
    setUser(updatedUser);
  };

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
    <Flex bg="var(--light-color)" w="100vw" h="100vh">
      {user && (
        <Flex w={250} p={4} flexDirection="column" bg="var(--dark-color)" position="relative">
          <Flex mb={4} gap={2} alignItems="center">
            <Button onClick={onDrawerOpen} colorScheme="teal" variant="outline" _hover={{ bg: 'teal.400', color: "white" }}>
              View Profile
            </Button>
            <IconButton
              aria-label="Logout"
              variant="outline"
              colorScheme="teal"
              _hover={{ bg: 'teal.400', color: "white" }}
              onClick={handleLogout}
              icon={<NotAllowedIcon />}
            />
          </Flex>

          <Box userSelect="none" gap={6} display="flex" flexDirection="column" overflowY="auto">
            {users.map((test) => (
              <Tooltip key={test.email} label={test.email} aria-label="A tooltip">
                <Flex style={{ display: 'flex', alignItems: 'center', padding: '3px', gap: '6px' }}>
                  <Avatar name={`${test?.firstName} ${test?.lastName}`} />
                  <Text color="var(--font-color)">
                    {Capitalize(test?.firstName) + ' ' + Capitalize(test?.lastName)}
                    {test?.email === user.email ? ' (Me)' : ''}
                  </Text>
                </Flex>
              </Tooltip>
            ))}
          </Box>
        </Flex>
      )}
      <Box flex={1} p={20} overflowY="auto">
        <Board   />
      </Box>
      <ThemeSelector />

      <Drawer onClose={onDrawerClose} placement="left" isOpen={isDrawerOpen} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0} bg="var(--light-color)">
            <VStack gap={0} align="stretch">
              <Box w="100%" h="30vh" position="relative" bg="var(--dark-color)">
                <BannerSelector setBanner={setBanner} />
                {Banner === "Breezy" && <Breezycherryblossoms />}
                {Banner === "Particles" && <Particles />}
                {Banner === "Pattern" && <Pattern />}
                {Banner === "Hexagon" && <Hexagon />}
                <Box ml={5} bg="var(--light-color)" position="absolute" top="22vh" p={2} borderRadius="full">
                  <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                </Box>
              </Box>
              <Box>
                {user && <Profile user={user}  onSave={handleProfileSave} />}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default HomePage;
