import { Box, Button, Heading, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import CustomLink from "../../components/common/CustomLink";
import RegisterForm from "../../components/auth/RegisterForm";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { isLoading, error } = useAuth().state;

  const prevClicked = useRef(null);

  const registerGuestUser = useAuth().registerGuest;

  const handleRegisterGuest = () => {
    prevClicked.current = "GUEST";
    console.log(prevClicked.current);
    registerGuestUser();
  };

  return (
    <Box mt="4rem" padding="0px 30px">
      <Box textAlign="center">
        <Heading>Register a new account</Heading>
        <Text>
          Already have an account?{" "}
          <CustomLink to={"/login"}>Go to login page</CustomLink>
        </Text>
        <RegisterForm
          prevClicked={prevClicked}
          error={error}
          isLoading={isLoading}
        />
      </Box>

      <Box
        textAlign="center"
        mt="20px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading maxWidth="30ch">
          Try out the application first and register as guest
        </Heading>
        <Text maxWidth="60ch">
          Guests accounts are deleted within a couple of hours and you will get
          some mock data for testing
        </Text>
        <Button
          colorScheme="orange"
          mt="20px"
          onClick={handleRegisterGuest}
          isLoading={isLoading && prevClicked.current === "GUEST"}
          disabled={isLoading}
        >
          Register as guest
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;
