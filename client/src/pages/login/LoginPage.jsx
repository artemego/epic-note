import { Box, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import CustomLink from "../../components/CustomLink";
import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <Box title="loginPage">
      <Box textAlign="center" mt="4rem">
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
