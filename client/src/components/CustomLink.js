import { Link as ChakraLink } from "@chakra-ui/layout";
import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ to, children }) {
  return (
    <ChakraLink>
      <Link to={to}>{children}</Link>
    </ChakraLink>
  );
}
