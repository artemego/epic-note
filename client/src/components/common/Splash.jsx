import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";

export default function Splash() {
  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
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
