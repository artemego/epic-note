import { Box, Text } from "@chakra-ui/layout";
import React from "react";

export default function Placeholder() {
  return (
    <Box
      h="100vh"
      w="60%"
      margin="0 auto"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      textAlign="center"
    >
      <Text color="orange.400" as="h2" fontSize="35px">
        No page selected
      </Text>
      <Text as="p" fontSize="35px">
        Please select or add a page.
      </Text>
    </Box>
  );
}
