import { Box, Button, Heading, Text } from "@chakra-ui/react";
import React from "react";
import CustomLink from "../../components/common/CustomLink";
import RegisterForm from "../../components/auth/RegisterForm";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const registerGuestUser = useAuth().registerGuest;

  const handleRegisterGuest = () => {
    console.log("register as guest");
    registerGuestUser();
  };

  return (
    <>
      <Box textAlign="center" mt="4rem">
        <Heading>Register a new account</Heading>
        <Text>
          Already have an account?{" "}
          <CustomLink to={"/login"}>Go to login page</CustomLink>
        </Text>
        <RegisterForm />
      </Box>

      <Box textAlign="center" mt="20px">
        <Heading>Try out the application first and register as guest</Heading>
        <Text>
          Guests accounts are deleted within a couple of days and you will get
          some mock data for testing
        </Text>
        <Button colorScheme="orange" mt="20px" onClick={handleRegisterGuest}>
          Register as guest
        </Button>
      </Box>
    </>
  );
};

export default RegisterPage;
