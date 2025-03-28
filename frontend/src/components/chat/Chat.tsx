import  { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chat.service';
import {
   Input, VStack, Text,
  IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent,
  DrawerHeader, DrawerBody, Flex, Spacer, FormControl, InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { ChatIcon, ArrowRightIcon } from '@chakra-ui/icons';

export const Chat = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.onMessage((newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    chatService.onUserConnected((user) => {
      setActiveUsers((prev) => [...prev, user]);
    });

    chatService.onUserDisconnected((user) => {
      setActiveUsers((prev) => prev.filter((u) => u !== user));
    });

    chatService.getActiveUsers(setActiveUsers);

    return () => {
      chatService.onError(() => {});
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const sender = localStorage.getItem('username') || 'Guest';

    try {
      await chatService.sendMessage({ sender, content: message });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <>
      <IconButton
        icon={<ChatIcon />}
        aria-label="Open Chat"
        position="fixed"
        bottom="20px"
        right="20px"
        size="lg"
        colorScheme="teal"
        borderRadius="full"
        boxShadow="lg"
        onClick={onOpen}
        _hover={{ transform: 'scale(1.1)', transition: '0.2s' }}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent  >
        <DrawerHeader borderBottomWidth="2px" color="var(--font-color)"  bg="var(--dark-color)" fontSize="xl" textAlign="center">Chat Room</DrawerHeader>
          <DrawerBody bg="var(--light-color)" color="var(--font-color)" display="flex" flexDirection="column" p={4}>
            <VStack align="stretch" spacing={4} flex={1} overflowY="auto" maxH="400px">
              {messages.map((msg, index) => (
                <Flex
                  key={index}
                  alignSelf={msg.sender === localStorage.getItem('username') ? 'flex-end' : 'flex-start'}
                  bg={msg.sender === localStorage.getItem('username') ? 'teal.500' : 'gray.700'}
                 
                  px={4}
                  py={2}
                  borderRadius={"xl"}
                  maxW="80%"
                >
                  <Text fontSize="sm">{msg.content}</Text>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </VStack>

            <Spacer />

            <FormControl>
              <InputGroup >
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  variant="filled"
                  bg="var(--dark-color)"
                  color="var(--font-color)"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500',  bg: 'var(--dark-color)'  }}
                  _hover={{ bg: 'var(--dark-color)' }}
                  borderRadius="full"
                 
                  
                />
                <InputRightElement>
                  <IconButton
                    icon={<ArrowRightIcon />}
                    aria-label="Send Message"
                    colorScheme="teal"
                    onClick={sendMessage}
                    isRound
                    disabled={!message.trim()}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};