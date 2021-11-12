import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";

export default function Splash() {
  return (
    <Box
      h="100%"
      w="100%"
      alignItems="center"
      justifyContent="center"
      display="inline-flex"
      boxSizing="border-box"
    >
      <Spinner
        color="orange"
        size="xl"
        emptyColor="gray.200"
        thickness="4px"
        speed="0.65s"
      />
    </Box>
  );
}
