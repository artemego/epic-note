import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
  IconButton,
} from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser, setError } = useAuth();

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    resolver: yupResolver(userSchema),
  });

  const { error, isLoading } = useAuth().state;

  const handleRegister = (data) => {
    registerUser(data);
  };

  // при первом рендере надо сбросить прошлую ошибку error(когда переключаемся с другой страницы)

  useEffect(() => {
    setError(null);
  }, []);

  return (
    <>
      <form>
        <Stack
          maxWidth={1200}
          margin="auto"
          spacing={5}
          marginTop={5}
          textAlign="left"
        >
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
            <FormHelperText id="email-helper-text">Your email</FormHelperText>
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
                <IconButton
                  aria-label="show password"
                  h="1.75rem"
                  size="sm"
                  mr="1rem"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            <FormHelperText id="password-helper-text">
              Your password
            </FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!errors?.confirmPassword}
            errortext={errors?.confirmPassword && "Passwords should match"}
          >
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              aria-describedby="confirmPassword-helper-text"
              autoComplete="off"
              ref={register}
            />
            <FormErrorMessage>
              {errors.confirmPassword && "Passwords should match"}
            </FormErrorMessage>
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
              onClick={handleSubmit(handleRegister)}
              colorScheme="orange"
              w="100%"
              disabled={
                !!errors.email ||
                !!errors.password ||
                errors.confirmPassword ||
                isLoading === true
              }
            >
              Register
            </Button>
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </form>
    </>
  );
}
