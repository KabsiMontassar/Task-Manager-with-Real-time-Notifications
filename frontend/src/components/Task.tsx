import { Card, Badge, CardBody, Text, Flex, Avatar, AvatarGroup, Box } from '@chakra-ui/react'
import { Task as TaskType } from '../types/task';

interface TaskWithUser extends TaskType {
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
}

interface TaskProps {
  dark: string;
  fontColor: string;
  task: TaskWithUser;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: () => void;
}

const Task = ({dark, fontColor, task, onDragStart, onDragEnd}: TaskProps) => {
  const userName = task.assignedToUser ? 
    `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}` : 
    'Unknown User';

  return (
    <Card 
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragEnd={onDragEnd}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.15)"} 
      bg={dark} 
      color={"#D8D8DB"}
    >
      <CardBody p={4} userSelect={"none"}>
        <Box mb={3} gap={2}>
          <Badge mx={1} colorScheme={task.priority === 'HIGH' ? 'red' : task.priority === 'MEDIUM' ? 'yellow' : 'teal'}>
            {task.priority}
          </Badge>
          {task.attachments?.length > 0 && (
            <Badge mx={1} colorScheme='blue'>Has Attachments</Badge>
          )}
          {task.dueDate && (
            <Badge mx={1} colorScheme='red'>Due {new Date(task.dueDate).toLocaleDateString()}</Badge>
          )}
        </Box>
        <Flex justifyContent={"space-between"}>
          <Text color={fontColor} noOfLines={1} fontSize="1.1rem">{task.title}</Text>
          <AvatarGroup color={"gray"} size='sm' max={2}>
            <Avatar name={userName} border={"none"} />
          </AvatarGroup>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Task