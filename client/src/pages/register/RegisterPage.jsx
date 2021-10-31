import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import CustomLink from "../../components/common/CustomLink";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <Box>
      <Box textAlign="center" mt="4rem">
        <Heading>Register a new account</Heading>
        <Text>
          Already have an account?{" "}
          <CustomLink to={"/login"}>Go to login page</CustomLink>
        </Text>
      </Box>

      <RegisterForm />
    </Box>
  );
};

export default RegisterPage;
