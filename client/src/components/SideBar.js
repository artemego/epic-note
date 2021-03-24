import { Button } from "@chakra-ui/button";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Slide,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";

// данные наверное получаем из notes
export default function SideBar({ pages }) {
  // Todo: это скорее всего нужно перенести в компонент выше
  const { isOpen, onToggle } = useDisclosure();
  const btnRef = React.useRef();

  const position = isOpen ? "relative" : "fixed";

  return (
    <>
      <div
        style={{ position: "absolute", left: "5px", top: "5px", zIndex: 100 }}
      >
        <Button ref={btnRef} colorScheme="orange" onClick={onToggle}>
          Pages
        </Button>
      </div>
      <Slide
        direction="left"
        in={isOpen}
        style={{
          height: "100vh",
          width: "300px",
          zIndex: 100,
          position: position,
        }}
      >
        <VStack
          color="black"
          bg="#F7F6F3"
          rounded="md"
          h="100vh"
          w="300px"
          overflowY="scroll"
        >
          <Box p={2.5} borderWidth="1px" m="5px" w="100%">
            <Flex justifyContent="space-between">
              <Heading fontSize={28}>User Pages </Heading>
              {/* <IconButton
                aria-label="Close Control Panel"
                onClick={onToggle}
                color="black"
              /> */}
              <Button
                aria-label="Close Control Panel"
                onClick={onToggle}
                colorScheme="orange"
              >
                Close
              </Button>
            </Flex>
          </Box>
          <Box
            p={2}
            borderWidth="1px"
            m="5px"
            w="100%"
            _hover={{ bg: "#E8E6E1", cursor: "pointer" }}
            style={{ transition: ".2s ease-in-out" }}
          >
            <Heading fontSize="xl">First page</Heading>
          </Box>
        </VStack>
      </Slide>
    </>
  );
}
