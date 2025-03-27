import {  Heading, Grid, GridItem, Flex } from '@chakra-ui/react'
import Task from './Task'
const Board = () => {
  return (
    <>
      <Heading mb={10} fontSize="1.5rem" color={"#FCFCFC"}>TaskManagement</Heading>
      
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        <GridItem  w='100%' h='70vh' bg='#37373E' p={3} borderRadius={5} border={"1px solid #424249"}>
          <Heading mb={3} fontSize="1.2rem" textAlign={"center"} color={"#C68EFD"}>Todos</Heading>
          <Flex direction="column" gap={5}  h="100%">
            <Task />
            <Task />
          </Flex>

        
        </GridItem>
        
        <GridItem w='100%' h='70vh' bg='#37373E' p={3} borderRadius={5} border={"1px solid #424249"}>
          <Heading mb={3} fontSize="1.2rem" textAlign={"center"} color={"#EB5B00"}>In Progress</Heading>
          <Flex direction="column" gap={5}  h="100%">
            <Task />
            <Task />
          </Flex>
        </GridItem>
        
        <GridItem gap={50}  w='100%' h='70vh' bg='#37373E' p={3} borderRadius={5} border={"1px solid #424249"}>
          <Heading mb={3} fontSize="1.2rem" textAlign={"center"} color={"#8AB2A6"}>Completed</Heading>
          <Flex direction="column" gap={5}  h="100%">
            <Task />
            <Task />
          </Flex>
       
        </GridItem>
      </Grid>
    </>
  );
};

export default Board;
