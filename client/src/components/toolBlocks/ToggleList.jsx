import { IconButton } from "@chakra-ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/layout";
import React, { useEffect, useRef, useState } from "react";

const firstLiContent = /(?<=^<li>)(.*?)(?=<\/li>)/;
const replaceRegexp = /&nbsp;|<br>/g;

function ToggleList({ children, html }) {
  const [isOpen, setIsOpen] = useState(false);
  const liTextRef = useRef(getFirstLiText());

  useEffect(() => {
    const newLiText = getFirstLiText();
    liTextRef.current = newLiText;
  }, []);

  const handleToggleClick = () => {
    liTextRef.current = getFirstLiText();
    setIsOpen(!isOpen);
  };

  function getFirstLiText() {
    const firstLiInner = html.match(firstLiContent);
    const replaced = firstLiInner[0].replaceAll(replaceRegexp, "");
    return replaced;
  }

  const firstItemText = liTextRef.current;

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
        {!isOpen ? (
          firstItemText ? (
            <Text>{firstItemText}</Text>
          ) : (
            <Text opacity={0.6} fontStyle="italic">
              unnamed toggle list, open and edit first line to change title {}
            </Text>
          )
        ) : null}
      </Flex>
      {isOpen && children}
    </Box>
  );
}

const ToggleListMemo = React.memo(ToggleList);
export default ToggleListMemo;
