import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
} from "@chakra-ui/react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

type Task = string;
type ColumnId = string;
interface BoardData {
  [columnId: ColumnId]: Task[];
}

const initialColumns: BoardData = {
  TODO: ["Design UI", "Write tests", "Fix bugs"],
  "IN PROGRESS": ["Implement feature"],
  DONE: ["Deploy to production"],
};

interface TaskProps {
  id: Task;
}

interface ColumnProps {
  id: ColumnId;
  items: Task[];
}

const statusColors: Record<ColumnId, string> = {
  TODO: "yellow",
  "IN PROGRESS": "blue",
  DONE: "green",
};

const Task: React.FC<TaskProps> = ({ id  }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      mb={2}
    >
      <Card
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="sm"
        _hover={{ boxShadow: "md" }}
      >
        <CardBody p={3}>
          {id}
        </CardBody>
      </Card>
    </Box>
  );
};

const Column: React.FC<ColumnProps> = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });
  const bgColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Box
      ref={setNodeRef}
      flex={1}
      minW="280px"
      mx={2}
      p={4}
      bg={bgColor}
      borderRadius="lg"
    >
      <Flex align="center" mb={4}>
        <Badge colorScheme={statusColors[id]} fontSize="md" px={3} py={1} borderRadius="full">
          {id}
        </Badge>
        <Box ml={2} fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
          ({items.length})
        </Box>
      </Flex>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Box>
          {items.map((item) => (
            <Task key={item} id={item} />
          ))}
        </Box>
      </SortableContext>
    </Box>
  );
};

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<BoardData>(initialColumns);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as Task;
    const overId = over.id as string; 

    const sourceColumn = Object.keys(columns).find((key) =>
      columns[key].includes(activeId)
    ) as ColumnId;

    if (!sourceColumn) return;

    const isOverColumn = Object.keys(columns).includes(overId);
    const destinationColumn = isOverColumn ? overId : 
      Object.keys(columns).find((key) => columns[key].includes(overId)) as ColumnId;

    if (!destinationColumn) return;

    if (sourceColumn === destinationColumn) {
      if (!isOverColumn) {
        const oldIndex = columns[sourceColumn].indexOf(activeId);
        const newIndex = columns[sourceColumn].indexOf(overId);

        if (oldIndex !== newIndex) {
          setColumns({
            ...columns,
            [sourceColumn]: arrayMove(columns[sourceColumn], oldIndex, newIndex),
          });
        }
      }
      return;
    }

    setColumns((prev) => {
      const newSourceItems = prev[sourceColumn].filter(
        (item) => item !== activeId
      );
      
      let newDestinationItems = [...prev[destinationColumn]];
      if (!isOverColumn) {
        const overIndex = prev[destinationColumn].indexOf(overId);
        newDestinationItems.splice(overIndex, 0, activeId);
      } else {
        newDestinationItems.push(activeId);
      }

      return {
        ...prev,
        [sourceColumn]: newSourceItems,
        [destinationColumn]: newDestinationItems,
      };
    });
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={6} textAlign="center">
        Task Board
      </Heading>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "flex-start" }}
          overflowX="auto"
          pb={4}
        >
          {Object.entries(columns).map(([id, items]) => (
            <Column key={id} id={id} items={items} />
          ))}
        </Flex>
      </DndContext>
    </Box>
  );
};

export default Board;