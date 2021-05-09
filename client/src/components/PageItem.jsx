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
export default function PageItem({
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
        if (e.target.nodeName === "svg") return;
        handlePageClick(page.pageId);
      }}
      p="5px"
      ml="5px"
      w="100%"
      h="100%"
      display="flex"
    >
      {isDeleting && deletingId === page.pageId && (
        <Spinner color="red.500" position="absolute" right="50%" />
      )}
      <Heading
        fontSize="xl"
        color={pageId === page.pageId ? "orange.600" : ""}
        style={{ transition: ".2s ease-in-out" }}
        textDecor={pageId === page.pageId ? "underline" : ""}
      >
        {page.name}
      </Heading>
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
  );
}
