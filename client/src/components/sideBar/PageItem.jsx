import {
  CopyIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

// pageId - текущий выбранный id страницы
// page - объект с page.pageId и page.name
function PageItem({
  handlePageClick,
  handlePageDelete,
  page,
  pageId,
  isDeleting,
  deletingId,
}) {
  return (
    <Box
      onClick={(e) => {
        if (e.target.nodeName === "svg" || e.target.nodeName === "BUTTON")
          return;
        handlePageClick(page.pageId);
      }}
      p="15px 5px"
      ml="5px"
      w="100%"
      h="100%"
      display="flex"
      // bgColor="black"
    >
      {isDeleting && deletingId === page.pageId && (
        <Spinner color="red.500" position="absolute" right="50%" />
      )}
      <Heading
        fontSize="xl"
        color={pageId === page.pageId ? "orange.600" : ""}
        style={{ transition: ".2s ease-in-out" }}
        textDecor={pageId === page.pageId ? "underline" : ""}
        flexBasis="80%"
        maxWidth="80%"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {page.name}
      </Heading>
      <Box position="absolute" right="5px">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            size="xs"
            variant="outline"
            ml="auto"
          />
          <MenuList>
            <MenuItem
              onClick={() => {
                // console.log("clicked");
                handlePageDelete(page.pageId);
              }}
              icon={<DeleteIcon />}
              // onClick={handlePageDelete(page.id)}
            >
              Delete page
            </MenuItem>
            <MenuItem icon={<CopyIcon />}>Duplicate</MenuItem>
            <MenuItem icon={<EditIcon />}>Change name</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
}

export default React.memo(PageItem);
