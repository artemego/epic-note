import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import React from "react";
// onButtonClick будет менять свойство counter в state
export default function ButtonBlock({ counter, onButtonClick }) {
  return (
    <Box ml={"5px"}>
      <Button colorScheme="orange" onClick={onButtonClick}>
        {counter}
      </Button>
    </Box>
  );
}
