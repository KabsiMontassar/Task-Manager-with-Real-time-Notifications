import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import { TaskList } from '../tasks/TaskList';
import {
  Flex, IconButton, Button, Avatar, Text, Box,
  Drawer, DrawerBody, VStack, DrawerOverlay,
  DrawerContent, useDisclosure
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
import { themes } from '../design/Themes';

import Board from '../tasks/Board';

type ThemeType = 'Light' | 'Ash' | 'Dark' | 'Oxyn';
type BannerType = "Breezy" | "Particles" | "Pattern" | "Hexagon";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const [theme, setTheme] = useState<ThemeType>('Light');
  const [dark, setDark] = useState<string>(themes[theme].dark || '#28282D');
  const [light, setLight] = useState<string>(themes[theme].light || '#333339');
  const [fontColor, setFontColor] = useState<string>('#D8D8DB');
  const [Banner, setBanner] = useState<BannerType>("Particles");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);

        // const allUsers = await userService.getAllUsers();
        // setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        authService.logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const storedTheme = localStorage.getItem('theme') as ThemeType;
    const storedBanner = localStorage.getItem('Banner') as BannerType;
    setBanner(storedBanner || 'Particles');

    setTheme(storedTheme || 'Light');
    setDark(themes[theme]?.dark || '#28282D');
    setLight(themes[theme]?.light || '#333339');
    setFontColor(themes[theme]?.fontColor || '#D8D8DB');
  }, [navigate, theme]);

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
    <Flex bg={light} w="100vw" h="100vh">
      {user && (
        <Flex w={250} p={25} flexDirection={"column"} bg={dark} position="relative">
          <Flex mb={4} gap={2} alignItems="center">
            <Button w={"lg"} _hover={{ bg: 'teal.400', color: "white" }}
              onClick={onDrawerOpen} colorScheme='teal' variant='outline'>
              View Profile
            </Button>
            <IconButton
              aria-label='Logout'
              variant='outline' colorScheme='teal'
              _hover={{ bg: 'teal.400', color: "white" }}
              onClick={handleLogout} icon={<NotAllowedIcon />} />
          </Flex>

          <Flex style={{ display: 'flex', alignItems: 'center', padding: '3px', gap: '6px' }}>
            <Avatar bg='green.500' name={user?.firstName + ' ' + user?.lastName} />
            <Text color={fontColor}>{Capitalize(user?.firstName) + ' ' + Capitalize(user?.lastName)} ( Me ) </Text>
          </Flex>
        </Flex>
      )}

      <Box flex={1} p={20} overflowY={"auto"}>
        <Board  />
      </Box>

      <ThemeSelector setTheme={setTheme} />

      <Drawer onClose={onDrawerClose} placement='left' isOpen={isDrawerOpen} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0} bg={light}>
            <VStack gap={0} align='stretch'>
              <Box w={"100%"} h={"30vh"} position={"relative"} bg={dark}>
                <BannerSelector setBanner={setBanner} />

                {Banner === "Breezy" && <Breezycherryblossoms />}
                {Banner === "Particles" && <Particles />}
                {Banner === "Pattern" && <Pattern />}
                {Banner === "Hexagon" && <Hexagon />}
                
                <Box ml={5} bg={light} position="absolute" top="22vh" p={2} borderRadius="full">
                  <Avatar size="2xl" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                </Box>
              </Box>
              <Box>
                {user && <Profile user={user} light={dark} dark={light} fontColor={fontColor} />}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default HomePage;
