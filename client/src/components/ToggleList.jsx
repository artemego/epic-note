import { IconButton } from "@chakra-ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/layout";
import React, { useState } from "react";

const firstLiContent = /(?<=^<li>)(.*?)(?=<\/li>)/;
const replaceRegexp = /&nbsp;|<br>/g;

export default function ToggleList({ children, html }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const getFirstItem = () => {
    const firstLiInner = html.match(firstLiContent);
    const replaced = firstLiInner[0].replaceAll(replaceRegexp, "");
    return replaced;
  };

  return (
    <Box w="100%">
      <Flex alignItems="center" justifyContent="flex-start">
        <IconButton
          colorScheme="orange"
          variant="outline"
          aria-label="Open list"
          size="xs"
          fontSize="17px"
          icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={handleToggleClick}
          mr="5px"
        />
        {isOpen || <Text>{getFirstItem()}</Text>}
      </Flex>
      {isOpen && children}
    </Box>
  );
}
