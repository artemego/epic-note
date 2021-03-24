import { Box, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { Link } from "react-router-dom";
import CustomLink from "../../components/CustomLink";
import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <Box>
      <Box textAlign="center">
        <Heading>Sing in to your account</Heading>
        <Text>
          Or <CustomLink to={"/register"}>Go to register page</CustomLink>
        </Text>
      </Box>

      <LoginForm />
    </Box>
  );
};

export default LoginPage;
