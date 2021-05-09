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
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import AddPageModal from "./AddPageModal";
import objectId from "../helpers/objectId";
import FolderTree from "./FolderTree";

export default function SideBar({ pageId }) {
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
  const position = isOpen ? "sticky" : "fixed";

  const handleLogout = () => {
    logout();
  };

  const handlePageClick = (pageId) => {
    history.push(`/${pageId}`);
  };

  // console.log("data: " + JSON.stringify(data));
  // if (!isLoading) {
  //   console.log(data.pages);
  // }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalSaveClick = async ({ pageTitle }) => {
    // add page запрос на сервер
    console.log("in handle add page");
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
    // console.log("handlePageDelete, id: " + pageId);
    await notesApi.deletePage(accessToken, pageId);
    setIsDeleting(false);
    setDeletingId(null);
    refetch();
    console.log("in delete page");
  };

  // здесь мы просто наверное будем отсылать запрос на обновление страниц, на клиенте обновление уже произойдет в дереве, хотя хз
  const handleUpdatePages = async (newTree) => {
    console.log("in update pages");
    notesApi.updatePages(accessToken, newTree);
  };

  return (
    <>
      <div style={{ position: "fixed", left: "5px", top: "5px", zIndex: 100 }}>
        <Button ref={btnRef} chcolorSeme="orange" onClick={onToggle}>
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
            <FolderTree
              handlePageClick={handlePageClick}
              handlePageDelete={handlePageDelete}
              pageId={pageId}
              isDeleting={isDeleting}
              deletingId={deletingId}
              handleUpdatePages={handleUpdatePages}
              pagesData={data.pages}
            />
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
