
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Flex, IconButton, Button, Avatar, Text } from '@chakra-ui/react'
import { NotAllowedIcon } from '@chakra-ui/icons';

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const Sidebar = ({ user }: { user: UserProfile }) => {

    const navigate = useNavigate();
    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };


    const Capitalize = (str?: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <Flex w={250} p={25} flexDirection={"column"} bg="#28282D" >

            <Flex mb={4} gap={2}>
                <Button w={"lg"}  _hover={{ bg: 'teal.400' , color:"white" }} colorScheme='teal' variant='outline'>
                    View Profile
                </Button>
                <IconButton aria-label='Search database'
                    variant='outline' colorScheme='teal'
                    _hover={{ bg: 'teal.400', color:"white" }}
                    onClick={handleLogout} icon={<NotAllowedIcon    />} />
            </Flex>

            <Flex style={{ display: 'flex', alignItems: 'center', padding: '10px', gap: '10px' }}>
                <Avatar bg='green.500' name={user?.firstName + ' ' + user?.lastName} />
                <Text color="#FCFCFC">{Capitalize(user?.firstName) + ' ' + Capitalize(user?.lastName)}</Text>
            </Flex>

        </Flex>
    )
}

export default Sidebar