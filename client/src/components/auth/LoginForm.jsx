import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import userSchema from "../../schemas/userSchema";

import {
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";

// Todo: скорее всего нужно объединить это с registerForm в один файл

export default function LoginForm() {
  // const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(userSchema),
  });

  const { login } = useAuth();

  const { error, isLoading } = useAuth().state;

  const handleLogin = (data) => {
    console.log(data);
    login(data);
  };

  // useEffect(() => {
  //   console.log("redirecting" + isAuth);
  //   if (isAuth) history.push("/");
  // }, [isAuth]);

  return (
    <>
      <form title="loginForm">
        <Stack maxWidth={1200} margin="auto" spacing={5} marginTop={5}>
          <FormControl
            isInvalid={!!errors?.email?.message}
            errortext={errors?.email?.message}
          >
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              aria-describedby="email-helper-text"
              ref={register}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            <FormHelperText id="email-helper-text">
              Enter your email
            </FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!errors?.password?.message}
            errortext={errors?.password?.message}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                aria-describedby="password-helper-text"
                autoComplete="off"
                ref={register}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  mr="1rem"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            <FormHelperText id="password-helper-text">
              Enter your password
            </FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!error?.message}
            errortext={error?.message}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Button
              type="submit"
              isLoading={isLoading}
              onClick={handleSubmit(handleLogin)}
              colorScheme="orange"
              w="100%"
              disabled={
                !!errors.email ||
                !!errors.password ||
                errors.confirmPassword ||
                isLoading === true
              }
            >
              Login
            </Button>
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </form>
    </>
  );
}
