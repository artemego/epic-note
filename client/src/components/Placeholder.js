import { Box, Text } from "@chakra-ui/layout";
import React from "react";

export default function Placeholder() {
  return (
    <Box
      minH="100vh"
      w="60%"
      margin="35vh auto"
      display="flex"
      alignItems="center"
      // justifyContent="center"
      // h="40%"
      flexDir="column"
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
// .editor {
//   min-height: 100vh;
//   width: 60%;
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   flex-direction: column;
//   color: #2f3437;
//   margin: 1.5vh auto;
// }
