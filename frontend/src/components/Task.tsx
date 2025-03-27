import { Card, Badge, CardBody, Text, Flex, Avatar, AvatarGroup,Box } from '@chakra-ui/react'

const Task = () => {
  return (
    <Card bg='#424249' color={"#D8D8DB"}>

      <CardBody>
        <Box   mb={3} gap={2}>
          <Badge mx={1} colorScheme='teal'>LOW</Badge>
          <Badge  mx={1} colorScheme='blue'>Has Attachements</Badge>
          <Badge  mx={1} colorScheme='red'>Has Deadline</Badge>
        </Box>

        <Flex justifyContent={"space-between"}>
          <Text noOfLines={1} fontSize="1.5rem">Testing the Deployment</Text>
          <AvatarGroup color={"gray"} size='sm' max={2}>
            <Avatar name='Ryan Florence'  src='https://bit.ly/ryan-florence' />
            <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
            <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
            <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
            <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
          </AvatarGroup>

        </Flex>






      </CardBody>
    </Card>
  )
}

export default Task