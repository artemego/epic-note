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
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as notesApi from "../api/notesApi";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import {
  AddIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import AddPageModal from "./AddPageModal";
import objectId from "../helpers/objectId";

export default function SideBar({ pageId }) {
  // Todo: можно здесь добавить error state
  // Todo: можно заменить на mutation из react-query
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { isOpen, onToggle } = useDisclosure();
  const { logout } = useAuth();
  const { accessToken } = useAuth().state;
  const history = useHistory();

  // react-query
  const { data, error, isLoading, isError, refetch } = useQuery(
    "pages",
    async () => {
      return await notesApi.getPages(accessToken);
    }
  );

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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalSaveClick = async ({ pageTitle }) => {
    // add page запрос на сервер
    setIsFetching(true);
    const initialBlock = { _id: objectId(), tag: "p", html: "" };
    await notesApi.addPage(accessToken, pageTitle, initialBlock);
    setIsFetching(false);
    setIsModalOpen(false);
    refetch();
  };

  const handlePageDelete = async (pageId) => {
    // delete page запрос на сервер
    setIsDeleting(true);
    setDeletingId(pageId);
    console.log(pageId);
    await notesApi.deletePage(accessToken, pageId);
    setIsDeleting(false);
    setDeletingId(null);
    refetch();
  };

  return (
    <>
      <div
        style={{ position: "absolute", left: "5px", top: "5px", zIndex: 100 }}
      >
        <Button ref={btnRef} colorScheme="orange" onClick={onToggle}>
          Pages <ArrowRightIcon ml="10px" />
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
          <Box p={2.5} mr="5px" ml="5px" w="100%" position="relative">
            <Flex justifyContent="space-between">
              <Heading fontSize={28}>User Pages </Heading>
              <Button
                aria-label="Close Control Panel"
                onClick={handleLogout}
                colorScheme="orange"
              >
                Logout
              </Button>
              <Button
                aria-label="Close Control Panel"
                onClick={onToggle}
                colorScheme="orange"
                ml="5px"
              >
                Close
                <ArrowLeftIcon ml="10px" />
              </Button>
            </Flex>
          </Box>
          {isLoading ? (
            <Spinner />
          ) : (
            data.pages.map((page) => (
              <Box
                onClick={(e) => {
                  // debugger;
                  if (e.target.nodeName === "svg") return;
                  console.log(page.pageId);
                  handlePageClick(page.pageId);
                }}
                p={2}
                borderWidth="1px"
                m="5px"
                w="100%"
                display="flex"
                _hover={{ bg: "#E8E6E1", cursor: "pointer" }}
                style={{ transition: ".2s ease-in-out" }}
                justifyContent="space-between"
                key={page.pageId}
              >
                {isDeleting && deletingId === page.pageId && (
                  <Spinner color="red.500" position="absolute" right="50%" />
                )}
                <Heading fontSize="xl">{page.name}</Heading>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HamburgerIcon />}
                    size="xs"
                    variant="outline"
                  />
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        // console.log("clicked");
                        handlePageDelete(page.pageId);
                      }}
                      icon={<DeleteIcon />}
                      command="⌘T"
                      // onClick={handlePageDelete(page.id)}
                    >
                      Delete page
                    </MenuItem>
                    <MenuItem icon={<CopyIcon />} command="⌘N">
                      Duplicate
                    </MenuItem>
                    <MenuItem icon={<EditIcon />} command="⌘N">
                      Change name
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            ))
          )}

          <AddPageModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleModalSaveClick}
            isLoading={isFetching}
          />

          <Box
            onClick={handleModalOpen}
            p={2}
            borderWidth="1px"
            m="5px"
            w="100%"
            _hover={{ bg: "#E8E6E1", cursor: "pointer" }}
            style={{ transition: ".2s ease-in-out" }}
            position="fixed"
            bottom="0px"
            left="0px"
            h="65px"
            display="flex"
            alignItems="center"
          >
            <AddIcon />
            <Heading fontSize="xl" ml="15px">
              New page
            </Heading>
          </Box>
        </VStack>
      </Slide>
    </>
  );
}
