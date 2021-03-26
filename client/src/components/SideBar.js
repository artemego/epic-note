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
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import * as notesApi from "../api/notesApi";
import { useQuery } from "react-query";
import { useHistory } from "react-router";

export default function SideBar() {
  const { isOpen, onToggle } = useDisclosure();
  const { logout } = useAuth();
  const { accessToken } = useAuth().state;
  const history = useHistory();

  // react-query
  const { data, error, isLoading, isError } = useQuery("pages", async () => {
    return await notesApi.getPages(accessToken);
  });

  const btnRef = React.useRef();
  const position = isOpen ? "relative" : "fixed";

  const handleLogout = () => {
    logout();
  };

  const handlePageClick = (pageId) => {
    history.push(`/${pageId}`);
  };

  console.log("data: " + data);
  if (!isLoading) {
    console.log(data.pages);
  }

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
          <Box p={2.5} mr="5px" ml="5px" w="100%">
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
              <Button
                aria-label="Close Control Panel"
                onClick={handleLogout}
                colorScheme="orange"
              >
                Logout
              </Button>
            </Flex>
          </Box>
          {isLoading ? (
            <Spinner />
          ) : (
            data.pages.map((page) => (
              <Box
                onClick={() => {
                  console.log(page.pageId);
                  handlePageClick(page.pageId);
                }}
                p={2}
                borderWidth="1px"
                m="5px"
                w="100%"
                _hover={{ bg: "#E8E6E1", cursor: "pointer" }}
                style={{ transition: ".2s ease-in-out" }}
              >
                <Heading fontSize="xl">{page.name}</Heading>
              </Box>
            ))
          )}
        </VStack>
      </Slide>
    </>
  );
}
