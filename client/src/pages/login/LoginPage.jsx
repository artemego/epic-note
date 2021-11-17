import { Box, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import CustomLink from "../../components/common/CustomLink";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <Box mt="4rem" padding="0px 30px">
      <Box textAlign="center" mt="4rem">
        <Heading>Sign in to your account</Heading>
        <Text>
          Or <CustomLink to={"/register"}>Go to register page</CustomLink>
        </Text>
      </Box>

      <LoginForm />
    </Box>
  );
};

export default LoginPage;
