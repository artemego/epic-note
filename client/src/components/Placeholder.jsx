import { Box, Text } from '@chakra-ui/layout';
import React from 'react';

export default function Placeholder() {
  return (
    <Box
      w="60%"
      margin="35vh auto"
      display="flex"
      alignItems="center"
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
