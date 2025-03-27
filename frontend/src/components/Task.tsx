import { Card, Badge, CardBody, Text, Flex, Avatar, AvatarGroup, Box } from '@chakra-ui/react'

const Task = () => {
  return (
    <Card boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.15)"} bg='#424249' color={"#D8D8DB"}>
      <CardBody userSelect={"none"}     >
        <Box mb={3} gap={2}>
          <Badge mx={1} colorScheme='teal'>LOW</Badge>
          <Badge mx={1} colorScheme='blue'>Has Attachements</Badge>
          <Badge mx={1} colorScheme='red'>Has Deadline</Badge>
        </Box>
        <Flex justifyContent={"space-between"}>
          <Text noOfLines={1} fontSize="1.1rem">Testing the Deployment</Text>
          <AvatarGroup color={"gray"} size='sm' max={2}>
            <Avatar name='Ryan Florence' border={"none"} src='https://bit.ly/ryan-florence' />
          </AvatarGroup>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Task