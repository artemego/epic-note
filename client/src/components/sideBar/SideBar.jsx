import { Button } from "@chakra-ui/button";
import {
  Box,
  Flex,
  Heading,
  Slide,
  useDisclosure,
  VStack,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as notesApi from "../../api/notesApi";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import objectId from "../../helpers/objectId";
import FolderTree from "./FolderTree";
import AddPageModal from "./AddPageModal";
import { useCallback } from "react";

export default function SideBar({ pageId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { isOpen, onToggle } = useDisclosure();
  const { logout } = useAuth();
  const { accessToken, email, isLoading: isAuthLoading } = useAuth().state;
  const history = useHistory();

  // react-query
  const { data, isLoading, refetch } = useQuery("pages", async () => {
    return await notesApi.getPages(accessToken);
  });

  const btnRef = React.useRef();
  const position = isOpen ? "sticky" : "fixed";

  const handleLogout = () => {
    logout();
  };

  const handlePageClick = useCallback(
    (pageId) => {
      history.push(`/${pageId}`);
    },
    [history]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalSaveClick = useCallback(
    async ({ pageTitle }) => {
      // add page запрос на сервер
      setIsFetching(true);
      const initialBlock = { _id: objectId(), tag: "p", html: "" };
      await notesApi.addPage(accessToken, pageTitle, initialBlock);
      setIsFetching(false);
      setIsModalOpen(false);
      refetch();
    },
    [accessToken, refetch]
  );

  const handlePageDelete = useCallback(
    async (pageId) => {
      // delete page запрос на сервер
      setIsDeleting(true);
      setDeletingId(pageId);
      // console.log("handlePageDelete, id: " + pageId);
      await notesApi.deletePage(accessToken, pageId);
      setIsDeleting(false);
      setDeletingId(null);
      refetch();
      // перенаправляем пользователя на placeholder страницу, если удаляется выбранная страница
      if (history.location.pathname === `/${pageId}`) history.push(`/`);
    },
    [accessToken, refetch]
  );

  // здесь мы просто наверное будем отсылать запрос на обновление страниц, на клиенте обновление уже произойдет в дереве, хотя хз
  const handleUpdatePages = useCallback(
    async (newTree) => {
      notesApi.updatePages(accessToken, newTree);
    },
    [accessToken]
  );

  return (
    <>
      <div style={{ position: "fixed", left: "5px", top: "5px", zIndex: 100 }}>
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
          overflowX="hidden"
        >
          <Box p={2.5} mr="5px" ml="5px" w="100%" position="relative">
            <Flex justifyContent="space-between" mb="10px">
              <Heading fontSize={28}>User Pages </Heading>
              <Button
                aria-label="Close Control Panel"
                onClick={handleLogout}
                colorScheme="orange"
                disabled={isAuthLoading}
                isLoading={isAuthLoading}
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
            <Divider orientation="horizontal" />
            <Box p="5px 0px" fontWeight="500" color="gray.600">
              Logged in as {email}
            </Box>
            <Divider orientation="horizontal" />
          </Box>
          {isLoading ? (
            <Spinner />
          ) : !data.pages.rootIds.length ? (
            <Box p="10px" height="100%" textAlign="center" color="gray.600">
              You have no pages, click <b>new page</b> button to create a new
              page
            </Box>
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
            <Heading fontSize="xl" ml="15px" overflow="hidden">
              New page
            </Heading>
          </Box>
        </VStack>
      </Slide>
    </>
  );
}
